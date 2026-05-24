/**
 * Migration : ajoute le champ `disponible: true` à TOUS les produits existants.
 * Idempotent (ne touche que les documents où le champ est absent).
 *
 * Usage :
 *   MONGO_URI_IBYTRADE_GOAPI="mongodb+srv://..." node scripts/migrate-disponible.mjs
 *
 * (La variable est déjà dans votre .env ; vous pouvez aussi faire :)
 *   node --env-file=.env scripts/migrate-disponible.mjs
 */
import mongoose from "mongoose";

const URI = process.env.MONGO_URI_IBYTRADE_GOAPI;
if (!URI) {
  console.error("❌ Variable MONGO_URI_IBYTRADE_GOAPI manquante.");
  process.exit(1);
}

async function run() {
  await mongoose.connect(URI);
  const products = mongoose.connection.collection("products");

  const res = await products.updateMany(
    { disponible: { $exists: false } },
    { $set: { disponible: true } }
  );

  console.log(`✅ Migration terminée : ${res.modifiedCount} produit(s) mis à jour (disponible=true).`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Erreur migration :", e);
  process.exit(1);
});
