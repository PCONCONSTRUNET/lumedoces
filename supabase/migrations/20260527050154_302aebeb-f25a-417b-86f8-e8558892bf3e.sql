INSERT INTO public.user_roles (user_id, role)
VALUES ('eeecf4fd-bece-49dc-bab9-d64ed30b4c8c', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;