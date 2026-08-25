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
  if (!currentBid || currentBid <= 0) return 1;
  if (currentBid === 1) return 2;
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

// Complete 194 Sovereign Countries Dataset matching warmap.lol palette with $1-$10 affordable pricing
export const WORLD_COUNTRIES: CountryMeta[] = [
  {
    "numericId": "840",
    "code": "US",
    "code3": "USA",
    "name": "United States",
    "flag": "🇺🇸",
    "coordinates": [
      -98.58,
      39.83
    ],
    "population": "335M",
    "tier": "TIER S",
    "defaultColor": "#ecc849",
    "startingPrice": 10
  },
  {
    "numericId": "124",
    "code": "CA",
    "code3": "CAN",
    "name": "Canada",
    "flag": "🇨🇦",
    "coordinates": [
      -106.35,
      56.13
    ],
    "population": "39M",
    "tier": "TIER A",
    "defaultColor": "#d84c37",
    "startingPrice": 7
  },
  {
    "numericId": "304",
    "code": "GL",
    "code3": "GRL",
    "name": "Greenland",
    "flag": "🇬🇱",
    "coordinates": [
      -42.6,
      71.71
    ],
    "population": "56K",
    "tier": "TIER B",
    "defaultColor": "#4ade80",
    "startingPrice": 3
  },
  {
    "numericId": "484",
    "code": "MX",
    "code3": "MEX",
    "name": "Mexico",
    "flag": "🇲🇽",
    "coordinates": [
      -102.55,
      23.63
    ],
    "population": "128M",
    "tier": "TIER A",
    "defaultColor": "#34d399",
    "startingPrice": 7
  },
  {
    "numericId": "320",
    "code": "GT",
    "code3": "GTM",
    "name": "Guatemala",
    "flag": "🇬🇹",
    "coordinates": [
      -90.23,
      15.78
    ],
    "population": "18M",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 2
  },
  {
    "numericId": "084",
    "code": "BZ",
    "code3": "BLZ",
    "name": "Belize",
    "flag": "🇧🇿",
    "coordinates": [
      -88.5,
      17.19
    ],
    "population": "400K",
    "tier": "TIER C",
    "defaultColor": "#a855f7",
    "startingPrice": 1
  },
  {
    "numericId": "340",
    "code": "HN",
    "code3": "HND",
    "name": "Honduras",
    "flag": "🇭🇳",
    "coordinates": [
      -86.24,
      15.2
    ],
    "population": "10M",
    "tier": "TIER C",
    "defaultColor": "#fb923c",
    "startingPrice": 1
  },
  {
    "numericId": "222",
    "code": "SV",
    "code3": "SLV",
    "name": "El Salvador",
    "flag": "🇸🇻",
    "coordinates": [
      -88.9,
      13.79
    ],
    "population": "6.3M",
    "tier": "TIER C",
    "defaultColor": "#ec4899",
    "startingPrice": 2
  },
  {
    "numericId": "558",
    "code": "NI",
    "code3": "NIC",
    "name": "Nicaragua",
    "flag": "🇳🇮",
    "coordinates": [
      -85.21,
      12.87
    ],
    "population": "6.9M",
    "tier": "TIER C",
    "defaultColor": "#eab308",
    "startingPrice": 1
  },
  {
    "numericId": "188",
    "code": "CR",
    "code3": "CRI",
    "name": "Costa Rica",
    "flag": "🇨🇷",
    "coordinates": [
      -83.75,
      9.75
    ],
    "population": "5.2M",
    "tier": "TIER C",
    "defaultColor": "#3b82f6",
    "startingPrice": 2
  },
  {
    "numericId": "591",
    "code": "PA",
    "code3": "PAN",
    "name": "Panama",
    "flag": "🇵🇦",
    "coordinates": [
      -80.78,
      8.54
    ],
    "population": "4.4M",
    "tier": "TIER C",
    "defaultColor": "#14b8a6",
    "startingPrice": 2
  },
  {
    "numericId": "192",
    "code": "CU",
    "code3": "CUB",
    "name": "Cuba",
    "flag": "🇨🇺",
    "coordinates": [
      -77.78,
      21.52
    ],
    "population": "11M",
    "tier": "TIER C",
    "defaultColor": "#f43f5e",
    "startingPrice": 2
  },
  {
    "numericId": "388",
    "code": "JM",
    "code3": "JAM",
    "name": "Jamaica",
    "flag": "🇯🇲",
    "coordinates": [
      -77.3,
      18.11
    ],
    "population": "2.8M",
    "tier": "TIER C",
    "defaultColor": "#84cc16",
    "startingPrice": 1
  },
  {
    "numericId": "332",
    "code": "HT",
    "code3": "HTI",
    "name": "Haiti",
    "flag": "🇭🇹",
    "coordinates": [
      -72.29,
      18.97
    ],
    "population": "11.5M",
    "tier": "TIER C",
    "defaultColor": "#6366f1",
    "startingPrice": 1
  },
  {
    "numericId": "214",
    "code": "DO",
    "code3": "DOM",
    "name": "Dominican Republic",
    "flag": "🇩🇴",
    "coordinates": [
      -70.16,
      18.74
    ],
    "population": "11.2M",
    "tier": "TIER C",
    "defaultColor": "#06b6d4",
    "startingPrice": 2
  },
  {
    "numericId": "044",
    "code": "BS",
    "code3": "BHS",
    "name": "Bahamas",
    "flag": "🇧🇸",
    "coordinates": [
      -77.4,
      25.03
    ],
    "population": "410K",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 2
  },
  {
    "numericId": "780",
    "code": "TT",
    "code3": "TTO",
    "name": "Trinidad and Tobago",
    "flag": "🇹🇹",
    "coordinates": [
      -61.22,
      10.69
    ],
    "population": "1.5M",
    "tier": "TIER C",
    "defaultColor": "#ef4444",
    "startingPrice": 2
  },
  {
    "numericId": "052",
    "code": "BB",
    "code3": "BRB",
    "name": "Barbados",
    "flag": "🇧🇧",
    "coordinates": [
      -59.54,
      13.19
    ],
    "population": "280K",
    "tier": "TIER C",
    "defaultColor": "#0284c7",
    "startingPrice": 1
  },
  {
    "numericId": "662",
    "code": "LC",
    "code3": "LCA",
    "name": "Saint Lucia",
    "flag": "🇱🇨",
    "coordinates": [
      -60.98,
      13.91
    ],
    "population": "180K",
    "tier": "TIER C",
    "defaultColor": "#f59e0b",
    "startingPrice": 1
  },
  {
    "numericId": "670",
    "code": "VC",
    "code3": "VCT",
    "name": "Saint Vincent",
    "flag": "🇻🇨",
    "coordinates": [
      -61.29,
      13.25
    ],
    "population": "110K",
    "tier": "TIER C",
    "defaultColor": "#10b981",
    "startingPrice": 1
  },
  {
    "numericId": "308",
    "code": "GD",
    "code3": "GRD",
    "name": "Grenada",
    "flag": "🇬🇩",
    "coordinates": [
      -61.68,
      12.12
    ],
    "population": "125K",
    "tier": "TIER C",
    "defaultColor": "#ec4899",
    "startingPrice": 1
  },
  {
    "numericId": "028",
    "code": "AG",
    "code3": "ATG",
    "name": "Antigua and Barbuda",
    "flag": "🇦🇬",
    "coordinates": [
      -61.8,
      17.06
    ],
    "population": "93K",
    "tier": "TIER C",
    "defaultColor": "#8b5cf6",
    "startingPrice": 1
  },
  {
    "numericId": "659",
    "code": "KN",
    "code3": "KNA",
    "name": "Saint Kitts and Nevis",
    "flag": "🇰🇳",
    "coordinates": [
      -62.78,
      17.36
    ],
    "population": "48K",
    "tier": "TIER C",
    "defaultColor": "#14b8a6",
    "startingPrice": 1
  },
  {
    "numericId": "212",
    "code": "DM",
    "code3": "DMA",
    "name": "Dominica",
    "flag": "🇩🇲",
    "coordinates": [
      -61.37,
      15.41
    ],
    "population": "72K",
    "tier": "TIER C",
    "defaultColor": "#84cc16",
    "startingPrice": 1
  },
  {
    "numericId": "076",
    "code": "BR",
    "code3": "BRA",
    "name": "Brazil",
    "flag": "🇧🇷",
    "coordinates": [
      -51.93,
      -14.24
    ],
    "population": "216M",
    "tier": "TIER A",
    "defaultColor": "#ef4444",
    "startingPrice": 7
  },
  {
    "numericId": "170",
    "code": "CO",
    "code3": "COL",
    "name": "Colombia",
    "flag": "🇨🇴",
    "coordinates": [
      -74.3,
      4.57
    ],
    "population": "52M",
    "tier": "TIER B",
    "defaultColor": "#f97316",
    "startingPrice": 3
  },
  {
    "numericId": "862",
    "code": "VE",
    "code3": "VEN",
    "name": "Venezuela",
    "flag": "🇻🇪",
    "coordinates": [
      -66.59,
      6.42
    ],
    "population": "29M",
    "tier": "TIER B",
    "defaultColor": "#eab308",
    "startingPrice": 3
  },
  {
    "numericId": "328",
    "code": "GY",
    "code3": "GUY",
    "name": "Guyana",
    "flag": "🇬🇾",
    "coordinates": [
      -58.93,
      4.86
    ],
    "population": "800K",
    "tier": "TIER C",
    "defaultColor": "#22c55e",
    "startingPrice": 1
  },
  {
    "numericId": "740",
    "code": "SR",
    "code3": "SUR",
    "name": "Suriname",
    "flag": "🇸🇷",
    "coordinates": [
      -56.03,
      3.92
    ],
    "population": "600K",
    "tier": "TIER C",
    "defaultColor": "#06b6d4",
    "startingPrice": 1
  },
  {
    "numericId": "218",
    "code": "EC",
    "code3": "ECU",
    "name": "Ecuador",
    "flag": "🇪🇨",
    "coordinates": [
      -78.18,
      -1.83
    ],
    "population": "18M",
    "tier": "TIER C",
    "defaultColor": "#facc15",
    "startingPrice": 2
  },
  {
    "numericId": "604",
    "code": "PE",
    "code3": "PER",
    "name": "Peru",
    "flag": "🇵🇪",
    "coordinates": [
      -75.02,
      -9.19
    ],
    "population": "34M",
    "tier": "TIER B",
    "defaultColor": "#a855f7",
    "startingPrice": 3
  },
  {
    "numericId": "068",
    "code": "BO",
    "code3": "BOL",
    "name": "Bolivia",
    "flag": "🇧🇴",
    "coordinates": [
      -63.59,
      -16.29
    ],
    "population": "12M",
    "tier": "TIER C",
    "defaultColor": "#3b82f6",
    "startingPrice": 2
  },
  {
    "numericId": "152",
    "code": "CL",
    "code3": "CHL",
    "name": "Chile",
    "flag": "🇨🇱",
    "coordinates": [
      -71.54,
      -35.68
    ],
    "population": "19M",
    "tier": "TIER B",
    "defaultColor": "#10b981",
    "startingPrice": 3
  },
  {
    "numericId": "032",
    "code": "AR",
    "code3": "ARG",
    "name": "Argentina",
    "flag": "🇦🇷",
    "coordinates": [
      -63.62,
      -38.42
    ],
    "population": "46M",
    "tier": "TIER B",
    "defaultColor": "#27272a",
    "startingPrice": 5
  },
  {
    "numericId": "600",
    "code": "PY",
    "code3": "PRY",
    "name": "Paraguay",
    "flag": "🇵🇾",
    "coordinates": [
      -58.44,
      -23.44
    ],
    "population": "6.8M",
    "tier": "TIER C",
    "defaultColor": "#f43f5e",
    "startingPrice": 2
  },
  {
    "numericId": "858",
    "code": "UY",
    "code3": "URY",
    "name": "Uruguay",
    "flag": "🇺🇾",
    "coordinates": [
      -55.77,
      -32.52
    ],
    "population": "3.4M",
    "tier": "TIER C",
    "defaultColor": "#0284c7",
    "startingPrice": 2
  },
  {
    "numericId": "826",
    "code": "GB",
    "code3": "GBR",
    "name": "United Kingdom",
    "flag": "🇬🇧",
    "coordinates": [
      -3.44,
      55.38
    ],
    "population": "67M",
    "tier": "TIER S",
    "defaultColor": "#facc15",
    "startingPrice": 10
  },
  {
    "numericId": "276",
    "code": "DE",
    "code3": "DEU",
    "name": "Germany",
    "flag": "🇩🇪",
    "coordinates": [
      10.45,
      51.17
    ],
    "population": "84M",
    "tier": "TIER S",
    "defaultColor": "#14b8a6",
    "startingPrice": 10
  },
  {
    "numericId": "250",
    "code": "FR",
    "code3": "FRA",
    "name": "France",
    "flag": "🇫🇷",
    "coordinates": [
      2.21,
      46.23
    ],
    "population": "68M",
    "tier": "TIER A",
    "defaultColor": "#06b6d4",
    "startingPrice": 7
  },
  {
    "numericId": "380",
    "code": "IT",
    "code3": "ITA",
    "name": "Italy",
    "flag": "🇮🇹",
    "coordinates": [
      12.57,
      41.87
    ],
    "population": "59M",
    "tier": "TIER A",
    "defaultColor": "#10b981",
    "startingPrice": 7
  },
  {
    "numericId": "724",
    "code": "ES",
    "code3": "ESP",
    "name": "Spain",
    "flag": "🇪🇸",
    "coordinates": [
      -3.75,
      40.46
    ],
    "population": "48M",
    "tier": "TIER A",
    "defaultColor": "#f97316",
    "startingPrice": 7
  },
  {
    "numericId": "620",
    "code": "PT",
    "code3": "PRT",
    "name": "Portugal",
    "flag": "🇵🇹",
    "coordinates": [
      -8.22,
      39.4
    ],
    "population": "10M",
    "tier": "TIER B",
    "defaultColor": "#ef4444",
    "startingPrice": 3
  },
  {
    "numericId": "528",
    "code": "NL",
    "code3": "NLD",
    "name": "Netherlands",
    "flag": "🇳🇱",
    "coordinates": [
      5.29,
      52.13
    ],
    "population": "18M",
    "tier": "TIER A",
    "defaultColor": "#ea580c",
    "startingPrice": 7
  },
  {
    "numericId": "056",
    "code": "BE",
    "code3": "BEL",
    "name": "Belgium",
    "flag": "🇧🇪",
    "coordinates": [
      4.47,
      50.5
    ],
    "population": "12M",
    "tier": "TIER B",
    "defaultColor": "#eab308",
    "startingPrice": 5
  },
  {
    "numericId": "756",
    "code": "CH",
    "code3": "CHE",
    "name": "Switzerland",
    "flag": "🇨🇭",
    "coordinates": [
      8.23,
      46.82
    ],
    "population": "8.9M",
    "tier": "TIER A",
    "defaultColor": "#ef4444",
    "startingPrice": 7
  },
  {
    "numericId": "040",
    "code": "AT",
    "code3": "AUT",
    "name": "Austria",
    "flag": "🇦🇹",
    "coordinates": [
      14.55,
      47.52
    ],
    "population": "9.1M",
    "tier": "TIER B",
    "defaultColor": "#f43f5e",
    "startingPrice": 5
  },
  {
    "numericId": "752",
    "code": "SE",
    "code3": "SWE",
    "name": "Sweden",
    "flag": "🇸🇪",
    "coordinates": [
      18.64,
      60.13
    ],
    "population": "10.5M",
    "tier": "TIER A",
    "defaultColor": "#38bdf8",
    "startingPrice": 7
  },
  {
    "numericId": "578",
    "code": "NO",
    "code3": "NOR",
    "name": "Norway",
    "flag": "🇳🇴",
    "coordinates": [
      8.47,
      60.47
    ],
    "population": "5.5M",
    "tier": "TIER B",
    "defaultColor": "#3b82f6",
    "startingPrice": 5
  },
  {
    "numericId": "208",
    "code": "DK",
    "code3": "DNK",
    "name": "Denmark",
    "flag": "🇩🇰",
    "coordinates": [
      9.5,
      56.26
    ],
    "population": "5.9M",
    "tier": "TIER B",
    "defaultColor": "#dc2626",
    "startingPrice": 5
  },
  {
    "numericId": "246",
    "code": "FI",
    "code3": "FIN",
    "name": "Finland",
    "flag": "🇫🇮",
    "coordinates": [
      25.75,
      61.92
    ],
    "population": "5.6M",
    "tier": "TIER B",
    "defaultColor": "#60a5fa",
    "startingPrice": 5
  },
  {
    "numericId": "372",
    "code": "IE",
    "code3": "IRL",
    "name": "Ireland",
    "flag": "🇮🇪",
    "coordinates": [
      -8.24,
      53.41
    ],
    "population": "5.2M",
    "tier": "TIER B",
    "defaultColor": "#16a34a",
    "startingPrice": 5
  },
  {
    "numericId": "616",
    "code": "PL",
    "code3": "POL",
    "name": "Poland",
    "flag": "🇵🇱",
    "coordinates": [
      19.15,
      51.92
    ],
    "population": "38M",
    "tier": "TIER A",
    "defaultColor": "#ec4899",
    "startingPrice": 7
  },
  {
    "numericId": "203",
    "code": "CZ",
    "code3": "CZE",
    "name": "Czechia",
    "flag": "🇨🇿",
    "coordinates": [
      15.47,
      49.82
    ],
    "population": "10.5M",
    "tier": "TIER B",
    "defaultColor": "#3b82f6",
    "startingPrice": 3
  },
  {
    "numericId": "703",
    "code": "SK",
    "code3": "SVK",
    "name": "Slovakia",
    "flag": "🇸🇰",
    "coordinates": [
      19.7,
      48.67
    ],
    "population": "5.4M",
    "tier": "TIER C",
    "defaultColor": "#a855f7",
    "startingPrice": 2
  },
  {
    "numericId": "348",
    "code": "HU",
    "code3": "HUN",
    "name": "Hungary",
    "flag": "🇭🇺",
    "coordinates": [
      19.5,
      47.16
    ],
    "population": "9.6M",
    "tier": "TIER C",
    "defaultColor": "#22c55e",
    "startingPrice": 2
  },
  {
    "numericId": "642",
    "code": "RO",
    "code3": "ROU",
    "name": "Romania",
    "flag": "🇷🇴",
    "coordinates": [
      24.97,
      45.94
    ],
    "population": "19M",
    "tier": "TIER C",
    "defaultColor": "#eab308",
    "startingPrice": 2
  },
  {
    "numericId": "100",
    "code": "BG",
    "code3": "BGR",
    "name": "Bulgaria",
    "flag": "🇧🇬",
    "coordinates": [
      25.49,
      42.73
    ],
    "population": "6.5M",
    "tier": "TIER C",
    "defaultColor": "#10b981",
    "startingPrice": 2
  },
  {
    "numericId": "300",
    "code": "GR",
    "code3": "GRC",
    "name": "Greece",
    "flag": "🇬🇷",
    "coordinates": [
      21.82,
      39.07
    ],
    "population": "10.4M",
    "tier": "TIER B",
    "defaultColor": "#0284c7",
    "startingPrice": 3
  },
  {
    "numericId": "804",
    "code": "UA",
    "code3": "UKR",
    "name": "Ukraine",
    "flag": "🇺🇦",
    "coordinates": [
      31.17,
      48.38
    ],
    "population": "38M",
    "tier": "TIER B",
    "defaultColor": "#facc15",
    "startingPrice": 3
  },
  {
    "numericId": "112",
    "code": "BY",
    "code3": "BLR",
    "name": "Belarus",
    "flag": "🇧🇾",
    "coordinates": [
      27.95,
      53.71
    ],
    "population": "9.2M",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 2
  },
  {
    "numericId": "440",
    "code": "LT",
    "code3": "LTU",
    "name": "Lithuania",
    "flag": "🇱🇹",
    "coordinates": [
      23.88,
      55.17
    ],
    "population": "2.8M",
    "tier": "TIER C",
    "defaultColor": "#eab308",
    "startingPrice": 2
  },
  {
    "numericId": "428",
    "code": "LV",
    "code3": "LVA",
    "name": "Latvia",
    "flag": "🇱🇻",
    "coordinates": [
      24.6,
      56.88
    ],
    "population": "1.9M",
    "tier": "TIER C",
    "defaultColor": "#b91c1c",
    "startingPrice": 1
  },
  {
    "numericId": "233",
    "code": "EE",
    "code3": "EST",
    "name": "Estonia",
    "flag": "🇪🇪",
    "coordinates": [
      25.01,
      58.6
    ],
    "population": "1.3M",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 2
  },
  {
    "numericId": "191",
    "code": "HR",
    "code3": "HRV",
    "name": "Croatia",
    "flag": "🇭🇷",
    "coordinates": [
      15.2,
      45.1
    ],
    "population": "3.9M",
    "tier": "TIER C",
    "defaultColor": "#ef4444",
    "startingPrice": 2
  },
  {
    "numericId": "705",
    "code": "SI",
    "code3": "SVN",
    "name": "Slovenia",
    "flag": "🇸🇮",
    "coordinates": [
      14.99,
      46.15
    ],
    "population": "2.1M",
    "tier": "TIER C",
    "defaultColor": "#3b82f6",
    "startingPrice": 2
  },
  {
    "numericId": "688",
    "code": "RS",
    "code3": "SRB",
    "name": "Serbia",
    "flag": "🇷🇸",
    "coordinates": [
      21.01,
      44.02
    ],
    "population": "6.6M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 2
  },
  {
    "numericId": "070",
    "code": "BA",
    "code3": "BIH",
    "name": "Bosnia and Herzegovina",
    "flag": "🇧🇦",
    "coordinates": [
      17.68,
      43.92
    ],
    "population": "3.2M",
    "tier": "TIER C",
    "defaultColor": "#2563eb",
    "startingPrice": 1
  },
  {
    "numericId": "499",
    "code": "ME",
    "code3": "MNE",
    "name": "Montenegro",
    "flag": "🇲🇪",
    "coordinates": [
      19.37,
      42.71
    ],
    "population": "620K",
    "tier": "TIER C",
    "defaultColor": "#b91c1c",
    "startingPrice": 1
  },
  {
    "numericId": "008",
    "code": "AL",
    "code3": "ALB",
    "name": "Albania",
    "flag": "🇦🇱",
    "coordinates": [
      20.17,
      41.15
    ],
    "population": "2.8M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "807",
    "code": "MK",
    "code3": "MKD",
    "name": "North Macedonia",
    "flag": "🇲🇰",
    "coordinates": [
      21.75,
      41.61
    ],
    "population": "1.8M",
    "tier": "TIER C",
    "defaultColor": "#eab308",
    "startingPrice": 1
  },
  {
    "numericId": "498",
    "code": "MD",
    "code3": "MDA",
    "name": "Moldova",
    "flag": "🇲🇩",
    "coordinates": [
      28.37,
      47.41
    ],
    "population": "2.5M",
    "tier": "TIER C",
    "defaultColor": "#3b82f6",
    "startingPrice": 1
  },
  {
    "numericId": "442",
    "code": "LU",
    "code3": "LUX",
    "name": "Luxembourg",
    "flag": "🇱🇺",
    "coordinates": [
      6.13,
      49.82
    ],
    "population": "660K",
    "tier": "TIER B",
    "defaultColor": "#38bdf8",
    "startingPrice": 3
  },
  {
    "numericId": "352",
    "code": "IS",
    "code3": "ISL",
    "name": "Iceland",
    "flag": "🇮🇸",
    "coordinates": [
      -19.02,
      64.96
    ],
    "population": "380K",
    "tier": "TIER C",
    "defaultColor": "#1d4ed8",
    "startingPrice": 2
  },
  {
    "numericId": "196",
    "code": "CY",
    "code3": "CYP",
    "name": "Cyprus",
    "flag": "🇨🇾",
    "coordinates": [
      33.43,
      35.13
    ],
    "population": "1.3M",
    "tier": "TIER C",
    "defaultColor": "#f59e0b",
    "startingPrice": 2
  },
  {
    "numericId": "470",
    "code": "MT",
    "code3": "MLT",
    "name": "Malta",
    "flag": "🇲🇹",
    "coordinates": [
      14.38,
      35.94
    ],
    "population": "530K",
    "tier": "TIER C",
    "defaultColor": "#ef4444",
    "startingPrice": 1
  },
  {
    "numericId": "020",
    "code": "AD",
    "code3": "AND",
    "name": "Andorra",
    "flag": "🇦🇩",
    "coordinates": [
      1.52,
      42.51
    ],
    "population": "80K",
    "tier": "TIER C",
    "defaultColor": "#2563eb",
    "startingPrice": 1
  },
  {
    "numericId": "438",
    "code": "LI",
    "code3": "LIE",
    "name": "Liechtenstein",
    "flag": "🇱🇮",
    "coordinates": [
      9.56,
      47.17
    ],
    "population": "40K",
    "tier": "TIER C",
    "defaultColor": "#1e3a8a",
    "startingPrice": 1
  },
  {
    "numericId": "492",
    "code": "MC",
    "code3": "MCO",
    "name": "Monaco",
    "flag": "🇲🇨",
    "coordinates": [
      7.42,
      43.74
    ],
    "population": "39K",
    "tier": "TIER B",
    "defaultColor": "#dc2626",
    "startingPrice": 3
  },
  {
    "numericId": "674",
    "code": "SM",
    "code3": "SMR",
    "name": "San Marino",
    "flag": "🇸🇲",
    "coordinates": [
      12.46,
      43.94
    ],
    "population": "34K",
    "tier": "TIER C",
    "defaultColor": "#60a5fa",
    "startingPrice": 1
  },
  {
    "numericId": "336",
    "code": "VA",
    "code3": "VAT",
    "name": "Vatican City",
    "flag": "🇻🇦",
    "coordinates": [
      12.45,
      41.9
    ],
    "population": "800",
    "tier": "TIER C",
    "defaultColor": "#facc15",
    "startingPrice": 1
  },
  {
    "numericId": "156",
    "code": "CN",
    "code3": "CHN",
    "name": "China",
    "flag": "🇨🇳",
    "coordinates": [
      104.2,
      35.86
    ],
    "population": "1.4B",
    "tier": "TIER S",
    "defaultColor": "#a855f7",
    "startingPrice": 10
  },
  {
    "numericId": "356",
    "code": "IN",
    "code3": "IND",
    "name": "India",
    "flag": "🇮🇳",
    "coordinates": [
      78.96,
      20.59
    ],
    "population": "1.43B",
    "tier": "TIER A",
    "defaultColor": "#f97316",
    "startingPrice": 7
  },
  {
    "numericId": "392",
    "code": "JP",
    "code3": "JPN",
    "name": "Japan",
    "flag": "🇯🇵",
    "coordinates": [
      138.25,
      36.2
    ],
    "population": "125M",
    "tier": "TIER S",
    "defaultColor": "#ef4444",
    "startingPrice": 10
  },
  {
    "numericId": "410",
    "code": "KR",
    "code3": "KOR",
    "name": "South Korea",
    "flag": "🇰🇷",
    "coordinates": [
      127.77,
      35.91
    ],
    "population": "52M",
    "tier": "TIER A",
    "defaultColor": "#3b82f6",
    "startingPrice": 7
  },
  {
    "numericId": "360",
    "code": "ID",
    "code3": "IDN",
    "name": "Indonesia",
    "flag": "🇮🇩",
    "coordinates": [
      113.92,
      -0.79
    ],
    "population": "278M",
    "tier": "TIER A",
    "defaultColor": "#dc2626",
    "startingPrice": 7
  },
  {
    "numericId": "702",
    "code": "SG",
    "code3": "SGP",
    "name": "Singapore",
    "flag": "🇸🇬",
    "coordinates": [
      103.82,
      1.35
    ],
    "population": "6M",
    "tier": "TIER A",
    "defaultColor": "#ef4444",
    "startingPrice": 7
  },
  {
    "numericId": "784",
    "code": "AE",
    "code3": "ARE",
    "name": "United Arab Emirates",
    "flag": "🇦🇪",
    "coordinates": [
      53.85,
      23.42
    ],
    "population": "9.5M",
    "tier": "TIER A",
    "defaultColor": "#10b981",
    "startingPrice": 7
  },
  {
    "numericId": "682",
    "code": "SA",
    "code3": "SAU",
    "name": "Saudi Arabia",
    "flag": "🇸🇦",
    "coordinates": [
      45.08,
      23.89
    ],
    "population": "36M",
    "tier": "TIER A",
    "defaultColor": "#16a34a",
    "startingPrice": 7
  },
  {
    "numericId": "792",
    "code": "TR",
    "code3": "TUR",
    "name": "Turkey",
    "flag": "🇹🇷",
    "coordinates": [
      35.24,
      38.96
    ],
    "population": "85M",
    "tier": "TIER A",
    "defaultColor": "#dc2626",
    "startingPrice": 7
  },
  {
    "numericId": "376",
    "code": "IL",
    "code3": "ISR",
    "name": "Israel",
    "flag": "🇮🇱",
    "coordinates": [
      34.85,
      31.05
    ],
    "population": "9.8M",
    "tier": "TIER A",
    "defaultColor": "#2563eb",
    "startingPrice": 7
  },
  {
    "numericId": "764",
    "code": "TH",
    "code3": "THA",
    "name": "Thailand",
    "flag": "🇹🇭",
    "coordinates": [
      100.99,
      15.87
    ],
    "population": "72M",
    "tier": "TIER B",
    "defaultColor": "#3b82f6",
    "startingPrice": 3
  },
  {
    "numericId": "704",
    "code": "VN",
    "code3": "VNM",
    "name": "Vietnam",
    "flag": "🇻🇳",
    "coordinates": [
      108.28,
      14.06
    ],
    "population": "98M",
    "tier": "TIER B",
    "defaultColor": "#e11d48",
    "startingPrice": 3
  },
  {
    "numericId": "458",
    "code": "MY",
    "code3": "MYS",
    "name": "Malaysia",
    "flag": "🇲🇾",
    "coordinates": [
      101.98,
      4.21
    ],
    "population": "34M",
    "tier": "TIER B",
    "defaultColor": "#f59e0b",
    "startingPrice": 3
  },
  {
    "numericId": "608",
    "code": "PH",
    "code3": "PHL",
    "name": "Philippines",
    "flag": "🇵🇭",
    "coordinates": [
      121.77,
      12.88
    ],
    "population": "115M",
    "tier": "TIER B",
    "defaultColor": "#2563eb",
    "startingPrice": 3
  },
  {
    "numericId": "586",
    "code": "PK",
    "code3": "PAK",
    "name": "Pakistan",
    "flag": "🇵🇰",
    "coordinates": [
      69.35,
      30.38
    ],
    "population": "240M",
    "tier": "TIER B",
    "defaultColor": "#059669",
    "startingPrice": 3
  },
  {
    "numericId": "050",
    "code": "BD",
    "code3": "BGD",
    "name": "Bangladesh",
    "flag": "🇧🇩",
    "coordinates": [
      90.36,
      23.68
    ],
    "population": "170M",
    "tier": "TIER B",
    "defaultColor": "#15803d",
    "startingPrice": 3
  },
  {
    "numericId": "634",
    "code": "QA",
    "code3": "QAT",
    "name": "Qatar",
    "flag": "🇶🇦",
    "coordinates": [
      51.18,
      25.35
    ],
    "population": "2.7M",
    "tier": "TIER B",
    "defaultColor": "#881337",
    "startingPrice": 5
  },
  {
    "numericId": "414",
    "code": "KW",
    "code3": "KWT",
    "name": "Kuwait",
    "flag": "🇰🇼",
    "coordinates": [
      47.48,
      29.31
    ],
    "population": "4.3M",
    "tier": "TIER B",
    "defaultColor": "#047857",
    "startingPrice": 5
  },
  {
    "numericId": "512",
    "code": "OM",
    "code3": "OMN",
    "name": "Oman",
    "flag": "🇴🇲",
    "coordinates": [
      55.92,
      21.51
    ],
    "population": "4.6M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 2
  },
  {
    "numericId": "048",
    "code": "BH",
    "code3": "BHR",
    "name": "Bahrain",
    "flag": "🇧🇭",
    "coordinates": [
      50.55,
      26.07
    ],
    "population": "1.5M",
    "tier": "TIER C",
    "defaultColor": "#e11d48",
    "startingPrice": 2
  },
  {
    "numericId": "364",
    "code": "IR",
    "code3": "IRN",
    "name": "Iran",
    "flag": "🇮🇷",
    "coordinates": [
      53.69,
      32.43
    ],
    "population": "89M",
    "tier": "TIER B",
    "defaultColor": "#16a34a",
    "startingPrice": 3
  },
  {
    "numericId": "368",
    "code": "IQ",
    "code3": "IRQ",
    "name": "Iraq",
    "flag": "🇮🇶",
    "coordinates": [
      43.68,
      33.22
    ],
    "population": "44M",
    "tier": "TIER C",
    "defaultColor": "#000000",
    "startingPrice": 2
  },
  {
    "numericId": "400",
    "code": "JO",
    "code3": "JOR",
    "name": "Jordan",
    "flag": "🇯🇴",
    "coordinates": [
      36.24,
      30.59
    ],
    "population": "11M",
    "tier": "TIER C",
    "defaultColor": "#15803d",
    "startingPrice": 2
  },
  {
    "numericId": "422",
    "code": "LB",
    "code3": "LBN",
    "name": "Lebanon",
    "flag": "🇱🇧",
    "coordinates": [
      35.86,
      33.85
    ],
    "population": "5.5M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 2
  },
  {
    "numericId": "760",
    "code": "SY",
    "code3": "SYR",
    "name": "Syria",
    "flag": "🇸🇾",
    "coordinates": [
      38.99,
      34.8
    ],
    "population": "22M",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 1
  },
  {
    "numericId": "887",
    "code": "YE",
    "code3": "YEM",
    "name": "Yemen",
    "flag": "🇾🇪",
    "coordinates": [
      48.52,
      15.55
    ],
    "population": "33M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "398",
    "code": "KZ",
    "code3": "KAZ",
    "name": "Kazakhstan",
    "flag": "🇰🇿",
    "coordinates": [
      66.92,
      48.02
    ],
    "population": "20M",
    "tier": "TIER B",
    "defaultColor": "#0284c7",
    "startingPrice": 3
  },
  {
    "numericId": "860",
    "code": "UZ",
    "code3": "UZB",
    "name": "Uzbekistan",
    "flag": "🇺🇿",
    "coordinates": [
      64.59,
      41.38
    ],
    "population": "36M",
    "tier": "TIER C",
    "defaultColor": "#0ea5e9",
    "startingPrice": 2
  },
  {
    "numericId": "795",
    "code": "TM",
    "code3": "TKM",
    "name": "Turkmenistan",
    "flag": "🇹🇲",
    "coordinates": [
      59.56,
      38.97
    ],
    "population": "6.5M",
    "tier": "TIER C",
    "defaultColor": "#059669",
    "startingPrice": 1
  },
  {
    "numericId": "417",
    "code": "KG",
    "code3": "KGZ",
    "name": "Kyrgyzstan",
    "flag": "🇰🇬",
    "coordinates": [
      74.77,
      41.2
    ],
    "population": "7M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "762",
    "code": "TJ",
    "code3": "TJK",
    "name": "Tajikistan",
    "flag": "🇹🇯",
    "coordinates": [
      71.28,
      38.86
    ],
    "population": "10M",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 1
  },
  {
    "numericId": "004",
    "code": "AF",
    "code3": "AFG",
    "name": "Afghanistan",
    "flag": "🇦🇫",
    "coordinates": [
      67.71,
      33.94
    ],
    "population": "41M",
    "tier": "TIER C",
    "defaultColor": "#000000",
    "startingPrice": 1
  },
  {
    "numericId": "144",
    "code": "LK",
    "code3": "LKA",
    "name": "Sri Lanka",
    "flag": "🇱🇰",
    "coordinates": [
      80.77,
      7.87
    ],
    "population": "22M",
    "tier": "TIER C",
    "defaultColor": "#ea580c",
    "startingPrice": 2
  },
  {
    "numericId": "524",
    "code": "NP",
    "code3": "NPL",
    "name": "Nepal",
    "flag": "🇳🇵",
    "coordinates": [
      84.12,
      28.39
    ],
    "population": "31M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "064",
    "code": "BT",
    "code3": "BTN",
    "name": "Bhutan",
    "flag": "🇧🇹",
    "coordinates": [
      90.43,
      27.51
    ],
    "population": "780K",
    "tier": "TIER C",
    "defaultColor": "#f59e0b",
    "startingPrice": 1
  },
  {
    "numericId": "462",
    "code": "MV",
    "code3": "MDV",
    "name": "Maldives",
    "flag": "🇲🇻",
    "coordinates": [
      73.22,
      3.2
    ],
    "population": "520K",
    "tier": "TIER C",
    "defaultColor": "#059669",
    "startingPrice": 2
  },
  {
    "numericId": "104",
    "code": "MM",
    "code3": "MMR",
    "name": "Myanmar",
    "flag": "🇲🇲",
    "coordinates": [
      95.96,
      21.91
    ],
    "population": "54M",
    "tier": "TIER C",
    "defaultColor": "#eab308",
    "startingPrice": 2
  },
  {
    "numericId": "116",
    "code": "KH",
    "code3": "KHM",
    "name": "Cambodia",
    "flag": "🇰🇭",
    "coordinates": [
      104.99,
      12.57
    ],
    "population": "17M",
    "tier": "TIER C",
    "defaultColor": "#2563eb",
    "startingPrice": 2
  },
  {
    "numericId": "418",
    "code": "LA",
    "code3": "LAO",
    "name": "Laos",
    "flag": "🇱🇦",
    "coordinates": [
      102.5,
      19.86
    ],
    "population": "7.6M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "096",
    "code": "BN",
    "code3": "BRN",
    "name": "Brunei",
    "flag": "🇧🇳",
    "coordinates": [
      114.73,
      4.54
    ],
    "population": "450K",
    "tier": "TIER C",
    "defaultColor": "#facc15",
    "startingPrice": 2
  },
  {
    "numericId": "626",
    "code": "TL",
    "code3": "TLS",
    "name": "Timor-Leste",
    "flag": "🇹🇱",
    "coordinates": [
      125.73,
      -8.87
    ],
    "population": "1.3M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "496",
    "code": "MN",
    "code3": "MNG",
    "name": "Mongolia",
    "flag": "🇲🇳",
    "coordinates": [
      103.85,
      46.86
    ],
    "population": "3.4M",
    "tier": "TIER C",
    "defaultColor": "#2563eb",
    "startingPrice": 2
  },
  {
    "numericId": "408",
    "code": "KP",
    "code3": "PRK",
    "name": "North Korea",
    "flag": "🇰🇵",
    "coordinates": [
      127.51,
      40.34
    ],
    "population": "26M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 2
  },
  {
    "numericId": "268",
    "code": "GE",
    "code3": "GEO",
    "name": "Georgia",
    "flag": "🇬🇪",
    "coordinates": [
      43.36,
      42.32
    ],
    "population": "3.7M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 2
  },
  {
    "numericId": "051",
    "code": "AM",
    "code3": "ARM",
    "name": "Armenia",
    "flag": "🇦🇲",
    "coordinates": [
      45.04,
      40.07
    ],
    "population": "2.8M",
    "tier": "TIER C",
    "defaultColor": "#ea580c",
    "startingPrice": 1
  },
  {
    "numericId": "031",
    "code": "AZ",
    "code3": "AZE",
    "name": "Azerbaijan",
    "flag": "🇦🇿",
    "coordinates": [
      47.58,
      40.14
    ],
    "population": "10M",
    "tier": "TIER C",
    "defaultColor": "#0284c7",
    "startingPrice": 2
  },
  {
    "numericId": "643",
    "code": "RU",
    "code3": "RUS",
    "name": "Russia",
    "flag": "🇷🇺",
    "coordinates": [
      105.32,
      61.52
    ],
    "population": "144M",
    "tier": "TIER S",
    "defaultColor": "#84cc16",
    "startingPrice": 10
  },
  {
    "numericId": "818",
    "code": "EG",
    "code3": "EGY",
    "name": "Egypt",
    "flag": "🇪🇬",
    "coordinates": [
      30.8,
      26.82
    ],
    "population": "110M",
    "tier": "TIER B",
    "defaultColor": "#eab308",
    "startingPrice": 3
  },
  {
    "numericId": "566",
    "code": "NG",
    "code3": "NGA",
    "name": "Nigeria",
    "flag": "🇳🇬",
    "coordinates": [
      8.68,
      9.08
    ],
    "population": "220M",
    "tier": "TIER B",
    "defaultColor": "#16a34a",
    "startingPrice": 3
  },
  {
    "numericId": "710",
    "code": "ZA",
    "code3": "ZAF",
    "name": "South Africa",
    "flag": "🇿🇦",
    "coordinates": [
      22.94,
      -30.56
    ],
    "population": "60M",
    "tier": "TIER A",
    "defaultColor": "#8b5cf6",
    "startingPrice": 7
  },
  {
    "numericId": "504",
    "code": "MA",
    "code3": "MAR",
    "name": "Morocco",
    "flag": "🇲🇦",
    "coordinates": [
      -7.09,
      31.79
    ],
    "population": "37M",
    "tier": "TIER B",
    "defaultColor": "#dc2626",
    "startingPrice": 3
  },
  {
    "numericId": "012",
    "code": "DZ",
    "code3": "DZA",
    "name": "Algeria",
    "flag": "🇩🇿",
    "coordinates": [
      1.66,
      28.03
    ],
    "population": "45M",
    "tier": "TIER B",
    "defaultColor": "#16a34a",
    "startingPrice": 3
  },
  {
    "numericId": "788",
    "code": "TN",
    "code3": "TUN",
    "name": "Tunisia",
    "flag": "🇹🇳",
    "coordinates": [
      9.54,
      33.89
    ],
    "population": "12M",
    "tier": "TIER C",
    "defaultColor": "#e11d48",
    "startingPrice": 2
  },
  {
    "numericId": "434",
    "code": "LY",
    "code3": "LBY",
    "name": "Libya",
    "flag": "🇱🇾",
    "coordinates": [
      17.23,
      26.34
    ],
    "population": "7M",
    "tier": "TIER C",
    "defaultColor": "#059669",
    "startingPrice": 1
  },
  {
    "numericId": "404",
    "code": "KE",
    "code3": "KEN",
    "name": "Kenya",
    "flag": "🇰🇪",
    "coordinates": [
      37.91,
      -0.02
    ],
    "population": "54M",
    "tier": "TIER B",
    "defaultColor": "#ef4444",
    "startingPrice": 3
  },
  {
    "numericId": "231",
    "code": "ET",
    "code3": "ETH",
    "name": "Ethiopia",
    "flag": "🇪🇹",
    "coordinates": [
      40.49,
      9.15
    ],
    "population": "126M",
    "tier": "TIER B",
    "defaultColor": "#facc15",
    "startingPrice": 3
  },
  {
    "numericId": "288",
    "code": "GH",
    "code3": "GHA",
    "name": "Ghana",
    "flag": "🇬🇭",
    "coordinates": [
      -1.02,
      7.95
    ],
    "population": "34M",
    "tier": "TIER B",
    "defaultColor": "#ea580c",
    "startingPrice": 3
  },
  {
    "numericId": "384",
    "code": "CI",
    "code3": "CIV",
    "name": "Ivory Coast",
    "flag": "🇨🇮",
    "coordinates": [
      -5.55,
      7.54
    ],
    "population": "29M",
    "tier": "TIER C",
    "defaultColor": "#f97316",
    "startingPrice": 2
  },
  {
    "numericId": "686",
    "code": "SN",
    "code3": "SEN",
    "name": "Senegal",
    "flag": "🇸🇳",
    "coordinates": [
      -14.45,
      14.5
    ],
    "population": "17M",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 2
  },
  {
    "numericId": "834",
    "code": "TZ",
    "code3": "TZA",
    "name": "Tanzania",
    "flag": "🇹🇿",
    "coordinates": [
      34.89,
      -6.37
    ],
    "population": "65M",
    "tier": "TIER C",
    "defaultColor": "#06b6d4",
    "startingPrice": 2
  },
  {
    "numericId": "800",
    "code": "UG",
    "code3": "UGA",
    "name": "Uganda",
    "flag": "🇺🇬",
    "coordinates": [
      32.29,
      1.37
    ],
    "population": "47M",
    "tier": "TIER C",
    "defaultColor": "#eab308",
    "startingPrice": 2
  },
  {
    "numericId": "024",
    "code": "AO",
    "code3": "AGO",
    "name": "Angola",
    "flag": "🇦🇴",
    "coordinates": [
      17.87,
      -11.2
    ],
    "population": "36M",
    "tier": "TIER C",
    "defaultColor": "#b91c1c",
    "startingPrice": 2
  },
  {
    "numericId": "508",
    "code": "MZ",
    "code3": "MOZ",
    "name": "Mozambique",
    "flag": "🇲🇿",
    "coordinates": [
      35.53,
      -18.67
    ],
    "population": "33M",
    "tier": "TIER C",
    "defaultColor": "#059669",
    "startingPrice": 1
  },
  {
    "numericId": "894",
    "code": "ZM",
    "code3": "ZMB",
    "name": "Zambia",
    "flag": "🇿🇲",
    "coordinates": [
      27.85,
      -13.13
    ],
    "population": "20M",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 1
  },
  {
    "numericId": "716",
    "code": "ZW",
    "code3": "ZWE",
    "name": "Zimbabwe",
    "flag": "🇿🇼",
    "coordinates": [
      29.15,
      -19.02
    ],
    "population": "16M",
    "tier": "TIER C",
    "defaultColor": "#f59e0b",
    "startingPrice": 1
  },
  {
    "numericId": "072",
    "code": "BW",
    "code3": "BWA",
    "name": "Botswana",
    "flag": "🇧🇼",
    "coordinates": [
      24.68,
      -22.33
    ],
    "population": "2.6M",
    "tier": "TIER C",
    "defaultColor": "#0284c7",
    "startingPrice": 2
  },
  {
    "numericId": "516",
    "code": "NA",
    "code3": "NAM",
    "name": "Namibia",
    "flag": "🇳🇦",
    "coordinates": [
      18.49,
      -22.96
    ],
    "population": "2.6M",
    "tier": "TIER C",
    "defaultColor": "#3b82f6",
    "startingPrice": 2
  },
  {
    "numericId": "450",
    "code": "MG",
    "code3": "MDG",
    "name": "Madagascar",
    "flag": "🇲🇬",
    "coordinates": [
      46.87,
      -18.77
    ],
    "population": "29M",
    "tier": "TIER C",
    "defaultColor": "#ef4444",
    "startingPrice": 1
  },
  {
    "numericId": "120",
    "code": "CD",
    "code3": "COD",
    "name": "DR Congo",
    "flag": "🇨🇩",
    "coordinates": [
      21.76,
      -4.04
    ],
    "population": "102M",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 2
  },
  {
    "numericId": "178",
    "code": "CG",
    "code3": "COG",
    "name": "Congo",
    "flag": "🇨🇬",
    "coordinates": [
      15.83,
      -0.23
    ],
    "population": "6M",
    "tier": "TIER C",
    "defaultColor": "#10b981",
    "startingPrice": 1
  },
  {
    "numericId": "120",
    "code": "CM",
    "code3": "CMR",
    "name": "Cameroon",
    "flag": "🇨🇲",
    "coordinates": [
      12.35,
      7.37
    ],
    "population": "28M",
    "tier": "TIER C",
    "defaultColor": "#15803d",
    "startingPrice": 2
  },
  {
    "numericId": "266",
    "code": "GA",
    "code3": "GAB",
    "name": "Gabon",
    "flag": "🇬🇦",
    "coordinates": [
      11.61,
      -0.8
    ],
    "population": "2.4M",
    "tier": "TIER C",
    "defaultColor": "#22c55e",
    "startingPrice": 2
  },
  {
    "numericId": "226",
    "code": "GQ",
    "code3": "GNQ",
    "name": "Equatorial Guinea",
    "flag": "🇬🇶",
    "coordinates": [
      10.27,
      1.65
    ],
    "population": "1.7M",
    "tier": "TIER C",
    "defaultColor": "#059669",
    "startingPrice": 1
  },
  {
    "numericId": "148",
    "code": "TD",
    "code3": "TCD",
    "name": "Chad",
    "flag": "🇹🇩",
    "coordinates": [
      18.73,
      15.45
    ],
    "population": "18M",
    "tier": "TIER C",
    "defaultColor": "#d946ef",
    "startingPrice": 1
  },
  {
    "numericId": "562",
    "code": "NE",
    "code3": "NER",
    "name": "Niger",
    "flag": "🇳🇪",
    "coordinates": [
      8.08,
      17.61
    ],
    "population": "25M",
    "tier": "TIER C",
    "defaultColor": "#ea580c",
    "startingPrice": 1
  },
  {
    "numericId": "466",
    "code": "ML",
    "code3": "MLI",
    "name": "Mali",
    "flag": "🇲🇱",
    "coordinates": [
      -4,
      17.57
    ],
    "population": "22M",
    "tier": "TIER C",
    "defaultColor": "#15803d",
    "startingPrice": 1
  },
  {
    "numericId": "854",
    "code": "BF",
    "code3": "BFA",
    "name": "Burkina Faso",
    "flag": "🇧🇫",
    "coordinates": [
      -1.56,
      12.24
    ],
    "population": "22M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "478",
    "code": "MR",
    "code3": "MRT",
    "name": "Mauritania",
    "flag": "🇲🇷",
    "coordinates": [
      -10.94,
      21.01
    ],
    "population": "4.7M",
    "tier": "TIER C",
    "defaultColor": "#15803d",
    "startingPrice": 1
  },
  {
    "numericId": "729",
    "code": "SD",
    "code3": "SDN",
    "name": "Sudan",
    "flag": "🇸🇩",
    "coordinates": [
      30.22,
      12.86
    ],
    "population": "46M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "728",
    "code": "SS",
    "code3": "SSD",
    "name": "South Sudan",
    "flag": "🇸🇸",
    "coordinates": [
      31.31,
      6.88
    ],
    "population": "11M",
    "tier": "TIER C",
    "defaultColor": "#059669",
    "startingPrice": 1
  },
  {
    "numericId": "232",
    "code": "ER",
    "code3": "ERI",
    "name": "Eritrea",
    "flag": "🇪🇷",
    "coordinates": [
      39.78,
      15.18
    ],
    "population": "3.7M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "262",
    "code": "DJ",
    "code3": "DJI",
    "name": "Djibouti",
    "flag": "🇩🇯",
    "coordinates": [
      42.59,
      11.83
    ],
    "population": "1.1M",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 1
  },
  {
    "numericId": "706",
    "code": "SO",
    "code3": "SOM",
    "name": "Somalia",
    "flag": "🇸🇴",
    "coordinates": [
      46.2,
      5.15
    ],
    "population": "17M",
    "tier": "TIER C",
    "defaultColor": "#60a5fa",
    "startingPrice": 1
  },
  {
    "numericId": "646",
    "code": "RW",
    "code3": "RWA",
    "name": "Rwanda",
    "flag": "🇷🇼",
    "coordinates": [
      29.87,
      -1.94
    ],
    "population": "14M",
    "tier": "TIER C",
    "defaultColor": "#0284c7",
    "startingPrice": 2
  },
  {
    "numericId": "108",
    "code": "BI",
    "code3": "BDI",
    "name": "Burundi",
    "flag": "🇧🇮",
    "coordinates": [
      29.92,
      -3.37
    ],
    "population": "13M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "454",
    "code": "MW",
    "code3": "MWI",
    "name": "Malawi",
    "flag": "🇲🇼",
    "coordinates": [
      34.3,
      -13.25
    ],
    "population": "20M",
    "tier": "TIER C",
    "defaultColor": "#000000",
    "startingPrice": 1
  },
  {
    "numericId": "426",
    "code": "LS",
    "code3": "LSO",
    "name": "Lesotho",
    "flag": "🇱🇸",
    "coordinates": [
      28.23,
      -29.61
    ],
    "population": "2.3M",
    "tier": "TIER C",
    "defaultColor": "#2563eb",
    "startingPrice": 1
  },
  {
    "numericId": "748",
    "code": "SZ",
    "code3": "SWZ",
    "name": "Eswatini",
    "flag": "🇸🇿",
    "coordinates": [
      31.47,
      -26.52
    ],
    "population": "1.2M",
    "tier": "TIER C",
    "defaultColor": "#3b82f6",
    "startingPrice": 1
  },
  {
    "numericId": "480",
    "code": "MU",
    "code3": "MUS",
    "name": "Mauritius",
    "flag": "🇲🇺",
    "coordinates": [
      57.55,
      -20.35
    ],
    "population": "1.3M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 2
  },
  {
    "numericId": "690",
    "code": "SC",
    "code3": "SYC",
    "name": "Seychelles",
    "flag": "🇸🇨",
    "coordinates": [
      55.49,
      -4.68
    ],
    "population": "100K",
    "tier": "TIER C",
    "defaultColor": "#2563eb",
    "startingPrice": 2
  },
  {
    "numericId": "174",
    "code": "KM",
    "code3": "COM",
    "name": "Comoros",
    "flag": "🇰🇲",
    "coordinates": [
      43.33,
      -11.65
    ],
    "population": "850K",
    "tier": "TIER C",
    "defaultColor": "#15803d",
    "startingPrice": 1
  },
  {
    "numericId": "132",
    "code": "CV",
    "code3": "CPV",
    "name": "Cape Verde",
    "flag": "🇨🇻",
    "coordinates": [
      -24.01,
      16
    ],
    "population": "590K",
    "tier": "TIER C",
    "defaultColor": "#1d4ed8",
    "startingPrice": 1
  },
  {
    "numericId": "678",
    "code": "ST",
    "code3": "STP",
    "name": "Sao Tome and Principe",
    "flag": "🇸🇹",
    "coordinates": [
      6.61,
      0.19
    ],
    "population": "230K",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 1
  },
  {
    "numericId": "624",
    "code": "GW",
    "code3": "GNB",
    "name": "Guinea-Bissau",
    "flag": "🇬🇼",
    "coordinates": [
      -15.18,
      11.8
    ],
    "population": "2.1M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "324",
    "code": "GN",
    "code3": "GIN",
    "name": "Guinea",
    "flag": "🇬🇳",
    "coordinates": [
      -9.7,
      9.95
    ],
    "population": "14M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "694",
    "code": "SL",
    "code3": "SLE",
    "name": "Sierra Leone",
    "flag": "🇸🇱",
    "coordinates": [
      -11.78,
      8.46
    ],
    "population": "8.6M",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 1
  },
  {
    "numericId": "430",
    "code": "LR",
    "code3": "LBR",
    "name": "Liberia",
    "flag": "🇱🇷",
    "coordinates": [
      -9.43,
      6.43
    ],
    "population": "5.4M",
    "tier": "TIER C",
    "defaultColor": "#b91c1c",
    "startingPrice": 1
  },
  {
    "numericId": "768",
    "code": "TG",
    "code3": "TGO",
    "name": "Togo",
    "flag": "🇹🇬",
    "coordinates": [
      0.82,
      8.62
    ],
    "population": "8.8M",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 1
  },
  {
    "numericId": "204",
    "code": "BJ",
    "code3": "BEN",
    "name": "Benin",
    "flag": "🇧🇯",
    "coordinates": [
      2.32,
      9.31
    ],
    "population": "13M",
    "tier": "TIER C",
    "defaultColor": "#eab308",
    "startingPrice": 1
  },
  {
    "numericId": "140",
    "code": "CF",
    "code3": "CAF",
    "name": "Central African Republic",
    "flag": "🇨🇫",
    "coordinates": [
      20.94,
      6.61
    ],
    "population": "5.5M",
    "tier": "TIER C",
    "defaultColor": "#3b82f6",
    "startingPrice": 1
  },
  {
    "numericId": "270",
    "code": "GM",
    "code3": "GMB",
    "name": "Gambia",
    "flag": "🇬🇲",
    "coordinates": [
      -15.31,
      13.44
    ],
    "population": "2.7M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "036",
    "code": "AU",
    "code3": "AUS",
    "name": "Australia",
    "flag": "🇦🇺",
    "coordinates": [
      133.78,
      -25.27
    ],
    "population": "26M",
    "tier": "TIER A",
    "defaultColor": "#eab308",
    "startingPrice": 7
  },
  {
    "numericId": "554",
    "code": "NZ",
    "code3": "NZL",
    "name": "New Zealand",
    "flag": "🇳🇿",
    "coordinates": [
      174.89,
      -40.9
    ],
    "population": "5.2M",
    "tier": "TIER B",
    "defaultColor": "#f97316",
    "startingPrice": 5
  },
  {
    "numericId": "598",
    "code": "PG",
    "code3": "PNG",
    "name": "Papua New Guinea",
    "flag": "🇵🇬",
    "coordinates": [
      143.96,
      -6.31
    ],
    "population": "10M",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "242",
    "code": "FJ",
    "code3": "FJI",
    "name": "Fiji",
    "flag": "🇫🇯",
    "coordinates": [
      178.07,
      -17.71
    ],
    "population": "930K",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 1
  },
  {
    "numericId": "090",
    "code": "SB",
    "code3": "SLB",
    "name": "Solomon Islands",
    "flag": "🇸🇧",
    "coordinates": [
      160.16,
      -9.65
    ],
    "population": "720K",
    "tier": "TIER C",
    "defaultColor": "#16a34a",
    "startingPrice": 1
  },
  {
    "numericId": "548",
    "code": "VU",
    "code3": "VUT",
    "name": "Vanuatu",
    "flag": "🇻🇺",
    "coordinates": [
      166.96,
      -15.38
    ],
    "population": "330K",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "882",
    "code": "WS",
    "code3": "WSM",
    "name": "Samoa",
    "flag": "🇼🇸",
    "coordinates": [
      -172.1,
      -13.76
    ],
    "population": "220K",
    "tier": "TIER C",
    "defaultColor": "#b91c1c",
    "startingPrice": 1
  },
  {
    "numericId": "296",
    "code": "KI",
    "code3": "KIR",
    "name": "Kiribati",
    "flag": "🇰🇮",
    "coordinates": [
      -157.36,
      1.87
    ],
    "population": "130K",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "584",
    "code": "MH",
    "code3": "MHL",
    "name": "Marshall Islands",
    "flag": "🇲🇭",
    "coordinates": [
      171.18,
      7.13
    ],
    "population": "42K",
    "tier": "TIER C",
    "defaultColor": "#2563eb",
    "startingPrice": 1
  },
  {
    "numericId": "583",
    "code": "FM",
    "code3": "FSM",
    "name": "Micronesia",
    "flag": "🇫🇲",
    "coordinates": [
      150.55,
      7.43
    ],
    "population": "115K",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 1
  },
  {
    "numericId": "520",
    "code": "NR",
    "code3": "NRU",
    "name": "Nauru",
    "flag": "🇳🇷",
    "coordinates": [
      166.93,
      -0.52
    ],
    "population": "12K",
    "tier": "TIER C",
    "defaultColor": "#1e3a8a",
    "startingPrice": 1
  },
  {
    "numericId": "585",
    "code": "PW",
    "code3": "PLW",
    "name": "Palau",
    "flag": "🇵🇼",
    "coordinates": [
      134.58,
      7.51
    ],
    "population": "18K",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 1
  },
  {
    "numericId": "776",
    "code": "TO",
    "code3": "TON",
    "name": "Tonga",
    "flag": "🇹🇴",
    "coordinates": [
      -175.2,
      -21.18
    ],
    "population": "105K",
    "tier": "TIER C",
    "defaultColor": "#dc2626",
    "startingPrice": 1
  },
  {
    "numericId": "798",
    "code": "TV",
    "code3": "TUV",
    "name": "Tuvalu",
    "flag": "🇹🇻",
    "coordinates": [
      179.22,
      -7.11
    ],
    "population": "11K",
    "tier": "TIER C",
    "defaultColor": "#38bdf8",
    "startingPrice": 1
  },
  {
    "numericId": "901",
    "code": "IO_OCEAN",
    "code3": "IOP",
    "name": "Indian Ocean Trade Route",
    "flag": "⚓",
    "coordinates": [
      75,
      -10
    ],
    "population": "Naval Corridor",
    "tier": "TIER B",
    "defaultColor": "#10b981",
    "startingPrice": 3,
    "isOceanFleet": true
  },
  {
    "numericId": "902",
    "code": "SO_OCEAN",
    "code3": "SOP",
    "name": "Southern Ocean Patrol",
    "flag": "🚢",
    "coordinates": [
      0,
      -58
    ],
    "population": "Polar Fleet",
    "tier": "TIER B",
    "defaultColor": "#10b981",
    "startingPrice": 2,
    "isOceanFleet": true
  },
  {
    "numericId": "903",
    "code": "SA_OCEAN",
    "code3": "SAP",
    "name": "South Australia Patrol",
    "flag": "⚓",
    "coordinates": [
      130,
      -42
    ],
    "population": "Ocean Fleet",
    "tier": "TIER B",
    "defaultColor": "#10b981",
    "startingPrice": 2,
    "isOceanFleet": true
  },
  {
    "numericId": "904",
    "code": "SP_OCEAN",
    "code3": "SPF",
    "name": "South Pacific Fleet",
    "flag": "⛵",
    "coordinates": [
      -120,
      -25
    ],
    "population": "Deep Sea Armada",
    "tier": "TIER B",
    "defaultColor": "#10b981",
    "startingPrice": 2,
    "isOceanFleet": true
  },
  {
    "numericId": "905",
    "code": "NP_OCEAN",
    "code3": "NPF",
    "name": "North Pacific Fleet",
    "flag": "🛳️",
    "coordinates": [
      -160,
      32
    ],
    "population": "Carrier Fleet",
    "tier": "TIER B",
    "defaultColor": "#10b981",
    "startingPrice": 3,
    "isOceanFleet": true
  },
  {
    "numericId": "906",
    "code": "AF_OCEAN",
    "code3": "ATF",
    "name": "Atlantic Fleet Patrol",
    "flag": "⚓",
    "coordinates": [
      -35,
      25
    ],
    "population": "Naval Corridor",
    "tier": "TIER B",
    "defaultColor": "#10b981",
    "startingPrice": 3,
    "isOceanFleet": true
  }
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
  currentBid: c.startingPrice || 1,
  minOutbidPrice: calcMinOutbid(c.startingPrice || 1),
  totalPlunder: 0,
  clicks: 0,
}));
