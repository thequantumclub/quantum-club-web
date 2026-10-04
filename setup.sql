-- DATABASE SETUP SCRIPT FOR QUANTUM CLUB TICKETING
-- Please run this script in your Supabase SQL Editor.

-- 1. Create Bookings Table
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

-- 2. Create Tickets Table
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

-- 3. Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

-- 4. Policies for Bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id);

-- 5. Policies for Tickets
CREATE POLICY "Users can view their own tickets" ON public.tickets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tickets" ON public.tickets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets" ON public.tickets
    FOR UPDATE USING (auth.uid() = user_id);
