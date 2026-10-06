import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Users, Loader2, Phone, ShoppingBag, Calendar, ArrowUpDown, Search } from "lucide-react";
import { useState, useMemo } from "react";
import { formatBRL } from "@/store/cart";
import { ClientDetailsModal } from "@/components/admin/ClientDetailsModal";

export const Route = createFileRoute("/admin/dashboard/clientes")({
  component: ClientesPage,
});

type ClientData = {
  phone: string;
  name: string;
  cpf?: string;
  user_id?: string;
  total_spent: number;
  order_count: number;
  last_order: string;
  first_order: string;
};

function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "order_count" | "total_spent" | "last_order">("last_order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);

  const { data: clients, isLoading } = useQuery({
    queryKey: ["admin-clientes"],
    queryFn: async () => {
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("customer_name, customer_phone, total, created_at, status")
        .in("status", ["delivered", "paid", "completed", "pending", "confirmed", "preparing", "out_for_delivery"]);
        
      if (ordersError) console.error("Orders Error:", ordersError);

      const supabaseUntyped = supabase as any;
      const { data: profilesData, error: profilesError } = await supabaseUntyped
        .from("customer_profiles")
        .select("*");
        
      if (profilesError) console.error("Profiles Error:", profilesError);

      const map = new Map<string, ClientData>();
      
      if (profilesData) {
        profilesData.forEach((profile: any) => {
          const phone = profile.phone?.trim() || "Sem telefone";
          map.set(phone, {
            phone,
            name: profile.full_name?.trim() || "Sem Nome",
            cpf: profile.cpf || "Sem CPF",
            user_id: profile.id,
            total_spent: 0,
            order_count: 0,
            last_order: "-",
            first_order: "-"
          });
        });
      }
      
      if (ordersData) {
        ordersData.forEach((order: any) => {
          const phone = order.customer_phone?.trim() || "Sem telefone";
          const name = order.customer_name?.trim() || "Cliente Desconhecido";
          
          if (!map.has(phone)) {
            map.set(phone, {
              phone,
              name,
              cpf: "Não cadastrado",
              total_spent: order.total,
              order_count: 1,
              last_order: order.created_at,
              first_order: order.created_at
            });
          } else {
            const client = map.get(phone)!;
            client.total_spent += order.total;
            client.order_count += 1;
            
            if (client.last_order === "-" || new Date(order.created_at) > new Date(client.last_order)) {
              client.last_order = order.created_at;
              if (client.name === "Sem Nome") client.name = name;
            }
            if (client.first_order === "-" || new Date(order.created_at) < new Date(client.first_order)) {
              client.first_order = order.created_at;
            }
          }
        });
      }

      return Array.from(map.values());
    }
  });

  const filteredAndSorted = useMemo(() => {
    if (!clients) return [];
    
    let result = clients.filter(c => 
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      c.phone.includes(searchTerm)
    );
    
    result.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];
      
      if (sortBy === "last_order") {
        aVal = a.last_order === "-" ? 0 : new Date(a.last_order).getTime();
        bVal = b.last_order === "-" ? 0 : new Date(b.last_order).getTime();
      }
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    
    return result;
  }, [clients, searchTerm, sortBy, sortOrder]);

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 font-serif text-3xl font-extrabold text-gray-900">
            <Users className="h-8 w-8 text-brand" />
            Clientes
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Base de dados gerada automaticamente a partir dos pedidos concretizados.
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou telefone..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-brand focus:border-brand shadow-sm text-sm"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => toggleSort("name")}>
                  <div className="flex items-center gap-2">Cliente {sortBy === "name" && <ArrowUpDown className="h-3 w-3" />}</div>
                </th>
                <th className="px-6 py-4">Telefone</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => toggleSort("order_count")}>
                  <div className="flex items-center gap-2">Nº Pedidos {sortBy === "order_count" && <ArrowUpDown className="h-3 w-3" />}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => toggleSort("total_spent")}>
                  <div className="flex items-center gap-2">Total Gasto {sortBy === "total_spent" && <ArrowUpDown className="h-3 w-3" />}</div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-gray-100 transition" onClick={() => toggleSort("last_order")}>
                  <div className="flex items-center gap-2">Último Pedido {sortBy === "last_order" && <ArrowUpDown className="h-3 w-3" />}</div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((client) => (
                  <tr key={client.phone} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedClient(client)}>
                    <td className="px-6 py-4 font-bold text-gray-900">{client.name}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="h-4 w-4" /> {client.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        <ShoppingBag className="h-3.5 w-3.5" />
                        {client.order_count}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      {formatBRL(client.total_spent)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-gray-500">
                        <Calendar className="h-4 w-4" />
                        {client.last_order === "-" ? "Nenhuma compra" : new Date(client.last_order).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ClientDetailsModal 
        isOpen={!!selectedClient} 
        onClose={() => setSelectedClient(null)} 
        client={selectedClient} 
      />
    </div>
  );
}
