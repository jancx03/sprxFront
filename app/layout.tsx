import "./globals.css";
import { ShoppingListProvider } from "./context/ShoppingListContext";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Recipes",
  description: "A full-stack recipes app",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ShoppingListProvider>
          {/* Navbar */}
          <header className="bg-gray-900 text-white border-b border-gray-700">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-6">
              <Link href="/recipes" className="hover:underline">
                Recipes
              </Link>
              <Link href="/shopping-list" className="hover:underline">
                Shopping List
              </Link>
              <Link href="/favorites" className="hover:underline">
                Favorites
              </Link>
            </div>
          </header>

          {/* Main content */}
          <main>{children}</main>
        </ShoppingListProvider>
      </body>
    </html>
  );
}
