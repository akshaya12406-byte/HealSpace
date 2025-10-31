'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/signup', '/pending-approval', '/signup/parental-consent'];
  const showLayout = !noLayoutRoutes.some(route => pathname.startsWith(route));


  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {showLayout && <Footer />}
    </div>
  );
}
