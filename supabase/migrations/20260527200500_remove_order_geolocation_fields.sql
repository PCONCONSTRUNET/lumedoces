ALTER TABLE public.orders
  DROP COLUMN IF EXISTS latitude,
  DROP COLUMN IF EXISTS longitude;
