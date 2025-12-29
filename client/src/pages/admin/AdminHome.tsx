import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminMe, adminLogout } from "../../services/admin";

export default function AdminHome() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const me = await adminMe();
        setEmail(me.email);
      } catch {
        navigate("/admin/login", { replace: true });
      } finally {
        setReady(true);
      }
    })();
  }, [navigate]);

  async function doLogout() {
    await adminLogout();
    navigate("/admin/login", { replace: true });
  }

  if (!ready) return null;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-[#0b2e4e]">Tableau de bord</h1>
        <button
          onClick={doLogout}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          Se déconnecter
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-8">
        Connecté en tant que <span className="font-medium">{email}</span>
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Ajouter un bien */}
        <Link
          to="/admin/add"
          className="block border rounded-xl p-6 hover:shadow transition"
        >
          <div className="flex items-center gap-3 text-[#0b2e4e]">
            <span className="text-xl">➕</span>
            <div className="text-lg font-semibold">Ajouter un bien</div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Créer une nouvelle annonce (titre, type, localisation, prix, images…)
          </p>
        </Link>

        {/* Gérer les biens (placeholder for the next step) */}
        <Link
          to="/admin/properties"
          className="block border rounded-xl p-6 hover:shadow transition"
        >
          <div className="flex items-center gap-3 text-[#0b2e4e]">
            <span className="text-xl">🗒️</span>
            <div className="text-lg font-semibold">Gérer les biens</div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Liste, filtre, modification et archivage (à venir).
          </p>
        </Link>
      </div>
    </div>
  );
}
