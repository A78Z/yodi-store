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
    
    // Récupérer la dernière commande de l'utilisateur (la plus récente)
    const lastOrder = await OrderModel.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);
    
    if (!lastOrder) {
      return NextResponse.json(
        { message: "Aucune commande trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(lastOrder, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération de la dernière commande" },
      { status: 500 }
    );
  }
}
