import fs from 'fs';
import path from 'path';
import { Project, BidTransaction, PlatformStats, TerritoryState, WorldPower, WarEvent, MapStats } from './types';
import { broadcastEvent } from './events';
import { supabase } from './supabase';
import { WORLD_COUNTRIES, SEED_TERRITORIES, getEmpireColor, calcMinOutbid } from './worldData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'outbid_db.json');
const TERRITORIES_FILE = path.join(DATA_DIR, 'territories_db.json');

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
  private territoriesCache: Record<string, TerritoryState> = {};
  private warEventsCache: WarEvent[] = [];
  private initialized = false;

  constructor() {
    this.db = {
      projects: [],
      transactions: [],
      stats: {
        totalClicks: 0,
        highestBid: 0,
        launchTime: new Date().toISOString(),
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

    this.initTerritories();
    this.initialized = true;
  }

  private initTerritories() {
    let savedTerritories: Record<string, TerritoryState> = {};
    try {
      if (fs.existsSync(TERRITORIES_FILE)) {
        const raw = fs.readFileSync(TERRITORIES_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        savedTerritories = parsed.territories || {};
        this.warEventsCache = parsed.warEvents || [];
      }
    } catch {
      // ignore
    }

    WORLD_COUNTRIES.forEach((c) => {
      const saved = savedTerritories[c.code];
      const curRuler = saved?.currentRuler || null;
      const curBid = saved?.currentBid || c.startingPrice || 3;
      const minPrice = saved?.minOutbidPrice || calcMinOutbid(curBid);

      this.territoriesCache[c.code] = {
        countryCode: c.code,
        countryName: c.name,
        numericId: c.numericId,
        flag: c.flag,
        coordinates: c.coordinates,
        population: c.population,
        tier: c.tier,
        defaultColor: c.defaultColor,
        isOceanFleet: c.isOceanFleet,
        currentRuler: curRuler,
        currentBid: curBid,
        minOutbidPrice: minPrice,
        totalPlunder: saved?.totalPlunder || 0,
        clicks: saved?.clicks || 0,
        conqueredAt: saved?.conqueredAt,
      };
    });

    if (this.warEventsCache.length === 0) {
      this.warEventsCache = [];
    }
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');

      const territoriesPayload = {
        territories: this.territoriesCache,
        warEvents: this.warEventsCache,
        updatedAt: new Date().toISOString(),
      };
      fs.writeFileSync(TERRITORIES_FILE, JSON.stringify(territoriesPayload, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Error writing database file:', err);
    }
  }

  public getTerritories(): TerritoryState[] {
    this.init();
    return Object.values(this.territoriesCache);
  }

  public getTerritoryByCode(code: string): TerritoryState | undefined {
    this.init();
    return this.territoriesCache[code.toUpperCase()];
  }

  public async getTerritoriesAsync(): Promise<TerritoryState[]> {
    this.init();
    try {
      const { data, error } = await supabase
        .from('territories')
        .select('*');

      if (!error && data && data.length > 0) {
        data.forEach((row: any) => {
          const code = row.country_code?.toUpperCase();
          if (code && this.territoriesCache[code]) {
            if (row.current_ruler_title && row.current_ruler_url) {
              this.territoriesCache[code].currentRuler = {
                title: row.current_ruler_title,
                url: row.current_ruler_url,
                warCry: row.current_ruler_warcry,
                logoUrl: row.current_ruler_logo,
                color: row.current_ruler_color || this.territoriesCache[code].defaultColor,
                totalBid: Number(row.current_bid || 0),
              };
            }
            this.territoriesCache[code].currentBid = Number(row.current_bid || this.territoriesCache[code].currentBid);
            this.territoriesCache[code].minOutbidPrice = Number(row.min_outbid_price || calcMinOutbid(this.territoriesCache[code].currentBid));
            this.territoriesCache[code].totalPlunder = Number(row.total_plunder || 0);
            this.territoriesCache[code].clicks = Number(row.clicks || 0);
            this.territoriesCache[code].conqueredAt = row.conquered_at;
          }
        });
      }
    } catch {
      // ignore
    }
    return Object.values(this.territoriesCache);
  }

  public getWarEvents(limit = 30): WarEvent[] {
    this.init();
    return this.warEventsCache.slice(0, limit);
  }

  public getWorldPowers(): WorldPower[] {
    this.init();
    const map = new Map<string, {
      title: string;
      url: string;
      logoUrl: string;
      color: string;
      territoriesCount: number;
      totalPlunder: number;
      countries: string[];
    }>();

    Object.values(this.territoriesCache).forEach((t) => {
      if (!t.currentRuler) return;
      const key = t.currentRuler.url.toLowerCase();
      const existing = map.get(key);
      if (existing) {
        existing.territoriesCount += 1;
        existing.totalPlunder += t.currentBid;
        existing.countries.push(t.countryCode);
      } else {
        map.set(key, {
          title: t.currentRuler.title,
          url: t.currentRuler.url,
          logoUrl: t.currentRuler.logoUrl || '',
          color: t.currentRuler.color,
          territoriesCount: 1,
          totalPlunder: t.currentBid,
          countries: [t.countryCode],
        });
      }
    });

    const list = Array.from(map.values()).sort((a, b) => b.territoriesCount - a.territoriesCount || b.totalPlunder - a.totalPlunder);
    return list.map((p, idx) => ({
      ...p,
      rank: idx + 1,
    }));
  }

  public getMapStats(): MapStats {
    this.init();
    const territories = Object.values(this.territoriesCache);
    const claimedCount = territories.filter((t) => !!t.currentRuler).length;
    const totalCountries = territories.length;
    const totalPlundered = territories.reduce((sum, t) => sum + (t.totalPlunder || 0), 0);
    const totalClicks = territories.reduce((sum, t) => sum + (t.clicks || 0), 0);

    return {
      onlineCount: 2,
      totalVisitors: 58,
      totalPlundered,
      totalClicks,
      claimedCount,
      totalCountries,
    };
  }

  public async conquerTerritoryAsync(params: {
    countryCode: string;
    title: string;
    url: string;
    warCry?: string;
    customColor?: string;
    bidAmount: number;
    logoUrl?: string;
    category?: string;
    paymentProvider?: 'dodo' | 'stripe' | 'crypto';
  }): Promise<{ territory: TerritoryState; warEvent: WarEvent; powers: WorldPower[]; stats: MapStats }> {
    this.init();

    if (params.countryCode.toUpperCase() === 'CONQUER_ALL' || params.countryCode.toUpperCase() === 'ALL') {
      const now = new Date().toISOString();
      const color = params.customColor || '#f97316';
      const logo = params.logoUrl || `https://www.google.com/s2/favicons?domain=${normalizeUrl(params.url)}&sz=128`;

      const ruler = {
        title: params.title.trim(),
        url: params.url.trim().startsWith('http') ? params.url.trim() : `https://${params.url.trim()}`,
        warCry: params.warCry?.trim() || 'Absolute Planetary Domination',
        logoUrl: logo,
        color: color,
        totalBid: 5000,
      };

      WORLD_COUNTRIES.forEach((c) => {
        const existing = this.territoriesCache[c.code] || {
          countryCode: c.code,
          countryName: c.name,
          numericId: c.numericId,
          flag: c.flag,
          coordinates: c.coordinates,
          population: c.population,
          tier: c.tier,
          defaultColor: c.defaultColor,
          isOceanFleet: c.isOceanFleet,
          currentRuler: null,
          currentBid: c.startingPrice || 3,
          minOutbidPrice: calcMinOutbid(c.startingPrice || 3),
          totalPlunder: 0,
          clicks: 0,
        };
        this.territoriesCache[c.code] = {
          ...existing,
          currentRuler: ruler,
          currentBid: Math.max(existing.currentBid, 25),
          minOutbidPrice: calcMinOutbid(Math.max(existing.currentBid, 25)),
          totalPlunder: (existing.totalPlunder || 0) + 25,
          conqueredAt: now,
        };
      });

      const warEvent: WarEvent = {
        id: `we_hegemony_${Date.now()}`,
        countryCode: 'GLOBAL',
        countryName: 'Entire Planet Earth',
        flag: '🌍',
        rulerTitle: params.title.trim(),
        rulerUrl: params.url.trim(),
        warCry: params.warCry?.trim() || 'Total Planetary Dominion',
        amount: params.bidAmount,
        type: 'conquered',
        timestamp: 'just now',
      };

      this.warEventsCache.unshift(warEvent);
      this.save();

      const powers = this.getWorldPowers();
      const stats = this.getMapStats();

      return { territory: this.territoriesCache['US'] || Object.values(this.territoriesCache)[0], warEvent, powers, stats };
    }

    const code = params.countryCode.toUpperCase();
    const meta = WORLD_COUNTRIES.find((c) => c.code === code) || {
      numericId: '000',
      code,
      code3: code,
      name: code,
      flag: '🚩',
      coordinates: [0, 0] as [number, number],
      population: '1M',
      tier: 'TIER B' as const,
      defaultColor: '#f97316',
      startingPrice: 3,
    };

    const existing = this.territoriesCache[code] || {
      countryCode: code,
      countryName: meta.name,
      numericId: meta.numericId,
      flag: meta.flag,
      coordinates: meta.coordinates,
      population: meta.population,
      tier: meta.tier,
      defaultColor: meta.defaultColor,
      isOceanFleet: meta.isOceanFleet,
      currentRuler: null,
      currentBid: meta.startingPrice || 3,
      minOutbidPrice: calcMinOutbid(meta.startingPrice || 3),
      totalPlunder: 0,
      clicks: 0,
    };

    const isOutbid = !!existing.currentRuler;
    const color = params.customColor || getEmpireColor(params.title || params.url);
    const domainFavicon = params.logoUrl || `https://www.google.com/s2/favicons?domain=${normalizeUrl(params.url)}&sz=128`;
    const nextOutbidPrice = calcMinOutbid(params.bidAmount);

    const updatedTerritory: TerritoryState = {
      ...existing,
      currentRuler: {
        title: params.title.trim(),
        url: params.url.trim().startsWith('http') ? params.url.trim() : `https://${params.url.trim()}`,
        warCry: params.warCry?.trim() || undefined,
        logoUrl: domainFavicon,
        color: color,
        totalBid: params.bidAmount,
      },
      currentBid: params.bidAmount,
      minOutbidPrice: nextOutbidPrice,
      totalPlunder: (existing.totalPlunder || 0) + params.bidAmount,
      conqueredAt: new Date().toISOString(),
    };

    this.territoriesCache[code] = updatedTerritory;

    const warEvent: WarEvent = {
      id: `we_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      countryCode: code,
      countryName: meta.name,
      flag: meta.flag,
      rulerTitle: params.title.trim(),
      rulerUrl: params.url.trim(),
      warCry: params.warCry?.trim(),
      amount: params.bidAmount,
      type: isOutbid ? 'outbid' : 'conquered',
      timestamp: 'just now',
    };

    this.warEventsCache.unshift(warEvent);
    this.save();

    // Persist to Supabase territories table
    if (supabase) {
      try {
        await supabase.from('territories').upsert({
          country_code: code,
          country_name: meta.name,
          current_ruler_title: params.title.trim(),
          current_ruler_url: params.url.trim(),
          current_ruler_warcry: params.warCry?.trim(),
          current_ruler_logo: domainFavicon,
          current_ruler_color: color,
          current_bid: params.bidAmount,
          min_outbid_price: nextOutbidPrice,
          total_plunder: (existing.totalPlunder || 0) + params.bidAmount,
          conquered_at: new Date().toISOString(),
        }, { onConflict: 'country_code' });
      } catch (e) {
        // non-blocking fallback to JSON store
      }
    }

    return { territory: updatedTerritory, warEvent, powers: this.getWorldPowers(), stats: this.getMapStats() };
  }

  public async getProjectsAsync(category?: string, search?: string): Promise<Project[]> {
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .order('total_bid', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        let list: Project[] = data
          .filter((row: any) => row.is_hidden !== true)
          .map((row, idx) => ({
            id: row.id,
            url: row.url,
            normalizedUrl: row.normalized_url || row.url,
            title: row.title || row.url,
            description: row.description || '',
            category: row.category || 'ai-agents-infrastructure',
            logoUrl: row.logo_url,
            ogImage: row.og_image,
            ownerEmail: row.owner_email,
            twitterHandle: row.twitter_handle,
            totalBid: Number(row.total_bid || 0),
            initialBid: Number(row.initial_bid || row.total_bid || 0),
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

  public getProjectById(id: string): Project | undefined {
    this.init();
    return this.db.projects.find(p => p.id === id);
  }

  public getProjectByUrl(rawUrl: string): Project | undefined {
    this.init();
    const norm = normalizeUrl(rawUrl);
    return this.db.projects.find(p => p.normalizedUrl === norm || normalizeUrl(p.url) === norm);
  }

  public getStats(): PlatformStats {
    this.init();
    const projects = this.db.projects.filter(p => !p.isHidden);
    const totalVolume = projects.reduce((sum, p) => sum + p.totalBid, 0);
    const totalBidsCount = this.db.transactions.length;
    const totalProjectsCount = projects.length;
    const totalClicksDelivered = projects.reduce((sum, p) => sum + (p.clicks || 0), 0);

    const king = projects.length > 0 ? projects[0] : null;
    const highestSingleBid = this.db.transactions.reduce((max, t) => Math.max(max, t.amount), 0);

    let kingHoldDurationSeconds = 0;
    if (king && king.kingSince) {
      kingHoldDurationSeconds = Math.floor((Date.now() - new Date(king.kingSince).getTime()) / 1000);
    }

    return {
      totalVolume,
      totalBidsCount,
      totalProjectsCount,
      totalClicksDelivered,
      currentKing: king,
      kingHoldDurationSeconds,
      highestSingleBid,
    };
  }

  public getRecentBids(limit = 20): BidTransaction[] {
    this.init();
    if (this.db.transactions && this.db.transactions.length > 0) {
      return this.db.transactions.slice(0, limit);
    }
    // Fallback: construct activity from existing active projects
    return this.db.projects.slice(0, limit).map((p, idx) => ({
      id: `tx_${p.id}`,
      projectId: p.id,
      projectTitle: p.title,
      projectUrl: p.url,
      amount: p.totalBid,
      previousTotal: 0,
      newTotal: p.totalBid,
      isTopUp: false,
      newRank: idx + 1,
      paymentStatus: 'completed',
      paymentProvider: 'dodo',
      createdAt: p.createdAt,
    }));
  }

  public async getRecentBidsAsync(limit = 20): Promise<BidTransaction[]> {
    try {
      const { data, error } = await supabase
        .from('bid_transactions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (!error && data && data.length > 0) {
        return data.map((row: any) => ({
          id: row.id,
          projectId: row.project_id,
          projectTitle: row.project_title || row.project_url,
          projectUrl: row.project_url,
          amount: Number(row.amount || 0),
          previousTotal: Number(row.previous_total || 0),
          newTotal: Number(row.new_total || 0),
          isTopUp: row.is_top_up || false,
          newRank: row.new_rank || 1,
          previousRank: row.previous_rank,
          paymentStatus: row.payment_status || 'completed',
          paymentProvider: row.payment_provider || 'dodo',
          paymentIntentId: row.payment_intent_id,
          ownerEmail: row.owner_email,
          twitterHandle: row.twitter_handle,
          createdAt: row.created_at,
        }));
      }
    } catch (err) {
      console.error('[Supabase getRecentBidsAsync Error]', err);
    }

    return this.getRecentBids(limit);
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
    paymentProvider?: 'dodo' | 'stripe' | 'sandbox' | 'crypto' | 'lemonsqueezy' | 'paypal' | 'solana';
    paymentIntentId?: string;
  }) {
    const result = this.placeBid(params);
    const { project, transaction } = result;

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
        previous_total: transaction.previousTotal,
        new_total: transaction.newTotal,
        is_top_up: transaction.isTopUp,
        new_rank: transaction.newRank,
        previous_rank: transaction.previousRank,
        payment_status: 'completed',
        payment_provider: transaction.paymentProvider,
        payment_intent_id: transaction.paymentIntentId,
        owner_email: transaction.ownerEmail,
        twitter_handle: transaction.twitterHandle,
        created_at: transaction.createdAt,
      });

      const stats = this.getStats();
      await supabase.from('platform_stats').upsert({
        id: 'global_stats',
        total_volume: stats.totalVolume,
        total_bids_count: stats.totalBidsCount,
        total_projects_count: stats.totalProjectsCount,
        total_clicks_delivered: stats.totalClicksDelivered,
        highest_single_bid: stats.highestSingleBid,
        king_hold_duration_seconds: stats.kingHoldDurationSeconds,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error('[Supabase placeBidAsync Error]', err);
    }

    return result;
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
    paymentProvider?: 'dodo' | 'stripe' | 'sandbox' | 'crypto' | 'lemonsqueezy' | 'paypal' | 'solana';
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
      isTopUp = true;
      const existing = this.db.projects[existingIndex];
      previousTotal = existing.totalBid;
      previousRank = existing.rank;

      const newTotal = previousTotal + params.bidAmount;
      project = {
        ...existing,
        title: finalTitle || existing.title,
        description: params.description !== undefined ? params.description : existing.description,
        category: params.category || existing.category,
        logoUrl: params.logoUrl || existing.logoUrl || domainFavicon,
        ogImage: params.ogImage || existing.ogImage,
        ownerEmail: params.ownerEmail || existing.ownerEmail,
        twitterHandle: params.twitterHandle || existing.twitterHandle,
        totalBid: newTotal,
        updatedAt: new Date().toISOString(),
      };

      this.db.projects.splice(existingIndex, 1);
    } else {
      project = {
        id: normalized.replace(/[^a-z0-9]/gi, '_'),
        url: params.url.trim().startsWith('http') ? params.url.trim() : `https://${params.url.trim()}`,
        normalizedUrl: normalized,
        title: finalTitle || normalized,
        description: params.description || '',
        category: params.category || 'ai-agents-infrastructure',
        logoUrl: params.logoUrl || domainFavicon,
        ogImage: params.ogImage,
        ownerEmail: params.ownerEmail,
        twitterHandle: params.twitterHandle,
        totalBid: params.bidAmount,
        initialBid: params.bidAmount,
        clicks: 0,
        totalKingDurationSeconds: 0,
        rank: 1,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    this.db.projects.push(project);
    this.db.projects.sort((a, b) => b.totalBid - a.totalBid);

    let newRank = 1;
    this.db.projects.forEach((p, idx) => {
      const r = idx + 1;
      p.rank = r;
      if (p.id === project.id) {
        newRank = r;
      }
      if (r === 1 && !p.kingSince) {
        p.kingSince = new Date().toISOString();
      } else if (r !== 1) {
        p.kingSince = undefined;
      }
    });

    const isNewKing = newRank === 1 && (!previousKing || previousKing.id !== project.id);

    const transaction: BidTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      projectId: project.id,
      projectTitle: project.title,
      projectUrl: project.url,
      amount: params.bidAmount,
      previousTotal,
      newTotal: project.totalBid,
      isTopUp,
      newRank,
      previousRank,
      paymentStatus: 'completed',
      paymentProvider: params.paymentProvider || 'dodo',
      paymentIntentId: params.paymentIntentId,
      ownerEmail: params.ownerEmail,
      twitterHandle: params.twitterHandle,
      createdAt: new Date().toISOString(),
    };

    this.db.transactions.unshift(transaction);
    if (this.db.transactions.length > 500) {
      this.db.transactions = this.db.transactions.slice(0, 500);
    }

    this.db.stats.highestBid = Math.max(this.db.stats.highestBid, project.totalBid);
    this.save();

    return {
      project,
      transaction,
      isNewKing,
      stats: this.getStats(),
    };
  }

  public recordClick(projectId: string): string | null {
    this.init();
    const p = this.db.projects.find(x => x.id === projectId);
    if (p) {
      p.clicks = (p.clicks || 0) + 1;
      this.db.stats.totalClicks += 1;
      this.save();
      return p.url;
    }
    return null;
  }
}

export const store = new Store();
