// Petits drapeaux en SVG : rendu identique sur tous les téléphones
// (les emojis drapeaux s'affichent en lettres sur Windows).
const Flag = ({ country }: { country: "SN" | "CA" }) =>
  country === "SN" ? (
    <svg viewBox="0 0 3 2" className="h-3 w-[18px] shrink-0 rounded-[2px]" role="img" aria-label="Sénégal">
      <rect width="1" height="2" fill="#00853F" />
      <rect x="1" width="1" height="2" fill="#FDEF42" />
      <rect x="2" width="1" height="2" fill="#E31B23" />
      <polygon fill="#00853F" points="1.5,0.72 1.56,0.9 1.75,0.9 1.6,1.01 1.65,1.19 1.5,1.08 1.35,1.19 1.4,1.01 1.25,0.9 1.44,0.9" />
    </svg>
  ) : (
    <svg viewBox="0 0 4 2" className="h-3 w-[24px] shrink-0 rounded-[2px]" role="img" aria-label="Canada">
      <rect width="4" height="2" fill="#fff" />
      <rect width="1" height="2" fill="#D52B1E" />
      <rect x="3" width="1" height="2" fill="#D52B1E" />
      <polygon fill="#D52B1E" points="2,0.45 2.12,0.75 2.35,0.68 2.25,1.05 2.4,1.12 2.05,1.3 2.05,1.55 1.95,1.55 1.95,1.3 1.6,1.12 1.75,1.05 1.65,0.68 1.88,0.75" />
    </svg>
  );

export default Flag;
