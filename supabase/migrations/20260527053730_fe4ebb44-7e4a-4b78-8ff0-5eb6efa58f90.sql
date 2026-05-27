
WITH cat AS (
  INSERT INTO public.categories (name, sort_order, is_active)
  VALUES ('Coxinhas', 1, true)
  RETURNING id
)
INSERT INTO public.products (name, description, base_price, image_url, category_id, sort_order, is_active)
SELECT v.name, v.description, v.price, v.image, cat.id, v.sort, true
FROM cat,
(VALUES
  ('Coxinha de Frango',    'Massa dourada e crocante recheada com frango temperado e desfiado na hora.', 7.90, '/products/coxinha-frango.png',    1),
  ('Coxinha de Carne',     'Recheio suculento de carne moída refogada com temperos especiais da casa.',  7.90, '/products/coxinha-carne.png',     2),
  ('Coxinha de Calabresa', 'Calabresa selecionada moída e bem temperada, envolta em massa leve.',         7.90, '/products/coxinha-calabresa.png', 3)
) AS v(name, description, price, image, sort);
