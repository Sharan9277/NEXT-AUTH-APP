"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import TranslatorWrapper from '@/components/TranslatorWrapper';


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>AssignTutors</title>
      </head>
      <body>
        <SessionProvider>

            <TranslatorWrapper>
              {children}
            </TranslatorWrapper>

        </SessionProvider>
      </body>
    </html>
  );
}