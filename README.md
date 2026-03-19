# Stuffed Happiness Hub - Premium E-Commerce Platform

A beautiful, fully functional e-commerce platform for emotional gifting with stuffed toys. Built with Next.js 16, React 19, Tailwind CSS, and TypeScript.

## Features

### Customer Experience
- **Homepage** with hero section, category showcase, and featured products
- **Product Catalog** with 12 unique stuffed animals at various price points (₹399-₹679)
- **Product Detail Pages** with descriptions, best-for tags, quantity selectors, and related products
- **Shopping Cart** with persistent localStorage, quantity management, and real-time calculations
- **Checkout Flow** with customer information form, payment method selection, and order simulation
- **Toast Notifications** for all key actions (add to cart, place order, etc.)
- **Responsive Design** optimized for mobile, tablet, and desktop

### Admin Panel
- **Secure Login** with demo credentials (demo@example.com / password123)
- **Orders Dashboard** displaying all orders with customer details, amounts, and status
- **Analytics Cards** showing total orders, delivered count, and revenue
- **Status Tracking** with Pending, Processing, Shipped, and Delivered states
- **Export UI** for potential order exports (UI only)

### Design System
- **Soft Pink Theme** (#FFC0CB primary color) with lavender and peach accents
- **Poppins Font** for a friendly, modern aesthetic
- **Rounded Corners** (rounded-2xl) throughout for a cute, approachable feel
- **Smooth Animations** including fade-in on load, scale on hover, and soft shadows
- **Mobile-First Responsive** design with sticky bottom CTAs

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **State Management**: React Context API
- **Notifications**: Sonner
- **Icons**: Lucide React
- **Forms**: React Hook Form
- **Database**: localStorage (client-side) for cart and auth persistence
- **Image Handling**: Next.js Image component

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Homepage
│   ├── (root)/
│   │   └── page.tsx            # Main routes
│   ├── product/[id]/
│   │   └── page.tsx            # Product detail page
│   ├── cart/
│   │   └── page.tsx            # Shopping cart
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   ├── login/
│   │   └── page.tsx            # Admin login
│   ├── admin-secret/
│   │   └── page.tsx            # Admin dashboard (protected)
│   └── globals.css             # Global styles with theme variables
├── components/
│   ├── shared/
│   │   ├── Navbar.tsx          # Navigation with cart badge
│   │   └── Footer.tsx          # Footer with links
│   ├── home/
│   │   ├── HeroSection.tsx     # Hero banner
│   │   ├── CategorySection.tsx # Category cards
│   │   ├── FeaturedProducts.tsx # Product grid
│   │   └── TestimonialsSection.tsx # Customer reviews
│   └── product/
│       └── ProductCard.tsx     # Product card component
├── context/
│   ├── CartContext.tsx         # Cart state management
│   └── AuthContext.tsx         # Admin auth state
├── lib/
│   ├── constants.ts            # Product data, testimonials, mock orders
│   └── types.ts                # TypeScript types
├── public/
│   └── images/
│       ├── products/           # 12 product images
│       └── hero-section.jpg    # Hero background
└── package.json
```

## Getting Started

### Install & Run
```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Key Routes

- `/` - Homepage with products and testimonials
- `/product/[id]` - Product detail page
- `/cart` - Shopping cart
- `/checkout` - Checkout form
- `/login` - Admin login
- `/admin-secret` - Protected admin dashboard

## Product Data

12 featured stuffed animals including:
- Teddy Bear Sweetheart (₹599)
- Bunny Buddy Plush (₹449)
- Puppy Love Cuddle (₹549)
- Angel Wings Bear (₹679)
- Rainbow Panda (₹499)
- Sleepy Koala (₹399)
- Floral Fox Friend (₹529)
- Unicorn Dreams (₹599)
- Penguin Pal (₹449)
- Hedgehog Hugger (₹479)
- Cat in Sweater (₹549)
- Whale Friend (₹579)

## Admin Credentials

**Email**: demo@example.com  
**Password**: password123

## Features Implemented

✅ Theme setup with soft pink color palette  
✅ Cart persistence using localStorage  
✅ Context-based state management  
✅ Product catalog with 12 items  
✅ Shopping cart with quantity controls  
✅ Checkout flow with form validation  
✅ Admin login and protected dashboard  
✅ Orders management interface  
✅ Toast notifications for all actions  
✅ Responsive mobile-first design  
✅ Smooth animations and transitions  
✅ Product search/filtering via categories  
✅ Mock order data and testimonials  
✅ Semantic HTML and accessibility  

## Mobile Optimizations

- Sticky bottom "Add to Cart" buttons on product pages
- Touch-friendly tap targets (44px minimum)
- Responsive grid layouts (2 cols mobile, 4 desktop)
- Full-width modals and forms
- Hamburger menu for navigation
- Optimized images with lazy loading

## Customization

### Change Theme Colors
Edit `/app/globals.css` and modify the `--primary` and accent color variables.

### Add More Products
Update `/lib/constants.ts` with new product data and images.

### Modify Admin Credentials
Edit `/context/AuthContext.tsx` and change `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

## Deployment

Ready to deploy to Vercel:
```bash
npm run build
vercel deploy
```

## License

Built with love for emotional gifting ❤️
