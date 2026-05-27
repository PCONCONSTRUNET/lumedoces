ALTER TABLE public.audit_logs
ADD COLUMN IF NOT EXISTS ip_address inet,
ADD COLUMN IF NOT EXISTS user_agent text;

CREATE INDEX IF NOT EXISTS idx_audit_logs_ip_address ON public.audit_logs (ip_address);

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
  v_headers JSONB;
  v_ip_raw TEXT;
  v_ip inet;
  v_user_agent TEXT;
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

  BEGIN
    v_headers := NULLIF(current_setting('request.headers', true), '')::JSONB;
    v_ip_raw := COALESCE(
      v_headers ->> 'cf-connecting-ip',
      split_part(v_headers ->> 'x-forwarded-for', ',', 1),
      v_headers ->> 'x-real-ip'
    );
    v_user_agent := v_headers ->> 'user-agent';

    IF NULLIF(btrim(v_ip_raw), '') IS NOT NULL THEN
      v_ip := btrim(v_ip_raw)::inet;
    END IF;
  EXCEPTION WHEN OTHERS THEN
    v_ip := NULL;
    v_user_agent := NULL;
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

  INSERT INTO public.audit_logs (
    table_name,
    record_id,
    action,
    old_data,
    new_data,
    changed_fields,
    user_id,
    user_email,
    ip_address,
    user_agent
  )
  VALUES (
    TG_TABLE_NAME,
    v_record_id,
    TG_OP::public.audit_action,
    v_old,
    v_new,
    v_changed,
    v_user_id,
    v_user_email,
    v_ip,
    v_user_agent
  );

  IF TG_OP = 'DELETE' THEN RETURN OLD; ELSE RETURN NEW; END IF;
END;
$$;
