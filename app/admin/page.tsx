export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Building2, Users, TrendingUp, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

async function getDashboardStats() {
  const [totalProperties, activeProperties, totalLeads, newLeads] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { isActive: true } }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
  ]);
  return { totalProperties, activeProperties, totalLeads, newLeads };
}

async function getRecentLeads() {
  return prisma.lead.findMany({
    include: { property: { select: { title: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });
}

export default async function AdminDashboardPage() {
  const [stats, recentLeads] = await Promise.all([getDashboardStats(), getRecentLeads()]);

  const statCards = [
    {
      label: "Total Propriétés",
      value: stats.totalProperties,
      sub: `${stats.activeProperties} actives`,
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Contacts reçus",
      value: stats.totalLeads,
      sub: `${stats.newLeads} nouveaux`,
      icon: Users,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      label: "Taux d'activité",
      value:
        stats.totalProperties > 0
          ? `${Math.round((stats.activeProperties / stats.totalProperties) * 100)}%`
          : "—",
      sub: "Biens actifs",
      icon: TrendingUp,
      color: "text-brand-500",
      bg: "bg-brand-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="text-gray-500 mt-1">Vue d&apos;ensemble de votre activité</p>
        </div>
        <Link href="/admin/properties/new">
          <Button className="bg-brand-500 hover:bg-brand-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Ajouter un bien
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map(({ label, value, sub, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <div>
                <p className="text-gray-500 text-sm">{label}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-400">{sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Leads */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-bold text-lg text-gray-900">Contacts récents</h2>
          <Link href="/admin/leads">
            <Button variant="outline" size="sm" className="text-brand-500 border-brand-200">
              <Eye className="w-4 h-4 mr-1" />
              Voir tout
            </Button>
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recentLeads.length === 0 ? (
            <p className="p-6 text-gray-400 text-center">Aucun contact pour l&apos;instant</p>
          ) : (
            recentLeads.map((lead) => (
              <div key={lead.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                <div>
                  <p className="font-semibold text-gray-800">{lead.name}</p>
                  <p className="text-sm text-gray-500">{lead.email}</p>
                  {lead.property && (
                    <p className="text-xs text-brand-500 mt-0.5">→ {lead.property.title}</p>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      lead.status === "NEW"
                        ? "bg-green-100 text-green-700"
                        : lead.status === "CONTACTED"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lead.status === "NEW" ? "Nouveau" : lead.status === "CONTACTED" ? "Contacté" : "Fermé"}
                  </span>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(lead.createdAt).toLocaleDateString("fr-TN")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
