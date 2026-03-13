import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import { Building2, Home, TreePine, TrendingUp, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getFeaturedProperties() {
  return prisma.property.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}

async function getStats() {
  const [total, forSale, forRent] = await Promise.all([
    prisma.property.count({ where: { isActive: true } }),
    prisma.property.count({ where: { isActive: true, listingType: "SALE" } }),
    prisma.property.count({ where: { isActive: true, listingType: "RENT" } }),
  ]);
  return { total, forSale, forRent };
}

export default async function HomePage() {
  const [properties, stats] = await Promise.all([getFeaturedProperties(), getStats()]);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21626454266";

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background photo — blurred */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1920&q=80')",
          }}
        />
        {/* Strong dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55" />
        {/* Brand-colored gradient rising from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#002B5B]/80 via-transparent to-black/20" />

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          {/* Frosted-glass badge */}
          <div className="inline-flex items-center bg-white/10 backdrop-blur-md border border-white/25 rounded-full px-5 py-2 mb-8 shadow-lg">
            <span className="text-white text-xs font-semibold tracking-widest uppercase">
              Agence Immobilière de Confiance
            </span>
          </div>

          <h1
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight drop-shadow-lg"
          >
            Trouvez votre bien
            <span style={{ color: "#002B5B" }}> idéal</span>
            <br />en Tunisie
          </h1>
          <p className="text-gray-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto drop-shadow">
            Vente et location d&apos;appartements, villas, maisons et terrains dans toute la Tunisie.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-brand-500 text-white py-6">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold">{stats.total}+</p>
            <p className="text-brand-100 text-sm">Biens disponibles</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.forSale}+</p>
            <p className="text-brand-100 text-sm">À vendre</p>
          </div>
          <div>
            <p className="text-3xl font-bold">{stats.forRent}+</p>
            <p className="text-brand-100 text-sm">À louer</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-3 text-gray-900">
            Nos Catégories
          </h2>
          <p className="text-gray-500 text-center mb-10">Explorez par type de bien</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Appartements", icon: Building2, type: "APARTMENT" },
              { label: "Villas", icon: Home, type: "VILLA" },
              { label: "Terrains", icon: TreePine, type: "LAND" },
              { label: "Commerciaux", icon: TrendingUp, type: "COMMERCIAL" },
            ].map(({ label, icon: Icon, type }) => (
              <Link
                key={type}
                href={`/properties?type=${type}`}
                className="group bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md hover:border-brand-500 border-2 border-transparent transition-all"
              >
                <div className="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-brand-500 transition-colors">
                  <Icon className="w-7 h-7 text-brand-500 group-hover:text-white transition-colors" />
                </div>
                <p className="font-semibold text-gray-800">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      {properties.length > 0 && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Biens en Vedette</h2>
                <p className="text-gray-500 mt-1">Nos dernières annonces</p>
              </div>
              <Link href="/properties">
                <Button variant="outline" className="border-brand-500 text-brand-500 hover:bg-brand-50">
                  Voir tout
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Contact */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous cherchez un bien spécifique ?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Contactez-nous directement et nous trouverons le bien idéal pour vous.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              <MessageCircle className="w-5 h-5" />
              WhatsApp
            </a>
            <a
              href={`tel:+${whatsapp}`}
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-8 py-3 rounded-full font-semibold transition-colors"
            >
              <Phone className="w-5 h-5" />
              Appeler maintenant
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
