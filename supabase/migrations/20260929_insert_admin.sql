INSERT INTO public.user_roles (user_id, role)
VALUES ('e2d42cd8-c8a3-4ff1-8f47-7d3d4088cce7', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
