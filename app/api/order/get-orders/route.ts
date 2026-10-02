import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderModel from "@/lib/models/order";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";


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
    const userId = session.user?.id;
    
    // Récupérer toutes les commandes de l'utilisateur triées par date de création (plus récentes en premier)
    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 });
    
    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des commandes" },
      { status: 500 }
    );
  }
}
