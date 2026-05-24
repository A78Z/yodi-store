// lib/models/product.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  title: string;
  price: number;
  category: string;
  subCategory?: string;
  discount?: number;
  imageUrl: string;
  benefits?: string[];
  stock: number;
  brand?: string;
  sku?: string;
  etiquette?: string;
  description?: string;
  usage?: string;
  isFeatured?: boolean; // Pour le carrousel "produits mis en avant"
  disponible?: boolean; // false = "Bientôt disponible" (liste d'attente email)
}

const productSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    subCategory: {
      type: String,
      required: false,
      trim: true,
    },
    discount: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    brand: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // Permet les valeurs null/undefined uniques
    },
    etiquette: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    usage: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false, // Par défaut, non mis en avant
    },
    disponible: {
      type: Boolean,
      default: true, // Par défaut disponible (produits existants déjà en vente)
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel =
  mongoose.models.product || mongoose.model<IProduct>("product", productSchema);

export default ProductModel;
