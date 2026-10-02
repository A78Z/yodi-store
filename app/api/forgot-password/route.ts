import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import UserModel from "@/lib/models/user";
import VerificationModel from "@/lib/models/verification";
import ForgotPasswordTemplate from "@/components/forgotPasswordTemplate";
import { connectDB } from "@/lib/db";




export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await connectDB();
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json({ message: "Email requis" }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Aucun compte trouvé avec cet email" },
        { status: 404 }
      );
    }

    // Générer un code de récupération
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Supprimer les anciens codes de récupération pour cet email
    await VerificationModel.deleteMany({
      email,
      type: "password_reset",
    });

    // Sauvegarder le nouveau code de récupération
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expire dans 15 minutes

    await VerificationModel.create({
      email,
      code: resetCode,
      type: "password_reset",
      expiresAt,
    });

    // Envoyer l'email de récupération
    try {
      await resend.emails.send({
        from: "Yodi Cosmetics <noreply@ibendouma.com>",
        to: [email],
        subject: "Réinitialisation de votre mot de passe - Yodi Cosmetics",
        react: await ForgotPasswordTemplate({
          firstname: user.firstname,
          resetCode: resetCode,
        }),
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      // Ne pas faire échouer la requête si l'email ne peut pas être envoyé
    }

    return NextResponse.json(
      {
        message: "Un code de récupération a été envoyé à votre email",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur récupération mot de passe:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
