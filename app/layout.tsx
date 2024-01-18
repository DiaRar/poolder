import type { Metadata } from "next";
import { clsx } from "clsx";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Transaction Dashboard",
  description: "This is a dashboard of transactions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(inter.className, "h-screen")}>{children}</body>
    </html>
  );
}
