import { z } from "zod";

// ---- Property ----
export const propertySchema = z.object({
  title: z.string().min(2, "Le titre est requis"),
  description: z.string().optional().default(""),
  price: z.preprocess((v) => (!v || v === "" ? 0 : v), z.coerce.number().nonnegative().default(0)),
  city: z.string().optional().default(""),
  governorate: z.string().optional().default(""),
  type: z.enum(["APARTMENT", "HOUSE", "VILLA", "LAND", "COMMERCIAL"]),
  listingType: z.enum(["SALE", "RENT"]).default("SALE"),
  address: z.string().optional(),
  latitude: z.coerce.number().optional().nullable(),
  longitude: z.coerce.number().optional().nullable(),
  bedrooms: z.preprocess((v) => (!v || Number(v) <= 0 ? null : v), z.coerce.number().int().positive().optional().nullable()),
  bathrooms: z.preprocess((v) => (!v || Number(v) <= 0 ? null : v), z.coerce.number().int().positive().optional().nullable()),
  areaSqm: z.preprocess((v) => (!v || Number(v) <= 0 ? null : v), z.coerce.number().int().positive().optional().nullable()),
  isActive: z.boolean().default(true),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

// ---- Lead (contact form) ----
export const leadSchema = z.object({
  name: z.string().min(2, "Nom requis"),
  email: z.string().email("Email invalide"),
  phone: z
    .string()
    .regex(/^[+]?[\d\s\-]{8,15}$/, "Numéro invalide")
    .optional()
    .or(z.literal("")),
  message: z.string().min(10, "Message requis (min 10 caractères)"),
  propertyId: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadSchema>;

// ---- Admin login ----
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe requis"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// ---- Property filters (search) ----
export const filterSchema = z.object({
  governorate: z.string().optional(),
  city: z.string().optional(),
  type: z.enum(["APARTMENT", "HOUSE", "VILLA", "LAND", "COMMERCIAL"]).optional(),
  listingType: z.enum(["SALE", "RENT"]).optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sort: z.enum(["newest", "price_asc", "price_desc"]).default("newest"),
  page: z.coerce.number().int().positive().default(1),
});

export type FilterData = z.infer<typeof filterSchema>;
