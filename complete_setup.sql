-- QUANTUM CLUB DATABASE SETUP (COMPLETE & SAFE TO RE-RUN)
-- Run this entire script in your Supabase SQL Editor.

-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id text PRIMARY KEY,
    title text NOT NULL,
    date text NOT NULL,
    time text NOT NULL,
    location text NOT NULL,
    image text NOT NULL,
    ticket_price numeric NOT NULL,
    status text NOT NULL DEFAULT 'upcoming',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Bookings Table
CREATE TABLE IF NOT EXISTS public.bookings (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id text NOT NULL,
    quantity integer NOT NULL,
    amount numeric NOT NULL,
    utr text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'PENDING',
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add missing columns if they don't exist (from previous versions)
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_name text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_phone text;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS customer_email text;

-- 4. Create Tickets Table
CREATE TABLE IF NOT EXISTS public.tickets (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id uuid REFERENCES public.bookings(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    event_id text NOT NULL,
    ticket_number text NOT NULL UNIQUE,
    qr_token text NOT NULL UNIQUE,
    status text NOT NULL DEFAULT 'ACTIVE', -- ACTIVE or CLAIMED
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    claimed_at timestamp with time zone,
    claimed_by text
);

-- Add missing columns if they don't exist (from previous versions)
ALTER TABLE public.tickets ADD COLUMN IF NOT EXISTS customer_name text;


-- 5. Enable Row Level Security
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;


-- 6. DROP EXISTING POLICIES TO PREVENT ERRORS
DROP POLICY IF EXISTS "Admins can view admins" ON public.admins;
DROP POLICY IF EXISTS "Anyone can view events" ON public.events;
DROP POLICY IF EXISTS "Admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can insert their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admins can update all bookings" ON public.bookings;

DROP POLICY IF EXISTS "Users can view their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can insert their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Users can update their own tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can insert tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.tickets;
DROP POLICY IF EXISTS "Admins can update all tickets" ON public.tickets;


-- 7. RECREATE ALL POLICIES

-- Admins Policies
CREATE POLICY "Admins can view admins" ON public.admins FOR SELECT USING (auth.uid() = user_id);

-- Events Policies
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can insert events" ON public.events FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
CREATE POLICY "Admins can update events" ON public.events FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
CREATE POLICY "Admins can delete events" ON public.events FOR DELETE USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Bookings Policies
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
CREATE POLICY "Admins can update all bookings" ON public.bookings FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Tickets Policies
CREATE POLICY "Users can view their own tickets" ON public.tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own tickets" ON public.tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Verifying a booking inserts tickets owned by the customer, not the admin
CREATE POLICY "Admins can insert tickets" ON public.tickets FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all tickets" ON public.tickets FOR SELECT USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
CREATE POLICY "Admins can update all tickets" ON public.tickets FOR UPDATE USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Insert an initial dummy event just so the DB isn't empty
INSERT INTO public.events (id, title, date, time, location, image, ticket_price, status)
VALUES ('garba-night-2026', 'Garba Night 2026', 'Oct 24, 2026', '7:00 PM', 'Parbhani Stadium', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80', 800, 'featured')
ON CONFLICT (id) DO NOTHING;
