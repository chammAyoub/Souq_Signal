import { Inter } from "next/font/google";
import "./globals.css";

import { Dancing_Script } from 'next/font/google';

const dancing = Dancing_Script({ subsets: ['latin'], weight: ['700'] });

// Configure the Inter font with latin subset
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply the Inter font globally */}
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}