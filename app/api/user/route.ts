import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import UserModel from "@/lib/models/user";
import { options } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";


export async function GET() {
  const session = await getServerSession(options);
  
  if (!session) {
    return NextResponse.json(
      { message: "Non autorisé" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const user = await UserModel.findById(session.user?.id).select("-password");
    
    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de l'utilisateur" },
      { status: 500 }
    );
  }
}
