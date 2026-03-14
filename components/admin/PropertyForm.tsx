"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, type PropertyFormData } from "@/lib/validations";
import { GOVS, DELEGATIONS } from "@/data/tnLocations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, X, ImagePlus } from "lucide-react";
import Image from "next/image";
import type { Property, PropertyImage } from "@prisma/client";

type PropertyWithImages = Property & { images: PropertyImage[] };

interface Props {
  property?: PropertyWithImages;
}

export default function PropertyForm({ property }: Props) {
  const router = useRouter();
  const isEdit = !!property;

  const [images, setImages] = useState<string[]>(property?.images.map((i) => i.url) ?? []);
  const [uploading, setUploading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: property
      ? {
          title: property.title,
          description: property.description,
          price: property.price,
          city: property.city,
          governorate: property.governorate,
          type: property.type,
          listingType: property.listingType,
          address: property.address ?? "",
          latitude: property.latitude ?? undefined,
          longitude: property.longitude ?? undefined,
          bedrooms: property.bedrooms ?? undefined,
          bathrooms: property.bathrooms ?? undefined,
          areaSqm: property.areaSqm ?? undefined,
          isActive: property.isActive,
        }
      : { listingType: "SALE", isActive: true },
  });

  const governorate = watch("governorate");
  const delegations = governorate ? (DELEGATIONS[governorate] ?? []) : [];

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    const uploaded: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("propertyId", property?.id ?? "new");

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const { url } = await res.json();
          uploaded.push(url);
        } else {
          const err = await res.json();
          setServerError(err.error ?? "Erreur upload");
        }
      } catch {
        setServerError("Erreur réseau lors de l'upload");
      }
    }

    setImages((prev) => [...prev, ...uploaded]);
    setUploading(false);
    e.target.value = "";
  }

  async function onSubmit(data: PropertyFormData) {
    setServerError(null);
    try {
      const url = isEdit ? `/api/properties/${property.id}` : "/api/properties";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, images }),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(JSON.stringify(err.error ?? "Erreur serveur"));
        return;
      }

      router.push("/portail/properties");
      router.refresh();
    } catch {
      setServerError("Erreur réseau. Réessayez.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-sm">
          {serverError}
        </div>
      )}

      {/* Images */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <ImagePlus className="w-5 h-5 text-brand-500" />
          Photos du bien
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100">
              <Image src={url} alt={`image ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 text-xs bg-brand-500 text-white px-1.5 py-0.5 rounded">
                  Couverture
                </span>
              )}
            </div>
          ))}
          <label
            className={`aspect-square rounded-xl border-2 border-dashed border-gray-200 hover:border-brand-400 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              uploading ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            ) : (
              <>
                <Upload className="w-6 h-6 text-gray-400 mb-1" />
                <span className="text-xs text-gray-400">Ajouter</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>
        <p className="text-xs text-gray-400">Formats: JPG, PNG, WebP — Max 5MB par image</p>
      </div>

      {/* Main info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800">Informations principales</h2>

        <div>
          <Label htmlFor="title">Titre *</Label>
          <Input id="title" placeholder="Ex: Villa de luxe à La Marsa" className="mt-1" {...register("title")} />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="type">Type de bien *</Label>
            <select
              id="type"
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
              {...register("type")}
            >
              <option value="APARTMENT">Appartement</option>
              <option value="VILLA">Villa</option>
              <option value="HOUSE">Maison</option>
              <option value="LAND">Terrain</option>
              <option value="COMMERCIAL">Commercial</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <Label htmlFor="listingType">Transaction *</Label>
            <select
              id="listingType"
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
              {...register("listingType")}
            >
              <option value="SALE">À Vendre</option>
              <option value="RENT">À Louer</option>
            </select>
          </div>
        </div>

        <div>
          <Label htmlFor="price">Prix (TND) *</Label>
          <Input id="price" type="number" placeholder="Ex: 450000" className="mt-1" {...register("price")} />
          {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            rows={5}
            placeholder="Décrivez le bien en détail…"
            className="mt-1 resize-none"
            {...register("description")}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
        </div>
      </div>

      {/* Location */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800">Localisation</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="governorate">Gouvernorat *</Label>
            <select
              id="governorate"
              className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
              {...register("governorate")}
              onChange={(e) => {
                setValue("governorate", e.target.value);
                setValue("city", "");
              }}
            >
              <option value="">Sélectionner</option>
              {GOVS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.governorate && <p className="text-red-500 text-xs mt-1">{errors.governorate.message}</p>}
          </div>

          <div>
            <Label htmlFor="city">Délégation / Ville *</Label>
            {delegations.length > 0 ? (
              <select
                id="city"
                className="w-full mt-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
                {...register("city")}
              >
                <option value="">Sélectionner</option>
                {delegations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : (
              <Input id="city" placeholder="Ville" className="mt-1" {...register("city")} />
            )}
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="address">Adresse complète</Label>
          <Input id="address" placeholder="Rue, numéro…" className="mt-1" {...register("address")} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input id="latitude" type="number" step="any" placeholder="36.8065" className="mt-1" {...register("latitude")} />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input id="longitude" type="number" step="any" placeholder="10.1815" className="mt-1" {...register("longitude")} />
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h2 className="font-bold text-gray-800">Caractéristiques</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="bedrooms">Chambres</Label>
            <Input id="bedrooms" type="number" min="0" placeholder="0" className="mt-1" {...register("bedrooms")} />
          </div>
          <div>
            <Label htmlFor="bathrooms">Salles de bain</Label>
            <Input id="bathrooms" type="number" min="0" placeholder="0" className="mt-1" {...register("bathrooms")} />
          </div>
          <div>
            <Label htmlFor="areaSqm">Surface (m²)</Label>
            <Input id="areaSqm" type="number" min="0" placeholder="0" className="mt-1" {...register("areaSqm")} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isActive"
            {...register("isActive")}
            className="w-4 h-4 accent-brand-500"
          />
          <Label htmlFor="isActive" className="cursor-pointer">
            Bien actif (visible sur le site)
          </Label>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="flex-1"
        >
          Annuler
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || uploading}
          className="flex-1 bg-brand-500 hover:bg-brand-600 text-white"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              {isEdit ? "Modification…" : "Création…"}
            </>
          ) : isEdit ? (
            "Enregistrer les modifications"
          ) : (
            "Créer le bien"
          )}
        </Button>
      </div>
    </form>
  );
}
