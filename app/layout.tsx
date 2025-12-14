import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LightPillar from "@/components/LightPillar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative min-h-screen overflow-x-hidden bg-gray-900`}
      >
        <div className="fixed inset-0 z-0 pointer-events-none">
           <LightPillar 
             intensity={1.2}
             rotationSpeed={0.2}
             interactive={true}
             topColor="#4338ca" 
             bottomColor="#3b82f6" 
             pillarWidth={5.0}
           />
        </div>
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
