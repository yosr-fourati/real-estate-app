"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadFormData } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2 } from "lucide-react";

interface Props {
  propertyId?: string;
  propertyTitle?: string;
}

export default function LeadForm({ propertyId, propertyTitle }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      propertyId,
      message: propertyTitle
        ? `Bonjour, je suis intéressé(e) par le bien "${propertyTitle}". Merci de me contacter.`
        : "",
    },
  });

  async function onSubmit(data: LeadFormData) {
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error ?? "Une erreur est survenue");
        return;
      }

      setSubmitted(true);
      reset();
    } catch {
      setServerError("Impossible de contacter le serveur. Réessayez.");
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-4">
        <CheckCircle2 className="w-10 h-10 text-green-500 mb-2" />
        <p className="font-semibold text-gray-800">Message envoyé !</p>
        <p className="text-sm text-gray-500 mt-1">Nous vous contacterons bientôt.</p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-orange-500 hover:underline mt-3"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      {serverError && (
        <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{serverError}</p>
      )}

      <div>
        <Label htmlFor="lead-name" className="text-xs font-medium text-gray-600">
          Nom *
        </Label>
        <Input
          id="lead-name"
          placeholder="Votre nom"
          className="mt-1 text-sm"
          {...register("name")}
        />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="lead-email" className="text-xs font-medium text-gray-600">
          Email *
        </Label>
        <Input
          id="lead-email"
          type="email"
          placeholder="votre@email.com"
          className="mt-1 text-sm"
          {...register("email")}
        />
        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="lead-phone" className="text-xs font-medium text-gray-600">
          Téléphone
        </Label>
        <Input
          id="lead-phone"
          type="tel"
          placeholder="+216 XX XXX XXX"
          className="mt-1 text-sm"
          {...register("phone")}
        />
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="lead-message" className="text-xs font-medium text-gray-600">
          Message *
        </Label>
        <Textarea
          id="lead-message"
          rows={3}
          className="mt-1 text-sm resize-none"
          {...register("message")}
        />
        {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Envoi…
          </>
        ) : (
          "Envoyer ma demande"
        )}
      </Button>
    </form>
  );
}
