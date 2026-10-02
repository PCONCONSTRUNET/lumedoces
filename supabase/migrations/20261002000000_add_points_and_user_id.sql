-- Add user_id to orders to link them to authenticated users
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add points columns to orders
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS points_used integer NOT NULL DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS points_earned integer NOT NULL DEFAULT 0;

-- Create a secure view for points balance
CREATE OR REPLACE VIEW public.customer_points_balance AS
SELECT 
  user_id,
  COALESCE(SUM(points_earned) FILTER (WHERE status IN ('delivered', 'paid', 'completed')), 0) - 
  COALESCE(SUM(points_used) FILTER (WHERE status != 'cancelled'), 0) as balance
FROM public.orders
WHERE user_id IS NOT NULL
GROUP BY user_id;

-- Grant access to the view
GRANT SELECT ON public.customer_points_balance TO authenticated;
GRANT SELECT ON public.customer_points_balance TO service_role;

-- Update RLS for orders to allow users to see their own orders based on user_id
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
