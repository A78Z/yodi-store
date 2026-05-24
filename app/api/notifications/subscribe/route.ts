import { NextRequest, NextResponse } from "next/server";
import {
  subscribeToProduct,
  getWaitingCount,
  type SubscribeStatus,
} from "@/lib/notifications";

// Route PUBLIQUE (un visiteur non connecté doit pouvoir s'inscrire).
export const dynamic = "force-dynamic";

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

const STATUS_CODE: Record<SubscribeStatus, number> = {
  created: 201,
  already: 200,
  bot: 200,
  available: 200,
  invalid_email: 400,
  not_found: 404,
  rate_limited: 429,
  error: 500,
};

export async function POST(req: NextRequest) {
  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { status: "error", message: "Requête invalide." },
      { status: 400 }
    );
  }

  const result = await subscribeToProduct({
    email: body.email,
    produitId: body.produitId,
    honeypot: body.website, // champ honeypot côté client = "website"
    ip: clientIp(req),
  });

  return NextResponse.json(result, { status: STATUS_CODE[result.status] });
}

// GET ?produitId=... -> { count } : nombre de personnes en attente (preuve sociale)
export async function GET(req: NextRequest) {
  const produitId = new URL(req.url).searchParams.get("produitId") || "";
  const count = await getWaitingCount(produitId);
  return NextResponse.json({ count });
}
