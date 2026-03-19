import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-linear-to-b from-white/80 to-[#ffeef3]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 grid grid-cols-1 gap-10 md:grid-cols-3">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-accent shadow-md">
                <span className="text-lg text-white">💖</span>
              </div>
              <span className="text-lg font-bold text-foreground">Stuffed Happiness Hub</span>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              At Stuffed Happiness Hub, we create more than just plush toys — we create emotions. Every gift is designed to bring smiles, comfort, and unforgettable moments to your loved ones.
            </p>
          </div>

          <div>
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

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-foreground">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="transition-colors hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-primary">Contact Us</Link></li>
              <li><Link href="/privacy" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/terms" className="transition-colors hover:text-primary">Terms &amp; Conditions</Link></li>
            </ul>

            <div className="mt-6 flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="transition-colors hover:text-primary">Instagram</a>
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
