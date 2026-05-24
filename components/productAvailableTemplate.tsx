import React from "react";

export interface ProductAvailableTemplateProps {
  produitNom: string;
  produitImage?: string;
  prix: string; // déjà formaté, ex: "2 700 FCFA"
  produitUrl: string; // lien absolu vers la page produit
  logoUrl?: string;
  whatsapp?: string; // numéro E.164 sans +, ex: 221789689698
  telephone?: string; // affiché
  unsubscribeUrl?: string;
}

// Email envoyé quand un produit "Bientôt disponible" devient disponible.
const ProductAvailableTemplate: React.FC<ProductAvailableTemplateProps> = ({
  produitNom,
  produitImage,
  prix,
  produitUrl,
  logoUrl = "https://yodi-k.com/logo-yodi-k.png",
  whatsapp = "221789689698",
  telephone = "+221 78 968 96 98",
  unsubscribeUrl,
}) => {
  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
        backgroundColor: "#f8f9fa",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "10px",
          padding: "32px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoUrl} alt="Yodi-Store" width={90} height={90} style={{ display: "inline-block" }} />
        </div>

        <h1
          style={{
            color: "#A36F5E",
            fontSize: "22px",
            textAlign: "center",
            margin: "0 0 16px 0",
          }}
        >
          🎉 {produitNom} est enfin disponible !
        </h1>

        <p style={{ color: "#333", fontSize: "16px", lineHeight: 1.6, margin: "0 0 20px 0", textAlign: "center" }}>
          Bonne nouvelle ! Le produit <strong>{produitNom}</strong> que tu
          attendais est maintenant disponible chez Yodi-Store.
        </p>

        {/* Image produit */}
        {produitImage && (
          <div style={{ textAlign: "center", margin: "0 0 16px 0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={produitImage}
              alt={produitNom}
              width={240}
              style={{ maxWidth: "240px", borderRadius: "8px", display: "inline-block" }}
            />
          </div>
        )}

        {/* Prix */}
        <p style={{ textAlign: "center", color: "#A36F5E", fontSize: "20px", fontWeight: "bold", margin: "0 0 24px 0" }}>
          {prix}
        </p>

        {/* CTA */}
        <div style={{ textAlign: "center", margin: "0 0 28px 0" }}>
          <a
            href={produitUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#A36F5E",
              color: "white",
              padding: "14px 34px",
              textDecoration: "none",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            Voir le produit
          </a>
        </div>

        {/* Footer contacts */}
        <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", textAlign: "center" }}>
          <p style={{ color: "#666", fontSize: "13px", margin: "0 0 8px 0" }}>
            Une question ? Contacte-nous :
          </p>
          <p style={{ color: "#666", fontSize: "13px", margin: "0 0 4px 0" }}>
            <a href={`https://wa.me/${whatsapp}`} style={{ color: "#25D366", textDecoration: "none" }}>
              WhatsApp
            </a>{" "}
            &nbsp;•&nbsp; Tél : {telephone}
          </p>
          {unsubscribeUrl && (
            <p style={{ color: "#aaa", fontSize: "11px", margin: "12px 0 0 0" }}>
              <a href={unsubscribeUrl} style={{ color: "#aaa" }}>
                Se désinscrire de cette notification
              </a>
            </p>
          )}
          <p style={{ color: "#aaa", fontSize: "11px", margin: "10px 0 0 0" }}>
            © {new Date().getFullYear()} Yodi-Store — Dakar, Sénégal
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductAvailableTemplate;
