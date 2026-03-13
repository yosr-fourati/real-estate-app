"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/properties", label: "Annonces" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21626454266";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? "bg-white shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {scrolled || !isHome ? (
              <Image
                src="/indeed-logo.png"
                alt="Indeed Immobilier"
                width={180}
                height={56}
                className="object-contain h-14 w-auto"
                priority
              />
            ) : (
              <span className="font-bold text-xl text-white drop-shadow-md">
                Indeed immobilier
              </span>
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? scrolled || !isHome
                      ? "text-brand-500"
                      : "text-white font-semibold"
                    : scrolled || !isHome
                    ? "text-gray-700 hover:text-brand-500"
                    : "text-white/90 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              Nous contacter
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className={`md:hidden ${scrolled || !isHome ? "text-gray-700" : "text-white"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 space-y-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 text-sm font-medium rounded-lg ${
                  pathname === href
                    ? "text-brand-500 bg-brand-50"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-brand-500 text-white py-2 rounded-full text-sm font-semibold"
              >
                <Phone className="w-4 h-4" />
                Nous contacter
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
