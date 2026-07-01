import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Navbar from "@/components/ui/Navbar";
import CartDrawer from "@/components/ui/CartDrawer";
import { CartProvider } from "@/hooks/useCart";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Maison & Co. — Considered Goods",
  description:
    "A curated store of everyday essentials, sourced for craft and built to last.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex flex-1 flex-col">{children}</main>
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
