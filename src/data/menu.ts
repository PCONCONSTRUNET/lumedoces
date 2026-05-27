import heroCoxinha from "@/assets/hero-coxinha.jpg";
import coxinhaFrango from "@/assets/coxinha-frango.jpg";
import coxinhaCatupiry from "@/assets/coxinha-catupiry.jpg";
import coxinhaCheddar from "@/assets/coxinha-cheddar.jpg";
import coxinhaCombo from "@/assets/coxinha-combo.jpg";

const comboImage = "/products/combo.png";

export type Addon = { name: string; price: number };
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured?: boolean;
  addons?: Addon[];
};

const sauces: Addon[] = [
  { name: "Maionese da Casa", price: 3 },
  { name: "Molho Cheddar", price: 5 },
  { name: "Molho Barbecue", price: 4 },
  { name: "Molho Picante", price: 4 },
  { name: "Catupiry Extra", price: 5 },
  { name: "Ketchup", price: 2 },
];

export const products: Product[] = [
  {
    id: "coxinha-frango-50",
    name: "Mini Coxinhas Frango (50un)",
    description: "Cinquenta mini coxinhas de frango desfiado temperado",
    price: 48,
    image: coxinhaFrango,
    category: "salgados",
    featured: true,
    addons: sauces,
  },
  {
    id: "coxinha-catupiry-50",
    name: "Frango c/ Catupiry (50un)",
    description: "Mini coxinhas recheadas com frango e catupiry cremoso",
    price: 55,
    image: coxinhaCatupiry,
    category: "salgados",
    featured: true,
    addons: sauces,
  },
  {
    id: "coxinha-cheddar-50",
    name: "Cheddar Bacon (50un)",
    description: "Mini coxinhas recheadas com cheddar e bacon crocante",
    price: 58,
    image: coxinhaCheddar,
    category: "salgados",
    addons: sauces,
  },
  {
    id: "combo-festa",
    name: "Combo Festa (100un)",
    description: "100 mini coxinhas mistas + 4 molhos da casa",
    price: 110,
    image: comboImage,
    category: "combos",
    featured: true,
    addons: sauces,
  },
  {
    id: "combo-trio",
    name: "Trio Sabores (75un)",
    description: "25 frango + 25 catupiry + 25 cheddar bacon",
    price: 89,
    image: comboImage,
    category: "combos",
    addons: sauces,
  },
  {
    id: "coxinha-frango-25",
    name: "Mini Coxinhas Frango (25un)",
    description: "Porção menor para matar a vontade",
    price: 28,
    image: coxinhaFrango,
    category: "salgados",
    addons: sauces,
  },
  {
    id: "brigadeiro-20",
    name: "Brigadeiros Gourmet (20un)",
    description: "Brigadeiros tradicionais com granulado belga",
    price: 35,
    image: coxinhaCatupiry,
    category: "doces",
  },
  {
    id: "refri-2l",
    name: "Refrigerante 2L",
    description: "Coca-Cola, Guaraná ou Fanta — escolha na observação",
    price: 12,
    image: coxinhaCombo,
    category: "bebidas",
  },
];

export const categories = [
  { id: "salgados", label: "Salgados", emoji: "🍗" },
  { id: "combos", label: "Combos", emoji: "🎉" },
  { id: "doces", label: "Doces", emoji: "🍫" },
  { id: "bebidas", label: "Bebidas", emoji: "🥤" },
] as const;
