import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/admin/PropertyForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export default async function EditPropertyPage({ params }: Props) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) notFound();

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 mb-4 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Modifier le bien</h1>
        <p className="text-gray-500 mt-1 line-clamp-1">{property.title}</p>
      </div>
      <PropertyForm property={property} />
    </div>
  );
}
