import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import "./globals.css";
import DiscoverySidebar from "@/components/DiscoverySidebar";

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
            <aside className="w-1/4 bg-gray-100">
              <DiscoverySidebar />
            </aside>
            <main className="flex-1 p-4 overflow-y-auto">{children}</main>
            <aside className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
              <h2 className="text-xl font-semibold mb-4">Focused Collections</h2>
              {/* Focused collections and editing content will go here */}
            </aside>
          </div>
        </div>
      </body>
    </html>
  );
}