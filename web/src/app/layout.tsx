import type { Metadata } from "next";
import { inter, jakarta } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  title: "HigherStudy | Find the Right University. Connect with the Right Professor.",
  description: "Smart recommendations, powerful tracking and AI tools to help you get admitted to your dream university.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(inter.variable, jakarta.variable)} suppressHydrationWarning>
      <body className="min-h-screen bg-[#FAFAFE] text-slate-900 antialiased font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
