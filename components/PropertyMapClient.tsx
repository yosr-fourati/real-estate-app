"use client";

import dynamic from "next/dynamic";

// Leaflet must be loaded client-side only (no SSR)
const PropertyMap = dynamic(() => import("@/components/PropertyMapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-400 text-sm">
      Chargement de la carte…
    </div>
  ),
});

interface Props {
  lat: number;
  lng: number;
  title: string;
}

export default function PropertyMapClient({ lat, lng, title }: Props) {
  return <PropertyMap lat={lat} lng={lng} title={title} />;
}
