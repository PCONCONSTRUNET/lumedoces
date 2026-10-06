import fs from 'fs';
const file = 'c:/Users/Lucas/.antigravity-ide/lumedoces/src/routes/admin.dashboard.financeiro.tsx';
let content = fs.readFileSync(file, 'utf8');

const regex = /(<div className="grid lg:grid-cols-2 gap-4">[\s\S]*?)(<div className="rounded-2xl bg-card shadow-sm ring-1 ring-border\/60 overflow-hidden">[\s\S]*?)(<TxModal)/;
const match = content.match(regex);
if (match) {
  const newContent = content.replace(regex, '$2$1$3');
  fs.writeFileSync(file, newContent, 'utf8');
  console.log("Swapped!");
} else {
  console.log("Not matched");
}
