import fs from 'fs';

let content = fs.readFileSync('src/integrations/supabase/types.ts', 'utf-8');

// Add create_pix_payment to Functions
const pixFunction = `
      create_pix_payment: {
        Args: {
          p_order_id: string
          p_amount: number
        }
        Returns: {
          qrCode: string
          qrCodeBase64: string
          error?: string
        }
      }`;

content = content.replace(
  /Functions: \{/,
  `Functions: {${pixFunction}`
);

// We also need to fix `is_24h` nullability in admin.dashboard.horarios.tsx error
// Wait, the error is: Types of property 'is_24h' are incompatible. Type 'boolean | null' is not assignable to type 'boolean'.
// It's easier to just change `types.ts` so `is_24h` is boolean, not boolean | null.
content = content.replace(/is_24h: boolean \| null/g, "is_24h: boolean");

fs.writeFileSync('src/integrations/supabase/types.ts', content);
