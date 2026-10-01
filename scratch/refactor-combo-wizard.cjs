const fs = require('fs');

let content = fs.readFileSync('src/routes/admin.dashboard.cardapio.tsx', 'utf-8');

// 1. Add import for ComboWizard
content = content.replace(
  /import \{ ProdutoWizard \} from "@\/components\/cardapio\/ProdutoWizard";/,
  `import { ProdutoWizard } from "@/components/cardapio/ProdutoWizard";
import { ComboWizard } from "@/components/cardapio/ComboWizard";`
);

// 2. Remove the old ComboWizard function block entirely.
const oldComboWizardRegex = /function ComboWizard\(\{ onClose, onSuccess, products \}: any\) \{[\s\S]*?\}\n\nfunction AddExistingProductModal/s;
content = content.replace(
  oldComboWizardRegex,
  `function AddExistingProductModal`
);

fs.writeFileSync('src/routes/admin.dashboard.cardapio.tsx', content);
console.log("Replaced ComboWizard successfully.");
