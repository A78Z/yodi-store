// lib/models/emailNotification.ts
// Liste d'attente : emails des visiteurs intéressés par un produit indisponible.
import mongoose, { Schema, Document, Types } from "mongoose";

export interface IEmailNotification extends Document {
  email: string;
  produitId: Types.ObjectId;
  produitNom: string; // snapshot du nom au moment de l'inscription
  dateInscription: Date;
  notifie: boolean; // true une fois l'email "produit disponible" envoyé
  dateNotification: Date | null;
}

// Validation simple du format email côté schéma (en plus de la validation applicative)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emailNotificationSchema = new Schema<IEmailNotification>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: [EMAIL_REGEX, "Format d'email invalide"],
    },
    produitId: {
      type: Schema.Types.ObjectId,
      ref: "product",
      required: true,
      index: true,
    },
    produitNom: {
      type: String,
      required: true,
      trim: true,
    },
    dateInscription: {
      type: Date,
      default: Date.now,
    },
    notifie: {
      type: Boolean,
      default: false,
      index: true,
    },
    dateNotification: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Un même visiteur ne peut s'inscrire qu'une fois par produit.
emailNotificationSchema.index({ email: 1, produitId: 1 }, { unique: true });

const EmailNotificationModel =
  mongoose.models.emailNotification ||
  mongoose.model<IEmailNotification>(
    "emailNotification",
    emailNotificationSchema
  );

export default EmailNotificationModel;
