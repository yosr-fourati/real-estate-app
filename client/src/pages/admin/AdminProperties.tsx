import { useEffect, useState } from "react";
import {
  adminListProperties,
  adminSetPropertyStatus,
} from "../../services/admin";
import { Link, useNavigate } from "react-router-dom";

type Row = {
  id: string | number;
  title: string;
  city: string | null;
  type: string;
  price: number;
  isActive: boolean;
  createdAt: string;
};

export default function AdminProperties() {
  const [items, setItems] = useState<Row[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"createdAt" | "title" | "price">("createdAt");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErr(null);
      const data = await adminListProperties({
        page,
        pageSize,
        sort,
        dir,
        search,
      });
      setItems(
        data.items.map((p) => ({
          id: p.id,
          title: p.title,
          city: p.city,
          type: p.type,
          price: p.price,
          isActive: p.isActive,
          createdAt: p.createdAt,
        }))
      );
      setTotal(data.total);
      setPages(data.pages);
    } catch (e: any) {
      setErr(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, sort, dir, search]);

  async function toggleActive(id: string | number, next: boolean) {
    try {
      await adminSetPropertyStatus(id, next);
      await load();
    } catch (e: any) {
      alert(e.message || "Failed");
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-3">
      <div className="flex gap-3 items-center">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Recherche (titre, ville)…"
          className="border rounded px-3 py-2 w-[260px]"
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as any)}
          className="border rounded px-2 py-2"
        >
          <option value="createdAt">Tri : Date de création</option>
          <option value="title">Tri : Titre</option>
          <option value="price">Tri : Prix</option>
        </select>
        <select
          value={dir}
          onChange={(e) => setDir(e.target.value as any)}
          className="border rounded px-2 py-2"
        >
          <option value="desc">Décroissant</option>
          <option value="asc">Croissant</option>
        </select>
        <select
          value={pageSize}
          onChange={(e) => {
            setPage(1);
            setPageSize(Number(e.target.value));
          }}
          className="border rounded px-2 py-2"
        >
          {[10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n} / page
            </option>
          ))}
        </select>
      </div>

      {err && (
        <div className="bg-red-50 text-red-700 border border-red-200 px-3 py-2 rounded">
          {err}
        </div>
      )}

      <div className="overflow-x-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Titre</th>
              <th className="text-left p-3">Ville</th>
              <th className="text-left p-3">Type</th>
              <th className="text-left p-3">Prix (TND)</th>
              <th className="text-left p-3">Statut</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && items.length === 0 && (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan={6}>
                  Aucun résultat
                </td>
              </tr>
            )}
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.city ?? "-"}</td>
                <td className="p-3">{p.type}</td>
                <td className="p-3">{p.price.toLocaleString("fr-TN")}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      p.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.isActive ? "Actif" : "Archivé"}
                  </span>
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => toggleActive(p.id, !p.isActive)}
                    className="px-3 py-1 border rounded"
                  >
                    {p.isActive ? "Archiver" : "Réactiver"}
                  </button>
                  <Link
                    to={`/admin/properties/${p.id}/edit`}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Modifier
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm pt-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          ← Précédent
        </button>
        <div>
          Page <b>{page}</b> / <b>{pages}</b> — <b>{total}</b> résultats
        </div>
        <button
          disabled={page >= pages}
          onClick={() => setPage((p) => Math.min(pages, p + 1))}
          className="px-3 py-1 border rounded disabled:opacity-40"
        >
          Suivant →
        </button>
      </div>
    </div>
  );
}
