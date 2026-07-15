import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RequireAdmin from "../../components/RequireAdmin";
import {
  adminGetProperty,
  adminUpdateProperty,
  type Offer,
} from "../../services/admin";
import MediaUploader from "../../components/MediaUploader";
import { GOVS, DELEGATIONS } from "../../data/tnLocations";

// Same extended UI list as Home
type UiType =
  | "APARTMENT"
  | "DUPLEX"
  | "VILLA"
  | "LAND"
  | "BUREAU"
  | "COMMERCE"
  | "DEPOT"
  | "FOND_DE_COMMERCE"
  | "IMMEUBLE_BUREAU"
  | "USINE";

function toApiType(t: UiType): "APARTMENT" | "VILLA" | "LAND" {
  if (t === "VILLA") return "VILLA";
  if (t === "LAND") return "LAND";
  return "APARTMENT";
}

export default function AdminEdit() {
  return (
    <RequireAdmin>
      <Form />
    </RequireAdmin>
  );
}

function Form() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [uiType, setUiType] = useState<UiType>("APARTMENT");
  const [offer, setOffer] = useState<Offer>("SALE");
  const [governorate, setGovernorate] = useState("");
  const [delegation, setDelegation] = useState("");
  const [cityFree, setCityFree] = useState("");
  const [price, setPrice] = useState<string>("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [images, setImages] = useState<string[]>([]);

  const delegations = useMemo(
    () => (governorate ? DELEGATIONS[governorate] ?? [] : []),
    [governorate]
  );

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const p = await adminGetProperty(id!);

        setTitle(p.title ?? "");

        // Infer uiType from backend type (best effort)
        if (p.type === "VILLA") setUiType("VILLA");
        else if (p.type === "LAND") setUiType("LAND");
        else setUiType("APARTMENT");

        setOffer((p as any).offer ?? "SALE");

        // Try to pre-fill governorate/delegation based on current city
        const c = (p.city || "").trim();
        let guessedGov = "";
        let guessedDel = "";
        if (c) {
          // exact match first
          for (const g of GOVS) {
            if (g.toLowerCase() === c.toLowerCase()) {
              guessedGov = g;
              break;
            }
            for (const d of DELEGATIONS[g] || []) {
              if (d.toLowerCase() === c.toLowerCase()) {
                guessedGov = g;
                guessedDel = d;
                break;
              }
            }
            if (guessedDel) break;
          }
        }
        setGovernorate(guessedGov);
        setDelegation(guessedDel);
        setCityFree(!guessedGov && !guessedDel ? c : "");

        setPrice(String(p.price ?? ""));
        setDescription(p.description ?? "");
        setIsActive(Boolean((p as any).isActive ?? true));

        const urls =
          Array.isArray(p.images) ? p.images.map((i: any) => i?.url).filter(Boolean) : [];
        setImages(urls);
      } catch (e: any) {
        setErr(e?.message ?? "Erreur de chargement");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSaving(true);
      setErr(null);

      const pNum = Number(price);
      if (!Number.isFinite(pNum) || pNum <= 0) {
        throw new Error("Prix invalide.");
      }

      const chosenCity =
        delegation?.trim() || governorate?.trim() || cityFree.trim();
      if (!chosenCity) {
        throw new Error("Sélectionnez une délégation ou un gouvernorat, ou saisissez une ville.");
      }

      await adminUpdateProperty(id!, {
        title: title.trim(),
        type: toApiType(uiType),
        offer,
        city: chosenCity,
        price: pNum,
        description: description.trim(),
        isActive,
        images,
      });

      navigate("/admin/properties");
    } catch (e: any) {
      setErr(e?.message ?? "Échec de l’enregistrement");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="max-w-5xl mx-auto p-6">Chargement…</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Modifier un bien</h1>

      {err && (
        <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2">
          {err}
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Infos principales */}
        <div className="grid gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={uiType}
                onChange={(e) => setUiType(e.target.value as UiType)}
              >
                <optgroup label="Habitation">
                  <option value="APARTMENT">Appartement</option>
                  <option value="DUPLEX">Duplex</option>
                  <option value="VILLA">Villa</option>
                  <option value="LAND">Terrain</option>
                </optgroup>
                <optgroup label="Commercial">
                  <option value="BUREAU">Bureau</option>
                  <option value="COMMERCE">Commerce</option>
                  <option value="DEPOT">Dépôt</option>
                  <option value="FOND_DE_COMMERCE">Fond De Commerce</option>
                  <option value="IMMEUBLE_BUREAU">Immeuble Bureau</option>
                  <option value="USINE">Usine</option>
                </optgroup>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Offre</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={offer}
                onChange={(e) => setOffer(e.target.value as Offer)}
              >
                <option value="SALE">À vendre</option>
                <option value="RENT">À louer</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Gouvernorat</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={governorate}
                onChange={(e) => {
                  setGovernorate(e.target.value);
                  setDelegation("");
                }}
              >
                <option value="">Tous les gouvernorats</option>
                {GOVS.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Délégation</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={delegation}
                onChange={(e) => setDelegation(e.target.value)}
                disabled={!governorate}
              >
                <option value="">
                  {governorate ? "Toutes les délégations" : "Choisissez un gouvernorat"}
                </option>
                {delegations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Optional free text fallback */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ville (saisie libre – optionnel)
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              value={cityFree}
              onChange={(e) => setCityFree(e.target.value)}
              placeholder="Ex: Ariana, La Marsa, …"
            />
            <p className="text-xs text-gray-500 mt-1">
              Si vous choisissez une délégation, elle sera utilisée comme ville.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix (TND)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                min={0}
              />
            </div>
          </div>
        </div>

        {/* Médias */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Médias (images/vidéos)
          </label>
          <MediaUploader value={images} onChange={setImages} />
          <p className="text-xs text-gray-500 mt-2">
            Vous pouvez glisser-déposer des fichiers, les réordonner,
            supprimer, ou coller des URLs Cloudinary.
          </p>
        </div>

        {/* Description + état */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2 h-36"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Actif
        </label>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-[#0b2e4e] text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </div>
  );
}
