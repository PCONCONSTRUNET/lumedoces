
-- Remove permissive INSERT policy; trigger function runs as table owner and bypasses RLS
DROP POLICY IF EXISTS "Anyone can insert audit_logs" ON public.audit_logs;
REVOKE INSERT ON public.audit_logs FROM authenticated, anon;

-- Lock down the audit trigger function so only the database can invoke it via triggers
REVOKE EXECUTE ON FUNCTION public.audit_trigger_func() FROM PUBLIC, anon, authenticated;
