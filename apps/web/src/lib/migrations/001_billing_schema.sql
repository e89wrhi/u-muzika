-- ============================================================
-- U-Muzika full billing schema migration
-- Run in Supabase SQL editor (Dashboard > SQL Editor)
-- ============================================================

-- ─── 1. Extend user table ───────────────────────────────────────────────────
ALTER TABLE "user"
  ADD COLUMN IF NOT EXISTS credits             integer NOT NULL DEFAULT 50,
  ADD COLUMN IF NOT EXISTS stripe_customer_id  text    UNIQUE,
  ADD COLUMN IF NOT EXISTS subscription_tier   text    NOT NULL DEFAULT 'free'
    CHECK (subscription_tier IN ('free','pro','ultra')),
  ADD COLUMN IF NOT EXISTS subscription_status text    NOT NULL DEFAULT 'active'
    CHECK (subscription_status IN ('active','past_due','canceled','trialing'));

-- ─── 2. Subscriptions table ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id               text        NOT NULL REFERENCES "user"(clerk_id) ON DELETE CASCADE,
  stripe_subscription_id text        UNIQUE NOT NULL,
  stripe_customer_id     text        NOT NULL,
  stripe_price_id        text        NOT NULL,
  status                 text        NOT NULL DEFAULT 'active',
  current_period_start   timestamptz,
  current_period_end     timestamptz,
  cancel_at_period_end   boolean     NOT NULL DEFAULT false,
  canceled_at            timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_subscriptions_clerk_id        ON subscriptions(clerk_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_sub_id   ON subscriptions(stripe_subscription_id);

-- ─── 3. Credit transactions (full AI usage audit trail) ────────────────────
CREATE TABLE IF NOT EXISTS credit_transactions (
  id         uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id   text        NOT NULL REFERENCES "user"(clerk_id) ON DELETE CASCADE,
  amount     integer     NOT NULL,   -- positive = added, negative = spent
  action     text        NOT NULL,   -- 'purchase' | 'chat_message' | 'image_convert' | ...
  metadata   jsonb       NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_credit_tx_clerk_id   ON credit_transactions(clerk_id);
CREATE INDEX IF NOT EXISTS idx_credit_tx_created_at ON credit_transactions(created_at DESC);

-- ─── 4. Access keys (email-based API access) ─────────────────────────────
CREATE TABLE IF NOT EXISTS access_keys (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id     text        NOT NULL REFERENCES "user"(clerk_id) ON DELETE CASCADE,
  key          text        UNIQUE NOT NULL,
  label        text        NOT NULL DEFAULT 'Default key',
  is_active    boolean     NOT NULL DEFAULT true,
  expires_at   timestamptz,
  last_used_at timestamptz,
  usage_count  integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_access_keys_clerk_id ON access_keys(clerk_id);
CREATE INDEX IF NOT EXISTS idx_access_keys_key       ON access_keys(key);

-- ─── 5. RPC: atomic credit deduction (prevents race conditions) ─────────────
CREATE OR REPLACE FUNCTION deduct_credits(p_clerk_id text, p_amount integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_credits integer;
BEGIN
  SELECT credits INTO v_credits FROM "user" WHERE clerk_id = p_clerk_id FOR UPDATE;
  IF v_credits IS NULL THEN
    RETURN jsonb_build_object('success',false,'remaining',0,'error','user_not_found');
  END IF;
  IF v_credits < p_amount THEN
    RETURN jsonb_build_object('success',false,'remaining',v_credits,'error','insufficient_credits');
  END IF;
  UPDATE "user" SET credits = credits - p_amount, updated_at = now() WHERE clerk_id = p_clerk_id;
  RETURN jsonb_build_object('success',true,'remaining',v_credits - p_amount);
END;
$$;

-- ─── 6. RPC: atomic credit addition ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION add_credits(p_clerk_id text, p_amount integer)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_new_balance integer;
BEGIN
  UPDATE "user" SET credits = credits + p_amount, updated_at = now()
   WHERE clerk_id = p_clerk_id RETURNING credits INTO v_new_balance;
  IF v_new_balance IS NULL THEN
    RETURN jsonb_build_object('success',false,'new_balance',0);
  END IF;
  RETURN jsonb_build_object('success',true,'new_balance',v_new_balance);
END;
$$;

-- ─── 7. RLS ─────────────────────────────────────────────────────────────────
ALTER TABLE subscriptions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_keys          ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS automatically; the policies below cover anon/auth reads
CREATE POLICY IF NOT EXISTS "Own subscriptions"
  ON subscriptions FOR SELECT USING (clerk_id = current_setting('app.clerk_id',true));

CREATE POLICY IF NOT EXISTS "Own transactions"
  ON credit_transactions FOR SELECT USING (clerk_id = current_setting('app.clerk_id',true));

CREATE POLICY IF NOT EXISTS "Own access keys"
  ON access_keys FOR SELECT USING (clerk_id = current_setting('app.clerk_id',true));
