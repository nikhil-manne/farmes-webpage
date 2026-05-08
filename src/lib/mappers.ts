import apple from "../assets/apple.png";
import bachalakura from "../assets/bachalakura.png";
import banana from "../assets/banana.png";
import beerakaya from "../assets/beerakaya.png";
import brinjal from "../assets/brinjal.png";
import carrot from "../assets/carrot.png";
import chili from "../assets/chili.png";
import chukkakura from "../assets/chukkakura.png";
import dosakaya from "../assets/dosakaya.png";
import gongura from "../assets/gongura.png";
import goruchikkudu from "../assets/goruchikkudu.png";
import grapes from "../assets/grapes.png";
import ivygourd from "../assets/ivygourd.png";
import kakarakaya from "../assets/kakarakaya.png";
import ladyfinger from "../assets/ladyfinger.png";
import mango from "../assets/mango.png";
import mulakkaya from "../assets/mulakkaya.png";
import onion from "../assets/onion.png";
import potato from "../assets/potato.png";
import potlakaya from "../assets/potlakaya.png";
import spinach from "../assets/spinach.png";
import sweetpotato from "../assets/sweetpotato.png";
import thotakura from "../assets/thotakura.png";
import tomato from "../assets/tomato.png";
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
