"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

interface GalleryImage {
  id: string;
  url: string;
  alt: string | null;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  title: string;
}

export default function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => setLightboxOpen(false);

  const prevLightbox = useCallback(() => {
    setLightboxIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const nextLightbox = useCallback(() => {
    setLightboxIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, prevLightbox, nextLightbox]);

  // Lock body scroll when lightbox open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="relative h-72 md:h-96 w-full rounded-2xl overflow-hidden bg-gray-200 flex items-center justify-center text-gray-400">
        Aucune image disponible
      </div>
    );
  }

  return (
    <>
      {/* ── Main large image ── */}
      <div className="relative h-72 md:h-[480px] w-full rounded-2xl overflow-hidden bg-gray-200 group cursor-pointer"
        onClick={() => openLightbox(activeIndex)}
      >
        <Image
          src={images[activeIndex].url}
          alt={images[activeIndex].alt ?? title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          priority
        />

        {/* Zoom hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/40 rounded-full p-3">
            <ZoomIn className="w-7 h-7 text-white" />
          </div>
        </div>

        {/* Prev / Next on main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i - 1 + images.length) % images.length); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image précédente"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setActiveIndex((i) => (i + 1) % images.length); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Image suivante"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-sm px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* ── Thumbnails strip ── */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-2">
          {images.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => { setActiveIndex(idx); openLightbox(idx); }}
              className={`relative h-20 rounded-lg overflow-hidden bg-gray-200 ring-2 transition-all ${
                idx === activeIndex ? "ring-brand-500 scale-[1.04]" : "ring-transparent hover:ring-brand-300"
              }`}
            >
              <Image src={img.url} alt={img.alt ?? title} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white bg-white/20 hover:bg-white/40 rounded-full p-2 z-10 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-4 py-1 rounded-full z-10">
            {lightboxIndex + 1} / {images.length}
          </div>

          {/* Prev arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prevLightbox(); }}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 z-10 transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-5xl max-h-[85vh] mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].alt ?? title}
              width={1200}
              height={800}
              className="object-contain w-full max-h-[85vh] rounded-lg"
            />
          </div>

          {/* Next arrow */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); nextLightbox(); }}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white bg-white/20 hover:bg-white/40 rounded-full p-3 z-10 transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
          )}

          {/* Thumbnail strip in lightbox */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4 overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(idx); }}
                className={`relative flex-shrink-0 w-14 h-10 rounded overflow-hidden ring-2 transition-all ${
                  idx === lightboxIndex ? "ring-white scale-110" : "ring-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
