import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import EmailNotificationModel from "@/lib/models/emailNotification";

// Désinscription (RGPD) : supprime l'inscription à la liste d'attente.
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const id = new URL(req.url).searchParams.get("id") || "";
  const valid = /^[a-fA-F0-9]{24}$/.test(id);

  let message = "Lien de désinscription invalide.";
  if (valid) {
    try {
      await connectDB();
      await EmailNotificationModel.deleteOne({ _id: id });
      message = "Tu as bien été désinscrit. Tu ne recevras plus cette notification.";
    } catch {
      message = "Une erreur est survenue. Réessaie plus tard.";
    }
  }

  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Désinscription - Yodi-Store</title></head>
  <body style="font-family:Arial,sans-serif;background:#f8f9fa;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;">
    <div style="background:#fff;padding:40px;border-radius:10px;box-shadow:0 4px 6px rgba(0,0,0,.1);text-align:center;max-width:420px;">
      <h1 style="color:#A36F5E;font-size:20px;">Yodi-Store</h1>
      <p style="color:#333;font-size:15px;line-height:1.6;">${message}</p>
      <a href="https://yodi-k.com" style="display:inline-block;margin-top:12px;background:#A36F5E;color:#fff;padding:10px 24px;border-radius:8px;text-decoration:none;">Retour à la boutique</a>
    </div>
  </body></html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
