const fs = require('fs');
const path = require('path');

const files = [
  'src/routes/enderecos.tsx',
  'src/routes/admin.dashboard.produtos.tsx',
  'src/routes/admin.dashboard.pagamentos.tsx',
  'src/routes/admin.dashboard.pedidos.tsx',
  'src/routes/admin.dashboard.financeiro.tsx',
  'src/routes/admin.dashboard.entregas.tsx',
  'src/routes/admin.dashboard.cupons.tsx',
  'src/routes/admin.dashboard.categorias.tsx',
  'src/routes/admin.dashboard.cardapio.tsx'
];

for (const relPath of files) {
  const file = path.join('c:/Users/Lucas/.antigravity-ide/lumedoces', relPath);
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('useConfirm')) continue; // Already processed

  // 1. Add import
  const importLines = content.split('\n').filter(l => l.startsWith('import '));
  const lastImport = importLines[importLines.length - 1];
  content = content.replace(lastImport, lastImport + '\nimport { useConfirm } from "@/providers/ConfirmProvider";');

  // 2. Add hook initialization inside component.
  // We'll look for the first function that looks like a React component (starts with uppercase)
  // or a page component `export default function` or `function Admin...`.
  // Most routes use `function NomePage() {` or `function RouteComponent() {`
  const compMatch = content.match(/function\s+[A-Z]\w*\s*\([^)]*\)\s*{/);
  if (compMatch) {
    content = content.replace(compMatch[0], compMatch[0] + '\n  const { confirm } = useConfirm();');
  } else {
    // If it's a memo or something else
    const compMatch2 = content.match(/const\s+[A-Z]\w*\s*=\s*\([^)]*\)\s*=>\s*{/);
    if (compMatch2) {
      content = content.replace(compMatch2[0], compMatch2[0] + '\n  const { confirm } = useConfirm();');
    }
  }

  // 3. Replace confirm
  // !confirm("...") -> !(await confirm("..."))
  content = content.replace(/!confirm\(([^)]+)\)/g, '!(await confirm($1))');
  // confirm("...") -> await confirm("...")
  // Note: we have to be careful not to replace await confirm again
  content = content.replace(/([^a-zA-Z0-9_])confirm\(([^)]+)\)/g, (match, p1, p2) => {
    if (p1.trim() === 'await') return match;
    return `${p1}await confirm(${p2})`;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Processed ${relPath}`);
}
