import React, { useMemo } from "react";
import { GOVS as ALL_GOUVERNORATS, DELEGATIONS as TN_LOCATIONS } from "../data/tnLocations";

type Props = {
  params: URLSearchParams;
  setParams: React.Dispatch<React.SetStateAction<URLSearchParams>>;
};

// Buy budgets
const BUY_STEPS = [
  100_000, 200_000, 300_000, 400_000, 500_000, 600_000, 700_000, 800_000,
  900_000, 1_000_000, 1_100_000, 1_200_000, 1_300_000, 1_400_000, 1_500_000,
];
// Rent budgets (monthly): 600 → 5,000
const RENT_STEPS = Array.from({ length: 46 }, (_, i) => 600 + i * 100);

function fmtTND(n: number) {
  return n.toLocaleString("fr-TN") + " TND";
}

export default function FiltersSidebar({ params, setParams }: Props) {
  // read current values from URL
  const type = params.get("type") ?? "";
  const governorate = params.get("governorate") ?? "";
  const delegation = params.get("delegation") ?? "";
  const minPrice = params.get("minPrice") ?? "";
  const maxPrice = params.get("maxPrice") ?? "";
  const mode = params.get("mode") ?? "acheter"; // keep for price ladder
  const sort = params.get("sort") ?? "newest";

  const steps = mode === "louer" ? RENT_STEPS : BUY_STEPS;

  const minOptions = useMemo(
    () =>
      [{ label: "Aucun minimum", value: "" }].concat(
        steps.map((v) => ({ label: fmtTND(v), value: String(v) }))
      ),
    [steps]
  );
  const maxOptions = useMemo(() => {
    const min = minPrice ? Number(minPrice) : undefined;
    const base = steps.filter((v) => (min ? v >= min : true));
    return [{ label: "Aucun maximum", value: "" }].concat(
      base.map((v) => ({ label: fmtTND(v), value: String(v) }))
    );
  }, [steps, minPrice]);

  const delegations = useMemo(() => {
    if (!governorate) return [];
    const list = TN_LOCATIONS[governorate] || [];
    return list.map((d) => ({ label: d, value: d }));
  }, [governorate]);

  function writeParam(name: string, value: string) {
    setParams((prev) => {
      const copy = new URLSearchParams(prev);
      if (value) copy.set(name, value);
      else copy.delete(name);
      // if governorate changes, clear delegation
      if (name === "governorate") copy.delete("delegation");
      // reset page whenever filters change
      copy.delete("page");
      return copy;
    });
  }

  return (
    <aside className="sticky top-6 bg-white rounded-2xl shadow-md p-4 w-full max-w-[260px]">
      <h2 className="text-lg font-semibold text-[#0b2e4e] mb-4">Filtres</h2>

      {/* Type de bien */}
      <label className="block text-sm text-gray-700 mb-1">Type de bien</label>
      <select
        className="w-full mb-4 border rounded-lg px-3 py-2"
        value={type}
        onChange={(e) => writeParam("type", e.target.value)}
      >
        <option value="">Tous les types</option>
        <optgroup label="Habitation">
          <option value="APARTMENT">Appartement</option>
          <option value="APARTMENT">Duplex</option>
          <option value="VILLA">Villa</option>
          <option value="LAND">Terrain</option>
        </optgroup>
        <optgroup label="Commercial">
          <option value="APARTMENT">Bureau</option>
          <option value="APARTMENT">Commerce</option>
          <option value="APARTMENT">Dépôt</option>
          <option value="APARTMENT">Fond De Commerce</option>
          <option value="APARTMENT">Immeuble Bureau</option>
          <option value="APARTMENT">Usine</option>
        </optgroup>
      </select>

      {/* Gouvernorat */}
      <label className="block text-sm text-gray-700 mb-1">Gouvernorat</label>
      <select
        className="w-full mb-4 border rounded-lg px-3 py-2"
        value={governorate}
        onChange={(e) => writeParam("governorate", e.target.value)}
      >
        <option value="">Tous les gouvernorats</option>
        {ALL_GOUVERNORATS.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      {/* Délégation */}
      <label className="block text-sm text-gray-700 mb-1">Délégation</label>
      <select
        className="w-full mb-4 border rounded-lg px-3 py-2"
        value={delegation}
        onChange={(e) => writeParam("delegation", e.target.value)}
        disabled={!governorate}
      >
        <option value="">{governorate ? "Toutes les délégations" : "Sélectionnez un gouvernorat"}</option>
        {delegations.map((d) => (
          <option key={d.value} value={d.value}>{d.label}</option>
        ))}
      </select>

      {/* Prix minimum */}
      <label className="block text-sm text-gray-700 mb-1">Prix minimum</label>
      <select
        className="w-full mb-4 border rounded-lg px-3 py-2"
        value={minPrice}
        onChange={(e) => writeParam("minPrice", e.target.value)}
      >
        {minOptions.map((o) => (
          <option key={`min-${o.value || "none"}`} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Prix maximum */}
      <label className="block text-sm text-gray-700 mb-1">Prix maximum</label>
      <select
        className="w-full mb-4 border rounded-lg px-3 py-2"
        value={maxPrice}
        onChange={(e) => writeParam("maxPrice", e.target.value)}
      >
        {maxOptions.map((o) => (
          <option key={`max-${o.value || "none"}`} value={o.value}>{o.label}</option>
        ))}
      </select>

      {/* Trier par */}
      <label className="block text-sm text-gray-700 mb-1">Trier par</label>
      <select
        className="w-full mb-2 border rounded-lg px-3 py-2"
        value={sort}
        onChange={(e) => writeParam("sort", e.target.value)}
      >
        <option value="newest">Plus récents</option>
        <option value="price_asc">Prix croissant</option>
        <option value="price_desc">Prix décroissant</option>
      </select>
    </aside>
  );
}
