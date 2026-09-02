export interface CountryInfo {
  id: string;
  slug: string;
  name: string;
  code: string;
  flag: string;
  coordinates: [number, number];
  color?: string;
  tier?: 'TIER S' | 'TIER A' | 'TIER B' | 'TIER C';
  isOceanZone?: boolean;
  minPrice?: number;
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
    customColor?: string;
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

export const COUNTRY_COLOR_PALETTE = [
  '#ff5722',
  '#f59e0b',
  '#eab308',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#84cc16',
  '#ea580c',
  '#38bdf8',
  '#f43f5e',
];

export const DARK_MAP_COLORS = [
  '#f59e0b',
  '#e11d48',
  '#06b6d4',
  '#3b82f6',
  '#10b981',
  '#8b5cf6',
  '#ec4899',
  '#d97706',
  '#14b8a6',
  '#6366f1',
];

export function getProductFavicon(urlOrHandle: string): string {
  if (!urlOrHandle) return '/globe.svg';
  
  if (urlOrHandle.includes('linkedin.com')) {
    return 'https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca';
  }
  if (urlOrHandle.includes('x.com') || urlOrHandle.includes('twitter.com') || urlOrHandle.startsWith('@')) {
    const handle = urlOrHandle.replace(/.*(?:twitter\.com|x\.com)\//, '').replace('@', '').split('/')[0].split('?')[0];
    return `https://unavatar.io/twitter/${handle}`;
  }
  if (urlOrHandle.includes('github.com')) {
    const user = urlOrHandle.replace(/.*github\.com\//, '').split('/')[0];
    return `https://unavatar.io/github/${user}`;
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

export const COUNTRIES_DATA: Record<string, CountryInfo> = {
  "united-states-of-america": {
    id: "840",
    slug: "united-states-of-america",
    name: "United States",
    code: "US",
    flag: "🇺🇸",
    coordinates: [-98.5795, 39.8283],
    color: "#3b82f6",
    tier: "TIER S",
    minPrice: 4,
    currentLeader: {
      id: "ankit-singh",
      name: "Ankit Singh",
      tagline: "Founder & Growth Engineer building viral SaaS products",
      url: "https://www.linkedin.com/in/ankit-singh-63022b3a5/",
      logo: "https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
      stake: 3,
      category: "Indie Founders",
      claimedAt: "3d ago",
      expiresIn: "18h 40m",
      clicks: 98,
      customColor: "#3b82f6",
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
    tier: "TIER A",
    minPrice: 3,
    currentLeader: {
      id: "shipxankit",
      name: "@shipxankit",
      tagline: "Founder & builder shipping AI agents and viral micro-SaaS",
      url: "https://x.com/shipxankit",
      logo: "https://unavatar.io/twitter/shipxankit",
      stake: 2,
      category: "Indie Founders",
      claimedAt: "1h ago",
      expiresIn: "23h 05m",
      clicks: 34,
      customColor: "#f59e0b",
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
    tier: "TIER S",
    minPrice: 3,
    currentLeader: {
      id: "shipxankitconsulting",
      name: "ShipXAnkit Consulting",
      tagline: "Scale your startup with AI agents & viral distribution",
      url: "https://shipxankitconsulting.vercel.app/",
      logo: "https://unavatar.io/twitter/shipxankit",
      stake: 2,
      category: "Marketing & Advertising",
      claimedAt: "2d ago",
      expiresIn: "14h 15m",
      clicks: 81,
      customColor: "#10b981",
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
    tier: "TIER A",
    minPrice: 2,
    currentLeader: {
      id: "outoutbid-lol",
      name: "outoutbid.lol",
      tagline: "every outbid.lol clone, in one directory",
      url: "https://outoutbid.lol",
      logo: "https://outoutbid.lol/favicon.svg",
      stake: 1,
      category: "Marketing & Advertising",
      claimedAt: "21h ago",
      expiresIn: "3h 12m",
      isLaunchSponsored: true,
      clicks: 42,
      customColor: "#e11d48",
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
    tier: "TIER B",
    minPrice: 3,
    currentLeader: {
      id: "snapsong-app",
      name: "SnapSong",
      tagline: "Create viral AI music videos in seconds",
      url: "https://snapsong.io",
      logo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
      stake: 2,
      category: "AI Media Generation",
      claimedAt: "1d ago",
      expiresIn: "16h 20m",
      clicks: 53,
      customColor: "#e11d48",
    }
  },
  iran: {
    id: "364",
    slug: "iran",
    name: "Iran",
    code: "IR",
    flag: "🇮🇷",
    coordinates: [53.683, 32.4279],
    color: "#8b5cf6",
    tier: "TIER C",
    minPrice: 2,
    currentLeader: {
      id: "terrified-of-ai",
      name: "Terrified of AI",
      tagline: "Claim your spot on the world map.",
      url: "https://terrifiedof.ai",
      logo: "https://www.google.com/s2/favicons?domain=terrifiedof.ai&sz=128",
      stake: 10,
      category: "SEO & AI Visibility",
      claimedAt: "1d ago",
      expiresIn: "12h 00m",
      clicks: 290,
      customColor: "#8b5cf6",
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
    tier: "TIER S",
    minPrice: 5,
  },
  australia: {
    id: "036",
    slug: "australia",
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    coordinates: [133.7751, -25.2744],
    color: "#fbbf24",
    tier: "TIER A",
    minPrice: 3,
  },
  "united-kingdom": {
    id: "826",
    slug: "united-kingdom",
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    coordinates: [-3.436, 55.3781],
    color: "#3b82f6",
    tier: "TIER S",
    minPrice: 4,
  },
  germany: {
    id: "276",
    slug: "germany",
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    coordinates: [10.4515, 51.1657],
    color: "#8b5cf6",
    tier: "TIER A",
    minPrice: 3,
  },
  france: {
    id: "250",
    slug: "france",
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    coordinates: [2.2137, 46.2276],
    color: "#06b6d4",
    tier: "TIER A",
    minPrice: 3,
  },
  japan: {
    id: "392",
    slug: "japan",
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    coordinates: [138.2529, 36.2048],
    color: "#ec4899",
    tier: "TIER S",
    minPrice: 4,
  },
  turkey: {
    id: "792",
    slug: "turkey",
    name: "Turkey",
    code: "TR",
    flag: "🇹🇷",
    coordinates: [35.2433, 38.9637],
    color: "#e11d48",
    tier: "TIER B",
    minPrice: 2,
  },
  "saudi-arabia": {
    id: "682",
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    coordinates: [45.0792, 23.8859],
    color: "#10b981",
    tier: "TIER B",
    minPrice: 2,
  },
  egypt: {
    id: "818",
    slug: "egypt",
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    coordinates: [30.8025, 26.8206],
    color: "#f59e0b",
    tier: "TIER B",
    minPrice: 2,
  },
  "south-africa": {
    id: "710",
    slug: "south-africa",
    name: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    coordinates: [22.9375, -30.5595],
    color: "#14b8a6",
    tier: "TIER B",
    minPrice: 2,
  },
  mexico: {
    id: "484",
    slug: "mexico",
    name: "Mexico",
    code: "MX",
    flag: "🇲🇽",
    coordinates: [-102.5528, 23.6345],
    color: "#10b981",
    tier: "TIER B",
    minPrice: 2,
  },
  argentina: {
    id: "032",
    slug: "argentina",
    name: "Argentina",
    code: "AR",
    flag: "🇦🇷",
    coordinates: [-63.6167, -38.4161],
    color: "#06b6d4",
    tier: "TIER B",
    minPrice: 2,
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
    rulerName: "Ankit Singh",
    rulerLogo: "https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
    currentStake: 3,
    stealPrice: 4,
    multiplier: "8.5x",
    isClaimed: true,
  },
  {
    id: "hot-2",
    rank: 2,
    countryName: "Iran",
    countrySlug: "iran",
    countryFlag: "🇮🇷",
    countryCode: "IR",
    rulerName: "Terrified of AI",
    rulerLogo: "https://www.google.com/s2/favicons?domain=terrifiedof.ai&sz=128",
    currentStake: 10,
    stealPrice: 11,
    multiplier: "9.8x",
    isClaimed: true,
  },
  {
    id: "hot-3",
    rank: 3,
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
    id: "hot-4",
    rank: 4,
    countryName: "China",
    countrySlug: "china",
    countryFlag: "🇨🇳",
    countryCode: "CN",
    rulerName: "ShipXAnkit Consulting",
    rulerLogo: "https://unavatar.io/twitter/shipxankit",
    currentStake: 2,
    stealPrice: 3,
    multiplier: "6.1x",
    isClaimed: true,
  },
  {
    id: "hot-5",
    rank: 5,
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
  }
];

export const INITIAL_ACTIVITY: ActivityItem[] = [
  {
    id: "act-0",
    productName: "Terrified of AI",
    productSlug: "terrified-of-ai",
    productUrl: "https://terrifiedof.ai",
    logo: "https://www.google.com/s2/favicons?domain=terrifiedof.ai&sz=128",
    stake: 10,
    countryName: "Iran",
    countryFlag: "🇮🇷",
    countryCode: "IR",
    countrySlug: "iran",
    category: "SEO & AI Visibility",
    action: "claimed",
    timeAgo: "10m ago",
    placementSlug: "terrified-of-ai-iran",
  },
  {
    id: "act-1",
    productName: "Ankit Singh",
    productSlug: "ankit-singh",
    productUrl: "https://www.linkedin.com/in/ankit-singh-63022b3a5/",
    logo: "https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
    stake: 3,
    countryName: "United States",
    countryFlag: "🇺🇸",
    countryCode: "US",
    countrySlug: "united-states-of-america",
    category: "Indie Founders",
    action: "claimed",
    timeAgo: "3d ago",
    placementSlug: "ankit-singh-us",
  },
  {
    id: "act-2",
    productName: "@shipxankit",
    productSlug: "shipxankit",
    productUrl: "https://x.com/shipxankit",
    logo: "https://unavatar.io/twitter/shipxankit",
    stake: 2,
    countryName: "Russia",
    countryFlag: "🇷🇺",
    countryCode: "RU",
    countrySlug: "russia",
    category: "Indie Founders",
    action: "claimed",
    timeAgo: "1h ago",
    placementSlug: "shipxankit-russia",
  },
  {
    id: "act-3",
    productName: "ShipXAnkit Consulting",
    productSlug: "shipxankitconsulting",
    productUrl: "https://shipxankitconsulting.vercel.app/",
    logo: "https://unavatar.io/twitter/shipxankit",
    stake: 2,
    countryName: "China",
    countryFlag: "🇨🇳",
    countryCode: "CN",
    countrySlug: "china",
    category: "Marketing & Advertising",
    action: "claimed",
    timeAgo: "2d ago",
    placementSlug: "shipxankitconsulting-china",
  },
  {
    id: "act-4",
    productName: "SnapSong",
    productSlug: "snapsong-app",
    productUrl: "https://snapsong.io",
    logo: "https://www.google.com/s2/favicons?domain=spotify.com&sz=128",
    stake: 2,
    countryName: "Brazil",
    countryFlag: "🇧🇷",
    countryCode: "BR",
    countrySlug: "brazil",
    category: "AI Media Generation",
    action: "claimed",
    timeAgo: "1d ago",
    placementSlug: "snapsong-brazil",
  }
];

export const CATEGORIES_LIST = [
  { value: "", label: "🔥 All Categories" },
  { value: "seo-ai-visibility", label: "🔍 SEO & AI Visibility" },
  { value: "ai-agents-infrastructure", label: "🤖 AI Agents & Infrastructure" },
  { value: "ai-media-generation", label: "✨ AI Media Generation" },
  { value: "marketing-advertising", label: "📢 Marketing & Advertising" },
  { value: "developer-tools", label: "🛠️ Developer Tools" },
  { value: "indie-founders", label: "💼 Indie Founders" }
];

export const SAMPLE_PRODUCTS: Record<string, ProductDetail> = {
  "ankit-singh": {
    id: "ankit-singh",
    slug: "ankit-singh",
    name: "Ankit Singh",
    tagline: "Founder & Growth Engineer building viral SaaS products",
    url: "https://www.linkedin.com/in/ankit-singh-63022b3a5/",
    logo: "https://static.licdn.com/aero-v1/sc/h/al2o9zrvru7aqj8e1x2rzsrca",
    category: "Indie Founders",
    description: "Full-stack software engineer and growth builder specializing in viral web apps and autonomous AI agents.",
    launchDate: "September 2026",
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
  "shipxankitconsulting": {
    id: "shipxankitconsulting",
    slug: "shipxankitconsulting",
    name: "ShipXAnkit Consulting",
    tagline: "Scale your startup with AI agents & viral distribution",
    url: "https://shipxankitconsulting.vercel.app/",
    logo: "https://unavatar.io/twitter/shipxankit",
    category: "Marketing & Advertising",
    description: "End-to-end engineering, growth marketing, and AI automation consulting for high-growth tech startups.",
    launchDate: "September 2026",
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
  "shipxankit": {
    id: "shipxankit",
    slug: "shipxankit",
    name: "@shipxankit",
    tagline: "Founder & builder shipping AI agents and viral micro-SaaS",
    url: "https://x.com/shipxankit",
    logo: "https://unavatar.io/twitter/shipxankit",
    category: "Indie Founders",
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
  "terrified-of-ai": {
    id: "terrified-of-ai",
    slug: "terrified-of-ai",
    name: "Terrified of AI",
    tagline: "Claim your spot on the world map.",
    url: "https://terrifiedof.ai",
    logo: "https://www.google.com/s2/favicons?domain=terrifiedof.ai&sz=128",
    category: "SEO & AI Visibility",
    description: "Real-time AI monitoring and attention intelligence.",
    launchDate: "September 2026",
    totalStaked: 10,
    allTimeClicks: 290,
    countriesClaimed: [
      {
        countryName: "Iran",
        countryFlag: "🇮🇷",
        countrySlug: "iran",
        rank: 1,
        staked: 10,
        date: "1d ago",
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
    category: "AI Media Generation",
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
    category: "Marketing & Advertising",
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
  }
};
