// app/layout.tsx
import "./globals.css";
import { ShoppingListProvider } from "./context/ShoppingListContext";
import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata } from "next";

// Load fonts with typed config
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Typed metadata
export const metadata: Metadata = {
  title: "My Recipes",
  description: "A full-stack recipes app",
};

// Type for layout props
interface RootLayoutProps {
  children: React.ReactNode;
}

// Root layout component
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ShoppingListProvider>{children}</ShoppingListProvider>
      </body>
    </html>
  );
}
