CREATE TABLE store_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_enabled boolean NOT NULL DEFAULT true,
  pickup_enabled boolean NOT NULL DEFAULT true,
  delivery_fee numeric NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Insert default row
INSERT INTO store_settings (delivery_enabled, pickup_enabled, delivery_fee) VALUES (true, true, 0);

-- Enable RLS
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to store_settings"
  ON store_settings FOR SELECT
  USING (true);

CREATE POLICY "Allow admin to update store_settings"
  ON store_settings FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role = 'admin'
  ));
