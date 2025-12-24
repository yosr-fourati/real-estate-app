import { Request, Response } from "express";
import {
  findProperties,
  findPropertyById,
  createProperty,
} from "../services/property.service";

export async function listPropertiesController(req: Request, res: Response) {
  try {
    const { city, type, minPrice, maxPrice } = req.query;

    const filters = {
      city: typeof city === "string" ? city : undefined,
      type: typeof type === "string" ? type : undefined,
      minPrice:
        typeof minPrice === "string" && minPrice.trim() !== ""
          ? Number(minPrice)
          : undefined,
      maxPrice:
        typeof maxPrice === "string" && maxPrice.trim() !== ""
          ? Number(maxPrice)
          : undefined,
    };

    const properties = await findProperties(filters);
    res.json(properties);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to list properties" });
  }
}

export async function getPropertyController(req: Request, res: Response) {
  try {
    const idAsNum = Number(req.params.id);
    const id = Number.isNaN(idAsNum) ? req.params.id : idAsNum; // accept number or string

    const property = await findPropertyById(id);
    if (!property) return res.status(404).json({ message: "Not found" });
    res.json(property);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get property" });
  }
}

export async function createPropertyController(req: Request, res: Response) {
  try {
    const {
      title,
      city,
      type,
      price,
      description,
      images,
      lat,
      lng,
    } = req.body;

    if (!title || !city || !type || typeof price !== "number") {
      return res
        .status(400)
        .json({ message: "title, city, type, price are required" });
    }

    const created = await createProperty({
      title,
      city,
      type, // string here – the service maps it to enum
      price,
      description,
      images: Array.isArray(images) ? images : undefined, // expect string[]
      lat: typeof lat === "number" ? lat : null,
      lng: typeof lng === "number" ? lng : null,
    });

    res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err?.message ?? "Failed to create property" });
  }
}
