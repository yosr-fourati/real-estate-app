"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { GOVS, DELEGATIONS } from "@/data/tnLocations";
import { Button } from "@/components/ui/button";

const PROPERTY_TYPES = [
  { value: "", label: "Tous types" },
  { value: "APARTMENT", label: "Appartement" },
  { value: "VILLA", label: "Villa" },
  { value: "HOUSE", label: "Maison" },
  { value: "LAND", label: "Terrain" },
  { value: "COMMERCIAL", label: "Commercial" },
];

export default function SearchBar() {
  const router = useRouter();
  const [listingType, setListingType] = useState<"SALE" | "RENT">("SALE");
  const [governorate, setGovernorate] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");

  const delegations = governorate ? (DELEGATIONS[governorate] ?? []) : [];

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (listingType) params.set("listingType", listingType);
    if (governorate) params.set("governorate", governorate);
    if (city) params.set("city", city);
    if (type) params.set("type", type);
    router.push(`/properties?${params}`);
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-w-3xl mx-auto">
      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {(["SALE", "RENT"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setListingType(t)}
            className={`flex-1 py-3 text-sm font-semibold transition-colors ${
              listingType === t
                ? "text-brand-500 border-b-2 border-brand-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "SALE" ? "Acheter" : "Louer"}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSearch} className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          {/* Governorate */}
          <select
            value={governorate}
            onChange={(e) => {
              setGovernorate(e.target.value);
              setCity("");
            }}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-brand-400 bg-gray-50"
          >
            <option value="">Gouvernorat</option>
            {GOVS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          {/* Delegation */}
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!governorate}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-brand-400 bg-gray-50 disabled:opacity-50"
          >
            <option value="">Délégation</option>
            {delegations.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-brand-400 bg-gray-50"
          >
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          Rechercher
        </Button>
      </form>
    </div>
  );
}
