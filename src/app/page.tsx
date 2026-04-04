import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { LandingView } from '@/components/LandingView';
import { DashboardView } from '@/components/DashboardView';

export default async function Page() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <DashboardView user={user} />;
  }

  return <LandingView />;
}
