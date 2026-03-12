import PropertyForm from "@/components/admin/PropertyForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
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
        <h1 className="text-3xl font-bold text-gray-900">Nouveau bien</h1>
        <p className="text-gray-500 mt-1">Remplissez les informations du bien</p>
      </div>
      <PropertyForm />
    </div>
  );
}
