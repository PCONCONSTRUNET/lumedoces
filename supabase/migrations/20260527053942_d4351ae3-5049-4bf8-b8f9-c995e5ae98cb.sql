
INSERT INTO public.categories (name, sort_order, is_active) VALUES ('Porções', 3, true);

INSERT INTO public.products (category_id, name, description, base_price, image_url, is_active, sort_order)
SELECT id, 'Batata Frita', 'Porção de batata frita crocante acompanha 2 molhos.', 19.90, '/products/batata-frita.png', true, 1 FROM public.categories WHERE name='Porções'
UNION ALL
SELECT id, 'Mini Salsicha Empanada', 'Bolinhas de massa recheadas com salsicha.', 14.90, '/products/salsicha.png', true, 2 FROM public.categories WHERE name='Porções'
UNION ALL
SELECT id, 'Bolinho de Queijo', 'Bolinhos crocantes recheados com queijo cremoso.', 16.90, '/products/bolinho-queijo.png', true, 3 FROM public.categories WHERE name='Porções';
