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
  palakura,
  thotakura,
  gongura,
  menthikura,
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
  sorakaya,
  beerakaya,
  potlakaya,
  kakarakaya,
  ivygourd,
  mulakkaya,
  goruchikkudu,
};

const nameAliases: Record<string, string> = {
  "ridge gourd": "beerakaya",
  "bitter gourd": "kakarakaya",
  "snake gourd": "potlakaya",
  "bottle gourd": "sorakaya",
  "ivy gourd": "ivygourd",
  "yellow cucumber": "dosakaya",
  "cluster beans": "goruchikkudu",
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
};

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
};

function getProductImage(productName: string) {
  const normalized = productName.toLowerCase().trim();
  if (productImages[normalized]) return productImages[normalized];
  if (nameAliases[normalized] && productImages[nameAliases[normalized]]) return productImages[nameAliases[normalized]];
  for (const key of Object.keys(productImages)) {
    if (normalized.includes(key) || key.includes(normalized)) return productImages[key];
  }
  for (const [alias, key] of Object.entries(nameAliases)) {
    if (normalized.includes(alias) || alias.includes(normalized)) return productImages[key];
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
  return {
    id: product.id,
    name: product.name,
    image: getProductImage(product.name),
    pricePerKg: Number(product.pricePerKg),
    unit: "kg",
    farmerId: product.farmerId,
    farmerName: product.farmer.user.name || product.farmer.farmName || "Farm Partner",
    farmerLocation: product.farmer.villageOrAddress,
    category: getProductCategory(product.name),
    description: `${product.name} sourced from ${product.farmer.villageOrAddress}.`,
    tags: ["Fresh", "Farm-direct"],
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
