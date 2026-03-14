export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, PROPERTY_TYPE_LABELS, LISTING_TYPE_LABELS } from "@/lib/utils";
import DeletePropertyButton from "@/components/admin/DeletePropertyButton";

async function getProperties() {
  return prisma.property.findMany({
    include: { images: { orderBy: { order: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminPropertiesPage() {
  const properties = await getProperties();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Propriétés</h1>
          <p className="text-gray-500 mt-1">{properties.length} bien(s) au total</p>
        </div>
        <Link href="/portail/properties/new">
          <Button className="bg-brand-500 hover:bg-brand-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Nouveau bien
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-lg">Aucune propriété pour l&apos;instant</p>
          <Link href="/portail/properties/new" className="mt-4 inline-block">
            <Button className="bg-brand-500 hover:bg-brand-600 text-white mt-4">
              Ajouter votre premier bien
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Bien</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Type</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Prix</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {properties.map((p) => {
                const cover = p.images[0]?.url;
                return (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          {cover ? (
                            <Image
                              src={cover}
                              alt={p.title}
                              width={56}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              N/A
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm line-clamp-1">{p.title}</p>
                          <p className="text-xs text-gray-500">{p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary" className="text-xs">
                        {PROPERTY_TYPE_LABELS[p.type]}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm font-semibold text-brand-600">
                      {formatPrice(p.price, p.listingType)}
                    </td>
                    <td className="p-4">
                      <Badge
                        className={p.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}
                        variant="secondary"
                      >
                        {p.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      {new Date(p.createdAt).toLocaleDateString("fr-TN")}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/properties/${p.id}`} target="_blank">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-500">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/portail/properties/${p.id}/edit`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-brand-500">
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </Link>
                        <DeletePropertyButton id={p.id} title={p.title} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
