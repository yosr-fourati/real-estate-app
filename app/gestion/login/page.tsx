"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isHuman, setIsHuman] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(data: LoginFormData) {
    setError(null);
    if (!isHuman) {
      setError("Veuillez confirmer que vous n'êtes pas un robot.");
      return;
    }
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      ip: "client",
      redirect: false,
    });

    if (res?.error) {
      setError("Email ou mot de passe incorrect. Trop de tentatives bloque l'accès 15 minutes.");
    } else {
      router.push("/gestion");
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-brand-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Administration</h1>
          <p className="text-gray-500 mt-1 text-sm">Indeed Immobilier</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-red-500 text-xs">{errors.password.message}</p>
            )}
          </div>

          <div
            onClick={() => setIsHuman(!isHuman)}
            className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 cursor-pointer select-none transition-all ${
              isHuman ? "border-brand-500 bg-brand-50" : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-6 h-6 rounded flex items-center justify-center border-2 transition-all flex-shrink-0 ${
              isHuman ? "bg-brand-500 border-brand-500" : "border-gray-300"
            }`}>
              {isHuman && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="text-sm text-gray-700 font-medium">Je ne suis pas un robot</span>
            <div className="ml-auto opacity-40">
              <svg viewBox="0 0 64 64" className="w-8 h-8" fill="none"><circle cx="32" cy="20" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 56c0-11 9-20 20-20s20 9 20 20" stroke="currentColor" strokeWidth="2"/></svg>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-500 hover:bg-brand-600 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Connexion…
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
