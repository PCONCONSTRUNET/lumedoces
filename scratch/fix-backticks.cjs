const fs = require('fs');

// Fix ComboWizard - replace escaped backtick template literals with real ones
let combo = fs.readFileSync('src/components/cardapio/ComboWizard.tsx', 'utf-8');
// The file has \` sequences — fix them
combo = combo.replace(/\\`/g, '`');
combo = combo.replace(/\\\${/g, '${');
fs.writeFileSync('src/components/cardapio/ComboWizard.tsx', combo);

// Fix ProdutoWizard - same
let prod = fs.readFileSync('src/components/cardapio/ProdutoWizard.tsx', 'utf-8');
prod = prod.replace(/\\`/g, '`');
prod = prod.replace(/\\\${/g, '${');
fs.writeFileSync('src/components/cardapio/ProdutoWizard.tsx', prod);

console.log("Fixed template literals in both wizard files.");
