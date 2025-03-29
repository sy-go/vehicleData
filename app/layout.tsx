import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts';
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Free vehicle data check",
  description: "Free service to check car, mot check, vehicle data",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
          {children}     
          <Analytics debug={true}/>
      </body>
    </html>
  )
}
