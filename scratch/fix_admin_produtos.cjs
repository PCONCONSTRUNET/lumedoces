const fs = require('fs');
const file = 'src/routes/admin.dashboard.produtos.tsx';
let code = fs.readFileSync(file, 'utf8');

// Replace load
code = code.replace(
  `  const load = async () => {
    // Supabase desconectado. Usando mock.
    setTimeout(() => {
      setRows([
        { id: "trufa-vegana", name: "Trufa Vegana de Chocolate", base_price: 8.00, is_active: true, category_id: "doces", categories: { name: "Doces Saudáveis" }, image_url: "/src/assets/trufa_vegana.jpg" } as unknown as Product,
        { id: "bolo-pote-vegano", name: "Bolo de Pote Cenoura e Cacau", base_price: 18.00, is_active: true, category_id: "doces", categories: { name: "Doces Saudáveis" }, image_url: "/src/assets/bolo_pote_vegano.jpg" } as unknown as Product,
        { id: "coxinha-vegana", name: "Mini Coxinhas Veganas", base_price: 24.00, is_active: true, category_id: "salgados", categories: { name: "Snacks Saudáveis" }, image_url: "/src/assets/coxinha_vegana.jpg" } as unknown as Product,
        { id: "kombucha-frutas", name: "Kombucha Frutas Vermelhas", base_price: 15.00, is_active: true, category_id: "bebidas", categories: { name: "Bebidas Naturais" }, image_url: "/src/assets/kombucha.jpg" } as unknown as Product
      ]);
    }, 300);
  };`,
  `  const load = async () => {
    const { data, error } = await supabase.from('products').select('*, categories(name)').order('name');
    if (!error && data) {
      setRows(data as any[]);
    } else {
      setRows([]);
    }
  };`
);

// Replace onToggle
code = code.replace(
  `  const onToggle = async (p: Product) => {
    // await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    toast.success("Status atualizado (Mock)");
    load();
  };`,
  `  const onToggle = async (p: Product) => {
    await supabase.from("products").update({ is_active: !p.is_active }).eq("id", p.id);
    toast.success("Status atualizado");
    load();
  };`
);

// Replace onDelete
code = code.replace(
  `  const onDelete = async (p: Product) => {
    if (!confirm(\`Excluir "\${p.name}"?\`)) return;
    // const { error } = await supabase.from("products").delete().eq("id", p.id);
    toast.success("Produto excluído (Mock)");
    setRows(prev => prev ? prev.filter(prod => prod.id !== p.id) : null);
  };`,
  `  const onDelete = async (p: Product) => {
    if (!confirm(\`Excluir "\${p.name}"?\`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (!error) {
      toast.success("Produto excluído");
      setRows(prev => prev ? prev.filter(prod => prod.id !== p.id) : null);
    } else {
      toast.error("Erro ao excluir");
    }
  };`
);

// The page has a mock NovoProdutoDialog below. We should replace it with the real ProdutoWizard!
// We will replace the <NovoProdutoDialog /> with <ProdutoWizard />
const importProdutoWizard = `import { ProdutoWizard } from "@/components/cardapio/ProdutoWizard";`;
if (!code.includes('ProdutoWizard')) {
  code = code.replace(
    'import {',
    `${importProdutoWizard}\nimport {`
  );
}

// In the component:
code = code.replace(
  `      <NovoProdutoDialog
        open={open}
        onOpenChange={setOpen}
        onCreated={() => {
          setOpen(false);
          load();
        }}
      />`,
  `      {open && (
        <ProdutoWizard
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            load();
          }}
          categories={[]}
          initialData={null}
        />
      )}`
);

// I need to provide categories to ProdutoWizard. Let's fetch them in load().
code = code.replace(
  `  const [rows, setRows] = useState<Product[] | null>(null);
  const [open, setOpen] = useState(false);`,
  `  const [rows, setRows] = useState<Product[] | null>(null);
  const [cats, setCats] = useState<Category[]>([]);
  const [open, setOpen] = useState(false);
  const [editingProd, setEditingProd] = useState<any>(null);`
);

code = code.replace(
  `  const load = async () => {
    const { data, error } = await supabase.from('products').select('*, categories(name)').order('name');
    if (!error && data) {
      setRows(data as any[]);
    } else {
      setRows([]);
    }
  };`,
  `  const load = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*, categories(name)').order('name'),
      supabase.from('categories').select('*').order('sort_order')
    ]);
    if (!prodRes.error && prodRes.data) setRows(prodRes.data as any[]);
    else setRows([]);
    if (!catRes.error && catRes.data) setCats(catRes.data as any[]);
  };`
);

// Edit button logic
code = code.replace(
  `                  <button
                    onClick={() => {
                      toast("Abrindo edição (Mock)");
                    }}
                    className="flex items-center gap-1 h-8 px-3 rounded-md text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                  >
                    Editar
                  </button>`,
  `                  <button
                    onClick={() => {
                      setEditingProd(p);
                      setOpen(true);
                    }}
                    className="flex items-center gap-1 h-8 px-3 rounded-md text-sm font-semibold text-gray-600 border border-gray-300 hover:bg-gray-100 transition opacity-0 group-hover:opacity-100"
                  >
                    Editar
                  </button>`
);

// Update modal call
code = code.replace(
  `      {open && (
        <ProdutoWizard
          onClose={() => setOpen(false)}
          onSuccess={() => {
            setOpen(false);
            load();
          }}
          categories={[]}
          initialData={null}
        />
      )}`,
  `      {open && (
        <ProdutoWizard
          onClose={() => {
            setOpen(false);
            setEditingProd(null);
          }}
          onSuccess={() => {
            setOpen(false);
            setEditingProd(null);
            load();
          }}
          categories={cats}
          initialData={editingProd}
        />
      )}`
);

fs.writeFileSync(file, code);
console.log('Done');
