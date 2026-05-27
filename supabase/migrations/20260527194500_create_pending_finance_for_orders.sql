-- Every order should create an automatic finance transaction immediately.
-- The transaction starts as pending and becomes paid when the order is marked paid.

CREATE OR REPLACE FUNCTION public.sync_order_payment_to_finance()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_sales_category uuid;
  v_finance_status public.finance_status;
  v_occurred_at date;
BEGIN
  SELECT id
    INTO v_sales_category
    FROM public.finance_categories
    WHERE name = 'Vendas' AND kind = 'revenue'
    LIMIT 1;

  v_finance_status := CASE
    WHEN NEW.status = 'paid' THEN 'paid'::public.finance_status
    ELSE 'pending'::public.finance_status
  END;

  v_occurred_at := CASE
    WHEN NEW.status = 'paid' THEN COALESCE(NEW.paid_at::date, CURRENT_DATE)
    ELSE COALESCE(NEW.created_at::date, CURRENT_DATE)
  END;

  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.finance_transactions (
      kind,
      status,
      amount,
      description,
      occurred_at,
      category_id,
      payment_method_id,
      order_id,
      is_auto
    )
    VALUES (
      'revenue',
      v_finance_status,
      NEW.total,
      'Pedido ' || substr(NEW.id::text, 1, 8) || ' - ' || NEW.customer_name,
      v_occurred_at,
      v_sales_category,
      NEW.payment_method_id,
      NEW.id,
      true
    );

    RETURN NEW;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    UPDATE public.finance_transactions
      SET
        status = v_finance_status,
        amount = NEW.total,
        description = 'Pedido ' || substr(NEW.id::text, 1, 8) || ' - ' || NEW.customer_name,
        occurred_at = v_occurred_at,
        category_id = v_sales_category,
        payment_method_id = NEW.payment_method_id,
        updated_at = now()
      WHERE order_id = NEW.id
        AND is_auto = true;

    IF NOT FOUND THEN
      INSERT INTO public.finance_transactions (
        kind,
        status,
        amount,
        description,
        occurred_at,
        category_id,
        payment_method_id,
        order_id,
        is_auto
      )
      VALUES (
        'revenue',
        v_finance_status,
        NEW.total,
        'Pedido ' || substr(NEW.id::text, 1, 8) || ' - ' || NEW.customer_name,
        v_occurred_at,
        v_sales_category,
        NEW.payment_method_id,
        NEW.id,
        true
      );
    END IF;

    RETURN NEW;
  END IF;

  RETURN NEW;
END;
$$;

INSERT INTO public.finance_transactions (
  kind,
  status,
  amount,
  description,
  occurred_at,
  category_id,
  payment_method_id,
  order_id,
  is_auto
)
SELECT
  'revenue',
  CASE
    WHEN o.status = 'paid' THEN 'paid'::public.finance_status
    ELSE 'pending'::public.finance_status
  END,
  o.total,
  'Pedido ' || substr(o.id::text, 1, 8) || ' - ' || o.customer_name,
  CASE
    WHEN o.status = 'paid' THEN COALESCE(o.paid_at::date, CURRENT_DATE)
    ELSE COALESCE(o.created_at::date, CURRENT_DATE)
  END,
  fc.id,
  o.payment_method_id,
  o.id,
  true
FROM public.orders o
LEFT JOIN public.finance_categories fc
  ON fc.name = 'Vendas'
  AND fc.kind = 'revenue'
WHERE NOT EXISTS (
  SELECT 1
  FROM public.finance_transactions ft
  WHERE ft.order_id = o.id
    AND ft.is_auto = true
);
