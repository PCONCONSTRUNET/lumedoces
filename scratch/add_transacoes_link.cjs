const fs = require('fs');
let filePath = 'src/routes/perfil.tsx';
let code = fs.readFileSync(filePath, 'utf8');

if (!code.includes('<Receipt')) {
  // Add Receipt icon import
  code = code.replace(
    'ArrowLeft, Loader2, ShoppingBag, ChevronRight, MapPin, HelpCircle, ShieldCheck }',
    'ArrowLeft, Loader2, ShoppingBag, ChevronRight, MapPin, HelpCircle, ShieldCheck, Receipt }'
  );
}

if (!code.includes('to="/transacoes"')) {
  // Add Link
  const linkHtml = `
              <Link to="/transacoes" className="flex items-center justify-between p-5 hover:bg-gray-50 transition active:bg-gray-100 border-b border-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                    <Receipt className="h-6 w-6" />
                  </div>
                  <span className="font-bold text-gray-800 text-lg">Minhas Transações</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </Link>
`;

  code = code.replace(
    '              <Link to="/historico"',
    linkHtml + '              <Link to="/historico"'
  );
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('Transacoes link added!');
