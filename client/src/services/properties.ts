// client/src/services/properties.ts
import { api } from "./api";

export type Property = {
  id: string;                 // string PK in your current schema
  title: string;
  description?: string | null;
  price: number;
  city: string;
  type: "VILLA" | "APARTMENT" | "LAND" | string;
  createdAt?: string;
  updatedAt?: string;
  // If you later add images relation:
  images?: Array<{ id?: string; url: string }>;
};

export type ListFilters = {
  city?: string;
  type?: string;        // "VILLA" | "APARTMENT" | "LAND"
  minPrice?: number;
  maxPrice?: number;
};

export async function listProperties(filters: ListFilters = {}): Promise<Property[]> {
  const { data } = await api.get<Property[]>("/api/properties", { params: filters });
  return data;
}

export async function getProperty(id: string): Promise<Property> {
  const { data } = await api.get<Property>(`/api/properties/${id}`);
  return data;
}
