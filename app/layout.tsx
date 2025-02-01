import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts';
import "./globals.css";
import VehicleData from '@/app/ui/dvla'
// import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "Free Car Data Check",
  description: "Free service to check car, vehicle data",
};



export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}
        >
          {children}
          <VehicleData />
        
      </body>
    </html>
  )
}
