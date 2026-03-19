export default function TermsPage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#fff7fa] via-[#fffafd] to-white py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-pink-100 bg-white p-6 shadow-sm sm:p-10">
          <h1 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl">Terms &amp; Conditions</h1>
          <p className="mb-8 text-sm leading-relaxed text-muted-foreground sm:text-base">
            These terms govern your use of Stuffed Happiness Hub. By using our website or placing an order, you agree to these terms.
          </p>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">1. Order Policy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              All orders are subject to product availability and confirmation. We reserve the right to cancel orders in case of pricing errors, stock issues, or suspicious activity.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">2. Payment Terms</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              We support secure payment options including Cash on Delivery and online payment gateways. Orders are processed only after successful payment or confirmation.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">3. Shipping Policy</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Delivery timelines may vary by location and logistics constraints. We aim to dispatch all confirmed orders promptly and keep customers updated.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">4. Return &amp; Refund Rules</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Returns and refunds are accepted as per our return policy for eligible products. Damaged or incorrect items must be reported within the specified timeline.
            </p>
          </section>

          <section className="mb-6">
            <h2 className="mb-2 text-xl font-semibold text-foreground">5. Cancellation Rules</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Orders can be cancelled while in pending status. Once packed or shipped, cancellation may not be possible.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold text-foreground">6. Liability Disclaimer</h2>
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              Stuffed Happiness Hub is not liable for indirect or consequential losses arising from website use, delivery delays, or third-party service interruptions.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
