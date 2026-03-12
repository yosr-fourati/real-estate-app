import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, Instagram, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21626454266";

  return (
    <footer className="bg-[#002B5B] text-gray-300 pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <div className="mb-4">
            <Image
              src="/indeed-logo.png"
              alt="Indeed Immobilier"
              width={140}
              height={44}
              className="object-contain brightness-0 invert"
            />
          </div>
          <p className="text-sm text-blue-200 leading-relaxed">
            Votre agence immobilière de confiance en Tunisie. Vente, location et gestion de biens immobiliers.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-white mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white transition-colors">Accueil</Link></li>
            <li><Link href="/properties" className="hover:text-white transition-colors">Annonces</Link></li>
            <li><Link href="/properties?listingType=SALE" className="hover:text-white transition-colors">À Vendre</Link></li>
            <li><Link href="/properties?listingType=RENT" className="hover:text-white transition-colors">À Louer</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-blue-300 flex-shrink-0" />
              <a href={`tel:+${whatsapp}`} className="hover:text-white transition-colors">
                +{whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-300 flex-shrink-0" />
              <a href="mailto:fouratiimmo@gmail.com" className="hover:text-white transition-colors">
                fouratiimmo@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
              <span>Tunis, Tunisie</span>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-blue-300" />
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-900 pt-6 text-center text-xs text-blue-300">
        © {year} Indeed Immobilier. Tous droits réservés.
      </div>
    </footer>
  );
}
