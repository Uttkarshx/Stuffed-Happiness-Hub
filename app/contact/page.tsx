'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill all fields before sending your message.');
      return;
    }

    toast.success('Message received. Our team will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-[#fff7fa] via-[#fffafd] to-white py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-foreground sm:text-5xl">Get in Touch</h1>
          <p className="mt-3 text-muted-foreground sm:text-lg">We’d love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-2xl font-semibold text-foreground">Contact Information</h2>
            <div className="space-y-4 text-sm sm:text-base">
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Email:</span>{' '}
                <a href="mailto:support@stuffedhappinesshub.com" className="text-primary hover:underline">
                  support@stuffedhappinesshub.com
                </a>
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Phone:</span> +91XXXXXXXXXX
              </p>
              <p className="text-muted-foreground">
                <span className="font-semibold text-foreground">Location:</span> Gurgaon, India
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="https://wa.me/919310457312"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-xl border border-pink-200 bg-linear-to-r from-[#ffe1ec] to-[#ffd2e3] px-5 py-3 text-sm font-semibold text-foreground transition-transform hover:-translate-y-0.5 sm:w-auto"
              >
                Chat on WhatsApp
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="mb-5 text-2xl font-semibold text-foreground">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="h-11 rounded-xl bg-white"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-11 rounded-xl bg-white"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message"
                  className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button type="submit" className="w-full rounded-xl bg-linear-to-r from-primary to-accent py-3 text-sm font-semibold text-white">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
