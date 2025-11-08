-- Function to get total waitlist signups, accessible to public (anon)
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM public.waitlist;
$$;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon, authenticated;
