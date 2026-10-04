-- Database migration for Quantum Club Registrations

CREATE TABLE IF NOT EXISTS public.registrations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id text NOT NULL,
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text,
  attendee_count integer NOT NULL,
  message text,
  consent boolean NOT NULL,
  status text NOT NULL DEFAULT 'PAYMENT_PENDING',
  ticket_status text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (users registering)
CREATE POLICY "Enable insert for anonymous users" ON public.registrations
  FOR INSERT WITH CHECK (true);

-- Allow anonymous reads for verification (by reference or utr)
CREATE POLICY "Enable read access for anonymous users" ON public.registrations
  FOR SELECT USING (true);

-- Allow anonymous updates ONLY if status is PAYMENT_PENDING
CREATE POLICY "Enable update for anonymous users" ON public.registrations
  FOR UPDATE USING (status = 'PAYMENT_PENDING') WITH CHECK (status = 'PAYMENT_PENDING' OR status = 'PENDING_MANUAL_VERIFICATION');

-- Enforce UTR Uniqueness at the database level to prevent race conditions
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_utr 
ON public.registrations ((metadata->>'utr')) 
WHERE metadata->>'utr' IS NOT NULL;

-- Enforce Booking Reference Uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS idx_registrations_unique_reference
ON public.registrations ((metadata->>'reference'))
WHERE metadata->>'reference' IS NOT NULL;
