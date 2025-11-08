-- Create pairs and pulses tables with permissive RLS for anon usage (demo/free plan)

-- Pairs table: pairing via simple invite code
CREATE TABLE IF NOT EXISTS public.pairs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.pairs ENABLE ROW LEVEL SECURITY;

-- Allow anyone to create or read pairs by code (no sensitive data stored)
CREATE POLICY "Anyone can create pair" ON public.pairs FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read pairs" ON public.pairs FOR SELECT USING (true);

-- Pulses table: events published to a pair
CREATE TABLE IF NOT EXISTS public.pulses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pair_code TEXT NOT NULL REFERENCES public.pairs(code) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  payload JSONB
);

ALTER TABLE public.pulses ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a pulse and read pulses for realtime demo
CREATE POLICY "Anyone can insert pulse" ON public.pulses FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read pulses" ON public.pulses FOR SELECT USING (true);

-- Enable realtime for these tables: ensure in dashboard Replication too
