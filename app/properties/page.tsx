import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import PropertyCard from "@/components/PropertyCard";
import FiltersSidebar from "@/components/FiltersSidebar";
import { Loader2 } from "lucide-react";
import type { Metadata } from "next";
import { Prisma } from "@prisma/client";
import type { PropertyType, ListingType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Annonces Immobilières",
  description: "Parcourez toutes nos annonces immobilières en Tunisie.",
};

const PAGE_SIZE = 9;

type SearchParamsRaw = {
  governorate?: string;
  city?: string;
  type?: string;
  listingType?: string;
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
};

async function getProperties(params: SearchParamsRaw) {
  const page = Math.max(1, parseInt(params.page ?? "1"));
  const skip = (page - 1) * PAGE_SIZE;

  const where: Prisma.PropertyWhereInput = {
    isActive: true,
  };

  if (params.governorate) {
    where.governorate = { contains: params.governorate, mode: "insensitive" };
  }
  if (params.city) {
    where.city = { contains: params.city, mode: "insensitive" };
  }
  if (params.type) {
    where.type = params.type as PropertyType;
  }
  if (params.listingType) {
    where.listingType = params.listingType as ListingType;
  }
  if (params.minPrice || params.maxPrice) {
    where.price = {};
    if (params.minPrice) where.price.gte = parseInt(params.minPrice);
    if (params.maxPrice) where.price.lte = parseInt(params.maxPrice);
  }

  const orderBy: Prisma.PropertyOrderByWithRelationInput =
    params.sort === "price_asc"
      ? { price: "asc" }
      : params.sort === "price_desc"
      ? { price: "desc" }
      : { createdAt: "desc" };

  const [properties, total] = await Promise.all([
    prisma.property.findMany({
      where,
      include: { images: { orderBy: { order: "asc" }, take: 1 } },
      orderBy,
      skip,
      take: PAGE_SIZE,
    }),
    prisma.property.count({ where }),
  ]);

  return { properties, total, page, totalPages: Math.ceil(total / PAGE_SIZE) };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParamsRaw>;
}) {
  const resolvedParams = await searchParams;
  const { properties, total, page, totalPages } = await getProperties(resolvedParams);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Annonces Immobilières</h1>
          <p className="text-gray-500 mt-1">
            {total} bien{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-72 flex-shrink-0">
            <FiltersSidebar currentParams={resolvedParams} />
          </aside>

          {/* Results */}
          <div className="flex-1">
            <Suspense
              fallback={
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
              }
            >
              {properties.length === 0 ? (
                <div className="text-center py-20 text-gray-500">
                  <p className="text-xl font-medium">Aucun bien trouvé</p>
                  <p className="mt-2">Modifiez vos critères de recherche</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {properties.map((p) => (
                      <PropertyCard key={p.id} property={p} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-10 flex justify-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <a
                          key={p}
                          href={`?${new URLSearchParams({
                            ...resolvedParams,
                            page: String(p),
                          })}`}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                            p === page
                              ? "bg-orange-500 text-white"
                              : "bg-white text-gray-700 hover:bg-orange-50 border border-gray-200"
                          }`}
                        >
                          {p}
                        </a>
                      ))}
                    </div>
                  )}
                </>
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
