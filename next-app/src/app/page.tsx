// src/app/page.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function LandingPage() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Subscribed:', email);
    setEmail('');
    alert('Thanks for subscribing!');
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111813] antialiased">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#dbe6df] bg-white/80 backdrop-blur-md px-6 lg:px-20 py-4">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#111813]">DeClut</span>
            </Link>
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/shop" className="text-sm font-semibold text-[#111813] hover:text-primary transition-colors">
                Shop
              </Link>
              <Link href="/sell" className="text-sm font-semibold text-[#111813] hover:text-primary transition-colors">
                Sell
              </Link>
              <Link href="/donate" className="text-sm font-semibold text-[#111813] hover:text-primary transition-colors">
                Donate
              </Link>
              <Link href="/" className="text-sm font-semibold text-[#111813] hover:text-primary transition-colors">
                Impact
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 justify-end items-center gap-6">
            <div className="hidden lg:flex w-full max-w-xs relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#61896f] text-xl">
                search
              </span>
              <input
                className="w-full bg-[#f0f4f2] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-[#61896f]"
                placeholder="Search curated styles..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/auth?mode=login"
                className="hidden sm:block px-5 py-2.5 text-sm font-bold text-[#111813] bg-[#f0f4f2] hover:bg-[#e2e9e5] rounded-xl transition-all"
              >
                Log In
              </Link>
              <Link
                href="/auth?mode=signup"
                className="px-5 py-2.5 text-sm font-bold text-[#111813] bg-primary hover:shadow-lg hover:shadow-primary/20 rounded-xl transition-all"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto">
        {/* Hero Section */}
        <section className="px-6 lg:px-20 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-8 order-2 lg:order-1">
              <div className="flex flex-col gap-4">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
                  <span className="material-symbols-outlined text-sm">eco</span>
                  Sustainable Marketplace
                </span>
                <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight text-[#111813]">
                  Fashion That <span className="text-primary underline decoration-primary/30">Feeds</span> the Earth
                </h1>
                <p className="text-lg lg:text-xl text-[#61896f] leading-relaxed max-w-xl">
                  Join the movement to declutter your closet and heal the planet. Shop unique pre-loved styles, sell your
                  extras, or donate to make a real-world impact.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="flex-1 sm:flex-none px-8 py-4 bg-primary text-[#111813] text-lg font-bold rounded-xl hover:shadow-xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-2"
                >
                  Shop Now <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
                <Link
                  href="/sell"
                  className="flex-1 sm:flex-none px-8 py-4 bg-[#f0f4f2] text-[#111813] text-lg font-bold rounded-xl hover:bg-[#e2e9e5] transition-all flex items-center justify-center gap-2 border border-[#dbe6df]"
                >
                  Sell Items
                </Link>
                <Link
                  href="/donate"
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-[#111813] text-[#111813] text-lg font-bold rounded-xl hover:bg-[#111813] hover:text-white transition-all"
                >
                  Donate
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  <div className="size-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                  </div>
                  <div className="size-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400"></div>
                  </div>
                  <div className="size-10 rounded-full border-2 border-white bg-gray-300 overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-400"></div>
                  </div>
                </div>
                <p className="text-sm font-medium text-[#61896f]">
                  <span className="text-[#111813] font-bold">4.2k+</span> people joined this week
                </p>
              </div>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Hero Image Placeholder
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur px-6 py-5 rounded-2xl flex justify-between items-center shadow-lg border border-white/20">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#61896f] uppercase tracking-wider">Top Curated Pick</span>
                    <span className="text-lg font-extrabold text-[#111813]">Vintage Silk Blazer</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-primary">$85.00</span>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 size-24 bg-primary/20 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -bottom-10 -left-10 size-48 bg-[#f0f4f2] rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </section>

        {/* Impact Stats Bar */}
        <section className="px-6 lg:px-20 py-8 bg-white border-y border-[#dbe6df]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl font-black text-[#111813]">10k+</span>
              <span className="text-sm font-semibold text-[#61896f]">Items Rehomed</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl font-black text-[#111813]">500k</span>
              <span className="text-sm font-semibold text-[#61896f]">Liters of Water Saved</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl font-black text-[#111813]">25k</span>
              <span className="text-sm font-semibold text-[#61896f]">kg CO2 Reduced</span>
            </div>
            <div className="flex flex-col items-center text-center gap-1">
              <span className="text-3xl font-black text-[#111813]">150+</span>
              <span className="text-sm font-semibold text-[#61896f]">Partner Charities</span>
            </div>
          </div>
        </section>

        {/* How DeClut Works */}
        <section className="px-6 lg:px-20 py-20 bg-background-light">
          <div className="flex flex-col gap-12">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-extrabold text-[#111813] mb-4">
                Making sustainable fashion easy for everyone.
              </h2>
              <p className="text-[#61896f] text-lg">
                Our circular platform connects your closet with a global community committed to the planet.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Buy */}
              <div className="group p-8 bg-white rounded-3xl border border-[#dbe6df] hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/5">
                <div className="size-14 bg-[#f0f4f2] group-hover:bg-primary transition-colors rounded-2xl flex items-center justify-center text-[#111813] mb-6">
                  <span className="material-symbols-outlined text-3xl">shopping_bag</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111813] mb-3">Buy</h3>
                <p className="text-[#61896f] leading-relaxed mb-6">
                  Discover high-quality vintage and pre-loved styles curated specifically for your taste. Quality checked
                  and verified.
                </p>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all"
                >
                  Start Shopping <span className="material-symbols-outlined">trending_flat</span>
                </Link>
              </div>
              {/* Sell */}
              <div className="group p-8 bg-white rounded-3xl border border-[#dbe6df] hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/5">
                <div className="size-14 bg-[#f0f4f2] group-hover:bg-primary transition-colors rounded-2xl flex items-center justify-center text-[#111813] mb-6">
                  <span className="material-symbols-outlined text-3xl">sell</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111813] mb-3">Sell</h3>
                <p className="text-[#61896f] leading-relaxed mb-6">
                  Our easy listing process takes less than 60 seconds. Get fast payouts and give your clothes a second
                  life.
                </p> 
                <Link
                  href="/Seller-dashboard/dashboard/seller/create-listing"
                  className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all"
                >
                  List an Item <span className="material-symbols-outlined">trending_flat</span>
                </Link>
              </div>
              {/* Donate */}
              <div className="group p-8 bg-white rounded-3xl border border-[#dbe6df] hover:border-primary transition-all hover:shadow-xl hover:shadow-primary/5">
                <div className="size-14 bg-[#f0f4f2] group-hover:bg-primary transition-colors rounded-2xl flex items-center justify-center text-[#111813] mb-6">
                  <span className="material-symbols-outlined text-3xl">volunteer_activism</span>
                </div>
                <h3 className="text-2xl font-bold text-[#111813] mb-3">Donate</h3>
                <p className="text-[#61896f] leading-relaxed mb-6">
                  Can't sell it? Donate to our network of eco-charities. We handle the logistics and provide a receipt.
                </p>
                <Link
                  href="/donate"
                  className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-3 transition-all"
                >
                  How to Donate <span className="material-symbols-outlined">trending_flat</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="px-6 lg:px-20 py-20 bg-white">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-4xl font-extrabold text-[#111813] mb-4">Curated for You</h2>
              <p className="text-[#61896f] text-lg">Fresh arrivals from the most conscious closets.</p>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 font-bold text-[#111813] hover:text-primary transition-colors"
            >
              View All Products <span className="material-symbols-outlined">grid_view</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Product Card 1 */}
            <ProductCard
              name="Organic Cotton Trench"
              brand="Burberry"
              size="M"
              price={120}
              impact="Saved 2,700L Water"
            />
            {/* Product Card 2 */}
            <ProductCard
              name="Vintage Denim Jacket"
              brand="Levi's"
              size="L"
              price={45}
              impact="1.2kg CO2 Saved"
            />
            {/* Product Card 3 */}
            <ProductCard
              name="Hemp Crewneck"
              brand="Patagonia"
              size="S"
              price={35}
              impact="Ethically Sourced"
            />
            {/* Product Card 4 */}
            <ProductCard
              name="Checked Wool Trousers"
              brand="Everlane"
              size="32"
              price={65}
              impact="Rare Vintage"
            />
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="px-6 lg:px-20 py-20">
          <div className="bg-primary/10 rounded-[3rem] p-8 lg:p-20 relative overflow-hidden flex flex-col items-center text-center gap-8">
            <div className="absolute top-0 right-0 size-64 bg-primary/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 size-64 bg-primary/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#111813] max-w-2xl leading-tight">
              Stay updated on slow fashion and sustainable living.
            </h2>
            <p className="text-[#61896f] text-lg max-w-xl">
              Get exclusive first access to curated drops and eco-impact tips delivered directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="w-full max-w-md flex flex-col sm:flex-row gap-3">
              <input
                className="flex-1 px-6 py-4 rounded-2xl bg-white border border-[#dbe6df] focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="Your email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="px-8 py-4 bg-primary text-[#111813] font-bold rounded-2xl hover:shadow-lg transition-all"
              >
                Join Us
              </button>
            </form>
            <p className="text-xs text-[#61896f]">No spam, just sustainability. Unsubscribe at any time.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#dbe6df] px-6 lg:px-20 py-16">
        <div className="max-w-[1440px] mx-auto grid grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="col-span-2 lg:col-span-2 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
                <span className="material-symbols-outlined">recycling</span>
              </div>
              <span className="text-xl font-extrabold tracking-tight">DeClut</span>
            </Link>
            <p className="text-[#61896f] max-w-xs leading-relaxed">
              We are building a future where fashion is circular, regenerative, and beautiful. Join our mission to reduce
              waste.
            </p>
            <div className="flex gap-4">
              <SocialLink href="#" icon="language" />
              <SocialLink href="#" icon="camera" />
              <SocialLink href="#" icon="mail" />
            </div>
          </div>
          <FooterColumn
            title="Marketplace"
            links={[
              { href: '/shop', label: 'Shop All' },
              { href: '/sell', label: 'Sell Items' },
              { href: '/new-arrivals', label: 'New Arrivals' },
              { href: '/top-sellers', label: 'Top Sellers' },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { href: '/mission', label: 'Our Mission' },
              { href: '/impact', label: 'Impact Report' },
              { href: '/careers', label: 'Careers' },
              { href: '/press', label: 'Press' },
            ]}
          />
          <FooterColumn
            title="Support"
            links={[
              { href: '/help', label: 'Help Center' },
              { href: '/shipping', label: 'Shipping Info' },
              { href: '/returns', label: 'Returns' },
              { href: '/contact', label: 'Contact Us' },
            ]}
          />
        </div>
        <div className="max-w-[1440px] mx-auto mt-16 pt-8 border-t border-[#f0f4f2] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-[#61896f]">© 2024 DeClut Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-xs text-[#61896f] hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-[#61896f] hover:text-primary transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-xs text-[#61896f] hover:text-primary transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Product Card Component
interface ProductCardProps {
  name: string;
  brand: string;
  size: string;
  price: number;
  impact: string;
}

function ProductCard({ name, brand, size, price, impact }: ProductCardProps) {
  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-gray-200 to-gray-300">
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">Product Image</div>
        <button className="absolute top-4 right-4 size-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#111813] hover:text-red-500 transition-colors">
          <span className="material-symbols-outlined">favorite</span>
        </button>
        <div className="absolute bottom-4 left-4 flex gap-2">
          <span className="px-3 py-1 bg-primary text-[#111813] text-[10px] font-bold rounded-lg uppercase">
            {impact}
          </span>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-base font-bold text-[#111813]">{name}</h3>
          <p className="text-sm text-[#61896f]">
            {brand} · Size {size}
          </p>
        </div>
        <p className="text-lg font-black text-[#111813]">${price}</p>
      </div>
    </div>
  );
}

// Footer Column Component
interface FooterColumnProps {
  title: string;
  links: Array<{ href: string; label: string }>;
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-bold text-[#111813]">{title}</h4>
      {links.map((link) => (
        <Link key={link.href} href={link.href} className="text-sm text-[#61896f] hover:text-primary transition-colors">
          {link.label}
        </Link>
      ))}
    </div>
  );
}

// Social Link Component
interface SocialLinkProps {
  href: string;
  icon: string;
}

function SocialLink({ href, icon }: SocialLinkProps) {
  return (
    <Link
      href={href}
      className="size-10 rounded-full border border-[#dbe6df] flex items-center justify-center hover:bg-primary transition-colors"
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </Link>
  );
}