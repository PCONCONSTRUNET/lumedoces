const fs = require('fs');

let content = fs.readFileSync('src/routes/admin.dashboard.cardapio.tsx', 'utf-8');

// 1. Add import for ProdutoWizard
content = content.replace(
  /import \{ CSS \} from "@dnd-kit\/utilities";\nimport \{ supabase \} from "@\/integrations\/supabase\/client";/,
  `import { CSS } from "@dnd-kit/utilities";
import { supabase } from "@/integrations/supabase/client";
import { ProdutoWizard } from "@/components/cardapio/ProdutoWizard";`
);

// 2. Remove the old ProdutoWizard function block entirely.
const oldProdutoWizardRegex = /function ProdutoWizard\(\{ onClose, onSuccess, categories, initialData \}: any\) \{[\s\S]*?\}\n\n\/\/\s*=\+\s*COMBO WIZARD/s;
content = content.replace(
  oldProdutoWizardRegex,
  `// ==========================================
// COMBO WIZARD`
);

// We need to just search for `function ProdutoWizard` and remove it up to `function ComboWizard`.
// Let's do it safely.
const wizardRegex = /function ProdutoWizard\(\{ onClose[\s\S]*?function ComboWizard/s;
content = content.replace(wizardRegex, 'function ComboWizard');


fs.writeFileSync('src/routes/admin.dashboard.cardapio.tsx', content);
console.log("Replaced ProdutoWizard successfully.");
