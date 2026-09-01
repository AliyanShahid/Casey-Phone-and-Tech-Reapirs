import { refurbishedDevices } from "@/lib/refurbished-stock";

export type RepairBrand = {
  name: string;
  slug: string;
  deviceTypes: Array<"Phone" | "Tablet" | "Laptop" | "Smartwatch">;
  series: RepairSeries[];
};

export type RepairSeries = {
  name: string;
  models: RepairDevice[];
};

export type RepairDevice = {
  brand: string;
  brandSlug: string;
  name: string;
  slug: string;
  type: "Phone" | "Tablet" | "Laptop" | "Smartwatch";
  image: string;
};

export type RepairOption = {
  id: string;
  slug: string;
  title: string;
  icon: string;
  summary: string;
  price: number | null;
  warranty: string;
  badge?: string;
  image?: string;
  choices?: RepairChoice[];
};

export type RepairChoice = {
  id: string;
  title: string;
  text: string;
  price: number;
  rating: number;
};

const stockImages = refurbishedDevices.map((device) => ({
  title: device.title.toLowerCase(),
  image: device.image
}));

export function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function imageFor(name: string, fallback: string) {
  const clean = name.toLowerCase().replace(/^apple\s+/, "");
  return stockImages.find((item) => item.title.includes(clean) || clean.includes(item.title.replace(/^apple\s+/, "")))?.image || fallback;
}

function makeDevice(brand: string, type: RepairDevice["type"], name: string, fallback: string): RepairDevice {
  return {
    brand,
    brandSlug: slugify(brand),
    name,
    slug: slugify(name),
    type,
    image: imageFor(name, fallback)
  };
}

function makeDeviceWithImage(brand: string, type: RepairDevice["type"], [name, image]: [string, string]): RepairDevice {
  return {
    brand,
    brandSlug: slugify(brand),
    name,
    slug: slugify(name),
    type,
    image
  };
}

function normalizedModelName(value: string) {
  return value
    .toLowerCase()
    .replace(/^apple\s+/, "")
    .replace(/\b5g\b/g, "")
    .replace(/\((\d{4})\)/g, "$1")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function realStockImageFor(name: string, fallback: string) {
  const target = normalizedModelName(name);
  const exact = refurbishedDevices.find((item) =>
    item.brand === "Apple" &&
    item.category === "Phone" &&
    normalizedModelName(cleanStockName(item.title)) === target
  );
  if (exact) return exact.image;

  return fallback;
}

const applePhoneImageOverrides: Record<string, string> = {
  "Apple iPhone 6": "/refurbished/phonebot-0001.png",
  "Apple iPhone 6 Plus": "/refurbished/phonebot-0009.jpg",
  "Apple iPhone 6s": "/refurbished/phonebot-0002.jpg",
  "Apple iPhone 6s Plus": "/refurbished/phonebot-0009.jpg",
  "Apple iPhone X": "/refurbished/phonebot-0027.jpg",
  "Apple iPhone 12 Pro Max": "/refurbished/phonebot-0092.jpg",
  "Apple iPhone SE (2022)": "/refurbished/phonebot-0006.jpg",
  "Apple iPhone 13 Pro Max": "/refurbished/phonebot-0113.jpg",
  "Apple iPhone 14": "/refurbished/phonebot-0114.jpg",
  "Apple iPhone 14 Plus": "/refurbished/phonebot-0114.jpg",
  "Apple iPhone 14 Pro": "/refurbished/phonebot-0144.jpg",
  "Apple iPhone 15": "/refurbished/phonebot-0145.jpg",
  "Apple iPhone 15 Pro": "/refurbished/phonebot-0171.jpg",
  "Apple iPhone 16": "/refurbished/phonebot-0172.jpg",
  "Apple iPhone 16 Pro": "/refurbished/phonebot-0171.jpg",
  "Apple iPhone 16 Pro Max": "/refurbished/phonebot-0171.jpg",
  "Apple iPhone 17 Pro": "/refurbished/phonebot-0199.jpg",
  "Apple iPhone Air": "/apple-official/iphone-air-card.png"
};

function makeApplePhoneDevice([name, fallback]: [string, string]): RepairDevice {
  return makeDeviceWithImage("Apple", "Phone", [name, applePhoneImageOverrides[name] || realStockImageFor(name, fallback)]);
}

const applePhoneNames = [
  "Apple iPhone 16 Pro Max", "Apple iPhone 16 Pro", "Apple iPhone 16 Plus", "Apple iPhone 16",
  "Apple iPhone 15 Pro Max", "Apple iPhone 15 Pro", "Apple iPhone 15 Plus", "Apple iPhone 15",
  "Apple iPhone 14 Pro Max", "Apple iPhone 14 Pro", "Apple iPhone 14 Plus", "Apple iPhone 14",
  "Apple iPhone 13 Pro Max", "Apple iPhone 13 Pro", "Apple iPhone 13 Mini", "Apple iPhone 13",
  "Apple iPhone 12 Pro Max", "Apple iPhone 12 Pro", "Apple iPhone 12 Mini", "Apple iPhone 12",
  "Apple iPhone 11 Pro Max", "Apple iPhone 11 Pro", "Apple iPhone 11",
  "Apple iPhone XS Max", "Apple iPhone XS", "Apple iPhone XR", "Apple iPhone X",
  "Apple iPhone SE 2022", "Apple iPhone SE 2020", "Apple iPhone 8 Plus", "Apple iPhone 8",
  "Apple iPhone 7 Plus", "Apple iPhone 7", "Apple iPhone 6S Plus", "Apple iPhone 6S", "Apple iPhone 6 Plus", "Apple iPhone 6"
];

const samsungPhoneNames = [
  "Samsung Galaxy S26 Ultra", "Samsung Galaxy S26 Plus", "Samsung Galaxy S26",
  "Samsung Galaxy S25 Ultra", "Samsung Galaxy S25 Plus", "Samsung Galaxy S25",
  "Samsung Galaxy S24 Ultra", "Samsung Galaxy S24 Plus", "Samsung Galaxy S24",
  "Samsung Galaxy S23 Ultra", "Samsung Galaxy S23 Plus", "Samsung Galaxy S23",
  "Samsung Galaxy S22 Ultra", "Samsung Galaxy S22 Plus", "Samsung Galaxy S22",
  "Samsung Galaxy S21 Ultra", "Samsung Galaxy S21 Plus", "Samsung Galaxy S21 FE",
  "Samsung Galaxy Note 20 Ultra", "Samsung Galaxy Note 20", "Samsung Galaxy A55", "Samsung Galaxy A54",
  "Samsung Galaxy A53", "Samsung Galaxy A35", "Samsung Galaxy A34", "Samsung Galaxy A33",
  "Samsung Galaxy A15", "Samsung Galaxy A14", "Samsung Galaxy A13", "Samsung Galaxy A12",
  "Samsung Galaxy Z Fold 6", "Samsung Galaxy Z Fold 5", "Samsung Galaxy Z Fold 4",
  "Samsung Galaxy Z Flip 6", "Samsung Galaxy Z Flip 5", "Samsung Galaxy Z Flip 4"
];

const googlePhoneNames = [
  "Google Pixel 10 Pro", "Google Pixel 10", "Google Pixel 9 Pro", "Google Pixel 9",
  "Google Pixel 8 Pro", "Google Pixel 8", "Google Pixel 7 Pro", "Google Pixel 7",
  "Google Pixel 6 Pro", "Google Pixel 6", "Google Pixel 5"
];

const oppoNames = ["Oppo Reno 12", "Oppo Reno 11", "Oppo Reno 10", "Oppo Reno 8", "Oppo Find X7", "Oppo Find X5", "Oppo A98", "Oppo A78", "Oppo A57"];
const vivoNames = ["Vivo X100", "Vivo V30", "Vivo V29", "Vivo V25", "Vivo V23", "Vivo Y100", "Vivo Y52", "Vivo Y21"];
const realmeNames = ["Realme GT 6", "Realme 12 Pro", "Realme 11 Pro", "Realme C67", "Realme Narzo 70", "Realme C55"];
const xiaomiNames = ["Xiaomi 14 Ultra", "Xiaomi 14", "Xiaomi 13T", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi Note 12", "POCO X6", "POCO F6", "POCO X5"];
const oneplusNames = ["OnePlus 12", "OnePlus 12R", "OnePlus 11", "OnePlus Nord 4", "OnePlus Nord CE 4"];
const huaweiNames = ["Huawei P60 Pro", "Huawei Mate 60 Pro", "Huawei Nova 12", "Huawei P50 Pro"];
const honorNames = ["Honor Magic 6 Pro", "Honor 200 Pro", "Honor 90", "Honor X9b"];
const motorolaNames = ["Motorola Edge 50 Pro", "Motorola Edge 40", "Motorola G84", "Motorola G Power", "Motorola Razr 50"];
const sonyNames = ["Sony Xperia 1 VI", "Sony Xperia 5 V", "Sony Xperia 10 VI"];

const laptopNames = [
  "Apple MacBook Air", "Apple MacBook Pro", "Microsoft Surface Pro 11", "Microsoft Surface Pro 10",
  "Microsoft Surface Laptop Studio", "Dell Laptop", "HP Laptop", "Lenovo Laptop", "Gaming Laptop"
];

// Apple Watch repair models are grouped by the official Apple Watch identification families.
// The watch images are local product-style SVG illustrations so the grid stays consistent and
// does not depend on external hotlinks or low-quality scraped images.
const appleWatchSeriesOfficial: Array<{ name: string; models: Array<[string, string]> }> = [
  {
    name: "Series Ultra",
    models: [
      ["Apple Watch Ultra 3 (49mm)", "/watches/apple-watch-ultra-3-49mm.svg"],
      ["Apple Watch Ultra 2 (49mm)", "/watches/apple-watch-ultra-2-49mm.svg"],
      ["Apple Watch Ultra (49mm)", "/watches/apple-watch-ultra-49mm.svg"]
    ]
  },
  {
    name: "Series 11",
    models: [
      ["Apple Watch Series 11 (46mm)", "/watches/apple-watch-series-11-46mm.svg"],
      ["Apple Watch Series 11 (42mm)", "/watches/apple-watch-series-11-42mm.svg"]
    ]
  },
  {
    name: "Series 10",
    models: [
      ["Apple Watch Series 10 (46mm)", "/watches/apple-watch-series-10-46mm.svg"],
      ["Apple Watch Series 10 (42mm)", "/watches/apple-watch-series-10-42mm.svg"]
    ]
  },
  {
    name: "Series 9",
    models: [
      ["Apple Watch Series 9 (45mm)", "/watches/apple-watch-series-9-45mm.svg"],
      ["Apple Watch Series 9 (41mm)", "/watches/apple-watch-series-9-41mm.svg"]
    ]
  },
  {
    name: "Series SE",
    models: [
      ["Apple Watch SE 3 (44mm)", "/watches/apple-watch-se-3-44mm.svg"],
      ["Apple Watch SE 3 (40mm)", "/watches/apple-watch-se-3-40mm.svg"],
      ["Apple Watch SE 2 (44mm)", "/watches/apple-watch-se-2-44mm.svg"],
      ["Apple Watch SE 2 (40mm)", "/watches/apple-watch-se-2-40mm.svg"],
      ["Apple Watch SE (44mm)", "/watches/apple-watch-se-44mm.svg"],
      ["Apple Watch SE (40mm)", "/watches/apple-watch-se-40mm.svg"]
    ]
  },
  {
    name: "Series 8",
    models: [
      ["Apple Watch Series 8 (45mm)", "/watches/apple-watch-series-8-45mm.svg"],
      ["Apple Watch Series 8 (41mm)", "/watches/apple-watch-series-8-41mm.svg"]
    ]
  },
  {
    name: "Series 7",
    models: [
      ["Apple Watch Series 7 (45mm)", "/watches/apple-watch-series-7-45mm.svg"],
      ["Apple Watch Series 7 (41mm)", "/watches/apple-watch-series-7-41mm.svg"]
    ]
  },
  {
    name: "Series 6",
    models: [
      ["Apple Watch Series 6 (44mm)", "/watches/apple-watch-series-6-44mm.svg"],
      ["Apple Watch Series 6 (40mm)", "/watches/apple-watch-series-6-40mm.svg"]
    ]
  },
  {
    name: "Series 5",
    models: [
      ["Apple Watch Series 5 (44mm)", "/watches/apple-watch-series-5-44mm.svg"],
      ["Apple Watch Series 5 (40mm)", "/watches/apple-watch-series-5-40mm.svg"]
    ]
  },
  {
    name: "Series 4",
    models: [
      ["Apple Watch Series 4 (44mm)", "/watches/apple-watch-series-4-44mm.svg"],
      ["Apple Watch Series 4 (40mm)", "/watches/apple-watch-series-4-40mm.svg"]
    ]
  },
  {
    name: "Series 3",
    models: [
      ["Apple Watch Series 3 (42mm)", "/watches/apple-watch-series-3-42mm.svg"],
      ["Apple Watch Series 3 (38mm)", "/watches/apple-watch-series-3-38mm.svg"]
    ]
  },
  {
    name: "Series 2",
    models: [
      ["Apple Watch Series 2 (42mm)", "/watches/apple-watch-series-2-42mm.svg"],
      ["Apple Watch Series 2 (38mm)", "/watches/apple-watch-series-2-38mm.svg"]
    ]
  },
  {
    name: "Series 1",
    models: [
      ["Apple Watch Series 1 (42mm)", "/watches/apple-watch-series-1-42mm.svg"],
      ["Apple Watch Series 1 (38mm)", "/watches/apple-watch-series-1-38mm.svg"]
    ]
  },
  {
    name: "1st Gen",
    models: [
      ["Apple Watch (1st generation, 42mm)", "/watches/apple-watch-1st-generation-42mm.svg"],
      ["Apple Watch (1st generation, 38mm)", "/watches/apple-watch-1st-generation-38mm.svg"]
    ]
  }
];

const appleIphoneOfficial: Array<[string, string]> = [
  ["Apple iPhone 6", "/apple-official/iphone-6.jpg"],
  ["Apple iPhone 6 Plus", "/apple-official/iphone-6-plus.jpg"],
  ["Apple iPhone 6s", "/apple-official/iphone-6s.jpg"],
  ["Apple iPhone 6s Plus", "/apple-official/iphone-6s-plus.jpg"],
  ["Apple iPhone 7", "/apple-official/iphone-7.jpg"],
  ["Apple iPhone 7 Plus", "/apple-official/iphone-7-plus.jpg"],
  ["Apple iPhone 8", "/apple-official/iphone-8.jpg"],
  ["Apple iPhone 8 Plus", "/apple-official/iphone-8-plus.jpg"],
  ["Apple iPhone X", "/apple-official/iphone-x.jpg"],
  ["Apple iPhone XR", "/apple-official/iphone-xr.jpg"],
  ["Apple iPhone XS", "/apple-official/iphone-xs.jpg"],
  ["Apple iPhone XS Max", "/apple-official/iphone-xs-max.jpg"],
  ["Apple iPhone SE (2020)", "/apple-official/iphone-se-2020.jpg"],
  ["Apple iPhone 11", "/apple-official/iphone-11.jpg"],
  ["Apple iPhone 11 Pro", "/apple-official/iphone-11-pro.jpg"],
  ["Apple iPhone 11 Pro Max", "/apple-official/iphone-11-pro-max.jpg"],
  ["Apple iPhone 12 Mini", "/apple-official/iphone-12-mini.jpg"],
  ["Apple iPhone 12", "/apple-official/iphone-12.jpg"],
  ["Apple iPhone 12 Pro", "/apple-official/iphone-12-pro.jpg"],
  ["Apple iPhone 12 Pro Max", "/apple-official/iphone-12-pro-max.jpg"],
  ["Apple iPhone SE (2022)", "/apple-official/iphone-se-2022.jpg"],
  ["Apple iPhone 13 Mini", "/apple-official/iphone-13-mini.jpg"],
  ["Apple iPhone 13", "/apple-official/iphone-13.jpg"],
  ["Apple iPhone 13 Pro", "/apple-official/iphone-13-pro.jpg"],
  ["Apple iPhone 13 Pro Max", "/apple-official/iphone-13-pro-max.jpg"],
  ["Apple iPhone 14", "/apple-official/iphone-14.jpg"],
  ["Apple iPhone 14 Plus", "/apple-official/iphone-14-plus.jpg"],
  ["Apple iPhone 14 Pro", "/apple-official/iphone-14-pro.jpg"],
  ["Apple iPhone 14 Pro Max", "/apple-official/iphone-14-pro-max.jpg"],
  ["Apple iPhone 15", "/apple-official/iphone-15.jpg"],
  ["Apple iPhone 15 Plus", "/apple-official/iphone-15-plus.jpg"],
  ["Apple iPhone 15 Pro", "/apple-official/iphone-15-pro.jpg"],
  ["Apple iPhone 15 Pro Max", "/apple-official/iphone-15-pro-max.jpg"],
  ["Apple iPhone 16e", "/apple-official/iphone-16e.jpg"],
  ["Apple iPhone 16", "/apple-official/iphone-16.jpg"],
  ["Apple iPhone 16 Plus", "/apple-official/iphone-16-plus.jpg"],
  ["Apple iPhone 16 Pro", "/apple-official/iphone-16-pro.jpg"],
  ["Apple iPhone 16 Pro Max", "/apple-official/iphone-16-pro-max.jpg"],
  ["Apple iPhone Air", "/apple-official/iphone-air.jpg"],
  ["Apple iPhone 17e", "/apple-official/iphone-17e.jpg"],
  ["Apple iPhone 17", "/apple-official/iphone-17.jpg"],
  ["Apple iPhone 17 Pro", "/apple-official/iphone-17-pro.jpg"],
  ["Apple iPhone 17 Pro Max", "/apple-official/iphone-17-pro-max.jpg"]
];

const appleIpadOfficial: Array<[string, string]> = [
  ["Apple iPad (7th Gen)", "/apple-official/ipad-7.jpg"],
  ["Apple iPad Air (3rd Gen)", "/apple-official/ipad-air-3.jpg"],
  ["Apple iPad Pro 11-inch (2020)", "/apple-official/ipad-pro-11-2020.jpg"],
  ["Apple iPad Pro 12.9-inch (2020)", "/apple-official/ipad-pro-12-2020.jpg"],
  ["Apple iPad (8th Gen)", "/apple-official/ipad-8.jpg"],
  ["Apple iPad mini (5th Gen)", "/apple-official/ipad-mini-5.jpg"],
  ["Apple iPad Pro 11-inch (2021)", "/apple-official/ipad-pro-11-2021.jpg"],
  ["Apple iPad Pro 12.9-inch (2021)", "/apple-official/ipad-pro-12-2021.jpg"],
  ["Apple iPad Air (4th Gen)", "/apple-official/ipad-air-4.jpg"],
  ["Apple iPad (9th Gen)", "/apple-official/ipad-9.jpg"],
  ["Apple iPad mini (6th Gen)", "/apple-official/ipad-mini-6.jpg"],
  ["Apple iPad (10th Gen)", "/apple-official/ipad-10.jpg"],
  ["Apple iPad Pro 11-inch (2022)", "/apple-official/ipad-pro-11-2022.jpg"],
  ["Apple iPad Pro 12.9-inch (2022)", "/apple-official/ipad-pro-12-2022.jpg"],
  ["Apple iPad Air (5th Gen)", "/apple-official/ipad-air-5.jpg"],
  ["Apple iPad mini (7th Gen)", "/apple-official/ipad-mini-7.jpg"],
  ["Apple iPad (11th Gen)", "/apple-official/ipad-11.jpg"],
  ["Apple iPad Air 11-inch (2025)", "/apple-official/ipad-air-11-2025.jpg"],
  ["Apple iPad Air 13-inch (2025)", "/apple-official/ipad-air-13-2025.jpg"],
  ["Apple iPad Pro 11-inch (M5)", "/apple-official/ipad-pro-11-2025.jpg"],
  ["Apple iPad Pro 13-inch (M5)", "/apple-official/ipad-pro-13-2025.jpg"],
  ["Apple iPad Air 11-inch (2026)", "/apple-official/ipad-air-11-2026.jpg"],
  ["Apple iPad Air 13-inch (2026)", "/apple-official/ipad-air-13-2026.jpg"]
];

const appleMacbookOfficial: Array<[string, string]> = [
  ["Apple MacBook Pro 13-inch (2017)", "/apple-official/mbp-13-2017.jpg"],
  ["Apple MacBook Pro 15-inch (2018)", "/apple-official/mbp-15-2018.jpg"],
  ["Apple MacBook Air (2018)", "/apple-official/mba-13-2018.jpg"],
  ["Apple MacBook Pro 16-inch (2019)", "/apple-official/mbp-16-2019.jpg"],
  ["Apple MacBook Air (M1, 2020)", "/apple-official/mba-13-2020.jpg"],
  ["Apple MacBook Pro 14-inch (2021)", "/apple-official/mbp-14-2021.jpg"],
  ["Apple MacBook Pro 16-inch (2021)", "/apple-official/mbp-16-2021.jpg"],
  ["Apple MacBook Air 13-inch (M2, 2022)", "/apple-official/mba-13-2022.jpg"],
  ["Apple MacBook Pro 13-inch (M2, 2022)", "/apple-official/mbp-13-2022.jpg"],
  ["Apple MacBook Air 15-inch (M2, 2023)", "/apple-official/mba-15-2023.jpg"],
  ["Apple MacBook Pro 14-inch (M3, 2023)", "/apple-official/mbp-14-2023.jpg"],
  ["Apple MacBook Pro 16-inch (M3, 2023)", "/apple-official/mbp-16-2023.jpg"],
  ["Apple MacBook Air 13-inch (M3, 2024)", "/apple-official/mba-13-2024.jpg"],
  ["Apple MacBook Air 15-inch (M3, 2024)", "/apple-official/mba-15-2024.jpg"],
  ["Apple MacBook Pro 14-inch (M4, 2024)", "/apple-official/mbp-14-2024.jpg"],
  ["Apple MacBook Pro 16-inch (M4, 2024)", "/apple-official/mbp-16-2024.jpg"],
  ["Apple MacBook Air 13-inch (M4, 2025)", "/apple-official/mba-13-2025.jpg"],
  ["Apple MacBook Air 15-inch (M4, 2025)", "/apple-official/mba-15-2025.jpg"],
  ["Apple MacBook Pro 14-inch (M5)", "/apple-official/mbp-14-2025.jpg"],
  ["Apple MacBook Pro 16-inch (M5 Pro/Max)", "/apple-official/mbp-16-2025.jpg"]
];

const samsungWatchNames: Array<[string, string]> = [
  ["Samsung Galaxy Watch 4", "/watches/galaxy-watch-4.jpg"],
  ["Samsung Galaxy Watch", "/watches/galaxy-watch-42mm.jpg"]
];

function seriesFrom(names: string[], size: number) {
  return Array.from({ length: Math.ceil(names.length / size) }, (_, index) => {
    const models = names.slice(index * size, index * size + size);
    const label = models[0]?.replace(/^Apple /, "").replace(/^Samsung /, "").split(" ").slice(0, 3).join(" ") || "Models";
    return { name: `${label} Series`, models };
  });
}

const phoneFallback = "/refurbished/phonebot-0108.jpg";
const samsungFallback = "/refurbished/phonebot-0129.jpg";
const laptopFallback = "/refurbished/phonebot-0228.jpg";

// Strip storage/condition/variant noise from a stock listing title so devices can be
// grouped into one clean model name, e.g. "Samsung Galaxy S24 Ultra 5G (256GB)" -> "Samsung Galaxy S24 Ultra".
function cleanStockName(title: string) {
  return title
    .replace(/\s*\|\s*DeGoogled.*$/i, "")
    .replace(/\s*-\s*Chinese Version.*$/i, "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .replace(/\bWiFi Cellular\b/gi, "")
    .replace(/\bWifi Cellular\b/gi, "")
    .replace(/\bWiFi\b/gi, "")
    .replace(/\bWifi\b/gi, "")
    .replace(/\bDual Sim\b/gi, "")
    .replace(/\b5G\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Build a device list directly from real refurbished-stock photos, deduped to one entry per
// clean model name. This guarantees every device shown has an actual, correctly matched photo -
// no generic fallback images standing in for a device we don't have a real picture of.
function devicesFromStock(brandMatch: string, category: RepairDevice["type"], brandLabel: string): RepairDevice[] {
  const seen = new Map<string, RepairDevice>();
  for (const item of refurbishedDevices) {
    if (item.brand.toLowerCase() !== brandMatch.toLowerCase() || item.category !== category) continue;
    const clean = cleanStockName(item.title);
    if (!clean || seen.has(clean)) continue;
    seen.set(clean, {
      brand: brandLabel,
      brandSlug: slugify(brandLabel),
      name: clean,
      slug: slugify(clean),
      type: category,
      image: item.image
    });
  }
  return [...seen.values()];
}

// Brands below are built from real refurbished-stock photos (devicesFromStock) wherever we
// have them, so every listed device has a guaranteed accurate picture. OnePlus, Realme, Sony
// and Microsoft currently have zero real stock photos in refurbished-stock.ts - see the note
// in CHANGELOG.md / 05-Development.md about how those are being handled for now.
export const repairBrands: RepairBrand[] = [
  {
    name: "Apple",
    slug: "apple",
    deviceTypes: ["Phone", "Tablet", "Laptop", "Smartwatch"],
    series: [
      { name: "iPhone Series", models: appleIphoneOfficial.map((pair) => makeApplePhoneDevice(pair)) },
      { name: "iPad Series", models: appleIpadOfficial.map((pair) => makeDeviceWithImage("Apple", "Tablet", pair)) },
      { name: "MacBook Series", models: appleMacbookOfficial.map((pair) => makeDeviceWithImage("Apple", "Laptop", pair)) },
      ...appleWatchSeriesOfficial.map((series) => ({
        name: series.name,
        models: series.models.map((pair) => makeDeviceWithImage("Apple", "Smartwatch", pair))
      }))
    ]
  },
  {
    name: "Samsung",
    slug: "samsung",
    deviceTypes: ["Phone", "Tablet", "Smartwatch"],
    series: [
      { name: "Galaxy Series", models: devicesFromStock("Samsung", "Phone", "Samsung") },
      { name: "Galaxy Tab Series", models: devicesFromStock("Samsung", "Tablet", "Samsung") },
      { name: "Galaxy Watch Series", models: samsungWatchNames.map((pair) => makeDeviceWithImage("Samsung", "Smartwatch", pair)) }
    ]
  },
  {
    name: "Google",
    slug: "google",
    deviceTypes: ["Phone"],
    series: [{ name: "Pixel Series", models: devicesFromStock("Google", "Phone", "Google") }]
  },
  {
    name: "OnePlus",
    slug: "oneplus",
    deviceTypes: ["Phone"],
    series: [{ name: "OnePlus Series", models: oneplusNames.map((model) => makeDevice("OnePlus", "Phone", model, samsungFallback)) }]
  },
  {
    name: "Microsoft",
    slug: "microsoft",
    deviceTypes: ["Laptop"],
    series: [{ name: "Laptop and Surface Series", models: laptopNames.map((model) => makeDevice(model.split(" ")[0], "Laptop", model, laptopFallback)) }]
  },
  {
    name: "Huawei",
    slug: "huawei",
    deviceTypes: ["Phone"],
    series: [{ name: "Huawei Series", models: devicesFromStock("Huawei", "Phone", "Huawei") }]
  },
  {
    name: "Oppo",
    slug: "oppo",
    deviceTypes: ["Phone"],
    series: [{ name: "Oppo Series", models: devicesFromStock("OPPO", "Phone", "Oppo") }]
  },
  {
    name: "Vivo",
    slug: "vivo",
    deviceTypes: ["Phone"],
    series: [{ name: "Vivo Series", models: devicesFromStock("Vivo", "Phone", "Vivo") }]
  },
  {
    name: "Realme",
    slug: "realme",
    deviceTypes: ["Phone"],
    series: [{ name: "Realme Series", models: realmeNames.map((model) => makeDevice("Realme", "Phone", model, samsungFallback)) }]
  },
  {
    name: "Xiaomi",
    slug: "xiaomi",
    deviceTypes: ["Phone"],
    series: [{ name: "Xiaomi Series", models: devicesFromStock("Xiaomi", "Phone", "Xiaomi") }]
  },
  {
    name: "Honor",
    slug: "honor",
    deviceTypes: ["Phone"],
    series: [{ name: "Honor Series", models: devicesFromStock("Honor", "Phone", "Honor") }]
  },
  {
    name: "Motorola",
    slug: "motorola",
    deviceTypes: ["Phone"],
    series: [{ name: "Motorola Series", models: devicesFromStock("Motorola", "Phone", "Motorola") }]
  },
  {
    name: "Sony",
    slug: "sony",
    deviceTypes: ["Phone"],
    series: [{ name: "Sony Xperia Series", models: sonyNames.map((model) => makeDevice("Sony", "Phone", model, samsungFallback)) }]
  }
];

export const allRepairDevices = repairBrands.flatMap((brand) => brand.series.flatMap((series) => series.models));

export const repairOptions: RepairOption[] = [
  {
    id: "screen",
    slug: "screen-repair",
    title: "Screen Repair",
    icon: "▯",
    summary: "Cracked glass, touch faults, lines, black display or flickering.",
    price: 129,
    warranty: "1 year warranty",
    badge: "starting from",
    choices: [
      { id: "aftermarket-screen", title: "Aftermarket Screen", text: "Affordable screen with standard display and touch performance.", price: 129, rating: 3 },
      { id: "premium-screen", title: "Premium Screen", text: "Better brightness, colour and touch response for everyday use.", price: 189, rating: 4 },
      { id: "genuine-screen", title: "Genuine Screen", text: "Highest-grade option where available for closer factory feel.", price: 249, rating: 5 }
    ]
  },
  {
    id: "battery",
    slug: "battery-repair",
    title: "Battery Repair",
    icon: "▰",
    summary: "Battery drains quickly, shuts off, swells or no longer holds charge.",
    price: 89,
    warranty: "1 year warranty",
    badge: "starting from",
    choices: [
      { id: "standard-battery", title: "Standard Battery", text: "Reliable replacement that restores normal battery life.", price: 89, rating: 3 },
      { id: "premium-battery", title: "Premium Battery", text: "Higher quality cell designed for stronger long-term performance.", price: 119, rating: 5 }
    ]
  },
  { id: "charging", slug: "charging-port-repair", title: "Charging Port Repair", icon: "⌁", summary: "Cable must be held at an angle or device will not charge.", price: 99, warranty: "1 year warranty" },
  { id: "back-glass", slug: "back-glass-repair", title: "Back Glass Repair", icon: "▧", summary: "Rear glass is cracked, shattered or unsafe to handle.", price: 99, warranty: "1 year warranty" },
  { id: "diagnose", slug: "diagnostic", title: "Diagnose Issue", icon: "⌕", summary: "Not sure what is wrong? We inspect first and guide the best path.", price: 39, warranty: "Diagnostic report" },
  { id: "water", slug: "liquid-damage-repair", title: "Liquid Damage Repair", icon: "≈", summary: "Device was exposed to water or liquid and is malfunctioning.", price: null, warranty: "Inspection required", badge: "quote" },
  { id: "data", slug: "data-recovery", title: "Data Recovery Service", icon: "◇", summary: "Device is damaged or unresponsive and important files need recovery.", price: null, warranty: "Assessment required", badge: "quote" },
  { id: "motherboard", slug: "motherboard-repair", title: "Motherboard Repair", icon: "▣", summary: "No power, boot loop, board-level fault or deep internal issue.", price: 39, warranty: "Diagnostic required", badge: "inspection" },
  { id: "camera", slug: "camera-repair", title: "Camera Repair", icon: "◉", summary: "Blurry camera, camera glass, rear camera or selfie camera fault.", price: 79, warranty: "1 year warranty" },
  { id: "speaker", slug: "speaker-repair", title: "Speaker / Earpiece Repair", icon: "◒", summary: "No sound, quiet audio, distorted speaker or poor call audio.", price: 69, warranty: "1 year warranty" },
  { id: "software", slug: "software-repair", title: "Software Repair", icon: "⌘", summary: "Slow device, update problem, lockup, reset or software fault.", price: 59, warranty: "30 day support" }
];

export function findBrand(slug?: string) {
  return repairBrands.find((brand) => brand.slug === slug) || repairBrands[0];
}

export function findDevice(slug?: string) {
  return allRepairDevices.find((device) => device.slug === slug);
}

export function findRepair(slug?: string) {
  return repairOptions.find((repair) => repair.slug === slug);
}
