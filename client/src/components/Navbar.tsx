import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isHome = location.pathname === "/";

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-500 ${
        scrolled || !isHome
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-white/10 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        >
          <img
            src="/indeed-logo.png"
            alt="Indeed Immobilier Logo"
            className="w-16 h-auto"
          />
          <span
            className={`text-2xl font-bold tracking-tight ${
              scrolled || !isHome ? "text-[#002B5B]" : "text-white drop-shadow-md"
            }`}
          >
            Indeed Immobilier
          </span>
        </Link>

        {/* Links */}
        <div
          className={`hidden md:flex items-center space-x-10 font-medium ${
            scrolled || !isHome ? "text-[#002B5B]" : "text-white"
          }`}
        >
          <Link
            to="/"
            className="relative group transition-all duration-300"
          >
            Accueil
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#002B5B] group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            to="/properties"
            className="relative group transition-all duration-300"
          >
            Biens
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#002B5B] group-hover:w-full transition-all duration-300"></span>
          </Link>

          <a
            href="https://www.instagram.com/indeed_immobilier/"
            target="_blank"
            rel="noopener noreferrer"
            className="relative group transition-all duration-300"
          >
            Instagram
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#002B5B] group-hover:w-full transition-all duration-300"></span>
          </a>
        </div>

        {/* Call-to-action */}
        <a
          href="https://wa.me/21626454266"
          target="_blank"
          rel="noopener noreferrer"
          className={`hidden md:inline-block px-5 py-2 rounded-full font-semibold transition-all duration-300 border ${
            scrolled || !isHome
              ? "bg-[#002B5B] text-white border-[#002B5B] hover:bg-white hover:text-[#002B5B]"
              : "bg-white/20 text-white border-white hover:bg-white hover:text-[#002B5B]"
          }`}
        >
          Contact
        </a>
      </div>
    </nav>
  );
}
