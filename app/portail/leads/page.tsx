export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import UpdateLeadStatusButton from "@/components/admin/UpdateLeadStatusButton";
import { Badge } from "@/components/ui/badge";

async function getLeads() {
  return prisma.lead.findMany({
    include: { property: { select: { title: true, id: true } } },
    orderBy: { createdAt: "desc" },
  });
}

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  CLOSED: "Fermé",
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-green-100 text-green-700",
  CONTACTED: "bg-blue-100 text-blue-700",
  CLOSED: "bg-gray-100 text-gray-600",
};

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contacts</h1>
        <p className="text-gray-500 mt-1">
          {leads.length} contact(s) —{" "}
          {leads.filter((l) => l.status === "NEW").length} nouveau(x)
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 text-lg">Aucun contact pour l&apos;instant</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Contact</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Message</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Bien</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Statut</th>
                <th className="text-left p-4 text-sm font-semibold text-gray-600">Date</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-gray-800 text-sm">{lead.name}</p>
                    <p className="text-xs text-gray-500">{lead.email}</p>
                    {lead.phone && <p className="text-xs text-gray-400">{lead.phone}</p>}
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="text-sm text-gray-600 line-clamp-2">{lead.message}</p>
                  </td>
                  <td className="p-4">
                    {lead.property ? (
                      <a
                        href={`/properties/${lead.property.id}`}
                        target="_blank"
                        className="text-xs text-brand-500 hover:underline line-clamp-2"
                      >
                        {lead.property.title}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400">Général</span>
                    )}
                  </td>
                  <td className="p-4">
                    <Badge className={STATUS_COLORS[lead.status]} variant="secondary">
                      {STATUS_LABELS[lead.status]}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {new Date(lead.createdAt).toLocaleDateString("fr-TN")}
                  </td>
                  <td className="p-4">
                    <UpdateLeadStatusButton id={lead.id} currentStatus={lead.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
