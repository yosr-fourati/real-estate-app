import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatPrice, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/utils";
import type { Property, PropertyImage, ListingType } from "@prisma/client";

type PropertyWithImage = Property & { images: PropertyImage[] };

export default function PropertyCard({ property }: { property: PropertyWithImage }) {
  const cover = property.images[0]?.url;

  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 group-hover:border-brand-200">
        {/* Image */}
        <div className="relative h-52 bg-gray-200 overflow-hidden">
          {cover ? (
            <Image
              src={cover}
              alt={property.images[0]?.alt ?? property.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Aucune image
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge className="bg-brand-500 text-white text-xs px-2 py-0.5">
              {LISTING_TYPE_LABELS[property.listingType as ListingType]}
            </Badge>
            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-white/90">
              {PROPERTY_TYPE_LABELS[property.type]}
            </Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-brand-500 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-3">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.city}
              {property.governorate ? `, ${property.governorate}` : ""}
            </span>
          </div>

          {/* Specs */}
          {(property.bedrooms || property.bathrooms || property.areaSqm) && (
            <div className="flex items-center gap-4 text-gray-500 text-xs mb-3">
              {property.bedrooms && (
                <span className="flex items-center gap-1">
                  <Bed className="w-3.5 h-3.5" />
                  {property.bedrooms}
                </span>
              )}
              {property.bathrooms && (
                <span className="flex items-center gap-1">
                  <Bath className="w-3.5 h-3.5" />
                  {property.bathrooms}
                </span>
              )}
              {property.areaSqm && (
                <span className="flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" />
                  {property.areaSqm} m²
                </span>
              )}
            </div>
          )}

          <p className="text-xl font-bold text-brand-500">
            {formatPrice(property.price, property.listingType as ListingType)}
          </p>
        </div>
      </div>
    </Link>
  );
}
