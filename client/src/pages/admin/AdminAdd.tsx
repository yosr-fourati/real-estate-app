import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminCreateProperty } from "../../services/admin";
import { GOVS as ALL_GOUVERNORATS, DELEGATIONS as TN_LOCATIONS } from "../../data/tnLocations";

type Form = {
  title: string;
  type: "APARTMENT" | "VILLA" | "LAND";
  governorate: string;
  delegation: string;
  price: string;            // keep as text, convert on submit
  description: string;
  images: string;           // comma separated URLs
  lat: string;
  lng: string;
};

export default function AdminAdd() {
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>({
    title: "",
    type: "APARTMENT",
    governorate: "",
    delegation: "",
    price: "",
    description: "",
    images: "",
    lat: "",
    lng: "",
  });

  const delegations = useMemo(
    () => (form.governorate ? TN_LOCATIONS[form.governorate] ?? [] : []),
    [form.governorate]
  );

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === "governorate" ? { delegation: "" } : null),
    }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    // basic validation
    if (!form.title.trim()) return alert("Titre requis");
    if (!form.governorate) return alert("Gouvernorat requis");
    if (!form.delegation) return alert("Délégation requise");
    const priceNum = Number(form.price);
    if (!Number.isFinite(priceNum) || priceNum <= 0) {
      return alert("Prix invalide");
    }

    const imagesArr = form.images
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    try {
      const created = await adminCreateProperty({
        title: form.title.trim(),
        type: form.type,
        governorate: form.governorate,
        delegation: form.delegation,
        price: priceNum,
        description: form.description.trim(),
        images: imagesArr,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
      });
      alert("Bien créé !");
      // Go to details page or the list page
      navigate(`/properties/${created.id}`, { replace: true });
    } catch (err: any) {
      alert(err?.message ?? "Échec de création");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-[#0b2e4e] mb-6">Ajouter un bien</h1>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Titre</label>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Ex: Villa S+5 à La Marsa"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={onChange}
              className="w-full border rounded-lg px-4 py-3 bg-white"
            >
              <option value="APARTMENT">Appartement</option>
              <option value="VILLA">Villa</option>
              <option value="LAND">Terrain</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Gouvernorat</label>
            <select
              name="governorate"
              value={form.governorate}
              onChange={onChange}
              className="w-full border rounded-lg px-4 py-3 bg-white"
            >
              <option value="">Choisir…</option>
              {ALL_GOUVERNORATS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Délégation</label>
            <select
              name="delegation"
              value={form.delegation}
              onChange={onChange}
              className="w-full border rounded-lg px-4 py-3 bg-white"
              disabled={!form.governorate}
            >
              <option value="">Choisir…</option>
              {delegations.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Prix (TND)</label>
            <input
              name="price"
              value={form.price}
              onChange={onChange}
              inputMode="numeric"
              className="w-full border rounded-lg px-4 py-3"
              placeholder="850000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Latitude (optionnel)</label>
            <input
              name="lat"
              value={form.lat}
              onChange={onChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="36.85"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Longitude (optionnel)</label>
            <input
              name="lng"
              value={form.lng}
              onChange={onChange}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="10.32"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Images (URLs, séparées par des virgules)</label>
          <input
            name="images"
            value={form.images}
            onChange={onChange}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="https://..., https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            className="w-full border rounded-lg px-4 py-3"
            placeholder="Description du bien…"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="bg-[#0b2e4e] text-white font-semibold px-5 py-3 rounded-lg hover:opacity-90 transition"
          >
            Créer
          </button>
        </div>
      </form>
    </div>
  );
}
