import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/admin";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@indeed-immo.tn");
  const [password, setPassword] = useState("changeme-strong");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await adminLogin(email, password);
      navigate("/admin");
    } catch (e: any) {
      setError(e?.message || "Connexion impossible");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Connexion Admin</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          className="bg-[#0b2e4e] text-white px-4 py-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
