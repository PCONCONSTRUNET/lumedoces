ALTER TYPE finance_status ADD VALUE IF NOT EXISTS 'refunded';
ALTER TYPE finance_status ADD VALUE IF NOT EXISTS 'failed';

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_status finance_status DEFAULT 'pending'::finance_status;
