import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
// import { CartProvider } from '@/app/contexts/CartContext';

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'DeClut - Sustainable Fashion Marketplace',
  description: 'Join the movement to declutter your closet and heal the planet. Shop unique pre-owned items and make a positive impact on the environment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakarta.variable} font-sans`}>
        {/* <CartProvider> */}
          {children}
        {/* </CartProvider> */}
      </body>
    </html>
  );
}
