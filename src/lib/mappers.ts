import tomato from "@/assets/products/tomato.png";
import spinach from "@/assets/products/spinach.png";
import sweetpotato from "@/assets/products/sweetpotato.png";
import thotakura from "@/assets/products/thotakura.png";
import sorakaya from "@/assets/products/sorakaya.png";
import potlakaya from "@/assets/products/potlakaya.png";
import potato from "@/assets/products/potato.png";
import palakura from "@/assets/products/palakura.png";
import onion from "@/assets/products/onion.png";
import mulakkaya from "@/assets/products/mulakkaya.png";
import menthikura from "@/assets/products/menthikura.png";
import mango from "@/assets/products/mango.png";
import ladyfinger from "@/assets/products/ladyfinger.png";
import kakarakaya from "@/assets/products/kakarakaya.png";
import ivygourd from "@/assets/products/ivygourd.png";
import grapes from "@/assets/products/grapes.png";
import goruchikkudu from "@/assets/products/goruchikkudu.png";
import gongura from "@/assets/products/gongura.png";
import dosakaya from "@/assets/products/dosakaya.png";
import chukkakura from "@/assets/products/chukkakura.png";
import chili from "@/assets/products/chili.png";
import carrot from "@/assets/products/carrot.png";
import brinjal from "@/assets/products/brinjal.png";
import beerakaya from "@/assets/products/beerakaya.png";
import banana from "@/assets/products/banana.png";
import bachalakura from "@/assets/products/bachalakura.png";
import apple from "@/assets/products/apple.png";
import type { BackendOrderStatus, BackendProduct } from "@/lib/api";

const productImages: Record<string, string> = {
  tomato,
  spinach,
  thotakura,
  gongura,
  chukkakura,
  bachalakura,
  carrot,
  potato,
  sweetpotato,
  onion,
  chili,
  brinjal,
  ladyfinger,
  banana,
  mango,
  apple,
  grapes,
  dosakaya,
  beerakaya,
  potlakaya,
  kakarakaya,
  ivygourd,
  mulakkaya,
  goruchikkudu,
  sorakaya,
  palakura,
  menthikura,
};

const nameAliases: Record<string, string> = {
  "ridge gourd": "beerakaya",
  "bitter gourd": "kakarakaya",
  "snake gourd": "potlakaya",
  "bottle gourd": "sorakaya",
  "ivy gourd": "ivygourd",
  "yellow cucumber": "dosakaya",
  "cluster beans": "goruchikkudu",
  "goru chikkudu": "goruchikkudu",
  "lady finger": "ladyfinger",
  "lady's finger": "ladyfinger",
  "sorrel leaves": "gongura",
  "fenugreek leaves": "menthikura",
  drumstick: "mulakkaya",
  "amaranth leaves": "thotakura",
  "spinach leaves": "palakura",
  okra: "ladyfinger",
  bhindi: "ladyfinger",
  eggplant: "brinjal",
  "sweet potato": "sweetpotato",
  chilli: "chili",
  // Telugu/Hindi aliases from farmer app language mode
  "టమోటా": "tomato",
  "ఉల్లిపాయ": "onion",
  "పాలకూర": "palakura",
  "బంగాళదుంప": "potato",
  "క్యారెట్": "carrot",
  "పచ్చి మిర్చి": "chili",
  "వంకాయ": "brinjal",
  "బెండకాయ": "ladyfinger",
  "దొండకాయ": "ivygourd",
  "గోంగూర": "gongura",
  "తోటకూర": "thotakura",
  "మెంతికూర": "menthikura",
  "చుక్కకూర": "chukkakura",
  "బచ్చలకూర": "bachalakura",
  "దోసకాయ": "dosakaya",
  "బీరకాయ": "beerakaya",
  "సొరకాయ": "sorakaya",
  "పొట్లకాయ": "potlakaya",
  "కాకరకాయ": "kakarakaya",
  "మునగకాయ": "mulakkaya",
  "గోరు చిక్కుడు": "goruchikkudu",
  "చిలగడ దుంప": "sweetpotato",
  "टमाटर": "tomato",
  "प्याज़": "onion",
  "आलू": "potato",
  "पालक": "palakura",
  "गाजर": "carrot",
  "हरी मिर्च": "chili",
  "बैंगन": "brinjal",
  "भिंडी": "ladyfinger",
  "कुंदरू": "ivygourd",
  "अंबाड़ी": "gongura",
  "चौलाई": "thotakura",
  "मेथी": "menthikura",
  "चुक्का साग": "chukkakura",
  "पोई साग": "bachalakura",
  "ककड़ी": "dosakaya",
  "तोरई": "beerakaya",
  "लौकी": "sorakaya",
  "चिचिंडा": "potlakaya",
  "करेला": "kakarakaya",
  "सहजन": "mulakkaya",
  "गवार": "goruchikkudu",
  "शकरकंद": "sweetpotato",
};

const canonicalDisplayNames: Record<string, string> = {
  tomato: "Tomato",
  onion: "Onion",
  potato: "Potato",
  sweetpotato: "Sweet potato",
  spinach: "Spinach",
  carrot: "Carrot",
  chili: "Green chili",
  apple: "Apple",
  banana: "Banana",
  mango: "Mango",
  grapes: "Grapes",
  brinjal: "Brinjal",
  ladyfinger: "Lady finger",
  ivygourd: "Ivy gourd",
  gongura: "Gongura",
  thotakura: "Thotakura",
  palakura: "Palakura",
  menthikura: "Menthikura",
  chukkakura: "Chukkakura",
  bachalakura: "Bachalakura",
  dosakaya: "Dosakaya",
  beerakaya: "Beerakaya",
  sorakaya: "Sorakaya",
  potlakaya: "Potlakaya",
  kakarakaya: "Kakarakaya",
  mulakkaya: "Mulakkaya",
  goruchikkudu: "Goru chikkudu",
};

export function normalizeProductName(productName: string) {
  const normalized = productName.toLowerCase().trim();
  const flat = normalized.replace(/[^a-z0-9]/g, "");
  const key = nameAliases[normalized] ?? nameAliases[flat] ?? flat;
  
  return {
    key,
    label: canonicalDisplayNames[key] ?? productName,
  };
}

export type UiProduct = {
  id: string;
  name: string;
  image: string;
  pricePerKg: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  category: string;
  description: string;
  tags: string[];
  allowedPackSizes: number[];
};

export function getProductImage(productName: string) {
  if (!productName) return tomato;
  
  const raw = productName.toLowerCase().trim();
  const flat = raw.replace(/[^a-z0-9]/g, "");
  
  // 1. Direct match with raw name
  if (productImages[raw]) return productImages[raw];
  
  // 2. Direct match with flat name
  if (productImages[flat]) return productImages[flat];
  
  // 3. Match via aliases
  const aliasKey = nameAliases[raw] || nameAliases[flat];
  if (aliasKey && productImages[aliasKey]) return productImages[aliasKey];

  // 4. Fuzzy match
  for (const key of Object.keys(productImages)) {
    if (flat.includes(key) || key.includes(flat)) return productImages[key];
  }

  // 6. Fuzzy match via aliases
  for (const [alias, key] of Object.entries(nameAliases)) {
    const flatAlias = alias.replace(/\s+/g, "");
    if (flat.includes(flatAlias) || flatAlias.includes(flat)) return productImages[key];
  }

  return tomato;
}

export function getProductCategory(productName: string) {
  const normalized = productName.toLowerCase().trim();
  const leafy = ["palakura", "spinach", "gongura", "menthikura", "thotakura", "chukkakura", "bachalakura", "leaf"];
  const roots = ["carrot", "onion", "potato", "sweetpotato", "radish", "beetroot", "root"];
  const fruiting = ["tomato", "brinjal", "chili", "ladyfinger", "banana", "apple", "mango", "grapes"];
  const cruciferous = ["cabbage", "cauliflower", "broccoli", "cruciferous"];
  const gourds = ["sorakaya", "beerakaya", "dosakaya", "potlakaya", "kakarakaya", "ivygourd", "gourd", "cucumber"];
  if (leafy.some((term) => normalized.includes(term))) return "Leafy";
  if (roots.some((term) => normalized.includes(term))) return "Roots";
  if (fruiting.some((term) => normalized.includes(term))) return "Fruiting";
  if (cruciferous.some((term) => normalized.includes(term))) return "Cruciferous";
  if (gourds.some((term) => normalized.includes(term))) return "Gourds";
  return "Fruiting";
}

export function toUiProduct(product: BackendProduct): UiProduct {
  const normalized = normalizeProductName(product.name);
  return {
    id: product.id,
    name: normalized.label,
    image: getProductImage(normalized.key),
    pricePerKg: Number(product.pricePerKg),
    unit: "kg",
    farmerId: product.farmerId,
    farmerName: product.farmer.user.name || product.farmer.farmName || "Farm Partner",
    farmerLocation: product.farmer.villageOrAddress,
    category: getProductCategory(normalized.key),
    description: `${normalized.label} sourced from ${product.farmer.villageOrAddress}.`,
    tags: ["Fresh", "Farm-direct"],
    allowedPackSizes: (product.allowedPackSizes || ["1.0"]).map(Number),
  };
}

export function toOrderUiStatus(status: BackendOrderStatus): "ordered" | "harvesting" | "packed" | "delivery" | "delivered" {
  if (status === "OUT_FOR_DELIVERY") return "delivery";
  if (status === "DELIVERED") return "delivered";
  if (status === "PACKED") return "packed";
  if (status === "HARVESTING" || status === "LOCKED") return "harvesting";
  return "ordered";
}

export const categories = ["All", "Leafy", "Roots", "Fruiting", "Cruciferous", "Gourds"];
