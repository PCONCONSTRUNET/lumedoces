WITH combo_category AS (
  INSERT INTO public.categories (name, sort_order, is_active)
  SELECT 'Combos', 4, true
  WHERE NOT EXISTS (
    SELECT 1
    FROM public.categories
    WHERE lower(name) = 'combos'
  )
  RETURNING id
),
category AS (
  SELECT id
  FROM combo_category
  UNION ALL
  SELECT id
  FROM public.categories
  WHERE lower(name) = 'combos'
  LIMIT 1
)
INSERT INTO public.products (
  category_id,
  name,
  description,
  base_price,
  image_url,
  is_active,
  sort_order
)
SELECT
  category.id,
  'Combo Festa',
  'Combo especial com mini coxinhas para compartilhar.',
  110.00,
  '/products/combo.png',
  true,
  1
FROM category
WHERE NOT EXISTS (
  SELECT 1
  FROM public.products
  WHERE lower(name) = 'combo festa'
);
