// client/src/pages/PropertyDetailsPage.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProperty, type Property } from "../services/properties";

export default function PropertyDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Identifiant de bien manquant.");
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getProperty(id);
        if (!cancelled) setProperty(data);
      } catch (e) {
        if (!cancelled) setError("Impossible de charger ce bien.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center text-gray-600">
        Chargement…
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="text-red-600 mb-6">{error ?? "Bien introuvable."}</p>
        <Link
          to="/properties"
          className="inline-block bg-[#002B5B] text-white px-5 py-3 rounded-lg hover:bg-[#003973] transition"
        >
          ← Retour aux biens
        </Link>
      </div>
    );
  }

  // basic image – if later you store multiple images in `images`
  const cover =
    property.images?.[0]?.url ??
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <img
            src={cover}
            alt={property.title}
            className="w-full h-80 object-cover rounded-2xl shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold text-[#002B5B]">{property.title}</h1>
          <p className="mt-2 text-gray-600">
            📍 {property.city} — {property.type}
          </p>
          <p className="mt-4 text-2xl font-semibold text-[#002B5B]">
            {property.price.toLocaleString("fr-TN")} TND
          </p>

          {property.description && (
            <p className="mt-6 text-gray-700 leading-relaxed">
              {property.description}
            </p>
          )}

          <div className="mt-8">
            <Link
              to="/properties"
              className="inline-block bg-[#002B5B] text-white px-5 py-3 rounded-lg hover:bg-[#003973] transition"
            >
              ← Retour aux biens
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
