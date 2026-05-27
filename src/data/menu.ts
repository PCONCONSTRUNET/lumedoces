import heroBurger from "@/assets/hero-burger.jpg";
import fries from "@/assets/fries.jpg";
import maxCheddar from "@/assets/max-cheddar.jpg";
import maxCheddarTriplo from "@/assets/max-cheddar-triplo.jpg";
import combo from "@/assets/combo.jpg";

export type Addon = { name: string; price: number };
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "lanches" | "porcoes" | "combos" | "tabuas";
  featured?: boolean;
  addons?: Addon[];
};

const burgerAddons: Addon[] = [
  { name: "Bacon", price: 7 },
  { name: "Calabresa", price: 7 },
  { name: "Carne", price: 7 },
  { name: "Cebola", price: 2 },
  { name: "Cheddar", price: 3 },
  { name: "Coração", price: 7 },
  { name: "Coxinha da Asa", price: 7 },
  { name: "Ovo", price: 3 },
  { name: "Queijo", price: 3 },
];

export const products: Product[] = [
  {
    id: "batata-frita-1kg",
    name: "Batata Frita (1kg)",
    description: "Mega porção de batatas fritas para compartilhar",
    price: 48,
    image: fries,
    category: "porcoes",
    featured: true,
    addons: burgerAddons,
  },
  {
    id: "max-cheddar-triplo",
    name: "Max Cheddar Triplo",
    description: "Triplo hambúrguer com muito cheddar cremoso e cebola caramelizada",
    price: 30,
    image: maxCheddarTriplo,
    category: "lanches",
    featured: true,
    addons: burgerAddons,
  },
  {
    id: "max-cheddar",
    name: "Max Cheddar",
    description: "Hambúrguer artesanal com cheddar cremoso e cebola caramelizada",
    price: 25,
    image: maxCheddar,
    category: "lanches",
    addons: burgerAddons,
  },
  {
    id: "combo-classico",
    name: "Combo Clássico",
    description: "Burger artesanal, queijo, presunto, bacon + batata + refri",
    price: 50,
    image: combo,
    category: "combos",
    featured: true,
    addons: burgerAddons,
  },
  {
    id: "demarch-especial",
    name: "Demarch Especial",
    description: "O lanche da casa: pão brioche, blend 180g, bacon e cheddar duplo",
    price: 35,
    image: heroBurger,
    category: "lanches",
    addons: burgerAddons,
  },
  {
    id: "tabua-familia",
    name: "Tábua da Família",
    description: "4 lanches + 2 porções de batata para dividir",
    price: 120,
    image: combo,
    category: "tabuas",
  },
  {
    id: "porcao-frango",
    name: "Porção Frango Crispy",
    description: "500g de frango empanado crocante com molho da casa",
    price: 38,
    image: fries,
    category: "porcoes",
    addons: burgerAddons,
  },
];

export const categories = [
  { id: "lanches", label: "Lanches", emoji: "🍔" },
  { id: "porcoes", label: "Porções", emoji: "🍟" },
  { id: "combos", label: "Combos", emoji: "🎁" },
  { id: "tabuas", label: "Tábuas", emoji: "🥩" },
] as const;
