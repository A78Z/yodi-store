import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import OrderModel from "@/lib/models/order";
import ProductModel, { type IProduct } from "@/lib/models/product";
import Currency from "@/lib/models/currency";
import { serializeProduct } from "@/lib/product-data";
import { validateCheckoutProducts } from "@/lib/checkout-products";
import { options } from "../auth/[...nextauth]/option";
import { getServerSession } from "next-auth";


export async function POST(req: Request) {
  const isAuth = await getServerSession(options);
  if (!isAuth) {
    return NextResponse.json(
      { message: "Vous devez être connecté pour confirmer votre commande" },
      { status: 401 }
    );
  }
  const data = await req.json();

  //   console.log(data);

  try {
    await connectDB();
    const items = data.orderData?.products;
    if (!Array.isArray(items) || !items.length || items.length > 100 || items.some(item => !item || !/^[a-f\d]{24}$/i.test(item.id))) {
      return NextResponse.json({ message: "Panier invalide" }, { status: 400 });
    }
    const products = await ProductModel.find({ _id: { $in: items.map(item => item.id) } }).lean<IProduct[]>();
    let checked;
    try {
      checked = validateCheckoutProducts(items, products);
    } catch (error) {
      return NextResponse.json({ message: error instanceof Error ? error.message : "Panier invalide" }, { status: 409 });
    }
    if (checked.pricesChanged) {
      return NextResponse.json({ message: "Le prix d’un produit a changé. Actualisez votre panier avant de confirmer." }, { status: 409 });
    }
    const currency = data.orderData.selectedCurrency;
    if (currency !== "FCFA" && currency !== "USD") return NextResponse.json({ message: "Devise invalide" }, { status: 400 });
    const rate = currency === "USD" ? Number((await Currency.findOne().lean<{ rate: number }>())?.rate) : 1;
    if (!Number.isFinite(rate) || rate <= 0) return NextResponse.json({ message: "Taux de change indisponible" }, { status: 503 });
    if (currency === "USD" && Number(data.orderData.valueCurrency) !== rate) {
      return NextResponse.json({ message: "Le taux de change a été actualisé. Rechargez la page avant de confirmer." }, { status: 409 });
    }
    const shippingCost = 1500;
    await OrderModel.create({
      ...data.orderData,
      userId: isAuth.user.id,
      products: checked.validated.map(({ product, id, quantity }) => ({ ...serializeProduct(product as unknown as Record<string, unknown>), id, quantity })),
      shippingCost,
      valueCurrency: rate,
      total: currency === "USD" ? Number(((checked.subtotal + shippingCost) / rate).toFixed(2)) : checked.subtotal + shippingCost,
    });
    return NextResponse.json(
      { message: "Commande créée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la création de la commande" },
      { status: 500 }
    );
  }
}
