// client/src/pages/PropertyListPage.tsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listProperties, type Property } from "../services/properties";

export default function PropertyListPage() {
  const [params] = useSearchParams();
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Build filters from URL
  const filters = {
    city: params.get("city") ?? undefined,
    type: params.get("type") ?? undefined,
    minPrice: params.get("minPrice") ? Number(params.get("minPrice")) : undefined,
    maxPrice: params.get("maxPrice") ? Number(params.get("maxPrice")) : undefined,
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listProperties(filters);
        if (!cancelled) setItems(data);
      } catch (e) {
        if (!cancelled) setError("Impossible de charger les biens.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params.toString()]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">🏠 Nos Biens Immobiliers</h1>

      {loading && <p className="text-center text-gray-600">Chargement…</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-600">Aucun bien ne correspond à votre recherche.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {items.map((p) => (
          <Link
            key={p.id}
            to={`/properties/${p.id}`}
            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={p.images?.[0]?.url ??
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
              alt={p.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-5">
              <h2 className="text-xl font-semibold text-blue-800">{p.title}</h2>
              <p className="text-gray-600 mt-1">📍 {p.city} — {p.type}</p>
              <p className="text-lg font-semibold text-blue-900 mt-2">
                {p.price.toLocaleString("fr-TN")} TND
              </p>
              <p className="text-sm text-gray-500 mt-3 line-clamp-3">{p.description}</p>
              <div className="mt-4 text-center">
                <span className="inline-block bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition">
                  Voir les détails
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
