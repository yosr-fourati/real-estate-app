"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const TRANSITIONS: Record<string, { label: string; next: string; className: string }> = {
  NEW: { label: "→ Contacté", next: "CONTACTED", className: "text-blue-500 hover:bg-blue-50" },
  CONTACTED: { label: "→ Fermé", next: "CLOSED", className: "text-gray-500 hover:bg-gray-50" },
  CLOSED: { label: "→ Nouveau", next: "NEW", className: "text-green-500 hover:bg-green-50" },
};

interface Props {
  id: string;
  currentStatus: string;
}

export default function UpdateLeadStatusButton({ id, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const transition = TRANSITIONS[currentStatus];
  if (!transition) return null;

  async function handleUpdate() {
    setLoading(true);
    try {
      await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: transition.next }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleUpdate}
      disabled={loading}
      className={`text-xs font-medium px-2 py-1 rounded-lg transition-colors flex items-center gap-1 ${transition.className}`}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : transition.label}
    </button>
  );
}
