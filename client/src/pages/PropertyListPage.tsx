import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listProperties, PropertyDto } from "../services/properties";

type Filters = {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
};

export default function PropertyListPage() {
  const [params] = useSearchParams();

  const filters = useMemo<Filters>(() => {
    const city = params.get("city") || undefined;
    const type = params.get("type") || undefined;

    const minRaw = params.get("minPrice");
    const maxRaw = params.get("maxPrice");
    const minPrice =
      minRaw && !Number.isNaN(Number(minRaw)) ? Number(minRaw) : undefined;
    const maxPrice =
      maxRaw && !Number.isNaN(Number(maxRaw)) ? Number(maxRaw) : undefined;

    return { city, type, minPrice, maxPrice };
  }, [params]);

  const [items, setItems] = useState<PropertyDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await listProperties(filters);
        if (!cancelled) setItems(data);
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Impossible de charger les biens.";
        if (!cancelled) setError(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [filters]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-[#002B5B] mb-6 text-center">
        🏠 Nos Biens Immobiliers
      </h1>

      {/* Status states */}
      {loading && (
        <p className="text-center text-gray-600">Chargement des biens…</p>
      )}
      {error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-center text-gray-600">
          Aucun bien ne correspond à votre recherche.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((p) => {
            const cover =
              p.image ??
              p.images?.[0]?.url ??
              "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop";

            return (
              <Link
                key={p.id}
                to={`/properties/${p.id}`}
                className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:-translate-y-1 transition transform duration-300"
              >
                <img
                  src={cover}
                  alt={p.title}
                  className="w-full h-56 object-cover"
                  loading="lazy"
                />
                <div className="p-5">
                  <h2 className="text-xl font-semibold text-[#002B5B]">
                    {p.title}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    📍 {p.city} – {p.type}
                  </p>
                  <p className="text-lg font-semibold text-[#002B5B] mt-2">
                    {p.price.toLocaleString("fr-TN")} TND
                  </p>
                  {p.description && (
                    <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                      {p.description}
                    </p>
                  )}
                  <div className="mt-4 text-center">
                    <span className="inline-block bg-[#002B5B] text-white px-4 py-2 rounded-md hover:bg-[#003973] transition">
                      Voir les détails
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
