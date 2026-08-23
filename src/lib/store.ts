import fs from 'fs';
import path from 'path';
import { Project, BidTransaction, PlatformStats } from './types';
import { broadcastEvent } from './events';
import { supabase } from './supabase';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'outbid_db.json');

interface DatabaseSchema {
  projects: Project[];
  transactions: BidTransaction[];
  stats: {
    totalClicks: number;
    highestBid: number;
    launchTime: string;
  };
}

export function normalizeUrl(urlStr: string): string {
  try {
    let clean = urlStr.trim().toLowerCase();
    if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
      clean = 'https://' + clean;
    }
    const parsed = new URL(clean);
    let host = parsed.hostname.replace(/^www\./, '');
    let path = parsed.pathname.replace(/\/$/, '');
    return `${host}${path}`;
  } catch {
    return urlStr.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
  }
}

class Store {
  private db: DatabaseSchema;
  private initialized = false;

  constructor() {
    this.db = {
      projects: [],
      transactions: [],
      stats: {
        totalClicks: 142732,
        highestBid: 14043,
        launchTime: new Date(Date.now() - 1000 * 60 * 60 * 66).toISOString(),
      }
    };
  }

  private init() {
    if (this.initialized) return;

    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
      }
    } catch (err) {
      console.error('[Store] Error reading database file:', err);
    }

    this.initialized = true;
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch {
      // In serverless readonly environments, ignore fs write errors
    }
  }

  private recalculateRanks() {
    this.db.projects.sort((a, b) => b.totalBid - a.totalBid);
    this.db.projects.forEach((proj, idx) => {
      proj.rank = idx + 1;
    });
  }

  public async getProjectsAsync(category?: string, search?: string): Promise<Project[]> {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('is_hidden', false)
        .order('total_bid', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        let list: Project[] = data.map((row, idx) => ({
          id: row.id,
          url: row.url,
          normalizedUrl: row.normalized_url,
          title: row.title,
          description: row.description || '',
          category: row.category,
          logoUrl: row.logo_url,
          ogImage: row.og_image,
          ownerEmail: row.owner_email,
          twitterHandle: row.twitter_handle,
          totalBid: Number(row.total_bid),
          initialBid: Number(row.initial_bid || row.total_bid),
          clicks: row.clicks || 0,
          totalKingDurationSeconds: row.total_king_duration_seconds || 0,
          kingSince: row.king_since,
          rank: idx + 1,
          isVerified: row.is_verified ?? true,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
        }));

        if (search && search.trim()) {
          const q = search.trim().toLowerCase();
          list = list.filter(p =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.url.toLowerCase().includes(q) ||
            (p.twitterHandle && p.twitterHandle.toLowerCase().includes(q))
          );
        }

        return list;
      }
    } catch (err) {
      console.error('[Supabase Read Failed, Falling back to local cache]', err);
    }

    return this.getProjects(category, search);
  }

  public getProjects(category?: string, search?: string): Project[] {
    this.init();
    let list = this.db.projects.filter(p => !p.isHidden);

    if (category && category !== 'all') {
      const catClean = category.toLowerCase().replace(/[^a-z0-9]/g, '');
      list = list.filter(p => {
        const pCatClean = p.category.toLowerCase().replace(/[^a-z0-9]/g, '');
        return pCatClean.includes(catClean) || catClean.includes(pCatClean);
      });
      list.sort((a, b) => b.totalBid - a.totalBid);
      list = list.map((p, idx) => ({
        ...p,
        rank: idx + 1,
      }));
    } else {
      list.sort((a, b) => b.totalBid - a.totalBid);
      list = list.map((p, idx) => ({
        ...p,
        rank: idx + 1,
      }));
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.url.toLowerCase().includes(q) ||
        (p.twitterHandle && p.twitterHandle.toLowerCase().includes(q))
      );
    }

    return list;
  }

  public async getProjectByIdAsync(id: string): Promise<Project | undefined> {
    try {
      const { data } = await supabase.from('projects').select('*').eq('id', id).single();
      if (data) {
        return {
          id: data.id,
          url: data.url,
          normalizedUrl: data.normalized_url,
          title: data.title,
          description: data.description || '',
          category: data.category,
          logoUrl: data.logo_url,
          ogImage: data.og_image,
          ownerEmail: data.owner_email,
          twitterHandle: data.twitter_handle,
          totalBid: Number(data.total_bid),
          initialBid: Number(data.initial_bid || data.total_bid),
          clicks: data.clicks || 0,
          totalKingDurationSeconds: data.total_king_duration_seconds || 0,
          kingSince: data.king_since,
          rank: data.rank || 1,
          isVerified: data.is_verified ?? true,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
      }
    } catch {
      // ignore
    }
    return this.getProjectById(id);
  }

  public getProjectById(id: string): Project | undefined {
    this.init();
    return this.db.projects.find(p => p.id === id);
  }

  public getProjectByUrl(rawUrl: string): Project | undefined {
    this.init();
    const norm = normalizeUrl(rawUrl);
    return this.db.projects.find(p => p.normalizedUrl === norm || normalizeUrl(p.url) === norm);
  }

  public getRankForBid(bidAmount: number, existingProjectId?: string): number {
    this.init();
    const projects = this.db.projects.filter(p => !p.isHidden && p.id !== existingProjectId);
    let rank = 1;
    for (const p of projects) {
      if (bidAmount <= p.totalBid) {
        rank++;
      } else {
        break;
      }
    }
    return rank;
  }

  public async placeBidAsync(params: {
    url: string;
    title?: string;
    description?: string;
    category?: string;
    logoUrl?: string;
    ogImage?: string;
    ownerEmail?: string;
    twitterHandle?: string;
    bidAmount: number;
    paymentProvider?: 'stripe' | 'sandbox' | 'crypto' | 'lemonsqueezy' | 'paypal' | 'solana';
    paymentIntentId?: string;
  }) {
    return this.placeBid(params);
  }

  public placeBid(params: {
    url: string;
    title?: string;
    description?: string;
    category?: string;
    logoUrl?: string;
    ogImage?: string;
    ownerEmail?: string;
    twitterHandle?: string;
    bidAmount: number;
    paymentProvider?: 'stripe' | 'sandbox' | 'crypto' | 'lemonsqueezy' | 'paypal' | 'solana';
    paymentIntentId?: string;
  }): { project: Project; transaction: BidTransaction; isNewKing: boolean; stats: PlatformStats } {
    this.init();

    const normalized = normalizeUrl(params.url);
    const existingIndex = this.db.projects.findIndex(
      p => p.normalizedUrl === normalized || normalizeUrl(p.url) === normalized
    );

    const previousKing = this.db.projects[0];
    let project: Project;
    let isTopUp = false;
    let previousTotal = 0;
    let previousRank: number | undefined;

    const domainFavicon = `https://www.google.com/s2/favicons?domain=${normalized}&sz=128`;

    // Auto-extract clean display title for social media items
    let finalTitle = params.title;
    const cleanUrl = params.url.trim().toLowerCase();
    if (cleanUrl.startsWith('@')) {
      finalTitle = cleanUrl;
    } else if (cleanUrl.includes('x.com/') || cleanUrl.includes('twitter.com/')) {
      const handle = cleanUrl.replace(/^(https?:\/\/)?(www\.)?(x\.com|twitter\.com)\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
      finalTitle = `@${handle}`;
    } else if (cleanUrl.includes('instagram.com/')) {
      const handle = cleanUrl.replace(/^(https?:\/\/)?(www\.)?instagram\.com\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
      finalTitle = `@${handle}`;
    } else if (cleanUrl.includes('github.com/')) {
      const handle = cleanUrl.replace(/^(https?:\/\/)?(www\.)?github\.com\//, '').split('/')[0].split('?')[0].replace(/^@/, '');
      finalTitle = `@${handle}`;
    }

    if (existingIndex >= 0) {
      project = this.db.projects[existingIndex];
      previousTotal = project.totalBid;
      previousRank = project.rank;
      isTopUp = true;

      let delta = params.bidAmount;
      if (params.bidAmount > project.totalBid) {
        delta = params.bidAmount - project.totalBid;
      }

      project.totalBid += delta;
      if (finalTitle) project.title = finalTitle;
      if (params.description) project.description = params.description;
      if (params.category) project.category = params.category;
      if (params.logoUrl) project.logoUrl = params.logoUrl;
      if (!project.logoUrl) project.logoUrl = domainFavicon;
      if (params.ownerEmail) project.ownerEmail = params.ownerEmail;
      if (params.twitterHandle) project.twitterHandle = params.twitterHandle.replace(/^@/, '');
      project.updatedAt = new Date().toISOString();
    } else {
      project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        url: params.url.startsWith('http') ? params.url : `https://${params.url}`,
        normalizedUrl: normalized,
        title: finalTitle || normalized,
        description: params.description || '',
        category: params.category || 'ai-agents-infrastructure',
        logoUrl: params.logoUrl || domainFavicon,
        ogImage: params.ogImage,
        ownerEmail: params.ownerEmail,
        twitterHandle: params.twitterHandle ? params.twitterHandle.replace(/^@/, '') : undefined,
        totalBid: params.bidAmount,
        initialBid: params.bidAmount,
        clicks: 0,
        totalKingDurationSeconds: 0,
        rank: 999,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isVerified: true,
      };
      this.db.projects.push(project);
    }

    this.recalculateRanks();

    const newKing = this.db.projects[0];
    const isNewKing = newKing.id === project.id && (!previousKing || previousKing.id !== project.id);

    if (isNewKing) {
      if (previousKing && previousKing.kingSince) {
        const heldSeconds = Math.floor((Date.now() - new Date(previousKing.kingSince).getTime()) / 1000);
        previousKing.totalKingDurationSeconds = (previousKing.totalKingDurationSeconds || 0) + heldSeconds;
        previousKing.kingSince = null;
      }
      newKing.kingSince = new Date().toISOString();
    }

    const transaction: BidTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: project.id,
      projectTitle: project.title,
      projectUrl: project.url,
      amount: isTopUp ? (project.totalBid - previousTotal) : params.bidAmount,
      previousTotal: previousTotal,
      newTotal: project.totalBid,
      isTopUp: isTopUp,
      newRank: project.rank,
      previousRank: previousRank,
      paymentStatus: 'completed',
      paymentProvider: params.paymentProvider || 'sandbox',
      paymentIntentId: params.paymentIntentId,
      ownerEmail: project.ownerEmail,
      twitterHandle: project.twitterHandle,
      createdAt: new Date().toISOString(),
    };

    this.db.transactions.unshift(transaction);
    if (this.db.transactions.length > 500) {
      this.db.transactions = this.db.transactions.slice(0, 500);
    }

    if (project.totalBid > this.db.stats.highestBid) {
      this.db.stats.highestBid = project.totalBid;
    }

    this.save();

    // Supabase Live Postgres Sync
    (async () => {
      try {
        await supabase.from('projects').upsert({
          id: project.id,
          url: project.url,
          normalized_url: project.normalizedUrl,
          title: project.title,
          description: project.description,
          category: project.category,
          logo_url: project.logoUrl,
          total_bid: project.totalBid,
          initial_bid: project.initialBid,
          clicks: project.clicks,
          rank: project.rank,
          is_verified: project.isVerified,
          is_hidden: false,
          updated_at: new Date().toISOString(),
        });

        await supabase.from('bid_transactions').insert({
          id: transaction.id,
          project_id: project.id,
          project_title: project.title,
          project_url: project.url,
          amount: transaction.amount,
          new_total: transaction.newTotal,
          payment_provider: transaction.paymentProvider,
          created_at: transaction.createdAt,
        });

        const stats = this.getStats();
        await supabase.from('platform_stats').upsert({
          id: 'global',
          total_volume: stats.totalVolume,
          total_bids_count: stats.totalBidsCount,
          total_projects_count: stats.totalProjectsCount,
          total_clicks_delivered: stats.totalClicksDelivered,
          current_king_id: newKing?.id || null,
          highest_single_bid: stats.highestSingleBid,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[Supabase Sync Error]', err);
      }
    })();

    const stats = this.getStats();

    broadcastEvent({
      type: isNewKing ? 'NEW_KING' : (isTopUp ? 'RANK_SHIFT' : 'NEW_BID'),
      data: {
        transaction,
        project,
        stats,
        message: isNewKing 
          ? `👑 NEW #1: ${project.title} outbid with $${project.totalBid.toLocaleString()}!`
          : `⚡ ${project.title} placed $${transaction.amount.toLocaleString()} bid (#${project.rank})`
      },
      timestamp: Date.now()
    });

    return { project, transaction, isNewKing, stats };
  }

  public async recordClickAsync(projectId: string): Promise<string | null> {
    const url = this.recordClick(projectId);
    try {
      await supabase.rpc('increment_clicks', { target_id: projectId });
    } catch {
      // ignore
    }
    return url;
  }

  public recordClick(projectId: string): string | null {
    this.init();
    const proj = this.db.projects.find(p => p.id === projectId);
    if (!proj) return null;

    proj.clicks = (proj.clicks || 0) + 1;
    this.db.stats.totalClicks = (this.db.stats.totalClicks || 0) + 1;
    this.save();

    (async () => {
      try {
        await supabase
          .from('projects')
          .update({ clicks: proj.clicks })
          .eq('id', proj.id);
      } catch {
        // ignore
      }
    })();

    broadcastEvent({
      type: 'CLICK_UPDATE',
      data: {
        project: proj,
        stats: this.getStats()
      },
      timestamp: Date.now()
    });

    return proj.url;
  }

  public getStats(): PlatformStats {
    this.init();
    const totalVolume = this.db.projects.reduce((acc, p) => acc + p.totalBid, 0);
    const totalClicks = this.db.projects.reduce((acc, p) => acc + (p.clicks || 0), 0);
    const king = this.db.projects.length > 0 ? this.db.projects[0] : null;

    let kingHoldSeconds = 0;
    if (king && king.kingSince) {
      kingHoldSeconds = Math.floor((Date.now() - new Date(king.kingSince).getTime()) / 1000);
    }

    return {
      totalVolume: Math.max(totalVolume, 194201),
      totalBidsCount: this.db.transactions.length,
      totalProjectsCount: this.db.projects.length,
      totalClicksDelivered: totalClicks,
      currentKing: king,
      kingHoldDurationSeconds: kingHoldSeconds,
      highestSingleBid: this.db.stats.highestBid || (king ? king.totalBid : 14043),
    };
  }

  public getRecentBids(limit = 20): BidTransaction[] {
    this.init();
    return this.db.transactions.slice(0, limit);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var __outbidStore__: Store | undefined;
}

export const store = global.__outbidStore__ ?? (global.__outbidStore__ = new Store());
