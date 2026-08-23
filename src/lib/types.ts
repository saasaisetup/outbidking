export type CategorySlug =
  | 'all'
  | 'seo-ai-visibility'
  | 'ai-agents-infrastructure'
  | 'ai-media-generation'
  | 'marketing-advertising'
  | 'developer-tools'
  | 'productivity-personal-tools'
  | 'people-profiles'
  | 'design-creative'
  | 'social-media-creator-tools'
  | 'writing-content'
  | 'sales-lead-generation'
  | 'business-finance-legal'
  | 'games-entertainment'
  | 'education-learning'
  | 'health-fitness-wellness'
  | 'ecommerce-retail'
  | 'directories-launch-discovery'
  | 'hiring-jobs-careers'
  | 'audio-voice-podcasting'
  | 'crypto-web3-investing'
  | 'agencies-studios-services'
  | 'security-privacy-compliance'
  | 'travel-local-lifestyle'
  | 'media-news'
  | 'domains-web-assets'
  | 'leaderboards-attention'
  | 'real-estate-property'
  | 'other';

export interface CategoryInfo {
  slug: CategorySlug;
  name: string;
  icon: string;
  description: string;
}

export interface Project {
  id: string;
  url: string;
  normalizedUrl: string;
  title: string;
  description: string;
  category: string;
  logoUrl?: string;
  ogImage?: string;
  ownerEmail?: string;
  twitterHandle?: string;
  totalBid: number;
  initialBid: number;
  clicks: number;
  totalKingDurationSeconds: number;
  kingSince?: string | null;
  rank: number;
  createdAt: string;
  updatedAt: string;
  isVerified?: boolean;
  isHidden?: boolean;
}

export interface BidTransaction {
  id: string;
  projectId: string;
  projectTitle: string;
  projectUrl: string;
  amount: number;
  previousTotal: number;
  newTotal: number;
  isTopUp: boolean;
  newRank?: number;
  previousRank?: number;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentProvider: 'stripe' | 'sandbox' | 'crypto' | 'lemonsqueezy' | 'paypal' | 'solana';
  paymentIntentId?: string;
  ownerEmail?: string;
  twitterHandle?: string;
  createdAt: string;
}

export interface PlatformStats {
  totalVolume: number;
  totalBidsCount: number;
  totalProjectsCount: number;
  totalClicksDelivered: number;
  currentKing: Project | null;
  kingHoldDurationSeconds: number;
  highestSingleBid: number;
}

export interface SSEEventData {
  type: 'NEW_BID' | 'NEW_KING' | 'RANK_SHIFT' | 'CLICK_UPDATE' | 'TERRITORY_CONQUERED' | 'INIT';
  data: {
    transaction?: BidTransaction;
    project?: Project;
    stats?: PlatformStats;
    territory?: any;
    message?: string;
  };
  timestamp: number;
}

export interface TerritoryState {
  countryCode: string;
  countryName: string;
  numericId: string;
  flag: string;
  coordinates: [number, number];
  population: string;
  tier: 'TIER S' | 'TIER A' | 'TIER B' | 'TIER C';
  defaultColor: string;
  isOceanFleet?: boolean;
  currentRuler?: {
    projectId?: string;
    title: string;
    url: string;
    warCry?: string;
    logoUrl?: string;
    color: string;
    totalBid: number;
  } | null;
  currentBid: number;
  minOutbidPrice: number;
  totalPlunder: number;
  clicks: number;
  conqueredAt?: string;
}

export interface WorldPower {
  rank: number;
  title: string;
  url: string;
  logoUrl?: string;
  color: string;
  territoriesCount: number;
  totalPlunder: number;
  countries: string[];
}

export interface WarEvent {
  id: string;
  countryCode: string;
  countryName: string;
  flag: string;
  rulerTitle: string;
  rulerUrl: string;
  warCry?: string;
  amount: number;
  type: 'conquered' | 'claimed' | 'outbid';
  timestamp: string;
}

export interface MapStats {
  onlineCount: number;
  totalVisitors: number;
  totalPlundered: number;
  totalClicks: number;
  claimedCount: number;
  totalCountries: number;
}
