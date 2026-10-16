// lib/models/category.ts
// Réglages d'affichage d'une catégorie (géré plus tard depuis l'admin).
// Une catégorie sans document ici est considérée visible (visible = true par défaut).
// Le site public ne fait que LIRE cette collection : autoIndex/autoCreate sont
// désactivés pour ne jamais créer de collection ni d'index en production.
import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  slug: string; // = champ `category` des produits (ex. "huile")
  title?: string; // libellé affiché ; sinon libellé par défaut du site
  visible: boolean;
}

const categorySchema = new Schema<ICategory>(
  {
    slug: { type: String, required: true, trim: true },
    title: { type: String, trim: true },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true, autoIndex: false, autoCreate: false }
);

const CategoryModel =
  mongoose.models.category || mongoose.model<ICategory>("category", categorySchema);

export default CategoryModel;
