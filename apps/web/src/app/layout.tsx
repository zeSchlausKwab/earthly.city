import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";
import DiscoverySidebar from "@/components/DiscoverySidebar";
import RightSidebar from "@/components/RightSibebar";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Earthly Land",
  description: "A social geojson editor built on nostr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col h-screen">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-1/4 p-4">
              <DiscoverySidebar />
            </aside>
            <main className="flex-1 p-4">{children}</main>
            <aside className="w-1/4 p-4">
              <RightSidebar />
            </aside>
          </div>
        </div>
        <Toaster />
      </body>
    </html>
  );
}