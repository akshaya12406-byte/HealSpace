'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from './navbar';
import Footer from './footer';

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const noLayoutRoutes = ['/login', '/signup', '/pending-approval'];
  const showLayout = !noLayoutRoutes.includes(pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {showLayout && <Navbar />}
      <main className="flex-grow">{children}</main>
      {showLayout && <Footer />}
    </div>
  );
}
