import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AuthForm } from '@/components/auth/auth-form';

export default async function AuthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/insights');
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <AuthForm />
    </main>
  );
}
