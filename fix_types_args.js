import fs from 'fs';
let content = fs.readFileSync('src/integrations/supabase/types.ts', 'utf-8');

// Replace create_pix_payment Args
content = content.replace(
  /create_pix_payment: \{\s*Args: \{([\s\S]*?)\}\s*Returns:/,
  `create_pix_payment: {\n        Args: {\n          payload: Json\n        }\n        Returns:`
);

// Fix TS error in useBusinessStatus: Property 'allHours' is missing
// The hook returns `Omit<BusinessStatus, "loading">`.
// Actually, `useBusinessStatus` expects `allHours` but it's not returning it in some branches.
// Wait, I can just use `sed` to fix the `order_status` in `types.ts`
// In the previous regex I only replaced order_status: | "pending", not all of them.
content = content.replace(
  /order_status:\s*\|\s*"pending"\s*\|\s*"ready"\s*\|\s*"dispatched"/,
  `order_status: | "pending" | "confirmed" | "preparing" | "ready_for_pickup" | "out_for_delivery" | "delivered" | "cancelled" | "paid" | "ready" | "dispatched"`
);

// We should fix `order_status` so the `Record` in admin.dashboard.pedidos matches.
// Actually, admin.dashboard.pedidos is complaining that `Record<order_status, string>` has missing `ready, dispatched`.
// Wait, it says: `Type '{ pending: string; confirmed: string; ... }' is missing ... 'ready', 'dispatched'`.
// So `ready` and `dispatched` are in `types.ts` but NOT in the `Record` in `pedidos.tsx`.
// So we should ADD them to the record in `pedidos.tsx` instead of removing from `types.ts` OR remove them from `types.ts`.
// Looking closely, `ready` and `dispatched` are NEW statuses I injected! I shouldn't have injected them! The previous types didn't have them!
content = content.replace(
  /order_status:\s*\|\s*"pending"\s*\|\s*"ready"\s*\|\s*"dispatched"/,
  `order_status:\n        | "pending"`
);


fs.writeFileSync('src/integrations/supabase/types.ts', content);
