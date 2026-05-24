import { Category } from "./types/types";

export const catImages = [
  {
    id: 1,
    image: "/categories/tisane-detox.webp",
    title: "Tisane Detox",
    slug: "tisane/detox",
  },
  {
    id: 2,
    image: "/categories/savonnette.webp",
    title: "Savon",
    slug: "savon",
  },
  {
    id: 3,
    image: "/categories/tisane-digestive.webp",
    title: "Tisane Digestive",
    slug: "tisane/digestive",
  },
  {
    id: 4,
    image: "/categories/baume-a-barbe.webp",
    title: "Baume à Barbe",
    slug: "baume/baume-barbe",
  },
  {
    id: 5,
    image: "/categories/cheveux.webp",
    title: "Cheveux",
    slug: "huile/cheveux",
  },
  {
    id: 6,
    image: "/categories/huile-a-barbe.webp",
    title: "Huile à Barbe",
    slug: "huile/huile-barbe",
  },
];

export const categories: Category[] = [
  {
    title: "Tisane",
    slug: "tisane",
    id: "hnjs12k",
    subcategories: [
      {
        title: "Detox",
        slug: "detox",
        id: "nxhapie",
      },
      {
        title: "Digestive",
        slug: "digestive",
        id: "vqpaxj",
      },
    ],
  },
  {
    title: "Huile",
    slug: "huile",
    id: "pacf9l4",

    subcategories: [
      {
        title: "Huile barbe",
        slug: "huile-barbe",
        id: "bzparer",
      },
      {
        title: "Huile cheveux",
        slug: "huile-cheveux",
        id: "zpqadi",
      },
    ],
  },
  {
    title: "Baume",
    slug: "baume",
    id: "nzpwtb",

    subcategories: [
      {
        title: "Baume à barbe",
        slug: "baume-a-barbe",
        id: "zvalpqvxj",
      },
      {
        title: "Baume pour cheveux",
        slug: "baume-pour-cheveux",
        id: "xpaceioa",
      },
    ],
  },
  {
    title: "Gomme à lèvres",
    slug: "gomme-a-levres",
    id: "gyg6k6h",
  },
  {
    title: "Savon",
    slug: "savon",
    id: "mb13w3q",
    subcategories: [
      {
        title: "Savon au curcuma et miel",
        slug: "savon-au-curcuma-et-miel",
        id: "hzbshqwo",
      },

      {
        title: "Savon aux agrumes",
        slug: "savon-au-agrumes",
        id: "aocwgjs",
      },
      {
        title: "Savon a l'avoine et au beurre de karité",
        slug: "savon-a-lavoine-et-au-beurre-de-karite",
        id: "slpsakce",
      },
      {
        title: "Savon exfoliant au citron et aux graines de pavot",
        slug: "savon-exfoliant-au-citron-et-au-graines-de-pavot",
        id: "asckppao",
      },
      {
        title: "Savon purifiant au laurier et clous de girofle",
        slug: "savon-purifiant-au-laurier-et-clous-de-girofle",
        id: "aoscqwcwjnc",
      },
      {
        title: "Op",
        slug: "op",
        id: "yfb74l7",
      },
    ],
  },
  {
    id: "lzqp9t",
    title: "Bain & Corps",
    slug: "bain-corps",
  },
  {
    id: "b51k0j",
    title: "Bébé & Maman",
    slug: "bebe-maman",
  }
];

export const productMock = {
  id: "hgushyk",
  title: "Topicrem Mela Lait Unifiant Ultra-Hydratant Spf15 500ml",
  price: 2700,
  discount: 20,
  imageUrl: "/products/timex.jpg",
  category: "Soins du visage",
  benefits: [
    "Unifie le teint",
    "Corrige et prévient l'apparition des taches",
    "Protection SPF15 (UVA/UVB)",
    "Hydratation intense 24h",
    "Peaux sensibles - Taches",
    "Hydrate 24H",
  ],
  stock: 10,
  brand: "TOPICREM",
  sku: "14526",
  etiquette: "TOPICREM MELA",
  description:
    "Le Topicrem Mela Lait Unifiant Ultra-Hydratant est un soin innovant qui unifie le teint tout en corrigeant et prévenant l'apparition des taches. Sa formule enrichie en actifs éclaircissants et hydratants offre une protection SPF15 contre les rayons UVA/UVB.",
  usage:
    "Appliquez le produit sur le visage et le cou le matin et le soir après nettoyage. Utilisez en complément de votre routine de soins habituelle.",
  quantity: 1,
};

export const products = [
  {
    id: 1,
    title:
      "Nuhanciam Lait Corps Éclaircissant Taches et Hydratant correcteur d’Hyperpigmentation 500 ml",
    slug: "nuhanciam-lait-corps-eclaircissant-taches-et-hydratant-correcteur-d-hyperpigmentation-500-ml",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
  {
    id: 2,
    title: "Produit  de detox pour enlever des toxines",
    slug: "produit-de-detox-pour-enlever-des-toxines",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
  {
    id: 3,
    title:
      "Nuhanciam Lait Corps Éclaircissant Taches et Hydratant correcteur d’Hyperpigmentation 500 ml",
    slug: "nuhanciam-lait-corps-eclaircissant-taches-et-hydratant-correcteur-d-hyperpigmentation-500-ml",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
  {
    id: 4,
    title: "Produit  de detox pour enlever des toxines",
    slug: "produit-de-detox-pour-enlever-des-toxines",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
  {
    id: 5,
    title: "Produit  de detox pour enlever des toxines",
    slug: "produit-de-detox-pour-enlever-des-toxines",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
  {
    id: 6,
    title: "Produit  de detox pour enlever des toxines",
    slug: "produit-de-detox-pour-enlever-des-toxines",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
  {
    id: 7,
    title: "Produit  de detox pour enlever des toxines",
    slug: "produit-de-detox-pour-enlever-des-toxines",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
  {
    id: 8,
    title: "Produit  de detox pour enlever des toxines",
    slug: "produit-de-detox-pour-enlever-des-toxines",
    description: "Description du produit 1",
    price: 2175,
    benefits: [
      "Unifie le teint",
      "Corrige et prévient l’apparition des taches",
      "Protection SPF15 (UVA/UVB)",
      "Hydratation intense 24h",
    ],
    discountPrice: 3575,
    productImage: "/products/timex.jpg",
    stock: 10,
    brand: "ToipDetox",
    sku: "12345",
    etiquette: "Detox",
  },
];

export const currentSelection = [
  {
    id: "hsy51",
    title: "Tisane détox",
    description: "Tisane détox préparée avec soin pour éliminer les toxines",
    category: "tisane/detox",
    productImage: "/current/tisane-detox.webp",
    isActive: true,
  },
  {
    id: "atw92",
    title: "Tisane digestive",
    description:
      "Tisane digestive préparée avec soin pour faciliter la digestion",
    category: "tisane/digestive",
    productImage: "/current/tisane-digestive.webp",
    isActive: false,
  },
  {
    id: "xqy73",
    title: "Jus de tisane détox",
    description:
      "Jus de tisane détox préparé avec soin pour éliminer les toxines",
    category: "tisane/detox",
    productImage: "/current/tisane.webp",
    isActive: false,
  },
];

export const deleliveryZones = {
  senegal: [
    "Mermoz",
    "VDN",
    "Liberté 6",
    "Sacré Cœur",
    "Baobab",
    "Point E",
    "Yoff",
    "Pikine",
    "Medina",
    "Rufisque",
    "Grand Yoff",
    "Colobane",
    "Grand Dakar",
    "HLM",
    "Ouakam",
    "Almadies",
    "Parcelles Assainies",
    "Ouest foire",
    "Nord foire",
    "Mbao",
    "Keur Massar",
    "Patte d'oie",
    "Ngor",
  ],
  canada: [
    "Montreal",
    "Toronto",
    "Vancouver",
    "Calgary",
    "Edmonton",
    "Winnipeg",
    "Hamilton",
    "Ottawa",
    "Quebec City",
  ],
};
