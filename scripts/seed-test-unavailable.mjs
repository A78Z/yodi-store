/**
 * Marque 2 produits en "indisponible" (disponible=false) pour tester le flow complet.
 * Par défaut, prend les 2 produits les plus récents. Vous pouvez aussi passer des SKU :
 *
 *   node --env-file=.env scripts/seed-test-unavailable.mjs
 *   node --env-file=.env scripts/seed-test-unavailable.mjs SKU123 SKU456
 *
 * Pour ANNULER (tout remettre disponible) :
 *   node --env-file=.env scripts/seed-test-unavailable.mjs --reset
 */
import mongoose from "mongoose";

const URI = process.env.MONGO_URI_IBYTRADE_GOAPI;
if (!URI) {
  console.error("❌ Variable MONGO_URI_IBYTRADE_GOAPI manquante.");
  process.exit(1);
}

const args = process.argv.slice(2);
const reset = args.includes("--reset");
const skus = args.filter((a) => !a.startsWith("--"));

async function run() {
  await mongoose.connect(URI);
  const products = mongoose.connection.collection("products");

  if (reset) {
    const res = await products.updateMany({}, { $set: { disponible: true } });
    console.log(`♻️  Reset : ${res.modifiedCount} produit(s) repassés disponibles.`);
    await mongoose.disconnect();
    return;
  }

  let targets;
  if (skus.length > 0) {
    targets = await products.find({ sku: { $in: skus } }).toArray();
  } else {
    targets = await products.find({}).sort({ createdAt: -1 }).limit(2).toArray();
  }

  if (targets.length === 0) {
    console.log("⚠️  Aucun produit trouvé.");
    await mongoose.disconnect();
    return;
  }

  for (const p of targets) {
    await products.updateOne({ _id: p._id }, { $set: { disponible: false } });
    console.log(`🔕 Marqué indisponible : ${p.title} (${p._id})`);
  }

  console.log(`✅ ${targets.length} produit(s) marqué(s) "Bientôt disponible".`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error("❌ Erreur :", e);
  process.exit(1);
});
