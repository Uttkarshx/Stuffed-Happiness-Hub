export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#fff7fa] via-[#fffafd] to-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl">Privacy Policy</h1>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            At Stuffed Happiness Hub, we value your trust and are committed to protecting your personal information.
            This policy explains what data we collect, how we use it, and how we keep it secure.
          </p>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">1. Introduction</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              By using our website, you agree to the collection and use of information as described in this policy.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">2. Data We Collect</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              We may collect your name, email address, phone number, and delivery address when you place orders or contact us.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">3. How We Use Your Data</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Your information is used to process orders, provide customer support, send order updates, and communicate important service information.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">4. Cookies</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              We use cookies and similar technologies to improve website performance, remember your preferences, and enhance your shopping experience.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">5. Data Protection</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              We use industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">6. Contact Us</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              For privacy-related questions, contact us at{' '}
              <a href="mailto:support@stuffedhappinesshub.com" className="text-primary hover:underline">
                support@stuffedhappinesshub.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
