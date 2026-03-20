import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-linear-to-b from-white/85 via-[#fff2f6] to-[#ffe9f1]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="card-soft mb-10 grid grid-cols-1 gap-10 p-6 md:grid-cols-3 md:p-8">
          <div className="text-center md:text-left">
            <div className="mb-4 flex items-center justify-center gap-3 md:justify-start">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent shadow-md">
                <span className="text-lg text-white">💖</span>
              </div>
              <span className="text-lg font-bold text-foreground">Stuffed Happiness Hub</span>
            </div>
            <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground md:mx-0">
              At Stuffed Happiness Hub, we create more than just plush toys — we create emotions. Every gift is designed to bring smiles, comfort, and unforgettable moments to your loved ones.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">Explore</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/shop" className="transition-colors hover:text-primary">Shop All Gifts</Link></li>
              <li><Link href="/shop?category=girlfriend" className="transition-colors hover:text-primary">For Girlfriend</Link></li>
              <li><Link href="/shop?category=kids" className="transition-colors hover:text-primary">For Kids</Link></li>
              <li><Link href="/shop?category=friends" className="transition-colors hover:text-primary">For Friends</Link></li>
              <li><Link href="/shop?category=family" className="transition-colors hover:text-primary">For Family</Link></li>
              <li><Link href="/wishlist" className="transition-colors hover:text-primary">Wishlist</Link></li>
            </ul>
          </div>

          <div className="text-center md:text-left">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="transition-colors hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">Contact Us</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-primary">Terms &amp; Conditions</Link></li>
            </ul>

            <h3 className="mb-3 mt-6 text-sm font-semibold uppercase tracking-wide text-foreground">Follow Us</h3>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground md:justify-start">
              <a
                href="https://www.instagram.com/stuffed_happiness_hub"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 transition-colors hover:text-primary"
              >
                <Instagram size={15} />
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-7">
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">© 2026 Stuffed Happiness Hub. All rights reserved.</p>
            <p className="text-xs text-muted-foreground">Made with ❤️ for heartfelt gifting moments.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
