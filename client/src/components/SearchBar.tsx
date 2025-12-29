import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GOVS as ALL_GOUVERNORATS,
  DELEGATIONS as TN_LOCATIONS,
} from "../data/tnLocations";

type Mode = "acheter" | "louer";
type Props = { mode?: Mode }; // default "acheter"

// Buy budgets: 100k → 1.5M
const BUY_STEPS = [
  100_000, 200_000, 300_000, 400_000, 500_000, 600_000, 700_000, 800_000,
  900_000, 1_000_000, 1_100_000, 1_200_000, 1_300_000, 1_400_000, 1_500_000,
];

// Rent budgets (monthly): 600 → 5,000 by 100
const RENT_STEPS = Array.from(
  { length: ((5_000 - 600) / 100) + 1 },
  (_, i) => 600 + i * 100
);

type FormState = {
  type: string;         // APARTMENT | VILLA | LAND | ""
  governorate: string;  // gouvernorat label or ""
  delegation: string;   // delegation label or ""
  minPrice: string;     // number string or ""
  maxPrice: string;     // number string or ""
};

function fmtTND(n: number) {
  return n.toLocaleString("fr-TN") + " TND";
}

export default function SearchBar({ mode = "acheter" }: Props) {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormState>({
    type: "",
    governorate: "",
    delegation: "",
    minPrice: "",
    maxPrice: "",
  });

  // Price ladders
  const steps = mode === "louer" ? RENT_STEPS : BUY_STEPS;
  const budgets = useMemo(
    () => steps.map((n) => ({ label: fmtTND(n), value: String(n) })),
    [steps]
  );

  const maxChoices = useMemo(() => {
    const min = form.minPrice ? Number(form.minPrice) : undefined;
    return budgets.filter((b) => (min ? Number(b.value) >= min : true));
  }, [budgets, form.minPrice]);

  // Délégations for the selected gouvernorat
  const delegations = useMemo<string[]>(
    () => (form.governorate ? TN_LOCATIONS[form.governorate] ?? [] : []),
    [form.governorate]
  );

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;

    // Keep max ≥ min
    if (name === "minPrice") {
      setForm((f) => {
        const next = { ...f, minPrice: value };
        if (next.maxPrice && value && Number(next.maxPrice) < Number(value)) {
          next.maxPrice = "";
        }
        return next;
      });
      return;
    }

    // If gouvernorat changes, clear delegation
    if (name === "governorate") {
      setForm((f) => ({ ...f, governorate: value, delegation: "" }));
      return;
    }

    setForm((f) => ({ ...f, [name]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const q = new URLSearchParams();

    // Property type -> backend enum you already support
    if (form.type) q.set("type", form.type);

    // Location: keep both for future, but still support current backend (uses `city`)
    if (form.governorate) q.set("governorate", form.governorate);
    if (form.delegation) q.set("delegation", form.delegation);

    // Backward-compat: send `city` as the most specific choice
    if (form.delegation) {
      q.set("city", form.delegation);
    } else if (form.governorate) {
      q.set("city", form.governorate);
    }

    if (form.minPrice) q.set("minPrice", form.minPrice);
    if (form.maxPrice) q.set("maxPrice", form.maxPrice);

    navigate(`/properties?${q.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white/95 text-[#0b2e4e] rounded-2xl p-6 shadow-xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
        {/* Type de bien */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Type de bien
          </label>
          <select
            name="type"
            value={form.type}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002B5B] bg-white"
            aria-label="Type de bien"
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
        </div>

        {/* Gouvernorat */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Gouvernorat
          </label>
          <select
            name="governorate"
            value={form.governorate}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002B5B] bg-white"
            aria-label="Gouvernorat"
          >
            <option value="">Tous les gouvernorats</option>
            {ALL_GOUVERNORATS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        {/* Délégation (depends on gouvernorat) */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Délégation
          </label>
          <select
            name="delegation"
            value={form.delegation}
            onChange={onChange}
            disabled={!form.governorate}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002B5B] bg-white disabled:bg-gray-100 disabled:text-gray-400"
            aria-label="Délégation"
          >
            <option value="">
              {form.governorate ? "Toutes les délégations" : "Choisissez un gouvernorat"}
            </option>
            {delegations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Prix minimum */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Prix minimum{mode === "louer" ? " / mois" : ""}
          </label>
          <select
            name="minPrice"
            value={form.minPrice}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002B5B] bg-white"
            aria-label="Prix minimum"
          >
            <option value="">Aucun minimum</option>
            {budgets.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* Prix maximum */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Prix maximum{mode === "louer" ? " / mois" : ""}
          </label>
          <select
            name="maxPrice"
            value={form.maxPrice}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#002B5B] bg-white"
            aria-label="Prix maximum"
          >
            <option value="">Aucun maximum</option>
            {maxChoices.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="h-[48px] bg-[#0b2e4e] text-white font-semibold px-5 rounded-lg hover:opacity-90 transition"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}
