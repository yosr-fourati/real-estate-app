import Link from "next/link";
import { Building2, Phone, Mail, Instagram, MapPin } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21626454266";

  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-6">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white text-lg">Indeed Immobilier</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Votre agence immobilière de confiance en Tunisie. Vente, location et gestion de biens immobiliers.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="font-semibold text-white mb-4">Navigation</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-orange-400 transition-colors">Accueil</Link></li>
            <li><Link href="/properties" className="hover:text-orange-400 transition-colors">Annonces</Link></li>
            <li><Link href="/properties?listingType=SALE" className="hover:text-orange-400 transition-colors">À Vendre</Link></li>
            <li><Link href="/properties?listingType=RENT" className="hover:text-orange-400 transition-colors">À Louer</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-semibold text-white mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <a href={`tel:+${whatsapp}`} className="hover:text-orange-400 transition-colors">
                +{whatsapp}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
              <a href="mailto:fouratiimmo@gmail.com" className="hover:text-orange-400 transition-colors">
                fouratiimmo@gmail.com
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
              <span>Tunis, Tunisie</span>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-orange-400 transition-colors"
              >
                <Instagram className="w-4 h-4 text-orange-400" />
                Instagram
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
        © {year} Indeed Immobilier. Tous droits réservés.
      </div>
    </footer>
  );
}
