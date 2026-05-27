
-- ============== payment_methods ==============
CREATE TABLE public.payment_methods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.payment_methods TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payment_methods TO authenticated;
GRANT ALL ON public.payment_methods TO service_role;

ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view payment_methods" ON public.payment_methods FOR SELECT USING (true);
CREATE POLICY "Admins insert payment_methods" ON public.payment_methods FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update payment_methods" ON public.payment_methods FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete payment_methods" ON public.payment_methods FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.payment_methods (name, sort_order) VALUES
  ('Dinheiro', 1),
  ('Pix', 2),
  ('Cartão Débito', 3),
  ('Cartão Crédito', 4),
  ('iFood/App', 5),
  ('Outros', 6);

-- ============== finance_categories ==============
CREATE TYPE public.finance_kind AS ENUM ('revenue', 'expense');
CREATE TYPE public.finance_dre_group AS ENUM ('revenue', 'cost', 'expense');

CREATE TABLE public.finance_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  kind public.finance_kind NOT NULL,
  dre_group public.finance_dre_group NOT NULL DEFAULT 'expense',
  color text NOT NULL DEFAULT '#94a3b8',
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.finance_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_categories TO authenticated;
GRANT ALL ON public.finance_categories TO service_role;

ALTER TABLE public.finance_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone view finance_categories" ON public.finance_categories FOR SELECT USING (true);
CREATE POLICY "Admins insert finance_categories" ON public.finance_categories FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update finance_categories" ON public.finance_categories FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete finance_categories" ON public.finance_categories FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.finance_categories (name, kind, dre_group, color, sort_order) VALUES
  ('Vendas', 'revenue', 'revenue', '#10b981', 1),
  ('Outras receitas', 'revenue', 'revenue', '#22c55e', 2),
  ('Custos de produto', 'expense', 'cost', '#f97316', 3),
  ('Despesas operacionais', 'expense', 'expense', '#ef4444', 4),
  ('Marketing', 'expense', 'expense', '#a855f7', 5),
  ('Salários', 'expense', 'expense', '#0ea5e9', 6),
  ('Outras despesas', 'expense', 'expense', '#64748b', 7);

-- ============== orders ==============
CREATE TYPE public.order_status AS ENUM ('pending', 'confirmed', 'preparing', 'delivered', 'paid', 'cancelled');

CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_phone text,
  customer_address text,
  notes text,
  status public.order_status NOT NULL DEFAULT 'pending',
  payment_method_id uuid REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  discount numeric(10,2) NOT NULL DEFAULT 0,
  total numeric(10,2) NOT NULL DEFAULT 0,
  paid_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT INSERT ON public.orders TO anon;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view orders" ON public.orders FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update orders" ON public.orders FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete orders" ON public.orders FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_orders_status ON public.orders(status);

-- ============== order_items ==============
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  total_price numeric(10,2) NOT NULL DEFAULT 0,
  variations_snapshot jsonb NOT NULL DEFAULT '[]'::jsonb
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_items TO authenticated;
GRANT INSERT ON public.order_items TO anon;
GRANT ALL ON public.order_items TO service_role;

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create order_items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view order_items" ON public.order_items FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update order_items" ON public.order_items FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete order_items" ON public.order_items FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_order_items_order ON public.order_items(order_id);
CREATE INDEX idx_order_items_product ON public.order_items(product_id);

-- ============== finance_transactions ==============
CREATE TYPE public.finance_status AS ENUM ('paid', 'pending');

CREATE TABLE public.finance_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.finance_kind NOT NULL,
  status public.finance_status NOT NULL DEFAULT 'paid',
  amount numeric(10,2) NOT NULL,
  description text NOT NULL,
  occurred_at date NOT NULL DEFAULT CURRENT_DATE,
  category_id uuid REFERENCES public.finance_categories(id) ON DELETE SET NULL,
  payment_method_id uuid REFERENCES public.payment_methods(id) ON DELETE SET NULL,
  order_id uuid REFERENCES public.orders(id) ON DELETE SET NULL,
  is_auto boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.finance_transactions TO authenticated;
GRANT ALL ON public.finance_transactions TO service_role;

ALTER TABLE public.finance_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view finance_transactions" ON public.finance_transactions FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins insert finance_transactions" ON public.finance_transactions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update finance_transactions" ON public.finance_transactions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete finance_transactions" ON public.finance_transactions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_finance_tx_occurred ON public.finance_transactions(occurred_at DESC);
CREATE INDEX idx_finance_tx_kind ON public.finance_transactions(kind);
CREATE INDEX idx_finance_tx_order ON public.finance_transactions(order_id);

-- ============== Trigger: pedido pago -> receita ==============
CREATE OR REPLACE FUNCTION public.sync_order_payment_to_finance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sales_category uuid;
BEGIN
  SELECT id INTO v_sales_category FROM public.finance_categories WHERE name = 'Vendas' AND kind = 'revenue' LIMIT 1;

  IF TG_OP = 'INSERT' THEN
    IF NEW.status = 'paid' THEN
      INSERT INTO public.finance_transactions (kind, status, amount, description, occurred_at, category_id, payment_method_id, order_id, is_auto)
      VALUES ('revenue', 'paid', NEW.total, 'Pedido ' || substr(NEW.id::text,1,8) || ' - ' || NEW.customer_name, COALESCE(NEW.paid_at::date, CURRENT_DATE), v_sales_category, NEW.payment_method_id, NEW.id, true);
    END IF;
    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'paid' AND OLD.status <> 'paid' THEN
      INSERT INTO public.finance_transactions (kind, status, amount, description, occurred_at, category_id, payment_method_id, order_id, is_auto)
      VALUES ('revenue', 'paid', NEW.total, 'Pedido ' || substr(NEW.id::text,1,8) || ' - ' || NEW.customer_name, COALESCE(NEW.paid_at::date, CURRENT_DATE), v_sales_category, NEW.payment_method_id, NEW.id, true);
    ELSIF NEW.status <> 'paid' AND OLD.status = 'paid' THEN
      DELETE FROM public.finance_transactions WHERE order_id = NEW.id AND is_auto = true;
    ELSIF NEW.status = 'paid' AND OLD.status = 'paid' AND (NEW.total <> OLD.total OR NEW.payment_method_id IS DISTINCT FROM OLD.payment_method_id) THEN
      UPDATE public.finance_transactions
        SET amount = NEW.total, payment_method_id = NEW.payment_method_id, updated_at = now()
        WHERE order_id = NEW.id AND is_auto = true;
    END IF;
    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_orders_to_finance
AFTER INSERT OR UPDATE ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.sync_order_payment_to_finance();

-- updated_at trigger function (idempotent)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_orders_updated BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_finance_tx_updated BEFORE UPDATE ON public.finance_transactions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
