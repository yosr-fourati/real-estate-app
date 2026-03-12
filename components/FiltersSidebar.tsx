"use client";

import { useRouter, usePathname } from "next/navigation";
import { GOVS, DELEGATIONS } from "@/data/tnLocations";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROPERTY_TYPES = [
  { value: "", label: "Tous types" },
  { value: "APARTMENT", label: "Appartement" },
  { value: "VILLA", label: "Villa" },
  { value: "HOUSE", label: "Maison" },
  { value: "LAND", label: "Terrain" },
  { value: "COMMERCIAL", label: "Commercial" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Plus récent" },
  { value: "price_asc", label: "Prix croissant" },
  { value: "price_desc", label: "Prix décroissant" },
];

interface Props {
  currentParams: Record<string, string | undefined>;
}

export default function FiltersSidebar({ currentParams }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function update(key: string, value: string) {
    const params = new URLSearchParams(
      Object.entries(currentParams).filter(([, v]) => v !== undefined) as [string, string][]
    );
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params}`);
  }

  function reset() {
    router.push(pathname);
  }

  const delegations = currentParams.governorate
    ? (DELEGATIONS[currentParams.governorate] ?? [])
    : [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5 sticky top-24">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-orange-500" />
          Filtres
        </h2>
        <button
          onClick={reset}
          className="text-xs text-gray-400 hover:text-orange-500 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Réinitialiser
        </button>
      </div>

      {/* Listing type */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Transaction
        </label>
        <select
          value={currentParams.listingType ?? ""}
          onChange={(e) => update("listingType", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
        >
          <option value="">Toutes</option>
          <option value="SALE">À Vendre</option>
          <option value="RENT">À Louer</option>
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Type de bien
        </label>
        <select
          value={currentParams.type ?? ""}
          onChange={(e) => update("type", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
        >
          {PROPERTY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* Governorate */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Gouvernorat
        </label>
        <select
          value={currentParams.governorate ?? ""}
          onChange={(e) => {
            update("governorate", e.target.value);
            update("city", "");
          }}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
        >
          <option value="">Tous</option>
          {GOVS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {/* Delegation */}
      {delegations.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Délégation
          </label>
          <select
            value={currentParams.city ?? ""}
            onChange={(e) => update("city", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
          >
            <option value="">Toutes</option>
            {delegations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Price range */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Budget (TND)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={currentParams.minPrice ?? ""}
            onChange={(e) => update("minPrice", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
          />
          <input
            type="number"
            placeholder="Max"
            value={currentParams.maxPrice ?? ""}
            onChange={(e) => update("maxPrice", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
          />
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
          Trier par
        </label>
        <select
          value={currentParams.sort ?? "newest"}
          onChange={(e) => update("sort", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-orange-400"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
