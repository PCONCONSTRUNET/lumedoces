import fs from 'fs';

let content = fs.readFileSync('src/integrations/supabase/types.ts', 'utf-8');

// business_hours Row
content = content.replace(
  /business_hours: \{\s*Row: \{([\s\S]*?)updated_at: string\s*\}/,
  'business_hours: {\n        Row: {$1updated_at: string\n          is_24h: boolean | null\n        }'
);

// orders Row
content = content.replace(
  /orders: \{\s*Row: \{([\s\S]*?)updated_at: string\s*\}/,
  'orders: {\n        Row: {$1updated_at: string\n          order_number: number\n          coupon_code: string | null\n          coupon_id: string | null\n        }'
);

fs.writeFileSync('src/integrations/supabase/types.ts', content);
