import smashBurger from "@/assets/smash-burger.jpg";
import xSalada from "@/assets/x-salada.jpg";
import fries from "@/assets/fries.jpg";
import soda from "@/assets/soda.jpg";

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
    id: "smash-duplo",
    name: "Smash Duplo c/ Queijo",
    description: "Dois suculentos hambúrgueres smash, queijo derretido, pão brioche amanteigado",
    price: 32,
    image: smashBurger,
    category: "hamburgueres",
    featured: true,
    addons: sauces,
  },
  {
    id: "x-salada-artesanal",
    name: "X-Salada Artesanal",
    description: "Hambúrguer artesanal clássico, alface, tomate, queijo, pão com gergelim",
    price: 28,
    image: xSalada,
    category: "hamburgueres",
    featured: true,
    addons: sauces,
  },
  {
    id: "porcao-fritas",
    name: "Porção de Fritas",
    description: "Fritas douradas e crocantes, acompanha ketchup",
    price: 18,
    image: fries,
    category: "porcoes",
    featured: true,
    addons: sauces,
  },
  {
    id: "refri-lata",
    name: "Refrigerante Lata",
    description: "Refrigerante gelado 350ml",
    price: 6,
    image: soda,
    category: "bebidas",
  },
];

export const categories = [
  { id: "hamburgueres", label: "Hambúrgueres", emoji: "🍔" },
  { id: "porcoes", label: "Porções", emoji: "🍟" },
  { id: "bebidas", label: "Bebidas", emoji: "🥤" },
] as const;
