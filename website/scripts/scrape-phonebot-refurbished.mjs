import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const publicDir = path.join(root, "public", "refurbished");
const outputFile = path.join(root, "lib", "refurbished-stock.ts");
const baseUrl = "https://www.phonebot.com.au/index.php?route=product/category/loadMoreProducts";

const categories = [
  { path: "133", category: "Phone", label: "Refurbished phones" },
  { path: "106", category: "Tablet", label: "Tablets" },
  { path: "139", category: "Laptop", label: "Laptops" }
];

const limit = 100;

function money(value) {
  const raw = String(value || "").replace(/[^\d.]/g, "");
  return Math.round(Number(raw || 0));
}

function conditionFrom(name) {
  return name.match(/\[(.*?)\]/)?.[1] || name.match(/\b(Grade [ABC]|Like New|Brand New)\b/i)?.[1] || "Checked";
}

function cleanTitle(name) {
  return String(name || "")
    .replace(/\s*\[[^\]]+\]\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extFromUrl(url) {
  const clean = String(url || "").split("?")[0];
  const ext = path.extname(clean).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? ext : ".jpg";
}

function slugify(input) {
  return String(input || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 70);
}

function escapeString(value) {
  return JSON.stringify(String(value || ""));
}

async function fetchProducts(category) {
  const found = [];
  for (let start = 0; start < 5000; start += limit) {
    const url = `${baseUrl}&path=${category.path}&start=${start}&limit=${limit}&sort=p.price&order=ASC&grade=0`;
    const response = await fetch(url, { headers: { "user-agent": "Casey stock import" } });
    if (!response.ok) throw new Error(`Fetch failed ${response.status} for ${url}`);
    const payload = await response.json();
    const products = Array.isArray(payload.products) ? payload.products : [];
    if (products.length === 0) break;

    for (const product of products) {
      const sourcePrice = money(product.special || product.price || product.schema_product_special);
      if (!sourcePrice || !product.name || !product.thumb) continue;
      found.push({ ...product, sourcePrice, importedCategory: category.category, importedLabel: category.label });
    }

    if (products.length < limit) break;
  }
  return found;
}

async function downloadImage(product, index) {
  const source = String(product.thumb).replace(/\\\//g, "/");
  const ext = extFromUrl(source);
  const file = `phonebot-${String(index + 1).padStart(4, "0")}${ext}`;
  const local = `/refurbished/${file}`;
  const response = await fetch(source, { headers: { "user-agent": "Casey stock import" } });
  if (!response.ok) return source;
  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(path.join(publicDir, file), bytes);
  return local;
}

const allProducts = [];
for (const category of categories) {
  allProducts.push(...await fetchProducts(category));
}

const unique = new Map();
for (const product of allProducts) {
  const key = product.product_id || `${product.name}-${product.sourcePrice}`;
  if (!unique.has(key)) unique.set(key, product);
}

const products = [...unique.values()].sort((a, b) => {
  const typeOrder = { Phone: 0, Tablet: 1, Laptop: 2 };
  return typeOrder[a.importedCategory] - typeOrder[b.importedCategory] || a.sourcePrice - b.sourcePrice;
});

await mkdir(publicDir, { recursive: true });

const devices = [];
for (let index = 0; index < products.length; index += 1) {
  const product = products[index];
  const title = cleanTitle(product.name);
  const sourceUrl = String(product.href || "").replace(/\\\//g, "/");
  const image = await downloadImage(product, index);
  devices.push({
    id: `${product.importedCategory.toLowerCase()}-${product.product_id || slugify(title)}`,
    title,
    category: product.importedCategory,
    condition: conditionFrom(product.name),
    sourcePrice: product.sourcePrice,
    caseyPrice: product.sourcePrice + 50,
    warranty: String(product.free_warranty || (product.importedCategory === "Phone" ? "12 months" : "6 months")).replace(/\s*\(Phonebot\)\s*/i, ""),
    image,
    stock: String(product.productStock || "").toLowerCase().includes("stock") ? "In stock" : "Check availability",
    brand: product.author || title.split(" ")[0],
    sku: product.sku || product.model || "",
    sourceUrl
  });
}

const ts = `export type RefurbishedDevice = {
  id: string;
  title: string;
  category: "Phone" | "Tablet" | "Laptop";
  condition: string;
  sourcePrice: number;
  caseyPrice: number;
  warranty: string;
  image: string;
  stock: string;
  brand: string;
  sku: string;
  sourceUrl: string;
};

export const refurbishedDevices: RefurbishedDevice[] = [
${devices.map((device) => `  {
    id: ${escapeString(device.id)},
    title: ${escapeString(device.title)},
    category: ${escapeString(device.category)} as RefurbishedDevice["category"],
    condition: ${escapeString(device.condition)},
    sourcePrice: ${device.sourcePrice},
    caseyPrice: ${device.caseyPrice},
    warranty: ${escapeString(device.warranty)},
    image: ${escapeString(device.image)},
    stock: ${escapeString(device.stock)},
    brand: ${escapeString(device.brand)},
    sku: ${escapeString(device.sku)},
    sourceUrl: ${escapeString(device.sourceUrl)}
  }`).join(",\n")}
];
`;

await writeFile(outputFile, ts);
console.log(`Imported ${devices.length} refurbished devices into ${outputFile}`);
