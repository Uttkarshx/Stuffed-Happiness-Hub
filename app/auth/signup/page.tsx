'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Mail, Lock, User, Phone, Eye, EyeOff, Check } from 'lucide-react';
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

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nextErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Please enter your name';
    }
    if (!formData.email.trim()) {
      nextErrors.email = 'Please enter your email';
    }
    if (!formData.phone.trim()) {
      nextErrors.phone = 'Please enter your phone number';
    }
    if (!formData.password.trim()) {
      nextErrors.password = 'Please enter a password';
    }
    if (formData.password.length < 6) {
      nextErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      toast.error('Please fix form errors');
      return;
    }

    setIsLoading(true);
    try {
      await signup(formData.name, formData.email, formData.phone, formData.password);
      toast.success('Account created successfully!');
      router.push('/');
    } catch (error: unknown) {
      toast.error(getErrorMessage(error, 'Failed to create account'));
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = formData.password.length >= 8 ? 'strong' : formData.password.length >= 6 ? 'good' : 'weak';

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join Stuffed Happiness Hub today</p>
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
              <span className="bg-white px-2 text-muted-foreground">or sign up with email</span>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Full Name</label>
            <div className="relative">
              <User size={20} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full rounded-lg border bg-background py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.name ? 'border-red-500' : 'border-border'
                }`}
              />
            </div>
            {errors.name && <p className="mt-2 text-xs text-red-600">{errors.name}</p>}
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

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Phone Number</label>
            <div className="relative">
              <Phone size={20} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91XXXXXXXXXX"
                className={`w-full rounded-lg border bg-background py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.phone ? 'border-red-500' : 'border-border'
                }`}
              />
            </div>
            {errors.phone && <p className="mt-2 text-xs text-red-600">{errors.phone}</p>}
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
            {formData.password && (
              <div className="mt-2 flex items-center gap-2">
                <div className={`h-1.5 flex-1 rounded-full ${
                  passwordStrength === 'strong' ? 'bg-green-500' :
                  passwordStrength === 'good' ? 'bg-yellow-500' :
                  'bg-red-500'
                }`} />
                <span className="text-xs font-semibold text-muted-foreground capitalize">{passwordStrength}</span>
              </div>
            )}
            {errors.password && <p className="mt-2 text-xs text-red-600">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">Confirm Password</label>
            <div className="relative">
              <Lock size={20} className="absolute left-3 top-3.5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-background py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.confirmPassword ? 'border-red-500' : 'border-border'
                }`}
              />
              {formData.password === formData.confirmPassword && formData.confirmPassword && (
                <Check size={20} className="absolute right-3 top-3.5 text-green-500" />
              )}
            </div>
            {errors.confirmPassword && <p className="mt-2 text-xs text-red-600">{errors.confirmPassword}</p>}
          </div>

          {/* Terms & Conditions */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded accent-primary mt-1" />
            <span className="text-xs text-muted-foreground">
              I agree to the{' '}
              <Link href="#" className="text-primary hover:underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link href="#" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            size="lg"
            className="w-full bg-linear-to-r from-primary to-accent hover:shadow-lg disabled:opacity-75"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-8 text-muted-foreground">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold">
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
