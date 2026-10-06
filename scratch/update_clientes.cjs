const fs = require('fs');
let filePath = 'src/routes/admin.dashboard.clientes.tsx';
let code = fs.readFileSync(filePath, 'utf8');

// Update ClientData type
code = code.replace(
`type ClientData = {
  phone: string;
  name: string;
  total_spent: number;
  order_count: number;
  last_order: string;
  first_order: string;
};`,
`type ClientData = {
  phone: string;
  name: string;
  cpf?: string;
  total_spent: number;
  order_count: number;
  last_order: string;
  first_order: string;
};`);

// Replace the queryFn
const oldQueryFn = `    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("customer_name, customer_phone, total, created_at, status")
        .in("status", ["delivered", "paid"]);
        
      if (error) {
        console.error("Supabase error fetching clients:", error);
        return [];
      }
      
      if (!data) return [];

      const map = new Map<string, ClientData>();
      
      data.forEach(order => {
        const phone = order.customer_phone?.trim() || "Sem telefone";
        const name = order.customer_name?.trim() || "Cliente Desconhecido";
        
        if (!map.has(phone)) {
          map.set(phone, {
            phone,
            name,
            total_spent: order.total,
            order_count: 1,
            last_order: order.created_at,
            first_order: order.created_at
          });
        } else {
          const client = map.get(phone)!;
          client.total_spent += order.total;
          client.order_count += 1;
          
          if (new Date(order.created_at) > new Date(client.last_order)) {
            client.last_order = order.created_at;
            client.name = name; // Usa o nome mais recente
          }
          if (new Date(order.created_at) < new Date(client.first_order)) {
            client.first_order = order.created_at;
          }
        }
      });

      return Array.from(map.values());
    }`;

const newQueryFn = `    queryFn: async () => {
      const { data: ordersData } = await supabase
        .from("orders")
        .select("customer_name, customer_phone, total, created_at, status")
        .in("status", ["delivered", "paid"]);
        
      const { data: profilesData } = await supabase
        .from("customer_profiles")
        .select("*")
        .catch(() => ({ data: null })); // Fallback if view doesn't exist yet

      const map = new Map<string, ClientData>();
      
      if (profilesData) {
        profilesData.forEach((profile: any) => {
          const phone = profile.phone?.trim() || "Sem telefone";
          map.set(phone, {
            phone,
            name: profile.full_name?.trim() || "Sem Nome",
            cpf: profile.cpf || "Sem CPF",
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
    }`;

code = code.replace(oldQueryFn, newQueryFn);

// Update rendering of last_order
code = code.replace(
`{new Date(client.last_order).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}`,
`{client.last_order === "-" ? "Nenhuma compra" : new Date(client.last_order).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}`);

fs.writeFileSync(filePath, code, 'utf8');
console.log('admin.dashboard.clientes.tsx updated!');
