// client/src/services/properties.ts
import { api } from "./api";

export type Property = {
  id: string;
  title: string;
  city: string;
  type: string; // enum name from server (e.g., "VILLA", "APARTMENT")
  price: number;
  description: string;
  images?: { id?: string; url: string }[];
  createdAt: string;
  updatedAt: string;
};

export type ListFilters = {
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function listProperties(filters: ListFilters = {}) {
  const params = new URLSearchParams();
  if (filters.city) params.set("city", filters.city);
  if (filters.type) params.set("type", filters.type);
  if (typeof filters.minPrice === "number") params.set("minPrice", String(filters.minPrice));
  if (typeof filters.maxPrice === "number") params.set("maxPrice", String(filters.maxPrice));

  const { data } = await api.get<Property[]>(`/api/properties?${params.toString()}`);
  return data;
}

export async function getProperty(id: string) {
  const { data } = await api.get<Property>(`/api/properties/${id}`);
  return data;
}
