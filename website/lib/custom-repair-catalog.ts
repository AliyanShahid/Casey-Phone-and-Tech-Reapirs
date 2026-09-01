"use client";

import {
  allRepairDevices,
  repairOptions,
  slugify,
  type RepairBrand,
  type RepairDevice,
  type RepairOption
} from "@/lib/repair-flow-data";

export const deviceTypes = ["Phone", "Tablet", "Laptop", "Smartwatch"] as const;

export type CustomDeviceType = (typeof deviceTypes)[number];

export type CustomRepairModel = {
  id: string;
  brandName: string;
  brandSlug: string;
  deviceType: CustomDeviceType;
  seriesName: string;
  name: string;
  slug: string;
  image: string;
};

export type CustomRepairCategory = {
  id: string;
  title: string;
  slug: string;
  image: string;
  summary: string;
  warranty: string;
  badge: string;
  basePrice: number | null;
};

export type CustomRepairPrice = {
  id: string;
  modelSlug: string;
  repairSlug: string;
  price: number | null;
};

export type CustomRepairCatalog = {
  models: CustomRepairModel[];
  repairCategories: CustomRepairCategory[];
  prices: CustomRepairPrice[];
};

export const emptyCustomRepairCatalog: CustomRepairCatalog = {
  models: [],
  repairCategories: [],
  prices: []
};

const catalogStorageKey = "casey-repairs-admin-catalog";

function browserReady() {
  return typeof window !== "undefined";
}

export function catalogSlug(value: string) {
  return slugify(value);
}

export function readCustomRepairCatalog(): CustomRepairCatalog {
  if (!browserReady()) return emptyCustomRepairCatalog;

  const saved = window.localStorage.getItem(catalogStorageKey);
  if (!saved) return emptyCustomRepairCatalog;

  try {
    const parsed = JSON.parse(saved) as Partial<CustomRepairCatalog>;
    return {
      models: parsed.models || [],
      repairCategories: parsed.repairCategories || [],
      prices: parsed.prices || []
    };
  } catch {
    return emptyCustomRepairCatalog;
  }
}

export function writeCustomRepairCatalog(catalog: CustomRepairCatalog) {
  if (!browserReady()) return;
  window.localStorage.setItem(catalogStorageKey, JSON.stringify(catalog));
  window.dispatchEvent(new Event("casey-catalog-updated"));
}

export function subscribeCustomRepairCatalog(callback: () => void) {
  if (!browserReady()) return () => {};
  window.addEventListener("casey-catalog-updated", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("casey-catalog-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

export function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function asRepairDevice(model: CustomRepairModel): RepairDevice {
  return {
    brand: model.brandName,
    brandSlug: model.brandSlug,
    name: model.name,
    slug: model.slug,
    type: model.deviceType,
    image: model.image
  };
}

export function mergeRepairBrands(baseBrands: RepairBrand[], catalog: CustomRepairCatalog): RepairBrand[] {
  const brands = baseBrands.map((brand) => ({
    ...brand,
    deviceTypes: [...brand.deviceTypes],
    series: brand.series.map((series) => ({ ...series, models: [...series.models] }))
  }));

  catalog.models.forEach((model) => {
    let brand = brands.find((item) => item.slug === model.brandSlug);
    if (!brand) {
      brand = {
        name: model.brandName,
        slug: model.brandSlug,
        deviceTypes: [],
        series: []
      };
      brands.push(brand);
    }

    if (!brand.deviceTypes.includes(model.deviceType)) {
      brand.deviceTypes.push(model.deviceType);
    }

    let series = brand.series.find((item) => item.name === model.seriesName);
    if (!series) {
      series = { name: model.seriesName, models: [] };
      brand.series.push(series);
    }

    const device = asRepairDevice(model);
    const existingIndex = series.models.findIndex((item) => item.slug === model.slug);
    if (existingIndex >= 0) {
      series.models[existingIndex] = device;
    } else {
      series.models.push(device);
    }
  });

  return brands;
}

export function allManagedRepairDevices(catalog: CustomRepairCatalog) {
  return [...allRepairDevices, ...catalog.models.map(asRepairDevice)];
}

function customCategoryToRepair(category: CustomRepairCategory): RepairOption {
  return {
    id: category.slug,
    slug: category.slug,
    title: category.title,
    icon: category.title.slice(0, 3).toUpperCase(),
    summary: category.summary,
    price: category.basePrice,
    warranty: category.warranty,
    badge: category.badge || undefined,
    image: category.image || undefined
  };
}

export function repairsForDevice(device: RepairDevice | undefined, catalog: CustomRepairCatalog): RepairOption[] {
  const options = [...repairOptions, ...catalog.repairCategories.map(customCategoryToRepair)];
  if (!device) return options;

  return options.map((option) => {
    const override = catalog.prices.find((price) => price.modelSlug === device.slug && price.repairSlug === option.slug);
    if (!override) return option;

    return {
      ...option,
      price: override.price,
      choices: option.choices?.map((choice) => ({ ...choice, price: override.price ?? choice.price }))
    };
  });
}

export function findManagedRepair(slug: string | undefined, catalog: CustomRepairCatalog) {
  if (!slug) return undefined;
  return repairsForDevice(undefined, catalog).find((repair) => repair.slug === slug);
}
