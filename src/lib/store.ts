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
      const seed = SEED_TERRITORIES[c.code];
      const curRuler = saved?.currentRuler || (seed?.currentRuler ? {
        title: seed.currentRuler.title,
        url: seed.currentRuler.url,
        warCry: seed.currentRuler.warCry,
        logoUrl: seed.currentRuler.logoUrl,
        color: seed.currentRuler.color || c.defaultColor,
        totalBid: seed.currentRuler.totalBid || seed.currentBid || c.startingPrice || 3,
      } : null);

      const curBid = saved?.currentBid || seed?.currentBid || c.startingPrice || 3;
      const minPrice = saved?.minOutbidPrice || seed?.minOutbidPrice || calcMinOutbid(curBid);

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
        totalPlunder: saved?.totalPlunder || (curRuler ? curBid : 0),
        clicks: saved?.clicks || 0,
        conqueredAt: saved?.conqueredAt || (curRuler ? new Date(Date.now() - 86400000).toISOString() : undefined),
      };
    });

    this.warEventsCache = [
      { id: 'we_1', countryCode: 'KR', countryName: 'South Korea', flag: '🇰🇷', rulerTitle: 'grinda.ai', rulerUrl: 'https://grinda.ai', warCry: 'Korean AI Innovations', amount: 25, type: 'claimed', timestamp: '1d ago' },
      { id: 'we_2', countryCode: 'TH', countryName: 'Thailand', flag: '🇹🇭', rulerTitle: 'bookit.now', rulerUrl: 'https://bookit.now', warCry: 'Instant booking everywhere', amount: 12, type: 'claimed', timestamp: '1d ago' },
      { id: 'we_3', countryCode: 'CN', countryName: 'China', flag: '🇨🇳', rulerTitle: 'xme.lol', rulerUrl: 'https://xme.lol', warCry: 'Scale your presence', amount: 27, type: 'conquered', timestamp: '1d ago' },
      { id: 'we_4', countryCode: 'TD', countryName: 'Chad', flag: '🇹🇩', rulerTitle: 'ilmi.online', rulerUrl: 'https://ilmi.online', warCry: 'Online learning for all', amount: 16, type: 'conquered', timestamp: '1d ago' },
      { id: 'we_5', countryCode: 'US', countryName: 'United States', flag: '🇺🇸', rulerTitle: 'Marlow Town', rulerUrl: 'https://marlow.lol', warCry: 'Building the king of towns', amount: 160, type: 'conquered', timestamp: '2d ago' },
      { id: 'we_6', countryCode: 'RU', countryName: 'Russia', flag: '🇷🇺', rulerTitle: 'Viral SEO - AI Suite', rulerUrl: 'https://getviralseo.com', warCry: 'Rank #1 with AI', amount: 93, type: 'conquered', timestamp: '2d ago' },
    ];
  }

  private save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
      fs.writeFileSync(TERRITORIES_FILE, JSON.stringify({
        territories: this.territoriesCache,
        warEvents: this.warEventsCache,
      }, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }

  // ==========================================
  // TERRITORY / WORLD WAR MAP METHODS
  // ==========================================

  public async getTerritoriesAsync(): Promise<TerritoryState[]> {
    this.init();
    try {
      const { data, error } = await supabase.from('territories').select('*');
      if (!error && data && data.length > 0) {
        const result: TerritoryState[] = WORLD_COUNTRIES.map((c) => {
          const row = data.find((r) => r.country_code === c.code);
          if (row) {
            const curBid = Number(row.current_bid || c.startingPrice || 3);
            const minPrice = Number(row.min_outbid_price || calcMinOutbid(curBid));
            return {
              countryCode: c.code,
              countryName: c.name,
              numericId: c.numericId,
              flag: c.flag,
              coordinates: c.coordinates,
              population: c.population,
              tier: c.tier,
              defaultColor: c.defaultColor,
              isOceanFleet: c.isOceanFleet,
              currentRuler: row.current_ruler_title ? {
                projectId: row.current_ruler_project_id || undefined,
                title: row.current_ruler_title,
                url: row.current_ruler_url,
                warCry: row.war_cry || undefined,
                logoUrl: row.current_ruler_logo,
                color: row.current_ruler_color || c.defaultColor,
                totalBid: curBid,
              } : null,
              currentBid: curBid,
              minOutbidPrice: minPrice,
              totalPlunder: Number(row.total_plunder || (row.current_ruler_title ? curBid : 0)),
              clicks: row.clicks || 0,
              conqueredAt: row.conquered_at,
            };
          }
          return this.territoriesCache[c.code] || {
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
        });

        result.forEach((t) => {
          this.territoriesCache[t.countryCode] = t;
        });

        return result;
      }
    } catch (err) {
      console.error('[getTerritoriesAsync error]', err);
    }

    return Object.values(this.territoriesCache);
  }

  public async conquerTerritoryAsync(params: {
    countryCode: string;
    title: string;
    url: string;
    warCry?: string;
    bidAmount: number;
    customColor?: string;
    logoUrl?: string;
    category?: string;
    paymentProvider?: string;
  }): Promise<{ territory: TerritoryState; warEvent: WarEvent; powers: WorldPower[]; stats: MapStats }> {
    this.init();
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
    if (this.warEventsCache.length > 50) {
      this.warEventsCache = this.warEventsCache.slice(0, 50);
    }

    this.save();

    (async () => {
      try {
        await supabase.from('territories').upsert({
          country_code: code,
          country_name: meta.name,
          flag: meta.flag,
          current_ruler_title: params.title.trim(),
          current_ruler_url: updatedTerritory.currentRuler?.url,
          current_ruler_logo: domainFavicon,
          current_ruler_color: color,
          current_bid: params.bidAmount,
          min_outbid_price: nextOutbidPrice,
          total_plunder: updatedTerritory.totalPlunder,
          population: meta.population,
          conquered_at: updatedTerritory.conqueredAt,
          updated_at: new Date().toISOString(),
        });

        await supabase.from('territory_claims').insert({
          id: warEvent.id,
          country_code: code,
          country_name: meta.name,
          project_title: params.title.trim(),
          project_url: params.url.trim(),
          amount: params.bidAmount,
          payment_provider: params.paymentProvider || 'sandbox',
          created_at: new Date().toISOString(),
        });
      } catch (err) {
        console.error('[Supabase Territory Sync Error]', err);
      }
    })();

    const powers = this.getWorldPowers();
    const stats = this.getMapStats();

    broadcastEvent({
      type: 'TERRITORY_CONQUERED',
      data: {
        territory: updatedTerritory,
        message: `⚔️ ${params.title} conquered ${meta.flag} ${meta.name} for $${params.bidAmount}!`,
      },
      timestamp: Date.now(),
    });

    return { territory: updatedTerritory, warEvent, powers, stats };
  }

  public async recordTerritoryClickAsync(countryCode: string): Promise<string | null> {
    this.init();
    const t = this.territoriesCache[countryCode.toUpperCase()];
    if (!t || !t.currentRuler) return null;

    t.clicks = (t.clicks || 0) + 1;
    this.save();

    (async () => {
      try {
        await supabase
          .from('territories')
          .update({ clicks: t.clicks })
          .eq('country_code', countryCode.toUpperCase());
      } catch {
        // ignore
      }
    })();

    return t.currentRuler.url;
  }

  public getWorldPowers(): WorldPower[] {
    this.init();
    const empires: Record<string, { title: string; url: string; logoUrl?: string; color: string; count: number; plunder: number; countries: string[] }> = {};

    Object.values(this.territoriesCache).forEach((t) => {
      if (t.currentRuler) {
        const key = normalizeUrl(t.currentRuler.url) || t.currentRuler.title.toLowerCase();
        if (!empires[key]) {
          empires[key] = {
            title: t.currentRuler.title,
            url: t.currentRuler.url,
            logoUrl: t.currentRuler.logoUrl,
            color: t.currentRuler.color,
            count: 0,
            plunder: 0,
            countries: [],
          };
        }
        empires[key].count += 1;
        empires[key].plunder += t.currentBid;
        empires[key].countries.push(t.countryCode);
      }
    });

    const powers = Object.values(empires)
      .sort((a, b) => b.plunder - a.plunder || b.count - a.count)
      .map((e, idx) => ({
        rank: idx + 1,
        title: e.title,
        url: e.url,
        logoUrl: e.logoUrl,
        color: e.color,
        territoriesCount: e.count,
        totalPlunder: e.plunder,
        countries: e.countries,
      }));

    return powers;
  }

  public getWarEvents(limit = 20): WarEvent[] {
    this.init();
    return this.warEventsCache.slice(0, limit);
  }

  public getMapStats(): MapStats {
    this.init();
    const territories = Object.values(this.territoriesCache);
    const claimed = territories.filter((t) => !!t.currentRuler);
    const totalPlundered = claimed.reduce((acc, t) => acc + t.totalPlunder, 0);
    const totalClicks = claimed.reduce((acc, t) => acc + (t.clicks || 0), 0);

    return {
      onlineCount: 132,
      totalVisitors: 13008,
      totalPlundered: Math.max(totalPlundered, 2709),
      totalClicks: Math.max(totalClicks, 14692),
      claimedCount: claimed.length || 132,
      totalCountries: 194,
    };
  }

  // ==========================================
  // CLASSIC BOARD / PROJECT METHODS
  // ==========================================

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

export const store =
  global.__outbidStore__ && typeof global.__outbidStore__.getTerritoriesAsync === 'function'
    ? global.__outbidStore__
    : (global.__outbidStore__ = new Store());
