
-- Audit log enum
CREATE TYPE public.audit_action AS ENUM ('INSERT', 'UPDATE', 'DELETE');

-- Audit logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  table_name TEXT NOT NULL,
  record_id TEXT,
  action public.audit_action NOT NULL,
  old_data JSONB,
  new_data JSONB,
  changed_fields TEXT[],
  user_id UUID,
  user_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs (created_at DESC);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs (table_name);
CREATE INDEX idx_audit_logs_action ON public.audit_logs (action);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs (user_id);
CREATE INDEX idx_audit_logs_record_id ON public.audit_logs (record_id);

GRANT SELECT, INSERT ON public.audit_logs TO authenticated;
GRANT ALL ON public.audit_logs TO service_role;

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view audit_logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- INSERT policy allows the trigger function (security definer) and admins to write.
CREATE POLICY "Anyone can insert audit_logs"
ON public.audit_logs FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_old JSONB;
  v_new JSONB;
  v_record_id TEXT;
  v_changed TEXT[];
  v_user_id UUID;
  v_user_email TEXT;
  k TEXT;
BEGIN
  BEGIN
    v_user_id := auth.uid();
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL;
  END;

  BEGIN
    v_user_email := (auth.jwt() ->> 'email');
  EXCEPTION WHEN OTHERS THEN
    v_user_email := NULL;
  END;

  IF TG_OP = 'DELETE' THEN
    v_old := to_jsonb(OLD);
    v_new := NULL;
    v_record_id := COALESCE(v_old->>'id', NULL);
  ELSIF TG_OP = 'INSERT' THEN
    v_old := NULL;
    v_new := to_jsonb(NEW);
    v_record_id := COALESCE(v_new->>'id', NULL);
  ELSE
    v_old := to_jsonb(OLD);
    v_new := to_jsonb(NEW);
    v_record_id := COALESCE(v_new->>'id', v_old->>'id');
    v_changed := ARRAY[]::TEXT[];
    FOR k IN SELECT jsonb_object_keys(v_new) LOOP
      IF (v_old->k) IS DISTINCT FROM (v_new->k) THEN
        v_changed := array_append(v_changed, k);
      END IF;
    END LOOP;
    IF array_length(v_changed, 1) IS NULL THEN
      RETURN NEW;
    END IF;
  END IF;

  INSERT INTO public.audit_logs (table_name, record_id, action, old_data, new_data, changed_fields, user_id, user_email)
  VALUES (TG_TABLE_NAME, v_record_id, TG_OP::public.audit_action, v_old, v_new, v_changed, v_user_id, v_user_email);

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;

-- Attach triggers to ALL business tables
CREATE TRIGGER audit_products AFTER INSERT OR UPDATE OR DELETE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_categories AFTER INSERT OR UPDATE OR DELETE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_product_variations AFTER INSERT OR UPDATE OR DELETE ON public.product_variations
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_product_variation_options AFTER INSERT OR UPDATE OR DELETE ON public.product_variation_options
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_orders AFTER INSERT OR UPDATE OR DELETE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_order_items AFTER INSERT OR UPDATE OR DELETE ON public.order_items
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_payment_methods AFTER INSERT OR UPDATE OR DELETE ON public.payment_methods
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_finance_categories AFTER INSERT OR UPDATE OR DELETE ON public.finance_categories
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_finance_transactions AFTER INSERT OR UPDATE OR DELETE ON public.finance_transactions
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_business_hours AFTER INSERT OR UPDATE OR DELETE ON public.business_hours
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();

CREATE TRIGGER audit_user_roles AFTER INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger_func();
