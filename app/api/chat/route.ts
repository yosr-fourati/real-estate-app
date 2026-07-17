import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/prisma";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// In-memory rate limiter: max 15 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS_PER_HOUR = 15;
const MAX_MESSAGES_PER_CONVERSATION = 20;
const MAX_INPUT_CHARS = 500;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }

  if (entry.count >= MAX_REQUESTS_PER_HOUR) return false;

  entry.count++;
  return true;
}

const TYPE_LABELS: Record<string, string> = {
  APARTMENT: "Appartement",
  HOUSE: "Maison",
  VILLA: "Villa",
  LAND: "Terrain",
  COMMERCIAL: "Local commercial",
};

async function buildSystemPrompt() {
  const properties = await prisma.property.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      price: true,
      city: true,
      governorate: true,
      type: true,
      listingType: true,
      bedrooms: true,
      bathrooms: true,
      areaSqm: true,
      description: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const listingLines = properties
    .map((p: (typeof properties)[number]) => {
      const type = TYPE_LABELS[p.type] ?? p.type;
      const mode = p.listingType === "RENT" ? "À louer" : "À vendre";
      const price =
        p.price > 0
          ? `${p.price.toLocaleString("fr-TN")} TND`
          : "Prix sur demande";
      const details = [
        p.bedrooms ? `${p.bedrooms} ch.` : null,
        p.bathrooms ? `${p.bathrooms} sdb.` : null,
        p.areaSqm ? `${p.areaSqm} m²` : null,
      ]
        .filter(Boolean)
        .join(", ");
      const location = [p.city, p.governorate].filter(Boolean).join(", ");
      return `- [${mode}] ${type} — ${p.title} | ${location} | ${price}${details ? ` | ${details}` : ""}`;
    })
    .join("\n");

  return `Tu es l'assistant virtuel de Indeed Immobilier, une agence immobilière basée en Tunisie à Ariana.
Tu réponds aux clients en français, arabe standard, ou anglais — toujours dans la langue utilisée par le client.
Tu es professionnel, chaleureux et utile.

COORDONNÉES DE L'AGENCE :
- Téléphone / WhatsApp : +216 26 454 266
- Email : fouratiimmo@gmail.com
- Adresse : 065 Avenue Habib Bourguiba, Ariana 2080, Tunisie
- Facebook : https://www.facebook.com/indeedimmobilier/
- Instagram : https://www.instagram.com/indeed_immobilier/

ANNONCES ACTUELLEMENT DISPONIBLES :
${listingLines || "Aucune annonce disponible pour le moment."}

INSTRUCTIONS :
- Aide les clients à trouver un bien selon leur budget, localisation, type ou nombre de pièces.
- Si un client cherche un bien, filtre les annonces ci-dessus et présente les plus pertinentes.
- Pour avoir plus de détails sur un bien ou organiser une visite, invite le client à contacter l'agence.
- Ne mentionne jamais de biens qui ne sont pas dans la liste ci-dessus.
- Sois concis (3-5 phrases max par réponse sauf si le client demande plus de détails).`;
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Trop de messages. Réessayez dans une heure." },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages requis" }, { status: 400 });
    }

    // Cap conversation length
    if (messages.length > MAX_MESSAGES_PER_CONVERSATION) {
      return NextResponse.json(
        { error: "Conversation trop longue. Rechargez la page pour recommencer." },
        { status: 400 }
      );
    }

    // Cap last user message length
    const lastMsg = messages[messages.length - 1];
    if (typeof lastMsg?.content === "string" && lastMsg.content.length > MAX_INPUT_CHARS) {
      return NextResponse.json(
        { error: "Message trop long (max 500 caractères)." },
        { status: 400 }
      );
    }

    const systemPrompt = await buildSystemPrompt();

    const response = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    });

    const text =
      response.content[0]?.type === "text" ? response.content[0].text : "";

    return NextResponse.json({ message: text });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
