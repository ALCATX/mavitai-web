export type AccountKind = "user" | "influencer" | "company";

export type CommunityAccount = {
  id: string;
  name: string;
  kind: AccountKind;
  subtitle: string;
  initials: string;
  accent: string;
};

export type FeedPost = {
  id: string;
  authorId: string;
  time: string;
  routine: string;
  body: string;
};

export type SponsoredAd = {
  id: string;
  brandId: string;
  title: string;
  description: string;
  cta: "Comprar Agora" | "Saber Mais";
  product: "whey" | "wear";
};

export const ACCOUNTS: Record<string, CommunityAccount> = {
  luna: {
    id: "luna",
    name: "Luna Power",
    kind: "influencer",
    subtitle: "Influenciadora · Hypertrophy",
    initials: "LP",
    accent: "bg-sport/20 text-sport",
  },
  rafa: {
    id: "rafa",
    name: "Rafa Iron",
    kind: "user",
    subtitle: "Atleta · Powerlifting",
    initials: "RI",
    accent: "bg-lime/15 text-lime",
  },
  mia: {
    id: "mia",
    name: "Mia Sprint",
    kind: "user",
    subtitle: "Atleta · Corrida",
    initials: "MS",
    accent: "bg-gold/15 text-gold",
  },
  nitro: {
    id: "nitro",
    name: "Nitro Lab",
    kind: "company",
    subtitle: "Marca · Suplementos",
    initials: "NL",
    accent: "bg-white/10 text-foreground",
  },
  volt: {
    id: "volt",
    name: "Volt Wear",
    kind: "company",
    subtitle: "Marca · Roupa esportiva",
    initials: "VW",
    accent: "bg-white/10 text-foreground",
  },
};

export const FEED_POSTS: FeedPost[] = [
  {
    id: "post-luna",
    authorId: "luna",
    time: "há 12 min",
    routine: "Push day",
    body: "Peito e tríceps concluídos. 4x8 no supino + drop set. Quem mais fechou o treino de hoje?",
  },
  {
    id: "post-rafa",
    authorId: "rafa",
    time: "há 41 min",
    routine: "Agachamento pesado",
    body: "5x5 a 180 kg. Técnica limpa, sem ego. Amanhã é dia de recuperar.",
  },
  {
    id: "post-mia",
    authorId: "mia",
    time: "há 2 h",
    routine: "Base aeróbica",
    body: "12 km leves + mobilidade. Consistência vale mais do que o treino heróico de domingo.",
  },
];

export const SPONSORED_ADS: SponsoredAd[] = [
  {
    id: "ad-whey",
    brandId: "nitro",
    title: "Nitro Whey Isolado 900g",
    description: "25g de proteína por dose, baixa lactose. Parceiro oficial MAVITAI Ads.",
    cta: "Comprar Agora",
    product: "whey",
  },
  {
    id: "ad-wear",
    brandId: "volt",
    title: "Regata Dry-Fit Volt",
    description: "Tecido respirável para treino pesado. Nova coleção da comunidade.",
    cta: "Saber Mais",
    product: "wear",
  },
];

export type FeedItem =
  | { type: "post"; post: FeedPost }
  | { type: "ad"; ad: SponsoredAd };

export function buildFeed(): FeedItem[] {
  const items: FeedItem[] = [];
  FEED_POSTS.forEach((post, index) => {
    items.push({ type: "post", post });
    const ad = SPONSORED_ADS[index];
    if (ad) items.push({ type: "ad", ad });
  });
  return items;
}

export function kindLabel(kind: AccountKind) {
  if (kind === "influencer") return "Influenciador";
  if (kind === "company") return "Empresa";
  return "Atleta";
}
