'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { toast } from 'sonner';

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, login, signup } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => setMounted(true), []);

  const isAuthRoute = useMemo(() => pathname.startsWith('/auth'), [pathname]);

  useEffect(() => {
    if (isAuthenticated && isAuthRoute) {
      router.replace('/');
    }
  }, [isAuthenticated, isAuthRoute, router]);

  if (!mounted) return null;

  if (isAuthenticated || isAuthRoute) {
    return <>{children}</>;
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password || (!isLogin && (!form.name || !form.phone))) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await signup(form.name, form.email, form.phone, form.password);
      }
      toast.success('Welcome to Stuffed Happiness Hub!');
      router.replace('/');
    } catch (error) {
      toast.error(getErrorMessage(error, 'Authentication failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#fff4f7] via-[#fff9f7] to-[#fef5ff] px-4 py-10">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 rounded-3xl border border-border bg-white/80 p-6 shadow-[0_20px_50px_rgba(255,111,145,0.16)] backdrop-blur lg:grid-cols-2 lg:p-10">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Welcome to Stuffed Happiness Hub 🧸💖</h1>
          <p className="mt-4 text-muted-foreground">Login or create account to start shopping</p>
          <div className="mt-8 space-y-3 rounded-2xl border border-border bg-muted/35 p-4 text-sm text-muted-foreground">
            <p>Gift smiles with adorable plushies.</p>
            <p>Track orders and save wishlist in one place.</p>
            <p>Exclusive offers unlock after login.</p>
          </div>
        </div>

        <form onSubmit={submit} className="card-soft space-y-4 p-6">
          <div className="mb-2 flex rounded-full bg-muted p-1">
            <button type="button" onClick={() => setIsLogin(true)} className={`flex-1 rounded-full py-2 text-sm ${isLogin ? 'bg-white text-foreground shadow' : 'text-muted-foreground'}`}>Login</button>
            <button type="button" onClick={() => setIsLogin(false)} className={`flex-1 rounded-full py-2 text-sm ${!isLogin ? 'bg-white text-foreground shadow' : 'text-muted-foreground'}`}>Sign Up</button>
          </div>

          {!isLogin && (
            <div className="relative">
              <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <input className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm" placeholder="Full name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>

          {!isLogin && (
            <div className="relative">
              <Phone size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <input className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm" placeholder="Phone" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} />
            </div>
          )}

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
            <input type="password" className="w-full rounded-xl border border-border bg-white py-2.5 pl-9 pr-3 text-sm" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} />
          </div>

          <Button type="button" variant="outline" disabled className="w-full rounded-full">Continue with Google (Coming soon)</Button>
          <Button type="submit" disabled={loading} className="w-full rounded-full bg-linear-to-r from-primary to-accent text-white">
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
          </Button>
        </form>
      </div>
    </div>
  );
}
