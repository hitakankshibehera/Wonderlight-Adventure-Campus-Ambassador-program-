import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/services/authContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'Wonderlight Campus Ambassador Program | Travel. Lead. Explore. Earn.',
  description: 'Become the official student representative of Wonderlight Adventure at your campus. Gain hands-on leadership, marketing, and event experience, earn travel credits and commissions, and unlock sponsored expeditions.',
  keywords: 'Campus Ambassador, Wonderlight Adventure, College Ambassador, Student Leadership, Travel Ambassador, Adventure Travel India',
  openGraph: {
    title: 'Wonderlight Campus Ambassador Program 2026–27',
    description: 'Your Campus. Your Network. Your Adventure. Applications open for student leaders across India.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-wonder-dark-950 text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        <AuthProvider>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">
            {children}
          </main>
          <Footer />
          <RoleSwitcher />
        </AuthProvider>
      </body>
    </html>
  );
}
