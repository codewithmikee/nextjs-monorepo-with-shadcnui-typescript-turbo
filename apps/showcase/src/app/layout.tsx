/**
 * @author Mikiyas Birhanu And AI
 * @description Main layout for the showcase app
 */
import { Inter } from 'next/font/google';
import './globals.css';
import { Metadata } from 'next';
import AuthProvider from '@/components/auth-provider';
import Navbar from '@/components/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'NextJS Monorepo Showcase',
  description: 'Showcase of NextJS monorepo with Turborepo and modern frontend technologies',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1 container py-8">{children}</main>
            <footer className="py-6 border-t">
              <div className="container">
                <p className="text-center text-sm text-muted-foreground">
                  © {new Date().getFullYear()} NextJS Monorepo. All rights reserved.
                </p>
              </div>
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
