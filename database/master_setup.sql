-- ==========================================
-- KALANGARA PAINT HOUSE - MASTER DATABASE SETUP
-- ==========================================
-- This file consolidates all structural and behavioral logic for the KPH database.

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE FUNCTIONS
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. CORE TABLES

-- Workers Table
CREATE TABLE IF NOT EXISTS public.workers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    phone TEXT,
    status TEXT DEFAULT 'Active',
    employee_image TEXT,
    joining_date DATE,
    resigning_date DATE,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    category TEXT, -- e.g., 'Interior', 'Exterior', 'Full Home'
    cover_image_url TEXT,
    completion_date DATE,
    date_format VARCHAR(20) DEFAULT 'full',
    sqft TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Work Images Table
CREATE TABLE IF NOT EXISTS public.work_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    location TEXT NOT NULL,
    image_url TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    state TEXT,
    district TEXT,
    interested_in TEXT,
    sqft TEXT,
    project_details TEXT,
    image_urls TEXT[] DEFAULT '{}',
    pdf_url TEXT,
    whatsapp_sent BOOLEAN DEFAULT false,
    whatsapp_status TEXT,
    whatsapp_response JSONB,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  image_url TEXT,
  review_text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Site Settings Table
CREATE TABLE IF NOT EXISTS public.site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WhatsApp Integration Tables
CREATE TABLE IF NOT EXISTS public.whatsapp_numbers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    phone_number TEXT NOT NULL,
    label TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.wati_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    api_endpoint TEXT NOT NULL DEFAULT '',
    api_key TEXT NOT NULL DEFAULT '',
    template_name TEXT NOT NULL DEFAULT 'enquiry_notification',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TRIGGERS
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_wati_settings_updated_at ON wati_settings;
CREATE TRIGGER update_wati_settings_updated_at BEFORE UPDATE ON wati_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. SECURITY & RLS

ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whatsapp_numbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wati_settings ENABLE ROW LEVEL SECURITY;

-- Anonymous Access (Public)
CREATE POLICY "Public Read Access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON reviews FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public Read Access" ON work_images FOR SELECT USING (is_published = true);
CREATE POLICY "Public Insert Enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Admin Access (Authenticated)
CREATE POLICY "Admin All Access" ON workers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access" ON work_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Read Enquiries" ON enquiries FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin All Access" ON projects FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access" ON reviews FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access" ON site_settings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Admin All Access" ON whatsapp_numbers FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin All Access" ON wati_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. STORAGE SETUP
-- Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('enquiry-pdfs', 'enquiry-pdfs', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('enquiry-attachments', 'enquiry-attachments', true) ON CONFLICT (id) DO NOTHING;

-- Storage Policies
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
CREATE POLICY "Public Uploads" ON storage.objects FOR INSERT WITH CHECK ( bucket_id IN ('uploads', 'enquiry-pdfs', 'enquiry-attachments') );
CREATE POLICY "Public Select" ON storage.objects FOR SELECT USING ( bucket_id IN ('uploads', 'enquiry-pdfs', 'enquiry-attachments') );

-- 7. ADMIN USER INITIALIZATION
DO $$
DECLARE
  user_id uuid;
BEGIN
  SELECT id INTO user_id FROM auth.users WHERE email = 'admin@gmail.com';
  IF user_id IS NOT NULL THEN
    UPDATE auth.users
    SET encrypted_password = crypt('admin@123', gen_salt('bf')),
        email_confirmed_at = now(),
        updated_at = now(),
        role = 'authenticated',
        aud = 'authenticated'
    WHERE id = user_id;
  ELSE
    INSERT INTO auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    VALUES ('00000000-0000-0000-0000-000000000000', gen_random_uuid(), 'authenticated', 'authenticated', 'admin@gmail.com', crypt('admin@123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now());
  END IF;
END $$;

-- 8. INITIAL DATA & CONFIG
INSERT INTO site_settings (key, value, description)
VALUES ('current_year', '2026', 'The current year displayed on the website.')
ON CONFLICT (key) DO UPDATE SET value = '2026', updated_at = NOW();

-- 9. MAINTENANCE
-- Daily PDF Cleanup (runs at midnight)
SELECT cron.schedule('daily-pdf-cleanup', '0 0 * * *', $$
  SELECT net.http_post(
    url:='https://ggbxrwqkymztlhsolkcc.supabase.co/functions/v1/cleanup-pdfs',
    headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) as request_id;
$$);

-- Database Keep-Alive (every 6 hours)
SELECT cron.schedule('keep-alive-ping', '0 */6 * * *', $$ SELECT 1; $$);

-- 10. SYSTEM FIXES (Internal)
DROP TRIGGER IF EXISTS "trg_send_admin_template" ON "public"."enquiries" CASCADE;
DROP FUNCTION IF EXISTS "public"."handle_new_enquiry"() CASCADE;
