import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { Resend } from "resend";
import UserModel from "@/lib/models/user";
import VerificationModel from "@/lib/models/verification";
import RegisterTemplate from "@/components/registerTemplate";
import { connectDB } from "@/lib/db";




export async function POST(request: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await connectDB();
    const body = await request.json();
    const {
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      zip,
      country,
      password,
    } = body;

    // Validation des champs requis
    if (
      !firstname ||
      !lastname ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !password
    ) {
      return NextResponse.json(
        { message: "Tous les champs obligatoires doivent être remplis" },
        { status: 400 }
      );
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Un compte avec cet email existe déjà" },
        { status: 400 }
      );
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Générer un code de vérification
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Données utilisateur à sauvegarder
    const userData = {
      firstname,
      lastname,
      email,
      phone,
      address,
      city,
      zip: zip || "",
      country: country || "",
      password: hashedPassword,
    };

    // Sauvegarder le code de vérification
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Expire dans 30 minutes

    await VerificationModel.create({
      email,
      code: verificationCode,
      userData,
      expiresAt,
    });

    // Envoyer l'email de vérification
    try {
      await resend.emails.send({
        from: "Yodi Cosmetics <noreply@ibendouma.com>",
        to: [email],
        subject: "Vérifiez votre compte Yodi Cosmetics",
        react: await RegisterTemplate({
          firstname,
          verificationCode,
        }),
      });
    } catch (emailError) {
      console.error("Erreur envoi email:", emailError);
      // Ne pas faire échouer l'inscription si l'email ne peut pas être envoyé
    }

    return NextResponse.json(
      {
        message: "Un code de vérification a été envoyé à votre email.",
        email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
