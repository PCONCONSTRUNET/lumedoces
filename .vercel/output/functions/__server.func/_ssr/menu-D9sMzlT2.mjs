const trufaVegana = "/assets/trufa_vegana-C9CglMzG.jpg";
const coxinhaVegana = "/assets/coxinha_vegana-CGZPxwJA.jpg";
const boloPoteVegano = "/assets/bolo_pote_vegano-B0WCN81_.jpg";
const kombucha = "/assets/kombucha-Bfn1o2bN.jpg";
const geladinhoGourmet = "/assets/geladinho_gourmet-DzYVwLPr.jpg";
const boloPoteSemLactose = "/assets/bolo_pote_sem_lactose-CZ2tmARS.jpg";
const extrasDoces = [
  { name: "Cobertura Extra de Cacau", price: 3 },
  { name: "Creme de Avelã Vegano", price: 5 },
  { name: "Calda de Frutas Vermelhas", price: 4 }
];
const products = [
  {
    id: "geladinho-gourmet-sem-lactose",
    name: "Geladinho Gourmet Sem Lactose",
    description: "Cremoso geladinho gourmet sabor coco com chocolate. 100% livre de lactose e super refrescante.",
    price: 6.5,
    image: geladinhoGourmet,
    category: "doces",
    featured: true
  },
  {
    id: "bolo-pote-sem-lactose",
    name: "Bolo de Pote Sem Lactose",
    description: "Delicioso bolo de pote com camadas de bolo de chocolate molhadinho e mousse cremoso sem lactose.",
    price: 19.9,
    image: boloPoteSemLactose,
    category: "doces",
    featured: true,
    addons: extrasDoces
  },
  {
    id: "trufa-vegana",
    name: "Trufa Vegana de Chocolate",
    description: "Deliciosa trufa de chocolate vegano, polvilhada com cacau 100%. Sem lactose e sem açúcar.",
    price: 8,
    image: trufaVegana,
    category: "doces",
    featured: true,
    addons: extrasDoces
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
    options: [
      {
        name: "Escolha a Calda",
        min: 1,
        max: 1,
        items: [
          { name: "Calda de Cacau 100%", price: 0 },
          { name: "Calda de Frutas Vermelhas", price: 3 },
          { name: "Sem Calda", price: 0 }
        ]
      }
    ]
  },
  {
    id: "coxinha-vegana",
    name: "Mini Coxinhas Veganas",
    description: "Porção de mini coxinhas crocantes recheadas de forma 100% vegetal e deliciosa.",
    price: 24,
    image: coxinhaVegana,
    category: "salgados",
    featured: true
  },
  {
    id: "kombucha-frutas",
    name: "Kombucha Frutas Vermelhas",
    description: "Refrescante bebida probiótica gaseificada com mix de frutas vermelhas. 100% natural.",
    price: 15,
    image: kombucha,
    category: "bebidas"
  }
];
const categories = [
  { id: "doces", name: "Doces Saudáveis", emoji: "🧁" },
  { id: "salgados", name: "Snacks Saudáveis", emoji: "🥨" },
  { id: "bebidas", name: "Bebidas Naturais", emoji: "🧃" }
];
export {
  categories as c,
  products as p
};
