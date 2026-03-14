import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import LeadForm from "@/components/LeadForm";
import PropertyMapClient from "@/components/PropertyMapClient";
import ImageGallery from "@/components/ImageGallery";
import { formatPrice, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/utils";
import { ArrowLeft, MapPin, Bed, Bath, Maximize2, Phone, MessageCircle, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";
import type { ListingType } from "@prisma/client";

type Props = { params: Promise<{ id: string }> };

async function getProperty(id: string) {
  return prisma.property.findUnique({
    where: { id, isActive: true },
    include: { images: { orderBy: { order: "asc" } } },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = await getProperty(id);
  if (!p) return { title: "Bien non trouvé" };
  return {
    title: p.title,
    description: p.description.slice(0, 160),
  };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { id } = await params;
  const property = await getProperty(id);
  if (!property) notFound();

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "21626454266";

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux annonces
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Images + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges */}
            <div className="flex gap-2">
              <Badge className="bg-brand-500 text-white text-sm">
                {LISTING_TYPE_LABELS[property.listingType]}
              </Badge>
              <Badge variant="secondary" className="text-sm">
                {PROPERTY_TYPE_LABELS[property.type]}
              </Badge>
            </div>

            {/* Image Gallery with lightbox */}
            <ImageGallery
              images={property.images.map((img) => ({
                id: img.id,
                url: img.url,
                alt: img.alt,
              }))}
              title={property.title}
            />

            {/* Title + Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>
                  {property.city}
                  {property.governorate ? `, ${property.governorate}` : ""}
                </span>
              </div>
              <p className="text-3xl font-bold text-brand-500 mt-3">
                {formatPrice(property.price, property.listingType)}
              </p>
            </div>

            {/* Specs */}
            {(property.bedrooms || property.bathrooms || property.areaSqm) && (
              <div className="flex gap-6 p-4 bg-white rounded-xl border border-gray-100">
                {property.bedrooms && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bed className="w-5 h-5 text-brand-500" />
                    <span className="font-semibold">{property.bedrooms}</span>
                    <span className="text-sm text-gray-500">chambres</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Bath className="w-5 h-5 text-brand-500" />
                    <span className="font-semibold">{property.bathrooms}</span>
                    <span className="text-sm text-gray-500">salles de bain</span>
                  </div>
                )}
                {property.areaSqm && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Maximize2 className="w-5 h-5 text-brand-500" />
                    <span className="font-semibold">{property.areaSqm}</span>
                    <span className="text-sm text-gray-500">m²</span>
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-3 text-gray-900">Description</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </div>

            {/* Map */}
            {!!property.latitude && !!property.longitude && (
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <h2 className="text-xl font-bold mb-3 text-gray-900">Localisation</h2>
                <div className="h-64 rounded-lg overflow-hidden">
                  <PropertyMapClient
                    lat={property.latitude}
                    lng={property.longitude}
                    title={property.title}
                  />
                </div>
              </div>
            )}

            {/* Date */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Calendar className="w-4 h-4" />
              Publié le {new Date(property.createdAt).toLocaleDateString("fr-TN")}
            </div>
          </div>

          {/* Right: Contact */}
          <div className="lg:col-span-1 space-y-4">
            {/* Quick contact */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-gray-900">Contacter l&apos;agence</h3>
              <div className="flex flex-col gap-3 mb-6">
                <a
                  href={`https://wa.me/${whatsapp}?text=Bonjour, je suis intéressé par: ${property.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </a>
                <a
                  href={`tel:+${whatsapp}`}
                  className="flex items-center justify-center gap-2 border-2 border-brand-500 text-brand-500 hover:bg-brand-50 py-3 px-4 rounded-xl font-semibold transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  Appeler
                </a>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-700 mb-3">Ou laissez vos coordonnées</h4>
                <LeadForm propertyId={property.id} propertyTitle={property.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
