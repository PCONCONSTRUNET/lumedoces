import fs from 'fs';

let content = fs.readFileSync('src/integrations/supabase/types.ts', 'utf-8');

// Inject is_24h into business_hours
content = content.replace(
  /business_hours: \{\n\s*Row: \{([\s\S]*?)\}/,
  (match, inner) => `business_hours: {\n        Row: {${inner}\n          is_24h: boolean | null\n        }`
);
content = content.replace(
  /business_hours: \{[\s\S]*?Insert: \{([\s\S]*?)\}/,
  (match, inner) => match.replace(inner, `${inner}\n          is_24h?: boolean | null`)
);
content = content.replace(
  /business_hours: \{[\s\S]*?Update: \{([\s\S]*?)\}/,
  (match, inner) => match.replace(inner, `${inner}\n          is_24h?: boolean | null`)
);

// Inject order_number, coupon_code, coupon_id into orders
const orderFields = `\n          order_number: number\n          coupon_code: string | null\n          coupon_id: string | null`;
const orderFieldsOptional = `\n          order_number?: number\n          coupon_code?: string | null\n          coupon_id?: string | null`;

content = content.replace(
  /orders: \{\n\s*Row: \{([\s\S]*?)\}/,
  (match, inner) => `orders: {\n        Row: {${inner}${orderFields}\n        }`
);
content = content.replace(
  /orders: \{[\s\S]*?Insert: \{([\s\S]*?)\}/,
  (match, inner) => match.replace(inner, `${inner}${orderFieldsOptional}`)
);
content = content.replace(
  /orders: \{[\s\S]*?Update: \{([\s\S]*?)\}/,
  (match, inner) => match.replace(inner, `${inner}${orderFieldsOptional}`)
);

// Inject coupons and store_settings table
const extraTables = `
      coupons: {
        Row: {
          id: string
          code: string
          description: string | null
          discount_type: "fixed" | "percent"
          discount_value: number
          min_order_total: number
          max_uses: number | null
          used_count: number
          starts_at: string | null
          expires_at: string | null
          is_active: boolean
        }
        Insert: any
        Update: any
        Relationships: []
      }
      store_settings: {
        Row: {
          id: string
          delivery_enabled: boolean
          pickup_enabled: boolean
          delivery_fee: number
          updated_at: string
        }
        Insert: any
        Update: any
        Relationships: []
      }
`;

content = content.replace(
  /Tables: \{/,
  `Tables: {${extraTables}`
);

// Inject new statuses into order_status enum
content = content.replace(
  /order_status:\s*\|\s*"pending"/,
  `order_status:\n        | "pending"\n        | "ready"\n        | "dispatched"`
);

fs.writeFileSync('src/integrations/supabase/types.ts', content);
