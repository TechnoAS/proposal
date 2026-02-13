import type { Metadata } from "next";
import { Pacifico, Nunito } from "next/font/google";
import "./globals.css";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

import MusicPlayer from "./components/MusicPlayer";

export const metadata: Metadata = {
  title: "A Special Question...",
  description: "For my Valentine",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${pacifico.variable} ${nunito.variable} antialiased font-nunito`}
      >
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
