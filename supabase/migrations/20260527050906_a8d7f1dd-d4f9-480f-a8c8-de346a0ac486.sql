
CREATE TABLE public.business_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week smallint NOT NULL UNIQUE CHECK (day_of_week BETWEEN 0 AND 6),
  open_time time NOT NULL DEFAULT '18:00',
  close_time time NOT NULL DEFAULT '23:00',
  is_closed boolean NOT NULL DEFAULT true,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.business_hours TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.business_hours TO authenticated;
GRANT ALL ON public.business_hours TO service_role;

ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view business hours"
  ON public.business_hours FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert business hours"
  ON public.business_hours FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update business hours"
  ON public.business_hours FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete business hours"
  ON public.business_hours FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.business_hours (day_of_week, open_time, close_time, is_closed)
VALUES
  (0, '18:00', '23:00', true),
  (1, '18:00', '23:00', true),
  (2, '18:00', '23:00', true),
  (3, '18:00', '23:00', true),
  (4, '18:00', '23:00', true),
  (5, '18:00', '23:00', true),
  (6, '18:00', '23:00', true);
