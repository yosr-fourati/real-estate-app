import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Indeed Immobilier | Agence Immobilière en Tunisie",
    template: "%s | Indeed Immobilier",
  },
  description:
    "Trouvez votre bien immobilier idéal en Tunisie. Vente et location d'appartements, villas, maisons et terrains.",
  keywords: ["immobilier tunisie", "vente appartement tunisie", "villa tunisie", "location tunisie"],
  openGraph: {
    title: "Indeed Immobilier",
    description: "Agence immobilière en Tunisie – Vente & Location",
    type: "website",
    locale: "fr_TN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <SessionProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Toaster />
        </SessionProvider>
        <Analytics />
      </body>
    </html>
  );
}
