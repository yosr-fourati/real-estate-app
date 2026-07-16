"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Phone, Instagram } from "lucide-react";

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
  const isAdmin = pathname.startsWith("/portail");

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
            <Image
              src="/indeed-logo.png"
              alt="Indeed Immobilier"
              width={260}
              height={80}
              className={`object-contain h-[72px] w-auto transition-all ${
                scrolled || !isHome ? "" : "brightness-0 invert"
              }`}
              priority
            />
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
            <div className="px-4 pt-1 flex gap-3">
              <a
                href="https://www.facebook.com/indeedimmobilier/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2 rounded-full text-sm font-medium hover:bg-gray-50"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                </svg>
                Facebook
              </a>
              <a
                href="https://www.instagram.com/indeed_immobilier/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 py-2 rounded-full text-sm font-medium hover:bg-gray-50"
              >
                <Instagram className="w-4 h-4" />
                Instagram
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
