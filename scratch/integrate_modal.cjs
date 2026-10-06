const fs = require('fs');
let filePath = 'src/routes/admin.dashboard.clientes.tsx';
let code = fs.readFileSync(filePath, 'utf8');

if (!code.includes('import { ClientDetailsModal }')) {
  // Add import
  code = code.replace(
    'import { formatBRL } from "@/store/cart";',
    'import { formatBRL } from "@/store/cart";\nimport { ClientDetailsModal } from "@/components/admin/ClientDetailsModal";'
  );
}

if (!code.includes('user_id?: string;')) {
  // Update ClientData (should be updated already but in case)
  code = code.replace(
    '  cpf?: string;\n  total_spent: number;',
    '  cpf?: string;\n  user_id?: string;\n  total_spent: number;'
  );
}

if (!code.includes('user_id: profile.id')) {
  // Update profilesData map
  code = code.replace(
    'cpf: profile.cpf || "Sem CPF",',
    'cpf: profile.cpf || "Sem CPF",\n            user_id: profile.id,'
  );
}

if (!code.includes('const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);')) {
  // Add state
  code = code.replace(
    'const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");',
    'const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");\n  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);'
  );
}

// Add onClick to tr
code = code.replace(
  '<tr key={client.phone} className="hover:bg-gray-50 transition-colors">',
  '<tr key={client.phone} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedClient(client)}>'
);

// Add modal before closing div
if (!code.includes('<ClientDetailsModal')) {
  code = code.replace(
    '    </div>\n  );\n}\n',
    `      <ClientDetailsModal 
        isOpen={!!selectedClient} 
        onClose={() => setSelectedClient(null)} 
        client={selectedClient} 
      />
    </div>
  );
}
`
  );
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Modal integrated!');
