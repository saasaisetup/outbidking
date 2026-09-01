export interface CountryInfo {
  id: string; // ISO numeric code string (e.g. "124" for Canada, "840" for USA, "643" for Russia)
  slug: string;
  name: string;
  code: string; // 2-letter ISO (e.g. "CA", "US", "RU")
  flag: string;
  coordinates: [number, number]; // [longitude, latitude]
  color?: string;
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

// Complete World Countries Registry mapping ISO numeric to info
export const COUNTRIES_DATA: Record<string, CountryInfo> = {
  russia: {
    id: "643",
    slug: "russia",
    name: "Russia",
    code: "RU",
    flag: "🇷🇺",
    coordinates: [105.3188, 61.524],
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
  canada: {
    id: "124",
    slug: "canada",
    name: "Canada",
    code: "CA",
    flag: "🇨🇦",
    coordinates: [-106.3468, 56.1304],
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
  "united-states-of-america": {
    id: "840",
    slug: "united-states-of-america",
    name: "United States of America",
    code: "US",
    flag: "🇺🇸",
    coordinates: [-95.7129, 37.0902],
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
  china: {
    id: "156",
    slug: "china",
    name: "China",
    code: "CN",
    flag: "🇨🇳",
    coordinates: [104.1954, 35.8617],
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
  turkey: {
    id: "792",
    slug: "turkey",
    name: "Turkey",
    code: "TR",
    flag: "🇹🇷",
    coordinates: [35.2433, 38.9637],
  },
  libya: {
    id: "434",
    slug: "libya",
    name: "Libya",
    code: "LY",
    flag: "🇱🇾",
    coordinates: [17.2283, 26.3351],
  },
  algeria: {
    id: "012",
    slug: "algeria",
    name: "Algeria",
    code: "DZ",
    flag: "🇩🇿",
    coordinates: [1.6596, 28.0339],
  },
  egypt: {
    id: "818",
    slug: "egypt",
    name: "Egypt",
    code: "EG",
    flag: "🇪🇬",
    coordinates: [30.8025, 26.8206],
  },
  "saudi-arabia": {
    id: "682",
    slug: "saudi-arabia",
    name: "Saudi Arabia",
    code: "SA",
    flag: "🇸🇦",
    coordinates: [45.0792, 23.8859],
  },
  india: {
    id: "356",
    slug: "india",
    name: "India",
    code: "IN",
    flag: "🇮🇳",
    coordinates: [78.9629, 20.5937],
  },
  kazakhstan: {
    id: "398",
    slug: "kazakhstan",
    name: "Kazakhstan",
    code: "KZ",
    flag: "🇰🇿",
    coordinates: [66.9237, 48.0196],
  },
  iran: {
    id: "364",
    slug: "iran",
    name: "Iran",
    code: "IR",
    flag: "🇮🇷",
    coordinates: [53.688, 32.4279],
  },
  sudan: {
    id: "729",
    slug: "sudan",
    name: "Sudan",
    code: "SD",
    flag: "🇸🇩",
    coordinates: [30.2176, 12.8628],
  },
  chad: {
    id: "148",
    slug: "chad",
    name: "Chad",
    code: "TD",
    flag: "🇹🇩",
    coordinates: [18.7322, 15.4542],
  },
  niger: {
    id: "562",
    slug: "niger",
    name: "Niger",
    code: "NE",
    flag: "🇳🇪",
    coordinates: [8.0817, 17.6078],
  },
  nigeria: {
    id: "566",
    slug: "nigeria",
    name: "Nigeria",
    code: "NG",
    flag: "🇳🇬",
    coordinates: [8.6753, 9.082],
  },
  mali: {
    id: "466",
    slug: "mali",
    name: "Mali",
    code: "ML",
    flag: "🇲🇱",
    coordinates: [-3.9962, 17.5707],
  },
  mauritania: {
    id: "478",
    slug: "mauritania",
    name: "Mauritania",
    code: "MR",
    flag: "🇲🇷",
    coordinates: [-10.9408, 21.0079],
  },
  "dem-rep-congo": {
    id: "180",
    slug: "dem-rep-congo",
    name: "Dem. Rep. Congo",
    code: "CD",
    flag: "🇨🇩",
    coordinates: [21.7587, -4.0383],
  },
  angola: {
    id: "024",
    slug: "angola",
    name: "Angola",
    code: "AO",
    flag: "🇦🇴",
    coordinates: [17.8739, -11.2027],
  },
  "south-africa": {
    id: "710",
    slug: "south-africa",
    name: "South Africa",
    code: "ZA",
    flag: "🇿🇦",
    coordinates: [22.9375, -30.5595],
  },
  ethiopia: {
    id: "231",
    slug: "ethiopia",
    name: "Ethiopia",
    code: "ET",
    flag: "🇪🇹",
    coordinates: [40.4897, 9.145],
  },
  brazil: {
    id: "076",
    slug: "brazil",
    name: "Brazil",
    code: "BR",
    flag: "🇧🇷",
    coordinates: [-51.9253, -14.235],
  },
  australia: {
    id: "036",
    slug: "australia",
    name: "Australia",
    code: "AU",
    flag: "🇦🇺",
    coordinates: [133.7751, -25.2744],
  },
  germany: {
    id: "276",
    slug: "germany",
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    coordinates: [10.4515, 51.1657],
  },
  "united-kingdom": {
    id: "826",
    slug: "united-kingdom",
    name: "United Kingdom",
    code: "GB",
    flag: "🇬🇧",
    coordinates: [-3.436, 55.3781],
  },
  france: {
    id: "250",
    slug: "france",
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    coordinates: [2.2137, 46.2276],
  },
  japan: {
    id: "392",
    slug: "japan",
    name: "Japan",
    code: "JP",
    flag: "🇯🇵",
    coordinates: [138.2529, 36.2048],
  },
  czechia: {
    id: "203",
    slug: "czechia",
    name: "Czechia",
    code: "CZ",
    flag: "🇨🇿",
    coordinates: [15.473, 49.8175],
  },
  argentina: {
    id: "032",
    slug: "argentina",
    name: "Argentina",
    code: "AR",
    flag: "🇦🇷",
    coordinates: [-63.6167, -38.4161],
  },
  mexico: {
    id: "484",
    slug: "mexico",
    name: "Mexico",
    code: "MX",
    flag: "🇲🇽",
    coordinates: [-102.5528, 23.6345],
  },
  indonesia: {
    id: "360",
    slug: "indonesia",
    name: "Indonesia",
    code: "ID",
    flag: "🇮🇩",
    coordinates: [113.9213, -0.7893],
  },
  spain: {
    id: "724",
    slug: "spain",
    name: "Spain",
    code: "ES",
    flag: "ES",
    coordinates: [-3.7492, 40.4637],
  },
  italy: {
    id: "380",
    slug: "italy",
    name: "Italy",
    code: "IT",
    flag: "🇮🇹",
    coordinates: [12.5674, 41.8719],
  },
  sweden: {
    id: "752",
    slug: "sweden",
    name: "Sweden",
    code: "SE",
    flag: "🇸🇪",
    coordinates: [18.6435, 60.1282],
  },
  norway: {
    id: "578",
    slug: "norway",
    name: "Norway",
    code: "NO",
    flag: "🇳🇴",
    coordinates: [8.4689, 60.472],
  },
  poland: {
    id: "616",
    slug: "poland",
    name: "Poland",
    code: "PL",
    flag: "🇵🇱",
    coordinates: [19.1451, 51.9194],
  },
  ukraine: {
    id: "804",
    slug: "ukraine",
    name: "Ukraine",
    code: "UA",
    flag: "🇺🇦",
    coordinates: [31.1656, 48.3794],
  },
  pakistan: {
    id: "586",
    slug: "pakistan",
    name: "Pakistan",
    code: "PK",
    flag: "🇵🇰",
    coordinates: [69.3451, 30.3753],
  },
  thailand: {
    id: "764",
    slug: "thailand",
    name: "Thailand",
    code: "TH",
    flag: "🇹🇭",
    coordinates: [100.9925, 15.87],
  },
  vietnam: {
    id: "704",
    slug: "vietnam",
    name: "Vietnam",
    code: "VN",
    flag: "🇻🇳",
    coordinates: [108.2772, 14.0583],
  },
  "south-korea": {
    id: "410",
    slug: "south-korea",
    name: "South Korea",
    code: "KR",
    flag: "🇰🇷",
    coordinates: [127.7669, 35.9078],
  },
  kenya: {
    id: "404",
    slug: "kenya",
    name: "Kenya",
    code: "KE",
    flag: "🇰🇪",
    coordinates: [37.9062, -0.0236],
  },
  morocco: {
    id: "504",
    slug: "morocco",
    name: "Morocco",
    code: "MA",
    flag: "🇲🇦",
    coordinates: [-7.0926, 31.7917],
  },
  ghana: {
    id: "288",
    slug: "ghana",
    name: "Ghana",
    code: "GH",
    flag: "🇬🇭",
    coordinates: [-1.0232, 7.9465],
  },
  chile: {
    id: "152",
    slug: "chile",
    name: "Chile",
    code: "CL",
    flag: "🇨🇱",
    coordinates: [-71.543, -35.6751],
  },
  colombia: {
    id: "170",
    slug: "colombia",
    name: "Colombia",
    code: "CO",
    flag: "🇨🇴",
    coordinates: [-74.2973, 4.5709],
  },
  peru: {
    id: "604",
    slug: "peru",
    name: "Peru",
    code: "PE",
    flag: "🇵🇪",
    coordinates: [-75.0152, -9.1899],
  },
  "new-zealand": {
    id: "554",
    slug: "new-zealand",
    name: "New Zealand",
    code: "NZ",
    flag: "🇳🇿",
    coordinates: [174.886, -40.9006],
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
    id: "hot-5",
    rank: 5,
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
  },
  {
    id: "hot-6",
    rank: 6,
    countryName: "Germany",
    countrySlug: "germany",
    countryFlag: "🇩🇪",
    countryCode: "DE",
    rulerName: "Unclaimed",
    rulerLogo: "/globe.svg",
    currentStake: 0,
    stealPrice: 1,
    multiplier: "5.8x",
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
    countryName: "United States of America",
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
    id: "act-4",
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
    id: "act-5",
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
  },
  {
    id: "act-6",
    productName: "LiftOff (@lift_off_sh) on X",
    productSlug: "x-lift-off-sh",
    productUrl: "https://x.com/lift_off_sh",
    logo: "https://unavatar.io/twitter/lift_off_sh",
    stake: 1,
    isLaunchSponsored: true,
    countryName: "Dem. Rep. Congo",
    countryFlag: "🇨🇩",
    countryCode: "CD",
    countrySlug: "dem-rep-congo",
    category: "Marketing",
    action: "expired",
    timeAgo: "21h ago",
    placementSlug: "x-lift-off-sh-congo-20260830",
  },
  {
    id: "act-7",
    productName: "Wafler DDoS Protection",
    productSlug: "wafler-one",
    productUrl: "https://wafler.one",
    logo: "https://wafler.one/favicon.ico",
    stake: 1,
    isLaunchSponsored: true,
    countryName: "Saudi Arabia",
    countryFlag: "🇸🇦",
    countryCode: "SA",
    countrySlug: "saudi-arabia",
    category: "SaaS",
    action: "expired",
    timeAgo: "21h ago",
    placementSlug: "wafler-one-saudi-arabia-20260830",
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
  { value: "education", label: "Education" },
  { value: "health", label: "Health" },
  { value: "media", label: "Media & Content" },
  { value: "community", label: "Community" },
  { value: "other", label: "Other" }
];

export const SAMPLE_PRODUCTS: Record<string, ProductDetail> = {
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
  "claude-ai": {
    id: "claude-ai",
    slug: "claude-ai",
    name: "Claude",
    tagline: "Next generation AI assistant by Anthropic",
    url: "https://claude.ai",
    logo: "https://www.google.com/s2/favicons?domain=claude.ai&sz=128",
    category: "AI",
    description: "State of the art AI reasoning, coding, and writing.",
    launchDate: "August 2026",
    totalStaked: 3,
    allTimeClicks: 98,
    countriesClaimed: [
      {
        countryName: "United States of America",
        countryFlag: "🇺🇸",
        countrySlug: "united-states-of-america",
        rank: 1,
        staked: 3,
        date: "3d ago",
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
    description: "Curated directory and launchpad for indie makers, bootstrapped products, and micro-SaaS founders.",
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
    description: "Turn your waiting list into an interactive referral engine that brings thousands of users on autopilot.",
    launchDate: "August 2026",
    totalStaked: 2,
    allTimeClicks: 210,
    countriesClaimed: [
      {
        countryName: "United States of America",
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
