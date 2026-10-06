const fs = require('fs');
const file = 'c:/Users/Lucas/.antigravity-ide/lumedoces/src/routes/admin.dashboard.financeiro.tsx';
let content = fs.readFileSync(file, 'utf8');

// Find the charts block
const chartsStart = content.indexOf('<div className="grid lg:grid-cols-2 gap-4">');
// Find the end of charts block
const chartsEnd = content.indexOf('</div>\n\n      <div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden">') + 6;

// Find the table block start
const tableStart = content.indexOf('<div className="rounded-2xl bg-card shadow-sm ring-1 ring-border/60 overflow-hidden">');
// Find the end of table block
const tableEnd = content.indexOf('</div>\n\n      <TxModal');

if (chartsStart !== -1 && tableStart !== -1 && tableEnd !== -1) {
  const chartsBlock = content.slice(chartsStart, chartsEnd);
  const tableBlock = content.slice(tableStart, tableEnd + 6);
  
  // They are separated by empty lines
  const beforeCharts = content.slice(0, chartsStart);
  const afterTable = content.slice(tableEnd + 6);
  
  const newContent = beforeCharts + tableBlock + '\n\n      ' + chartsBlock + afterTable;
  fs.writeFileSync(file, newContent, 'utf8');
  console.log('Successfully swapped!');
} else {
  console.log('Could not find blocks');
  console.log({chartsStart, chartsEnd, tableStart, tableEnd});
}
