'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as { message?: string };
    if (maybeError.message) {
      return maybeError.message;
    }
  }
  return fallback;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: { email?: string; password?: string } = {};

    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your email';
    }
    if (!formData.password.trim()) {
      nextErrors.password = 'Please enter your password';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('Please fill in required fields');
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Logged in successfully!');
      router.push('/');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Invalid email or password'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Log in to your Stuffed Happiness account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card-soft space-y-6 p-8">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="block w-full" tabIndex={0}>
                <Button
                  type="button"
                  variant="outline"
                  disabled
                  className="h-11 w-full cursor-not-allowed rounded-full bg-white/70 text-foreground/80"
                  aria-label="Continue with Google - Coming soon"
                >
                  Continue with Google
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Coming soon
                  </span>
                </Button>
              </span>
            </TooltipTrigger>
            <TooltipContent side="top" sideOffset={8}>
              Coming soon
            </TooltipContent>
          </Tooltip>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">or continue with email</span>
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Email Address</label>
            <div className="relative">
              <Mail size={20} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full rounded-lg border bg-background py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-500' : 'border-border'
                }`}
              />
            </div>
            {errors.email && <p className="mt-2 text-xs text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-background py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? 'border-red-500' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-primary" />
              <span className="text-muted-foreground">Remember me</span>
            </label>
            <Link href="#" className="text-primary hover:text-primary/80">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-linear-to-r from-primary to-accent hover:shadow-lg disabled:opacity-75"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 rounded-lg border border-border bg-muted/50 p-4">
          <p className="text-sm text-muted-foreground mb-2">Demo credentials:</p>
          <p className="text-xs text-muted-foreground">Email: demo@example.com</p>
          <p className="text-xs text-muted-foreground">Password: password123</p>
        </div>

        {/* Sign Up Link */}
        <p className="text-center mt-8 text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-semibold">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
