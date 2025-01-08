import type { Metadata } from "next";
import { inter } from '@/app/ui/fonts';
import "./globals.css";
import VehicleData from '@/app/ui/dvla'


export const metadata: Metadata = {
  title: "Free Car Data Check",
  description: "Free service to check car, vehicle data",
};

import { ThemeProvider } from 'next-themes'

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
