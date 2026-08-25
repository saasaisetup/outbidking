export interface CountryMeta {
  numericId: string;
  code: string;
  code3: string;
  name: string;
  flag: string;
  coordinates: [number, number];
  population: string;
  tier: 'TIER S' | 'TIER A' | 'TIER B' | 'TIER C';
  defaultColor: string;
  startingPrice: number;
  isOceanFleet?: boolean;
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

export function calcMinOutbid(currentBid: number): number {
  if (!currentBid || currentBid <= 0) return 3;
  return Math.ceil(currentBid * 1.5);
}

export const EMPIRE_COLORS = [
  '#ea580c', // Orange
  '#f59e0b', // Amber
  '#facc15', // Yellow
  '#4ade80', // Green
  '#2dd4bf', // Cyan
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#84cc16', // Lime
  '#fb923c', // Coral
  '#38bdf8', // Sky Blue
  '#f43f5e', // Rose
];

export function getEmpireColor(titleOrUrl: string): string {
  let hash = 0;
  const str = titleOrUrl.toLowerCase();
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % EMPIRE_COLORS.length;
  return EMPIRE_COLORS[index];
}

// Complete 194 Sovereign Countries Dataset matching warmap.lol palette
export const WORLD_COUNTRIES: CountryMeta[] = [
  // --- NORTH AMERICA ---
  { numericId: "840", code: "US", code3: "USA", name: "United States", flag: "🇺🇸", coordinates: [-98.5795, 39.8283], population: "335M", tier: "TIER S", defaultColor: "#ecc849", startingPrice: 160 },
  { numericId: "124", code: "CA", code3: "CAN", name: "Canada", flag: "🇨🇦", coordinates: [-106.3468, 56.1304], population: "39M", tier: "TIER S", defaultColor: "#d84c37", startingPrice: 86 },
  { numericId: "304", code: "GL", code3: "GRL", name: "Greenland", flag: "🇬🇱", coordinates: [-42.6043, 71.7069], population: "56K", tier: "TIER A", defaultColor: "#4ade80", startingPrice: 25 },
  { numericId: "484", code: "MX", code3: "MEX", name: "Mexico", flag: "🇲🇽", coordinates: [-102.5528, 23.6345], population: "128M", tier: "TIER A", defaultColor: "#34d399", startingPrice: 30 },
  { numericId: "320", code: "GT", code3: "GTM", name: "Guatemala", flag: "🇬🇹", coordinates: [-90.2308, 15.7835], population: "18M", tier: "TIER C", defaultColor: "#38bdf8", startingPrice: 4 },
  { numericId: "084", code: "BZ", code3: "BLZ", name: "Belize", flag: "🇧🇿", coordinates: [-88.4976, 17.1899], population: "400K", tier: "TIER C", defaultColor: "#a855f7", startingPrice: 3 },
  { numericId: "340", code: "HN", code3: "HND", name: "Honduras", flag: "🇭🇳", coordinates: [-86.2419, 15.2000], population: "10M", tier: "TIER C", defaultColor: "#fb923c", startingPrice: 3 },
  { numericId: "222", code: "SV", code3: "SLV", name: "El Salvador", flag: "🇸🇻", coordinates: [-88.8965, 13.7942], population: "6.3M", tier: "TIER C", defaultColor: "#ec4899", startingPrice: 5 },
  { numericId: "558", code: "NI", code3: "NIC", name: "Nicaragua", flag: "🇳🇮", coordinates: [-85.2072, 12.8654], population: "6.9M", tier: "TIER C", defaultColor: "#eab308", startingPrice: 4 },
  { numericId: "188", code: "CR", code3: "CRI", name: "Costa Rica", flag: "🇨🇷", coordinates: [-83.7534, 9.7489], population: "5.2M", tier: "TIER C", defaultColor: "#3b82f6", startingPrice: 6 },
  { numericId: "591", code: "PA", code3: "PAN", name: "Panama", flag: "🇵🇦", coordinates: [-80.7821, 8.5379], population: "4.4M", tier: "TIER C", defaultColor: "#14b8a6", startingPrice: 6 },
  { numericId: "192", code: "CU", code3: "CUB", name: "Cuba", flag: "🇨🇺", coordinates: [-77.7812, 21.5218], population: "11M", tier: "TIER C", defaultColor: "#f43f5e", startingPrice: 4 },
  { numericId: "388", code: "JM", code3: "JAM", name: "Jamaica", flag: "🇯🇲", coordinates: [-77.2975, 18.1096], population: "2.8M", tier: "TIER C", defaultColor: "#84cc16", startingPrice: 4 },
  { numericId: "332", code: "HT", code3: "HTI", name: "Haiti", flag: "🇭🇹", coordinates: [-72.2852, 18.9712], population: "11.5M", tier: "TIER C", defaultColor: "#6366f1", startingPrice: 3 },
  { numericId: "214", code: "DO", code3: "DOM", name: "Dominican Republic", flag: "🇩🇴", coordinates: [-70.1627, 18.7357], population: "11.2M", tier: "TIER C", defaultColor: "#06b6d4", startingPrice: 5 },

  // --- SOUTH AMERICA ---
  { numericId: "076", code: "BR", code3: "BRA", name: "Brazil", flag: "🇧🇷", coordinates: [-51.9253, -14.2350], population: "216M", tier: "TIER S", defaultColor: "#ef4444", startingPrice: 50 },
  { numericId: "170", code: "CO", code3: "COL", name: "Colombia", flag: "🇨🇴", coordinates: [-74.2973, 4.5709], population: "52M", tier: "TIER B", defaultColor: "#f97316", startingPrice: 14 },
  { numericId: "862", code: "VE", code3: "VEN", name: "Venezuela", flag: "🇻🇪", coordinates: [-66.5897, 6.4238], population: "29M", tier: "TIER B", defaultColor: "#eab308", startingPrice: 9 },
  { numericId: "328", code: "GY", code3: "GUY", name: "Guyana", flag: "🇬🇾", coordinates: [-58.9302, 4.8604], population: "800K", tier: "TIER C", defaultColor: "#22c55e", startingPrice: 3 },
  { numericId: "740", code: "SR", code3: "SUR", name: "Suriname", flag: "🇸🇷", coordinates: [-56.0278, 3.9193], population: "600K", tier: "TIER C", defaultColor: "#06b6d4", startingPrice: 3 },
  { numericId: "218", code: "EC", code3: "ECU", name: "Ecuador", flag: "🇪🇨", coordinates: [-78.1834, -1.8312], population: "18M", tier: "TIER C", defaultColor: "#facc15", startingPrice: 6 },
  { numericId: "604", code: "PE", code3: "PER", name: "Peru", flag: "🇵🇪", coordinates: [-75.0152, -9.1899], population: "34M", tier: "TIER B", defaultColor: "#ec4899", startingPrice: 11 },
  { numericId: "068", code: "BO", code3: "BOL", name: "Bolivia", flag: "🇧🇴", coordinates: [-63.5887, -16.2902], population: "12M", tier: "TIER C", defaultColor: "#14b8a6", startingPrice: 5 },
  { numericId: "600", code: "PY", code3: "PRY", name: "Paraguay", flag: "🇵🇾", coordinates: [-58.4438, -23.4425], population: "6.8M", tier: "TIER C", defaultColor: "#8b5cf6", startingPrice: 4 },
  { numericId: "152", code: "CL", code3: "CHL", name: "Chile", flag: "🇨🇱", coordinates: [-71.5430, -35.6751], population: "19.5M", tier: "TIER B", defaultColor: "#84cc16", startingPrice: 16 },
  { numericId: "032", code: "AR", code3: "ARG", name: "Argentina", flag: "🇦🇷", coordinates: [-63.6167, -38.4161], population: "46M", tier: "TIER A", defaultColor: "#27272a", startingPrice: 20 },
  { numericId: "858", code: "UY", code3: "URY", name: "Uruguay", flag: "🇺🇾", coordinates: [-55.7658, -32.5228], population: "3.4M", tier: "TIER C", defaultColor: "#38bdf8", startingPrice: 5 },

  // --- EUROPE ---
  { numericId: "826", code: "GB", code3: "GBR", name: "United Kingdom", flag: "🇬🇧", coordinates: [-3.4360, 55.3781], population: "67M", tier: "TIER S", defaultColor: "#facc15", startingPrice: 57 },
  { numericId: "372", code: "IE", code3: "IRL", name: "Ireland", flag: "🇮🇪", coordinates: [-8.2439, 53.4129], population: "5.1M", tier: "TIER B", defaultColor: "#22c55e", startingPrice: 21 },
  { numericId: "250", code: "FR", code3: "FRA", name: "France", flag: "🇫🇷", coordinates: [2.2137, 46.2276], population: "68M", tier: "TIER S", defaultColor: "#06b6d4", startingPrice: 42 },
  { numericId: "276", code: "DE", code3: "DEU", name: "Germany", flag: "🇩🇪", coordinates: [10.4515, 51.1657], population: "84M", tier: "TIER S", defaultColor: "#14b8a6", startingPrice: 48 },
  { numericId: "724", code: "ES", code3: "ESP", name: "Spain", flag: "🇪🇸", coordinates: [-3.7492, 40.4637], population: "48M", tier: "TIER A", defaultColor: "#ea580c", startingPrice: 27 },
  { numericId: "620", code: "PT", code3: "PRT", name: "Portugal", flag: "🇵🇹", coordinates: [-8.2245, 39.3999], population: "10.4M", tier: "TIER B", defaultColor: "#10b981", startingPrice: 16 },
  { numericId: "380", code: "IT", code3: "ITA", name: "Italy", flag: "🇮🇹", coordinates: [12.5674, 41.8719], population: "59M", tier: "TIER A", defaultColor: "#f97316", startingPrice: 29 },
  { numericId: "756", code: "CH", code3: "CHE", name: "Switzerland", flag: "🇨🇭", coordinates: [8.2275, 46.8182], population: "8.8M", tier: "TIER A", defaultColor: "#f43f5e", startingPrice: 38 },
  { numericId: "040", code: "AT", code3: "AUT", name: "Austria", flag: "🇦🇹", coordinates: [14.5501, 47.5162], population: "9M", tier: "TIER B", defaultColor: "#d946ef", startingPrice: 22 },
  { numericId: "056", code: "BE", code3: "BEL", name: "Belgium", flag: "🇧🇪", coordinates: [4.4699, 50.5039], population: "11.7M", tier: "TIER B", defaultColor: "#eab308", startingPrice: 23 },
  { numericId: "528", code: "NL", code3: "NLD", name: "Netherlands", flag: "🇳🇱", coordinates: [5.2913, 52.1326], population: "18M", tier: "TIER A", defaultColor: "#f97316", startingPrice: 32 },
  { numericId: "752", code: "SE", code3: "SWE", name: "Sweden", flag: "🇸🇪", coordinates: [18.6435, 60.1282], population: "10.5M", tier: "TIER A", defaultColor: "#38bdf8", startingPrice: 26 },
  { numericId: "578", code: "NO", code3: "NOR", name: "Norway", flag: "🇳🇴", coordinates: [8.4689, 60.4720], population: "5.5M", tier: "TIER A", defaultColor: "#3b82f6", startingPrice: 24 },
  { numericId: "246", code: "FI", code3: "FIN", name: "Finland", flag: "🇫🇮", coordinates: [25.7482, 61.9241], population: "5.5M", tier: "TIER B", defaultColor: "#60a5fa", startingPrice: 20 },
  { numericId: "208", code: "DK", code3: "DNK", name: "Denmark", flag: "🇩🇰", coordinates: [9.5018, 56.2639], population: "5.9M", tier: "TIER B", defaultColor: "#ef4444", startingPrice: 21 },
  { numericId: "616", code: "PL", code3: "POL", name: "Poland", flag: "🇵🇱", coordinates: [19.1451, 51.9194], population: "38M", tier: "TIER B", defaultColor: "#8b5cf6", startingPrice: 18 },
  { numericId: "804", code: "UA", code3: "UKR", name: "Ukraine", flag: "🇺🇦", coordinates: [31.1656, 48.3794], population: "38M", tier: "TIER B", defaultColor: "#facc15", startingPrice: 15 },
  { numericId: "112", code: "BY", code3: "BLR", name: "Belarus", flag: "🇧🇾", coordinates: [27.9534, 53.7098], population: "9.2M", tier: "TIER C", defaultColor: "#10b981", startingPrice: 8 },
  { numericId: "203", code: "CZ", code3: "CZE", name: "Czech Republic", flag: "🇨🇿", coordinates: [15.4730, 49.8175], population: "10.5M", tier: "TIER B", defaultColor: "#3b82f6", startingPrice: 17 },
  { numericId: "703", code: "SK", code3: "SVK", name: "Slovakia", flag: "🇸🇰", coordinates: [19.6990, 48.6690], population: "5.4M", tier: "TIER C", defaultColor: "#ec4899", startingPrice: 6 },
  { numericId: "348", code: "HU", code3: "HUN", name: "Hungary", flag: "🇭🇺", coordinates: [19.5033, 47.1625], population: "9.6M", tier: "TIER B", defaultColor: "#10b981", startingPrice: 14 },
  { numericId: "642", code: "RO", code3: "ROU", name: "Romania", flag: "🇷🇴", coordinates: [24.9668, 45.9432], population: "19M", tier: "TIER B", defaultColor: "#f59e0b", startingPrice: 13 },
  { numericId: "100", code: "BG", code3: "BGR", name: "Bulgaria", flag: "🇧🇬", coordinates: [25.4858, 42.7339], population: "6.5M", tier: "TIER C", defaultColor: "#059669", startingPrice: 7 },
  { numericId: "300", code: "GR", code3: "GRC", name: "Greece", flag: "🇬🇷", coordinates: [21.8243, 39.0742], population: "10.4M", tier: "TIER B", defaultColor: "#0284c7", startingPrice: 15 },
  { numericId: "008", code: "AL", code3: "ALB", name: "Albania", flag: "🇦🇱", coordinates: [20.1683, 41.1533], population: "2.8M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 3 },
  { numericId: "688", code: "RS", code3: "SRB", name: "Serbia", flag: "🇷🇸", coordinates: [21.0059, 44.0165], population: "6.7M", tier: "TIER C", defaultColor: "#3b82f6", startingPrice: 5 },
  { numericId: "191", code: "HR", code3: "HRV", name: "Croatia", flag: "🇭🇷", coordinates: [15.2000, 45.1000], population: "4M", tier: "TIER C", defaultColor: "#f43f5e", startingPrice: 7 },
  { numericId: "070", code: "BA", code3: "BIH", name: "Bosnia", flag: "🇧🇦", coordinates: [17.6791, 43.9159], population: "3.2M", tier: "TIER C", defaultColor: "#f59e0b", startingPrice: 3 },
  { numericId: "705", code: "SI", code3: "SVN", name: "Slovenia", flag: "🇸🇮", coordinates: [14.9955, 46.1512], population: "2.1M", tier: "TIER C", defaultColor: "#14b8a6", startingPrice: 6 },
  { numericId: "440", code: "LT", code3: "LTU", name: "Lithuania", flag: "🇱🇹", coordinates: [23.8813, 55.1694], population: "2.8M", tier: "TIER C", defaultColor: "#eab308", startingPrice: 4 },
  { numericId: "428", code: "LV", code3: "LVA", name: "Latvia", flag: "🇱🇻", coordinates: [24.6032, 56.8796], population: "1.9M", tier: "TIER C", defaultColor: "#881337", startingPrice: 4 },
  { numericId: "233", code: "EE", code3: "EST", name: "Estonia", flag: "🇪🇪", coordinates: [25.0136, 58.5953], population: "1.3M", tier: "TIER C", defaultColor: "#38bdf8", startingPrice: 6 },
  { numericId: "352", code: "IS", code3: "ISL", name: "Iceland", flag: "🇮🇸", coordinates: [-19.0208, 64.9631], population: "390K", tier: "TIER C", defaultColor: "#3b82f6", startingPrice: 6 },

  // --- ASIA & MIDDLE EAST ---
  { numericId: "643", code: "RU", code3: "RUS", name: "Russia", flag: "🇷🇺", coordinates: [95.3188, 61.5240], population: "144M", tier: "TIER S", defaultColor: "#84cc16", startingPrice: 93 },
  { numericId: "156", code: "CN", code3: "CHN", name: "China", flag: "🇨🇳", coordinates: [104.1954, 35.8617], population: "1.4B", tier: "TIER S", defaultColor: "#a855f7", startingPrice: 65 },
  { numericId: "356", code: "IN", code3: "IND", name: "India", flag: "🇮🇳", coordinates: [78.9629, 20.5937], population: "1.4B", tier: "TIER S", defaultColor: "#f97316", startingPrice: 75 },
  { numericId: "392", code: "JP", code3: "JPN", name: "Japan", flag: "🇯🇵", coordinates: [138.2529, 36.2048], population: "125M", tier: "TIER S", defaultColor: "#8b5cf6", startingPrice: 60 },
  { numericId: "410", code: "KR", code3: "KOR", name: "South Korea", flag: "🇰🇷", coordinates: [127.7669, 35.9078], population: "52M", tier: "TIER A", defaultColor: "#f97316", startingPrice: 25 },
  { numericId: "496", code: "MN", code3: "MNG", name: "Mongolia", flag: "🇲🇳", coordinates: [103.8467, 46.8625], population: "3.4M", tier: "TIER C", defaultColor: "#f59e0b", startingPrice: 6 },
  { numericId: "398", code: "KZ", code3: "KAZ", name: "Kazakhstan", flag: "🇰🇿", coordinates: [66.9237, 48.0196], population: "20M", tier: "TIER B", defaultColor: "#06b6d4", startingPrice: 10 },
  { numericId: "860", code: "UZ", code3: "UZB", name: "Uzbekistan", flag: "🇺🇿", coordinates: [64.5853, 41.3775], population: "36M", tier: "TIER C", defaultColor: "#38bdf8", startingPrice: 4 },
  { numericId: "795", code: "TM", code3: "TKM", name: "Turkmenistan", flag: "🇹🇲", coordinates: [59.5563, 38.9697], population: "6.5M", tier: "TIER C", defaultColor: "#10b981", startingPrice: 4 },
  { numericId: "417", code: "KG", code3: "KGZ", name: "Kyrgyzstan", flag: "🇰🇬", coordinates: [74.7661, 41.2044], population: "7M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 3 },
  { numericId: "762", code: "TJ", code3: "TJK", name: "Tajikistan", flag: "🇹🇯", coordinates: [71.2761, 38.8610], population: "10M", tier: "TIER C", defaultColor: "#fb923c", startingPrice: 3 },
  { numericId: "586", code: "PK", code3: "PAK", name: "Pakistan", flag: "🇵🇰", coordinates: [69.3451, 30.3753], population: "240M", tier: "TIER B", defaultColor: "#15803d", startingPrice: 12 },
  { numericId: "050", code: "BD", code3: "BGD", name: "Bangladesh", flag: "🇧🇩", coordinates: [90.3563, 23.6850], population: "171M", tier: "TIER B", defaultColor: "#047857", startingPrice: 10 },
  { numericId: "524", code: "NP", code3: "NPL", name: "Nepal", flag: "🇳🇵", coordinates: [84.1240, 28.3949], population: "30M", tier: "TIER C", defaultColor: "#dc2626", startingPrice: 4 },
  { numericId: "064", code: "BT", code3: "BTN", name: "Bhutan", flag: "🇧🇹", coordinates: [90.4336, 27.5142], population: "780K", tier: "TIER C", defaultColor: "#f59e0b", startingPrice: 3 },
  { numericId: "144", code: "LK", code3: "LKA", name: "Sri Lanka", flag: "🇱🇰", coordinates: [80.7718, 7.8731], population: "22M", tier: "TIER C", defaultColor: "#eab308", startingPrice: 5 },
  { numericId: "104", code: "MM", code3: "MMR", name: "Myanmar", flag: "🇲🇲", coordinates: [95.9560, 21.9162], population: "54M", tier: "TIER C", defaultColor: "#facc15", startingPrice: 7 },
  { numericId: "764", code: "TH", code3: "THA", name: "Thailand", flag: "🇹🇭", coordinates: [100.9925, 15.8700], population: "71M", tier: "TIER A", defaultColor: "#3b82f6", startingPrice: 12 },
  { numericId: "418", code: "LA", code3: "LAO", name: "Laos", flag: "🇱🇦", coordinates: [102.4955, 19.8563], population: "7.5M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 3 },
  { numericId: "116", code: "KH", code3: "KHM", name: "Cambodia", flag: "🇰🇭", coordinates: [104.9910, 12.5657], population: "16.8M", tier: "TIER C", defaultColor: "#2563eb", startingPrice: 5 },
  { numericId: "704", code: "VN", code3: "VNM", name: "Vietnam", flag: "🇻🇳", coordinates: [108.2772, 14.0583], population: "98M", tier: "TIER B", defaultColor: "#dc2626", startingPrice: 17 },
  { numericId: "458", code: "MY", code3: "MYS", name: "Malaysia", flag: "🇲🇾", coordinates: [101.9758, 4.2105], population: "34M", tier: "TIER B", defaultColor: "#0284c7", startingPrice: 18 },
  { numericId: "702", code: "SG", code3: "SGP", name: "Singapore", flag: "🇸🇬", coordinates: [103.8198, 1.3521], population: "5.6M", tier: "TIER A", defaultColor: "#ef4444", startingPrice: 45 },
  { numericId: "360", code: "ID", code3: "IDN", name: "Indonesia", flag: "🇮🇩", coordinates: [113.9213, -0.7893], population: "277M", tier: "TIER A", defaultColor: "#06b6d4", startingPrice: 22 },
  { numericId: "608", code: "PH", code3: "PHL", name: "Philippines", flag: "🇵🇭", coordinates: [121.7740, 12.8797], population: "115M", tier: "TIER B", defaultColor: "#3b82f6", startingPrice: 14 },
  { numericId: "096", code: "BN", code3: "BRN", name: "Brunei", flag: "🇧🇳", coordinates: [114.7277, 4.5353], population: "450K", tier: "TIER C", defaultColor: "#facc15", startingPrice: 3 },
  { numericId: "626", code: "TL", code3: "TLS", name: "Timor-Leste", flag: "🇹🇱", coordinates: [125.7275, -8.8742], population: "1.3M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 3 },
  { numericId: "792", code: "TR", code3: "TUR", name: "Turkey", flag: "🇹🇷", coordinates: [35.2433, 38.9637], population: "85M", tier: "TIER A", defaultColor: "#f43f5e", startingPrice: 28 },
  { numericId: "364", code: "IR", code3: "IRN", name: "Iran", flag: "🇮🇷", coordinates: [53.6880, 32.4279], population: "88M", tier: "TIER B", defaultColor: "#059669", startingPrice: 15 },
  { numericId: "368", code: "IQ", code3: "IRQ", name: "Iraq", flag: "🇮🇶", coordinates: [43.6793, 33.2232], population: "44M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 8 },
  { numericId: "760", code: "SY", code3: "SYR", name: "Syria", flag: "🇸🇾", coordinates: [38.9968, 34.8021], population: "22M", tier: "TIER C", defaultColor: "#16a34a", startingPrice: 4 },
  { numericId: "400", code: "JO", code3: "JOR", name: "Jordan", flag: "🇯🇴", coordinates: [36.2384, 30.5852], population: "11M", tier: "TIER C", defaultColor: "#15803d", startingPrice: 6 },
  { numericId: "422", code: "LB", code3: "LBN", name: "Lebanon", flag: "🇱🇧", coordinates: [35.8623, 33.8547], population: "5.5M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 5 },
  { numericId: "376", code: "IL", code3: "ISR", name: "Israel", flag: "🇮🇱", coordinates: [34.8516, 31.0461], population: "9.7M", tier: "TIER B", defaultColor: "#38bdf8", startingPrice: 32 },
  { numericId: "682", code: "SA", code3: "SAU", name: "Saudi Arabia", flag: "🇸🇦", coordinates: [45.0792, 23.8859], population: "36M", tier: "TIER A", defaultColor: "#eab308", startingPrice: 35 },
  { numericId: "887", code: "YE", code3: "YEM", name: "Yemen", flag: "🇾🇪", coordinates: [48.5164, 15.5527], population: "33M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 4 },
  { numericId: "512", code: "OM", code3: "OMN", name: "Oman", flag: "🇴🇲", coordinates: [55.9233, 21.4735], population: "4.6M", tier: "TIER B", defaultColor: "#10b981", startingPrice: 8 },
  { numericId: "784", code: "AE", code3: "ARE", name: "United Arab Emirates", flag: "🇦🇪", coordinates: [53.8478, 23.4241], population: "9.5M", tier: "TIER A", defaultColor: "#06b6d4", startingPrice: 40 },
  { numericId: "634", code: "QA", code3: "QAT", name: "Qatar", flag: "🇶🇦", coordinates: [51.1839, 25.3548], population: "2.7M", tier: "TIER B", defaultColor: "#881337", startingPrice: 15 },
  { numericId: "048", code: "BH", code3: "BHR", name: "Bahrain", flag: "🇧🇭", coordinates: [50.5577, 26.0667], population: "1.5M", tier: "TIER C", defaultColor: "#f43f5e", startingPrice: 3 },
  { numericId: "414", code: "KW", code3: "KWT", name: "Kuwait", flag: "🇰🇼", coordinates: [47.4818, 29.3117], population: "4.3M", tier: "TIER B", defaultColor: "#10b981", startingPrice: 15 },

  // --- AFRICA ---
  { numericId: "818", code: "EG", code3: "EGY", name: "Egypt", flag: "🇪🇬", coordinates: [30.8025, 26.8206], population: "112M", tier: "TIER A", defaultColor: "#f59e0b", startingPrice: 14 },
  { numericId: "434", code: "LY", code3: "LBY", name: "Libya", flag: "🇱🇾", coordinates: [17.2283, 26.3351], population: "7M", tier: "TIER C", defaultColor: "#16a34a", startingPrice: 6 },
  { numericId: "788", code: "TN", code3: "TUN", name: "Tunisia", flag: "🇹🇳", coordinates: [9.5375, 33.8869], population: "12M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 5 },
  { numericId: "012", code: "DZ", code3: "DZA", name: "Algeria", flag: "🇩🇿", coordinates: [1.6596, 28.0339], population: "45M", tier: "TIER B", defaultColor: "#15803d", startingPrice: 10 },
  { numericId: "504", code: "MA", code3: "MAR", name: "Morocco", flag: "🇲🇦", coordinates: [-7.0926, 31.7917], population: "37M", tier: "TIER B", defaultColor: "#dc2626", startingPrice: 9 },
  { numericId: "732", code: "EH", code3: "ESH", name: "Western Sahara", flag: "🇪🇭", coordinates: [-12.8858, 24.2155], population: "600K", tier: "TIER C", defaultColor: "#ea580c", startingPrice: 3 },
  { numericId: "478", code: "MR", code3: "MRT", name: "Mauritania", flag: "🇲🇷", coordinates: [-10.9408, 21.0079], population: "4.8M", tier: "TIER C", defaultColor: "#16a34a", startingPrice: 4 },
  { numericId: "466", code: "ML", code3: "MLI", name: "Mali", flag: "🇲🇱", coordinates: [-3.9962, 17.5707], population: "22M", tier: "TIER C", defaultColor: "#eab308", startingPrice: 5 },
  { numericId: "562", code: "NE", code3: "NER", name: "Niger", flag: "🇳🇪", coordinates: [8.0817, 17.6078], population: "26M", tier: "TIER C", defaultColor: "#f97316", startingPrice: 4 },
  { numericId: "148", code: "TD", code3: "TCD", name: "Chad", flag: "🇹🇩", coordinates: [18.7322, 15.4542], population: "18M", tier: "TIER C", defaultColor: "#d946ef", startingPrice: 16 },
  { numericId: "729", code: "SD", code3: "SDN", name: "Sudan", flag: "🇸🇩", coordinates: [30.2176, 12.8628], population: "46M", tier: "TIER C", defaultColor: "#059669", startingPrice: 6 },
  { numericId: "728", code: "SS", code3: "SSD", name: "South Sudan", flag: "🇸🇸", coordinates: [31.3070, 6.8770], population: "11M", tier: "TIER C", defaultColor: "#1e3a8a", startingPrice: 3 },
  { numericId: "231", code: "ET", code3: "ETH", name: "Ethiopia", flag: "🇪🇹", coordinates: [40.4897, 9.1450], population: "123M", tier: "TIER C", defaultColor: "#16a34a", startingPrice: 7 },
  { numericId: "706", code: "SO", code3: "SOM", name: "Somalia", flag: "🇸🇴", coordinates: [46.1996, 5.1521], population: "17M", tier: "TIER C", defaultColor: "#38bdf8", startingPrice: 3 },
  { numericId: "566", code: "NG", code3: "NGA", name: "Nigeria", flag: "🇳🇬", coordinates: [8.6753, 9.0820], population: "223M", tier: "TIER A", defaultColor: "#16a34a", startingPrice: 15 },
  { numericId: "288", code: "GH", code3: "GHA", name: "Ghana", flag: "🇬🇭", coordinates: [-1.0232, 7.9465], population: "33M", tier: "TIER B", defaultColor: "#eab308", startingPrice: 8 },
  { numericId: "384", code: "CI", code3: "CIV", name: "Ivory Coast", flag: "🇨🇮", coordinates: [-5.5471, 7.5400], population: "29M", tier: "TIER C", defaultColor: "#f97316", startingPrice: 6 },
  { numericId: "686", code: "SN", code3: "SEN", name: "Senegal", flag: "🇸🇳", coordinates: [-14.4524, 14.4974], population: "17M", tier: "TIER C", defaultColor: "#10b981", startingPrice: 5 },
  { numericId: "324", code: "GN", code3: "GIN", name: "Guinea", flag: "🇬🇳", coordinates: [-9.6966, 9.9456], population: "14M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 3 },
  { numericId: "120", code: "CM", code3: "CMR", name: "Cameroon", flag: "🇨🇲", coordinates: [12.3547, 7.3697], population: "27.9M", tier: "TIER C", defaultColor: "#15803d", startingPrice: 4 },
  { numericId: "140", code: "CF", code3: "CAF", name: "Central African Republic", flag: "🇨🇫", coordinates: [20.9394, 6.6111], population: "5.5M", tier: "TIER C", defaultColor: "#2563eb", startingPrice: 3 },
  { numericId: "180", code: "CD", code3: "COD", name: "DR Congo", flag: "🇨🇩", coordinates: [21.7587, -4.0383], population: "99M", tier: "TIER B", defaultColor: "#0284c7", startingPrice: 8 },
  { numericId: "178", code: "CG", code3: "COG", name: "Congo", flag: "🇨🇬", coordinates: [15.8277, -0.2280], population: "5.9M", tier: "TIER C", defaultColor: "#16a34a", startingPrice: 3 },
  { numericId: "266", code: "GA", code3: "GAB", name: "Gabon", flag: "🇬🇦", coordinates: [11.6094, -0.8037], population: "2.4M", tier: "TIER C", defaultColor: "#facc15", startingPrice: 4 },
  { numericId: "404", code: "KE", code3: "KEN", name: "Kenya", flag: "🇰🇪", coordinates: [37.9062, -0.0236], population: "54M", tier: "TIER B", defaultColor: "#dc2626", startingPrice: 11 },
  { numericId: "800", code: "UG", code3: "UGA", name: "Uganda", flag: "🇺🇬", coordinates: [32.2903, 1.3733], population: "47M", tier: "TIER C", defaultColor: "#eab308", startingPrice: 4 },
  { numericId: "834", code: "TZ", code3: "TZA", name: "Tanzania", flag: "🇹🇿", coordinates: [34.8888, -6.3690], population: "65M", tier: "TIER C", defaultColor: "#14b8a6", startingPrice: 5 },
  { numericId: "024", code: "AO", code3: "AGO", name: "Angola", flag: "🇦🇴", coordinates: [17.8739, -11.2027], population: "35M", tier: "TIER C", defaultColor: "#dc2626", startingPrice: 6 },
  { numericId: "894", code: "ZM", code3: "ZMB", name: "Zambia", flag: "🇿🇲", coordinates: [27.8493, -13.1339], population: "20M", tier: "TIER C", defaultColor: "#16a34a", startingPrice: 3 },
  { numericId: "716", code: "ZW", code3: "ZWE", name: "Zimbabwe", flag: "🇿🇼", coordinates: [29.1549, -19.0154], population: "16M", tier: "TIER C", defaultColor: "#f59e0b", startingPrice: 3 },
  { numericId: "508", code: "MZ", code3: "MOZ", name: "Mozambique", flag: "🇲🇿", coordinates: [35.5296, -18.6657], population: "33M", tier: "TIER C", defaultColor: "#059669", startingPrice: 4 },
  { numericId: "516", code: "NA", code3: "NAM", name: "Namibia", flag: "🇳🇦", coordinates: [18.4904, -22.9576], population: "2.6M", tier: "TIER C", defaultColor: "#3b82f6", startingPrice: 3 },
  { numericId: "072", code: "BW", code3: "BWA", name: "Botswana", flag: "🇧🇼", coordinates: [24.6849, -22.3285], population: "2.6M", tier: "TIER C", defaultColor: "#0284c7", startingPrice: 4 },
  { numericId: "710", code: "ZA", code3: "ZAF", name: "South Africa", flag: "🇿🇦", coordinates: [22.9375, -30.5595], population: "60M", tier: "TIER A", defaultColor: "#8b5cf6", startingPrice: 18 },
  { numericId: "450", code: "MG", code3: "MDG", name: "Madagascar", flag: "🇲🇬", coordinates: [46.8691, -18.7669], population: "29M", tier: "TIER C", defaultColor: "#ef4444", startingPrice: 4 },

  // --- OCEANIA ---
  { numericId: "036", code: "AU", code3: "AUS", name: "Australia", flag: "🇦🇺", coordinates: [133.7751, -25.2744], population: "26M", tier: "TIER S", defaultColor: "#eab308", startingPrice: 55 },
  { numericId: "554", code: "NZ", code3: "NZL", name: "New Zealand", flag: "🇳🇿", coordinates: [174.8860, -40.9006], population: "5.2M", tier: "TIER A", defaultColor: "#f97316", startingPrice: 19 },
  { numericId: "598", code: "PG", code3: "PNG", name: "Papua New Guinea", flag: "🇵🇬", coordinates: [143.9555, -6.31499], population: "10M", tier: "TIER C", defaultColor: "#dc2626", startingPrice: 4 },
  { numericId: "242", code: "FJ", code3: "FJI", name: "Fiji", flag: "🇫🇯", coordinates: [178.0650, -17.7134], population: "930K", tier: "TIER C", defaultColor: "#38bdf8", startingPrice: 3 },
  { numericId: "090", code: "SB", code3: "SLB", name: "Solomon Islands", flag: "🇸🇧", coordinates: [160.1562, -9.6457], population: "720K", tier: "TIER C", defaultColor: "#16a34a", startingPrice: 3 },

  // --- 6 STRATEGIC OCEAN ROUTES & FLEETS ($25 UNCLAIMED SPOTS) ---
  {
    numericId: "901",
    code: "IO_OCEAN",
    code3: "IOP",
    name: "Indian Ocean Trade Route",
    flag: "⚓",
    coordinates: [75.0, -10.0],
    population: "Naval Corridor",
    tier: "TIER B",
    defaultColor: "#10b981",
    startingPrice: 25,
    isOceanFleet: true,
  },
  {
    numericId: "902",
    code: "SO_OCEAN",
    code3: "SOP",
    name: "Southern Ocean Patrol",
    flag: "🚢",
    coordinates: [0.0, -58.0],
    population: "Polar Fleet",
    tier: "TIER B",
    defaultColor: "#10b981",
    startingPrice: 25,
    isOceanFleet: true,
  },
  {
    numericId: "903",
    code: "SA_OCEAN",
    code3: "SAP",
    name: "South Australia Patrol",
    flag: "⚓",
    coordinates: [130.0, -42.0],
    population: "Ocean Fleet",
    tier: "TIER B",
    defaultColor: "#10b981",
    startingPrice: 25,
    isOceanFleet: true,
  },
  {
    numericId: "904",
    code: "SP_OCEAN",
    code3: "SPF",
    name: "South Pacific Fleet",
    flag: "⛵",
    coordinates: [-120.0, -25.0],
    population: "Deep Sea Armada",
    tier: "TIER B",
    defaultColor: "#10b981",
    startingPrice: 25,
    isOceanFleet: true,
  },
  {
    numericId: "905",
    code: "NP_OCEAN",
    code3: "NPF",
    name: "North Pacific Fleet",
    flag: "🛳️",
    coordinates: [-160.0, 32.0],
    population: "Carrier Fleet",
    tier: "TIER B",
    defaultColor: "#10b981",
    startingPrice: 25,
    isOceanFleet: true,
  },
  {
    numericId: "906",
    code: "AF_OCEAN",
    code3: "ATF",
    name: "Atlantic Fleet Patrol",
    flag: "⚓",
    coordinates: [-35.0, 25.0],
    population: "Naval Corridor",
    tier: "TIER B",
    defaultColor: "#10b981",
    startingPrice: 25,
    isOceanFleet: true,
  },
];

// No fake seeded rulers - 100% real user data only
export const SEED_TERRITORIES: Record<string, Partial<TerritoryState>> = {};

export const INITIAL_TERRITORIES: TerritoryState[] = WORLD_COUNTRIES.map((c) => ({
  countryCode: c.code,
  countryName: c.name,
  numericId: c.numericId,
  flag: c.flag,
  coordinates: c.coordinates,
  population: c.population,
  tier: c.tier,
  defaultColor: c.defaultColor,
  isOceanFleet: c.isOceanFleet || false,
  currentRuler: null,
  currentBid: c.startingPrice || 3,
  minOutbidPrice: calcMinOutbid(c.startingPrice || 3),
  totalPlunder: 0,
  clicks: 0,
}));
