import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderModel from "@/lib/models/order";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/option";


export async function GET() {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = session.user?.id;

    // Récupérer toutes les commandes de l'utilisateur
    const orders = await OrderModel.find({ userId });
    // console.log(orders);

    // Calculer les statistiques
    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + Number(order.total) * Number(order.valueCurrency),
      0
    );

    // Compter les commandes par statut
    const delivered = orders.filter(
      (order) => order.status === "delivered"
    ).length;
    const pending = orders.filter((order) => order.status === "pending").length;
    const cancelled = orders.filter(
      (order) => order.status === "cancelled"
    ).length;
    const processing = orders.filter(
      (order) => order.status === "processing"
    ).length;

    const stats = {
      totalOrders,
      totalSpent,
      delivered,
      pending,
      cancelled,
      processing,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des statistiques" },
      { status: 500 }
    );
  }
}
