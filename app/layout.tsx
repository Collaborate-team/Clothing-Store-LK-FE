import type { Metadata } from "next";
import "./globals.css";
import { Geist, Geist_Mono, Cormorant_Garamond, Montserrat } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
	title: "Online Clothing App",
	description: "Clothing Store LK front-end",
};

import { NotificationProvider } from '@/context/NotificationContext';
import { ModalProvider } from '@/context/ModalContext';

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} ${montserrat.variable} antialiased`}
      >
        <NotificationProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </NotificationProvider>
      </body>
    </html>
  );
}