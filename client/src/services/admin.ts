const API = import.meta.env.VITE_API_URL || "http://localhost:8080";

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || res.statusText);
  }
  return res.json();
}

/* ---------- AUTH ----------- */

export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${API}/api/admin/login`, {
    method: "POST",
    credentials: "include", // important for cookies
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return json<{ ok: true }>(res);
}

export async function adminMe() {
  const res = await fetch(`${API}/api/admin/me`, {
    credentials: "include",
  });
  return json<{ ok: true; email: string }>(res);
}

export async function adminLogout() {
  const res = await fetch(`${API}/api/admin/logout`, {
    method: "POST",
    credentials: "include",
  });
  return json<{ ok: true }>(res);
}

/* ---------- ADMIN: CREATE PROPERTY ----------- */

export type CreatePropertyInput = {
  title: string;
  type: "APARTMENT" | "VILLA" | "LAND";
  governorate: string;
  delegation: string;
  // Your API currently expects `city`. We’ll send delegation as city for now.
  price: number;
  description?: string;
  images?: string[];        // URLs
  lat?: number | null;
  lng?: number | null;
};

export async function adminCreateProperty(input: CreatePropertyInput) {
  const payload = {
    title: input.title.trim(),
    type: input.type,
    city: input.delegation || input.governorate, // map to existing API field
    price: Number(input.price),
    description: input.description ?? "",
    images: input.images ?? [],
    lat: input.lat ?? null,
    lng: input.lng ?? null,
  };

  const res = await fetch(`${API}/api/properties`, {
    method: "POST",
    credentials: "include", // send cookie
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // returns the created Property
  return json<{
    id: string | number;
    title: string;
    type: string;
    city: string;
    price: number;
    description?: string | null;
    images?: { url: string }[] | string[] | null;
  }>(res);
}
