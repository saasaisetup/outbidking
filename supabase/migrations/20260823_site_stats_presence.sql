-- Migration: Create site_stats table, RLS, and increment_visitor_count function

-- 1. Create site_stats table
CREATE TABLE IF NOT EXISTS public.site_stats (
    id TEXT PRIMARY KEY,
    total_visitors BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Seed initial row with baseline count
INSERT INTO public.site_stats (id, total_visitors)
VALUES ('global', 142732)
ON CONFLICT (id) DO NOTHING;

-- 3. Configure Row Level Security (RLS) allowing public SELECT access
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on site_stats" ON public.site_stats;
CREATE POLICY "Allow public read access on site_stats"
    ON public.site_stats
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- 4. Create Postgres function increment_visitor_count() with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.increment_visitor_count()
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_count BIGINT;
BEGIN
    INSERT INTO public.site_stats (id, total_visitors, updated_at)
    VALUES ('global', 1, now())
    ON CONFLICT (id)
    DO UPDATE SET
        total_visitors = public.site_stats.total_visitors + 1,
        updated_at = now()
    RETURNING total_visitors INTO new_count;

    RETURN new_count;
END;
$$;

-- Grant execution to anon, authenticated, and service_role
GRANT EXECUTE ON FUNCTION public.increment_visitor_count() TO anon, authenticated, service_role;

-- 5. Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE site_stats;
