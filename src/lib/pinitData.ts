export interface CountryInfo {
  id: string; // ISO numeric code string or custom id
  slug: string;
  name: string;
  code: string; // 2-letter ISO
  flag: string;
  coordinates: [number, number]; // [longitude, latitude]
  color?: string;
  isOceanZone?: boolean;
  currentLeader?: {
    id: string;
    name: string;
    tagline: string;
    url: string;
    logo: string;
    stake: number;
    category: string;
    claimedAt: string;
    expiresIn: string;
    isLaunchSponsored?: boolean;
    clicks: number;
  };
}

export interface ActivityItem {
  id: string;
  productName: string;
  productSlug: string;
  productUrl: string;
  logo: string;
  stake: number;
  isLaunchSponsored?: boolean;
  countryName: string;
  countryFlag: string;
  countryCode: string;
  countrySlug: string;
  category: string;
  action: 'claimed' | 'expired' | 'outbid';
  timeAgo: string;
  placementSlug: string;
}

export interface HotCountryItem {
  id: string;
  rank: number;
  countryName: string;
  countrySlug: string;
  countryFlag: string;
  countryCode: string;
  rulerName: string;
  rulerLogo: string;
  currentStake: number;
  stealPrice: number;
  multiplier: string;
  isClaimed: boolean;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  url: string;
  logo: string;
  category: string;
  description: string;
  launchDate: string;
  totalStaked: number;
  allTimeClicks: number;
  countriesClaimed: {
    countryName: string;
    countryFlag: string;
    countrySlug: string;
    rank: number;
    staked: number;
    date: string;
    status: 'active' | 'hall-of-fame';
  }[];
}

// Logo resolver helper for any domain or social handle
export function getProductFavicon(urlOrHandle: string): string {
  if (!urlOrHandle) return '/globe.svg';
  
  if (urlOrHandle.includes('x.com') || urlOrHandle.includes('twitter.com') || urlOrHandle.startsWith('@')) {
    const handle = urlOrHandle.replace(/.*(?:twitter\.com|x\.com)\//, '').replace('@', '').split('/')[0].split('?')[0];
    return `https://unavatar.io/twitter/${handle}`;
  }
  if (urlOrHandle.includes('github.com')) {
    const user = urlOrHandle.replace(/.*github\.com\//, '').split('/')[0];
    return `https://unavatar.io/github/${user}`;
  }
  if (urlOrHandle.includes('linkedin.com')) {
    return 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca';
  }
  
  try {
    let domain = urlOrHandle.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    if (domain) {
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    }
  } catch {
    // fallback
  }
  return '/globe.svg';
}

// Neon Dark Mode Palette for Countries
export const DARK_MAP_COLORS = [
  '#f59e0b', // vibrant amber/orange
  '#e11d48', // vivid crimson/magenta
  '#06b6d4', // cyan/aqua
  '#3b82f6', // bright blue
  '#10b981', // emerald green
  '#8b5cf6', // purple
  '#ec4899', // hot pink
  '#d97706', // dark gold
  '#14b8a6', // teal
  '#6366f1', // indigo
];

// Complete World Countries & Maritime Trade Zones Registry
export const COUNTRIES_DATA: Record<string, CountryInfo> = {
  "united-states-of-america": {
    id: "840",
    slug: "united-states-of-america",
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    coordinates: [-98.5795, 39.8283],
    color: "#3b82f6",
    currentLeader: {
      id: "claude-ai",
      name: "Claude",
      tagline: "Next generation AI assistant by Anthropic",
      url: "https://claude.ai",
      logo: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
      stake: 3,
      category: "AI",
      claimedAt: "3d ago",
      expiresIn: "18h 40m",
      clicks: 98,
    }
  },
  russia: {
    id: "643",
    slug: "russia",
    name: "Russia",
    code: "RU",
    flag: "🇷🇺",
    coordinates: [95.3188, 61.524],
    color: "#f59e0b",
    currentLeader: {
      id: "shipxankit",
      name: "@shipxankit",
      tagline: "Founder & builder shipping AI agents and viral micro-SaaS",
      url: "https://x.com/shipxankit",
      logo: "https://unavatar.io/twitter/shipxankit",
      stake: 2,
      category: "AI",
      claimedAt: "1h ago",
      expiresIn: "23h 05m",
      clicks: 34,
    },
  },
  china: {
    id: "156",
    slug: "china",
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    coordinates: [104.1954, 35.8617],
    color: "#10b981",
    currentLeader: {
      id: "deepseek-com",
      name: "DeepSeek",
      tagline: "Unraveling the mystery of AGI",
      url: "https://deepseek.com",
      logo: "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128",
      stake: 2,
      category: "AI",
      claimedAt: "2d ago",
      expiresIn: "14h 15m",
      clicks: 81,
    }
  },
  canada: {
    id: "124",
    slug: "canada",
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    coordinates: [-106.3468, 56.1304],
    color: "#e11d48",
    currentLeader: {
      id: "outoutbid-lol",
      name: "outoutbid.lol",
      tagline: "every outbid.lol clone, in one directory",
      url: "https://outoutbid.lol",
      logo: "https://outoutbid.lol/favicon.svg",
      stake: 1,
      category: "Marketing",
      claimedAt: "21h ago",
      expiresIn: "3h 12m",
      isLaunchSponsored: true,
      clicks: 42,
    },
  },
  brazil: {
    id: "076",
    slug: "brazil",
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    coordinates: [-51.9253, -14.235],
    color: "#e11d48",
    currentLeader: {
      id: "snapsong-app",
      name: "SnapSong",
      tagline: "Create viral AI music videos in seconds",
      url: "https://snapsong.io",
      logo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
      stake: 2,
      category: "AI",
      claimedAt: "1d ago",
      expiresIn: "16h 20m",
      clicks: 53,
    }
  },
  india: {
    id: "356",
    slug: "india",
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    coordinates: [78.9629, 20.5937],
    color: "#f59e0b",
  },
  australia: {
    id: "036",
    slug: "australia",
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    coordinates: [133.7751, -25.2744],
    color: "#fbbf24",
  },
  "united-kingdom": {
    id: "826",
    slug: "united-kingdom",
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    coordinates: [-3.436, 55.3781],
    color: "#3b82f6",
  },
  germany: {
    id: "276",
    slug: "germany",
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    coordinates: [10.4515, 51.1657],
    color: "#8b5cf6",
  },
  france: {
    id: "250",
    slug: "france",
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    coordinates: [2.2137, 46.2276],
    color: "#06b6d4",
  },
  japan: {
    id: "392",
    slug: "japan",
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    coordinates: [138.2529, 36.2048],
    color: "#ec4899",
  },
  turkey: {
    id: "792",
    slug: "turkey",
    name: "Turkey",
    code: "TR",
    flag: "🇹🇷",
    coordinates: [35.2433, 38.9637],
    color: "#e11d48",
  },
  "saudi-arabia": {
    id: "682",
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    coordinates: [45.0792, 23.8859],
    color: "#10b981",
  },
  egypt: {
    id: "818",
    slug: "egypt",
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    coordinates: [30.8025, 26.8206],
    color: "#f59e0b",
  },
  "south-africa": {
    id: "710",
    slug: "south-africa",
    name: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    coordinates: [22.9375, -30.5595],
    color: "#14b8a6",
  },
  mexico: {
    id: "484",
    slug: "mexico",
    name: "Mexico",
    code: "MX",
    flag: "🇲🇽",
    coordinates: [-102.5528, 23.6345],
    color: "#10b981",
  },
  argentina: {
    id: "032",
    slug: "argentina",
    name: "Argentina",
    code: "AR",
    flag: "🇦🇷",
    coordinates: [-63.6167, -38.4161],
    color: "#06b6d4",
  },
  // Maritime Ocean Spots
  "south-atlantic-patrol": {
    id: "ocean-1",
    slug: "south-atlantic-patrol",
    name: "South Atlantic Patrol",
    code: "SA",
    flag: "⚓",
    coordinates: [-25.0, -32.0],
    isOceanZone: true,
  },
  "north-pacific-fleet": {
    id: "ocean-2",
    slug: "north-pacific-fleet",
    name: "North Pacific Fleet",
    code: "NP",
    flag: "⚓",
    coordinates: [-160.0, 32.0],
    isOceanZone: true,
  },
  "south-pacific-patrol": {
    id: "ocean-3",
    slug: "south-pacific-patrol",
    name: "South Pacific Patrol",
    code: "SP",
    flag: "⚓",
    coordinates: [-135.0, -28.0],
    isOceanZone: true,
  },
  "indian-ocean-trade-route": {
    id: "ocean-4",
    slug: "indian-ocean-trade-route",
    name: "Indian Ocean Trade Route",
    code: "IO",
    flag: "⚓",
    coordinates: [75.0, -18.0],
    isOceanZone: true,
  }
};

export const HOT_COUNTRIES: HotCountryItem[] = [
  {
    id: "hot-1",
    rank: 1,
    countryName: "United States",
    countrySlug: "united-states-of-america",
    countryFlag: "🇺🇸",
    countryCode: "US",
    rulerName: "Claude",
    rulerLogo: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
    currentStake: 3,
    stealPrice: 4,
    multiplier: "8.5x",
    isClaimed: true,
  },
  {
    id: "hot-2",
    rank: 2,
    countryName: "Russia",
    countrySlug: "russia",
    countryFlag: "🇷🇺",
    countryCode: "RU",
    rulerName: "@shipxankit",
    rulerLogo: "https://unavatar.io/twitter/shipxankit",
    currentStake: 2,
    stealPrice: 3,
    multiplier: "7.3x",
    isClaimed: true,
  },
  {
    id: "hot-3",
    rank: 3,
    countryName: "China",
    countrySlug: "china",
    countryFlag: "🇨🇳",
    countryCode: "CN",
    rulerName: "DeepSeek",
    rulerLogo: "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128",
    currentStake: 2,
    stealPrice: 3,
    multiplier: "6.1x",
    isClaimed: true,
  },
  {
    id: "hot-4",
    rank: 4,
    countryName: "Brazil",
    countrySlug: "brazil",
    countryFlag: "🇧🇷",
    countryCode: "BR",
    rulerName: "SnapSong",
    rulerLogo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
    currentStake: 2,
    stealPrice: 3,
    multiplier: "5.4x",
    isClaimed: true,
  },
  {
    id: "hot-5",
    rank: 5,
    countryName: "Canada",
    countrySlug: "canada",
    countryFlag: "🇨🇦",
    countryCode: "CA",
    rulerName: "outoutbid.lol",
    rulerLogo: "https://outoutbid.lol/favicon.svg",
    currentStake: 1,
    stealPrice: 2,
    multiplier: "4.9x",
    isClaimed: true,
  },
  {
    id: "hot-6",
    rank: 6,
    countryName: "India",
    countrySlug: "india",
    countryFlag: "🇮🇳",
    countryCode: "IN",
    rulerName: "Unclaimed",
    rulerLogo: "/globe.svg",
    currentStake: 0,
    stealPrice: 1,
    multiplier: "9.2x",
    isClaimed: false,
  }
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: "act-0",
    productName: "Claude",
    productSlug: "claude-ai",
    productUrl: "https://claude.ai",
    logo: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
    stake: 3,
    countryName: "United States",
    countryFlag: "🇺🇸",
    countryCode: "US",
    countrySlug: "united-states-of-america",
    category: "AI",
    action: "claimed",
    timeAgo: "3d ago",
    placementSlug: "claude-ai-us",
  },
  {
    id: "act-1",
    productName: "@shipxankit",
    productSlug: "shipxankit",
    productUrl: "https://x.com/shipxankit",
    logo: "https://unavatar.io/twitter/shipxankit",
    stake: 2,
    countryName: "Russia",
    countryFlag: "🇷🇺",
    countryCode: "RU",
    countrySlug: "russia",
    category: "AI",
    action: "claimed",
    timeAgo: "1h ago",
    placementSlug: "shipxankit-russia-20260901",
  },
  {
    id: "act-2",
    productName: "DeepSeek",
    productSlug: "deepseek-com",
    productUrl: "https://deepseek.com",
    logo: "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128",
    stake: 2,
    countryName: "China",
    countryFlag: "🇨🇳",
    countryCode: "CN",
    countrySlug: "china",
    category: "AI",
    action: "claimed",
    timeAgo: "2d ago",
    placementSlug: "deepseek-china",
  },
  {
    id: "act-3",
    productName: "SnapSong",
    productSlug: "snapsong-app",
    productUrl: "https://snapsong.io",
    logo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
    stake: 2,
    countryName: "Brazil",
    countryFlag: "🇧🇷",
    countryCode: "BR",
    countrySlug: "brazil",
    category: "AI",
    action: "claimed",
    timeAgo: "1d ago",
    placementSlug: "snapsong-brazil",
  },
  {
    id: "act-4",
    productName: "outoutbid.lol",
    productSlug: "outoutbid-lol",
    productUrl: "https://outoutbid.lol",
    logo: "https://outoutbid.lol/favicon.svg",
    stake: 1,
    isLaunchSponsored: true,
    countryName: "Canada",
    countryFlag: "🇨🇦",
    countryCode: "CA",
    countrySlug: "canada",
    category: "Marketing",
    action: "claimed",
    timeAgo: "21h ago",
    placementSlug: "outoutbid-lol-canada-20260831",
  },
  {
    id: "act-5",
    productName: "IndieTools",
    productSlug: "indietools-app",
    productUrl: "https://www.indietools.app",
    logo: "https://www.indietools.app/favicon.ico",
    stake: 1,
    countryName: "Turkey",
    countryFlag: "🇹🇷",
    countryCode: "TR",
    countrySlug: "turkey",
    category: "Marketing",
    action: "expired",
    timeAgo: "8h ago",
    placementSlug: "indietools-app-turkey-20260831",
  },
  {
    id: "act-6",
    productName: "QueueForm",
    productSlug: "queueform-com",
    productUrl: "https://www.queueform.com",
    logo: "https://framerusercontent.com/images/tfR1y96Rt21pquBZznoCbQMC5Qw.png",
    stake: 1,
    countryName: "United States of America",
    countryFlag: "🇺🇸",
    countryCode: "US",
    countrySlug: "united-states-of-america",
    category: "Marketing",
    action: "expired",
    timeAgo: "12h ago",
    placementSlug: "queueform-com-us-20260831",
  }
];

export const CATEGORIES_LIST = [
  { value: "", label: "All categories" },
  { value: "saas", label: "SaaS" },
  { value: "developer-tools", label: "Developer Tools" },
  { value: "ai", label: "AI" },
  { value: "marketing", label: "Marketing" },
  { value: "design", label: "Design" },
  { value: "productivity", label: "Productivity" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "finance", label: "Finance" },
  { value: "games", label: "Games" },
  { value: "other", label: "Other" }
];

export const SAMPLE_PRODUCTS: Record<string, ProductDetail> = {
  "claude-ai": {
    id: "claude-ai",
    slug: "claude-ai",
    name: "Claude",
    tagline: "Next generation AI assistant by Anthropic",
    url: "https://claude.ai",
    logo: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
    category: "AI",
    description: "State of the art AI reasoning, coding, and writing assistant.",
    launchDate: "August 2026",
    totalStaked: 3,
    allTimeClicks: 98,
    countriesClaimed: [
      {
        countryName: "United States",
        countryFlag: "🇺🇸",
        countrySlug: "united-states-of-america",
        rank: 1,
        staked: 3,
        date: "3d ago",
        status: "active",
      }
    ]
  },
  "shipxankit": {
    id: "shipxankit",
    slug: "shipxankit",
    name: "@shipxankit",
    tagline: "Founder & builder shipping AI agents and viral micro-SaaS",
    url: "https://x.com/shipxankit",
    logo: "https://unavatar.io/twitter/shipxankit",
    category: "AI",
    description: "Building fast, high-impact AI products and attention markets in public.",
    launchDate: "September 2026",
    totalStaked: 2,
    allTimeClicks: 34,
    countriesClaimed: [
      {
        countryName: "Russia",
        countryFlag: "🇷🇺",
        countrySlug: "russia",
        rank: 1,
        staked: 2,
        date: "1h ago",
        status: "active",
      }
    ]
  },
  "deepseek-com": {
    id: "deepseek-com",
    slug: "deepseek-com",
    name: "DeepSeek",
    tagline: "Unraveling the mystery of AGI",
    url: "https://deepseek.com",
    logo: "https://www.google.com/s2/favicons?domain=deepseek.com&sz=128",
    category: "AI",
    description: "Open source frontier AI models and intelligence research.",
    launchDate: "August 2026",
    totalStaked: 2,
    allTimeClicks: 81,
    countriesClaimed: [
      {
        countryName: "China",
        countryFlag: "🇨🇳",
        countrySlug: "china",
        rank: 1,
        staked: 2,
        date: "2d ago",
        status: "active",
      }
    ]
  },
  "snapsong-app": {
    id: "snapsong-app",
    slug: "snapsong-app",
    name: "SnapSong",
    tagline: "Create viral AI music videos in seconds",
    url: "https://snapsong.io",
    logo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
    category: "AI",
    description: "Turn your ideas and lyrics into studio-quality songs and visualizers.",
    launchDate: "August 2026",
    totalStaked: 2,
    allTimeClicks: 53,
    countriesClaimed: [
      {
        countryName: "Brazil",
        countryFlag: "🇧🇷",
        countrySlug: "brazil",
        rank: 1,
        staked: 2,
        date: "1d ago",
        status: "active",
      }
    ]
  },
  "outoutbid-lol": {
    id: "outoutbid-lol",
    slug: "outoutbid-lol",
    name: "outoutbid.lol",
    tagline: "every outbid.lol clone, in one directory",
    url: "https://outoutbid.lol",
    logo: "https://outoutbid.lol/favicon.svg",
    category: "Marketing",
    description: "The definitive open directory indexing all outbid and pay-to-rank game platforms.",
    launchDate: "August 2026",
    totalStaked: 1,
    allTimeClicks: 42,
    countriesClaimed: [
      {
        countryName: "Canada",
        countryFlag: "🇨🇦",
        countrySlug: "canada",
        rank: 1,
        staked: 1,
        date: "21h ago",
        status: "active",
      }
    ]
  },
  "indietools-app": {
    id: "indietools-app",
    slug: "indietools-app",
    name: "IndieTools",
    tagline: "Discover What's Building Next",
    url: "https://www.indietools.app",
    logo: "https://www.indietools.app/favicon.ico",
    category: "Marketing",
    description: "Curated directory and launchpad for indie makers and micro-SaaS founders.",
    launchDate: "August 2026",
    totalStaked: 1,
    allTimeClicks: 124,
    countriesClaimed: [
      {
        countryName: "Turkey",
        countryFlag: "🇹🇷",
        countrySlug: "turkey",
        rank: 1,
        staked: 1,
        date: "8h ago",
        status: "hall-of-fame",
      }
    ]
  },
  "queueform-com": {
    id: "queueform-com",
    slug: "queueform-com",
    name: "QueueForm",
    tagline: "Word of Mouth Marketing SaaS",
    url: "https://www.queueform.com",
    logo: "https://framerusercontent.com/images/tfR1y96Rt21pquBZznoCbQMC5Qw.png",
    category: "Marketing",
    description: "Turn your waiting list into an interactive referral engine.",
    launchDate: "August 2026",
    totalStaked: 1,
    allTimeClicks: 210,
    countriesClaimed: [
      {
        countryName: "United States",
        countryFlag: "🇺🇸",
        countrySlug: "united-states-of-america",
        rank: 1,
        staked: 1,
        date: "12h ago",
        status: "hall-of-fame",
      }
    ]
  }
};
