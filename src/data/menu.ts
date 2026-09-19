import trufaVegana from "@/assets/trufa_vegana.jpg";
import coxinhaVegana from "@/assets/coxinha_vegana.jpg";
import boloPoteVegano from "@/assets/bolo_pote_vegano.jpg";
import kombucha from "@/assets/kombucha.jpg";

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

const extrasDoces: Addon[] = [
  { name: "Cobertura Extra de Cacau", price: 3 },
  { name: "Creme de Avelã Vegano", price: 5 },
  { name: "Calda de Frutas Vermelhas", price: 4 },
];

export const products: Product[] = [
  {
    id: "trufa-vegana",
    name: "Trufa Vegana de Chocolate",
    description: "Deliciosa trufa de chocolate vegano, polvilhada com cacau 100%. Sem lactose e sem açúcar.",
    price: 8,
    image: trufaVegana,
    category: "doces",
    featured: true,
    addons: extrasDoces,
  },
  {
    id: "bolo-pote-vegano",
    name: "Bolo de Pote Cenoura e Cacau",
    description: "Bolo de cenoura vegano intercalado com deliciosa calda de cacau. Sem glúten.",
    price: 18,
    image: boloPoteVegano,
    category: "doces",
    featured: true,
    addons: extrasDoces,
  },
  {
    id: "coxinha-vegana",
    name: "Mini Coxinhas Veganas",
    description: "Porção de mini coxinhas crocantes recheadas de forma 100% vegetal e deliciosa.",
    price: 24,
    image: coxinhaVegana,
    category: "salgados",
    featured: true,
  },
  {
    id: "kombucha-frutas",
    name: "Kombucha Frutas Vermelhas",
    description: "Refrescante bebida probiótica gaseificada com mix de frutas vermelhas. 100% natural.",
    price: 15,
    image: kombucha,
    category: "bebidas",
  },
];

export const categories = [
  { id: "doces", label: "Doces Saudáveis", emoji: "🧁" },
  { id: "salgados", label: "Snacks Saudáveis", emoji: "🥨" },
  { id: "bebidas", label: "Bebidas Naturais", emoji: "🧃" },
] as const;
