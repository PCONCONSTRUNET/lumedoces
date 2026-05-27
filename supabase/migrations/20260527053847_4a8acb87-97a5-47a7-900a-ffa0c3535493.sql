
INSERT INTO public.categories (name, sort_order, is_active) VALUES ('Pastéis', 2, true);

INSERT INTO public.products (category_id, name, description, base_price, image_url, is_active, sort_order)
SELECT id, 'Pastel de Frango', 'Pastel crocante recheado com frango temperado.', 8.90, '/products/pastel-frango.png', true, 1 FROM public.categories WHERE name='Pastéis'
UNION ALL
SELECT id, 'Pastel de Carne', 'Pastel crocante recheado com carne moída.', 8.90, '/products/pastel-carne.png', true, 2 FROM public.categories WHERE name='Pastéis'
UNION ALL
SELECT id, 'Pastel de Pizza', 'Pastel recheado com presunto, queijo, tomate e orégano.', 8.90, '/products/pastel-pizza.png', true, 3 FROM public.categories WHERE name='Pastéis';
