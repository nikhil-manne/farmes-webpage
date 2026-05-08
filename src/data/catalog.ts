import tomato from "@/assets/veg-tomato.jpg";
import spinach from "@/assets/veg-spinach.jpg";
import carrot from "@/assets/veg-carrot.jpg";
import broccoli from "@/assets/veg-broccoli.jpg";
import pepper from "@/assets/veg-pepper.jpg";
import cucumber from "@/assets/veg-cucumber.jpg";
import farmer1 from "@/assets/farmer-1.jpg";
import farm1 from "@/assets/farm-1.jpg";
import farm2 from "@/assets/farm-2.jpg";
import farm3 from "@/assets/farm-3.jpg";

export type Vegetable = {
  id: string;
  name: string;
  image: string;
  pricePerKg: number;
  unit: string;
  farmerId: string;
  farmerName: string;
  category: string;
  description: string;
  tags: string[];
};

export type Farmer = {
  id: string;
  name: string;
  location: string;
  bio: string;
  avatar: string;
  gallery: string[];
  yearsFarming: number;
};

export const farmers: Farmer[] = [
  {
    id: "f1",
    name: "Ramesh Patel",
    location: "Nashik, Maharashtra",
    bio: "Third-generation farmer practicing chemical-free, regenerative agriculture across 12 acres of family land.",
    avatar: farmer1,
    gallery: [farm1, farm2, farm3, farm1, farm2, farm3],
    yearsFarming: 22,
  },
];

export const categories = ["All", "Leafy", "Roots", "Fruiting", "Cruciferous", "Gourds"];

export const vegetables: Vegetable[] = [
  { id: "v1", name: "Vine Tomatoes", image: tomato, pricePerKg: 60, unit: "kg", farmerId: "f1", farmerName: "Ramesh Patel", category: "Fruiting",
    description: "Hand-picked vine-ripened tomatoes, sun-grown for natural sweetness. Harvested the morning of delivery.",
    tags: ["Organic", "Pesticide-free", "Sun-ripened"] },
  { id: "v2", name: "Baby Spinach", image: spinach, pricePerKg: 45, unit: "bunch", farmerId: "f1", farmerName: "Ramesh Patel", category: "Leafy",
    description: "Tender baby spinach leaves, grown in nutrient-rich soil. Perfect for salads and quick sautés.",
    tags: ["Organic", "Iron-rich"] },
  { id: "v3", name: "Heritage Carrots", image: carrot, pricePerKg: 50, unit: "kg", farmerId: "f1", farmerName: "Ramesh Patel", category: "Roots",
    description: "Naturally sweet carrots with their leafy tops still attached, a sign of true freshness.",
    tags: ["Heirloom", "Sweet"] },
  { id: "v4", name: "Green Broccoli", image: broccoli, pricePerKg: 90, unit: "head", farmerId: "f1", farmerName: "Ramesh Patel", category: "Cruciferous",
    description: "Crisp, dense broccoli florets harvested at peak maturity for full flavour and nutrition.",
    tags: ["Organic"] },
  { id: "v5", name: "Red Bell Peppers", image: pepper, pricePerKg: 120, unit: "kg", farmerId: "f1", farmerName: "Ramesh Patel", category: "Fruiting",
    description: "Glossy red peppers, sweet and juicy. Greenhouse-grown without synthetic chemicals.",
    tags: ["Sweet"] },
  { id: "v6", name: "English Cucumber", image: cucumber, pricePerKg: 35, unit: "kg", farmerId: "f1", farmerName: "Ramesh Patel", category: "Gourds",
    description: "Cool, crisp cucumbers with thin skin. Excellent hydration straight from the vine.",
    tags: ["Crisp"] },
];

export const getVegetable = (id: string) => vegetables.find(v => v.id === id);
export const getFarmer = (id: string) => farmers.find(f => f.id === id);
