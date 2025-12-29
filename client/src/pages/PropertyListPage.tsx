// client/src/pages/PropertyListPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { listProperties, type Property, type ListFilters } from "../services/properties";
import FiltersSidebar from "../components/FiltersSidebar";

const PAGE_SIZE = 6;

export default function PropertyListPage() {
  const [params, setParams] = useSearchParams();

  // ---- Parse URL -> filters + view state ----
  const filters = useMemo<ListFilters>(() => {
    const type = params.get("type") || undefined;

    const governorate = params.get("governorate") || undefined;
    const delegation = params.get("delegation") || undefined;
    const city = delegation || governorate || undefined;

    const minRaw = params.get("minPrice");
    const maxRaw = params.get("maxPrice");
    const minPrice = minRaw && !Number.isNaN(+minRaw) ? +minRaw : undefined;
    const maxPrice = maxRaw && !Number.isNaN(+maxRaw) ? +maxRaw : undefined;

    return { city, type, minPrice, maxPrice };
  }, [params]);

  const sort = params.get("sort") || "newest";
  const page = Math.max(1, Number(params.get("page") || "1"));

  // ---- Data state ----
  const [items, setItems] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---- Fetch whenever filters change ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);

        // Only pass server-supported filters
        const apiFilters: ListFilters = {
          city: filters.city,
          type: filters.type,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
        };

        const data = await listProperties(apiFilters);
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
    // reset page to 1 when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.city, filters.type, filters.minPrice, filters.maxPrice]);

  // keep URL page reset when filters change
  useEffect(() => {
    setParams((prev) => {
      const copy = new URLSearchParams(prev);
      copy.set("page", "1");
      return copy;
    });
    // only when filters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.city, filters.type, filters.minPrice, filters.maxPrice]);

  // ---- Sort + Paginate (client-side) ----
  const sorted = useMemo(() => {
    const clone = [...items];
    if (sort === "price_asc") {
      clone.sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    } else if (sort === "price_desc") {
      clone.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    } else {
      // newest first by createdAt (fallback no-op)
      clone.sort((a, b) => {
        const aT = a.createdAt ? +new Date(a.createdAt) : 0;
        const bT = b.createdAt ? +new Date(b.createdAt) : 0;
        return bT - aT;
      });
    }
    return clone;
  }, [items, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = sorted.slice(start, start + PAGE_SIZE);

  function goToPage(p: number) {
    const target = Math.min(Math.max(1, p), totalPages);
    setParams((prev) => {
      const copy = new URLSearchParams(prev);
      copy.set("page", String(target));
      return copy;
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar */}
      <FiltersSidebar params={params} setParams={setParams} />

      {/* Results */}
      <section>
        <h1 className="text-2xl font-bold text-[#002B5B] mb-4">Biens disponibles</h1>

        {loading && <p className="text-gray-600">Chargement…</p>}
        {error && <p className="text-red-600">{error}</p>}

        {!loading && !error && sorted.length === 0 && (
          <p className="text-gray-600">Aucun bien ne correspond à votre recherche.</p>
        )}

        {!loading && !error && sorted.length > 0 && (
          <>
            <p className="text-sm text-gray-500 mb-3">
              {sorted.length} résultat{sorted.length > 1 ? "s" : ""} — page {currentPage}/{totalPages}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {visible.map((p) => {
                const cover: string =
                  (p as any).image ??
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
                      <h2 className="text-xl font-semibold text-[#002B5B]">{p.title}</h2>
                      <p className="text-gray-600 mt-1">📍 {p.city} — {p.type}</p>
                      <p className="text-lg font-semibold text-[#002B5B] mt-2">
                        {p.price.toLocaleString("fr-TN")} TND
                      </p>
                      {p.description && (
                        <p className="text-sm text-gray-500 mt-3 line-clamp-3">{p.description}</p>
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

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 rounded-md border disabled:opacity-50"
              >
                ← Précédent
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-2 rounded-md border disabled:opacity-50"
              >
                Suivant →
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
