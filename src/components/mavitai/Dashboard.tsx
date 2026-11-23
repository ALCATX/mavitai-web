import { useMemo, useState } from "react";
import {
  ACCOUNTS,
  SPONSORED_ADS,
  buildFeed,
  kindLabel,
  type CommunityAccount,
} from "@/lib/community";
import { isBirthdayToday } from "@/lib/profile";
import {
  DIET_OPTIONS,
  GOAL_OPTIONS,
  type DashboardSection,
  type UserProfile,
} from "@/lib/types";
import { BirthdayBanner } from "./BirthdayBanner";
import { FollowButton } from "./FollowButton";
import { ProfilePanel } from "./ProfilePanel";
import { SponsoredAdCard } from "./SponsoredAdCard";
import {
  AdsIcon,
  CloseIcon,
  CoinIcon,
  CommentIcon,
  FeedIcon,
  HeartIcon,
  LockIcon,
  MenuIcon,
  ShortsIcon,
  TrophyIcon,
} from "./icons";

const NAV_ITEMS: {
  id: DashboardSection;
  label: string;
  locked?: boolean;
  icon: typeof FeedIcon;
}[] = [
  { id: "feed", label: "Feed de Rotinas", icon: FeedIcon },
  { id: "shorts", label: "Vídeos Curtos", icon: ShortsIcon },
  { id: "ads", label: "Mavitai Ads", icon: AdsIcon },
  { id: "pro", label: "Área Pro", icon: LockIcon, locked: true },
];

const RANKING = [
  { id: "luna", coins: 2480, place: 1 },
  { id: "rafa", coins: 2310, place: 2 },
  { id: "mia", coins: 1988, place: 3 },
  { id: "nitro", coins: 1760, place: 4 },
  { id: "volt", coins: 1544, place: 5 },
];

type DashboardProps = {
  profile: UserProfile;
  onProfileChange: (next: UserProfile) => void;
};

export function Dashboard({ profile, onProfileChange }: DashboardProps) {
  const [section, setSection] = useState<DashboardSection>("feed");
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [composer, setComposer] = useState("");
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [birthdayDismissed, setBirthdayDismissed] = useState(false);

  const firstName = profile.name.trim().split(" ")[0] || "Atleta";
  const initials = firstName.slice(0, 2).toUpperCase();
  const goalLabel =
    GOAL_OPTIONS.find((option) => option.id === profile.goal)?.label ?? "Definir objetivo";
  const dietLabel =
    DIET_OPTIONS.find((option) => option.id === profile.diet)?.label ?? "Dieta";
  const isPro = profile.plan === "diamond";
  const coins = isPro ? profile.mavicoins + 250 : profile.mavicoins;
  const isPrivate = profile.profileVisibility === "private";
  const showBirthday =
    isBirthdayToday(profile.birthDate) && !birthdayDismissed;

  function openSection(next: DashboardSection) {
    if (next === "pro" && !isPro) {
      setSection("pro");
      setMenuOpen(false);
      return;
    }
    setSection(next);
    setMenuOpen(false);
  }

  function toggleFollow(id: string) {
    setFollowing((current) => ({ ...current, [id]: !current[id] }));
  }

  return (
    <div className="min-h-dvh bg-background">
      {showBirthday ? (
        <BirthdayBanner
          name={firstName}
          onDismiss={() => setBirthdayDismissed(true)}
        />
      ) : null}

      <header className="sticky top-0 z-30 border-b border-line bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-xl border border-line lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <MenuIcon />
            </button>
            <span className="font-display text-2xl tracking-[0.18em]">MAVITAI</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-gold/35 bg-gold/10 px-3 py-1.5">
              <CoinIcon className="h-5 w-5" />
              <span className="font-display text-lg tracking-wide text-gold">
                {coins.toLocaleString("pt-BR")}
              </span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-gold-soft sm:inline">
                Mavicoins
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-lime/40 bg-lime/15 text-sm font-bold text-lime"
              title="Configurações de perfil"
              aria-label="Abrir configurações de perfil"
            >
              {initials}
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_280px]">
        <aside className="hidden lg:block">
          <SideNav section={section} isPro={isPro} onSelect={openSection} />
        </aside>

        <main className="min-w-0 pb-24 lg:pb-8">
          {section === "feed" ? (
            <FeedView
              firstName={firstName}
              goalLabel={goalLabel}
              dietLabel={dietLabel}
              isPrivate={isPrivate}
              composer={composer}
              onComposerChange={setComposer}
              following={following}
              onToggleFollow={toggleFollow}
              likedPosts={likedPosts}
              onToggleLike={(id) =>
                setLikedPosts((current) => ({ ...current, [id]: !current[id] }))
              }
              openComments={openComments}
              onToggleComments={(id) =>
                setOpenComments((current) => (current === id ? null : id))
              }
            />
          ) : null}
          {section === "shorts" ? <ShortsView /> : null}
          {section === "ads" ? (
            <AdsView following={following} onToggleFollow={toggleFollow} />
          ) : null}
          {section === "pro" ? <ProView isPro={isPro} /> : null}
        </main>

        <aside className="hidden lg:block">
          <RankingCard following={following} onToggleFollow={toggleFollow} />
        </aside>

        {section === "feed" ? (
          <div className="lg:hidden">
            <RankingCard following={following} onToggleFollow={toggleFollow} />
          </div>
        ) : null}
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-background/95 px-2 py-2 backdrop-blur-md lg:hidden">
        <ul className="grid grid-cols-4 gap-1">
          {NAV_ITEMS.map((item) => {
            const active = section === item.id;
            const locked = item.id === "pro" && !isPro;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => openSection(item.id)}
                  className={`flex w-full flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium ${
                    active ? "text-lime" : "text-zinc-400"
                  }`}
                >
                  <span className="relative">
                    <item.icon className="h-5 w-5" />
                    {locked ? (
                      <LockIcon className="absolute -right-2 -top-1 h-3 w-3 text-gold" />
                    ) : null}
                  </span>
                  {item.id === "feed"
                    ? "Rotinas"
                    : item.id === "shorts"
                      ? "Vídeos"
                      : item.id === "ads"
                        ? "Ads"
                        : "Pro"}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full w-[min(86vw,320px)] border-r border-line bg-surface p-5">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-xl tracking-[0.16em]">Menu</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar">
                <CloseIcon />
              </button>
            </div>
            <SideNav section={section} isPro={isPro} onSelect={openSection} />
          </div>
        </div>
      ) : null}

      {settingsOpen ? (
        <ProfilePanel
          profile={profile}
          onClose={() => setSettingsOpen(false)}
          onToggleVisibility={() =>
            onProfileChange({
              ...profile,
              profileVisibility: isPrivate ? "public" : "private",
            })
          }
        />
      ) : null}
    </div>
  );
}

function SideNav({
  section,
  isPro,
  onSelect,
}: {
  section: DashboardSection;
  isPro: boolean;
  onSelect: (section: DashboardSection) => void;
}) {
  return (
    <nav className="space-y-1">
      {NAV_ITEMS.map((item) => {
        const active = section === item.id;
        const locked = item.id === "pro" && !isPro;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-sm font-medium transition ${
              active ? "bg-lime/12 text-lime" : "text-zinc-300 hover:bg-white/5"
            }`}
          >
            <span className="flex items-center gap-3">
              <item.icon />
              {item.label}
            </span>
            {locked ? <LockIcon className="text-gold" /> : null}
          </button>
        );
      })}
    </nav>
  );
}

function FeedView({
  firstName,
  goalLabel,
  dietLabel,
  isPrivate,
  composer,
  onComposerChange,
  following,
  onToggleFollow,
  likedPosts,
  onToggleLike,
  openComments,
  onToggleComments,
}: {
  firstName: string;
  goalLabel: string;
  dietLabel: string;
  isPrivate: boolean;
  composer: string;
  onComposerChange: (value: string) => void;
  following: Record<string, boolean>;
  onToggleFollow: (id: string) => void;
  likedPosts: Record<string, boolean>;
  onToggleLike: (id: string) => void;
  openComments: string | null;
  onToggleComments: (id: string) => void;
}) {
  const items = useMemo(() => buildFeed(), []);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-line bg-surface p-4 sm:p-5">
        <p className="text-sm text-zinc-400">
          Olá, <span className="font-semibold text-foreground">{firstName}</span> · {goalLabel} ·{" "}
          {dietLabel}
        </p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-500">
          {isPrivate ? <LockIcon className="h-3.5 w-3.5 text-lime" /> : null}
          Perfil {isPrivate ? "privado" : "público"}
        </p>
        <label className="mt-3 block">
          <span className="sr-only">Compartilhe sua rotina de hoje</span>
          <textarea
            value={composer}
            onChange={(event) => onComposerChange(event.target.value)}
            placeholder="Compartilhe sua rotina de hoje..."
            rows={3}
            className="w-full resize-none rounded-2xl border border-line bg-surface-2 px-4 py-3 text-sm outline-none ring-lime/30 placeholder:text-zinc-500 focus:ring-2"
          />
        </label>
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="h-10 rounded-xl bg-lime px-4 text-sm font-bold text-[#0b1204] disabled:opacity-40"
            disabled={!composer.trim()}
          >
            Publicar
          </button>
        </div>
      </section>

      {items.map((item) => {
        if (item.type === "ad") {
          const brand = ACCOUNTS[item.ad.brandId];
          return (
            <SponsoredAdCard
              key={item.ad.id}
              ad={item.ad}
              brand={brand}
              following={Boolean(following[brand.id])}
              onToggleFollow={() => onToggleFollow(brand.id)}
            />
          );
        }

        const author = ACCOUNTS[item.post.authorId];
        const liked = Boolean(likedPosts[item.post.id]);
        const commentsOpen = openComments === item.post.id;

        return (
          <article
            key={item.post.id}
            className="overflow-hidden rounded-3xl border border-line bg-surface"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
              <AccountRow account={author} />
              <FollowButton
                following={Boolean(following[author.id])}
                onToggle={() => onToggleFollow(author.id)}
                compact
              />
            </div>
            <p className="px-4 text-xs text-zinc-500 sm:px-5">
              {item.post.routine} · {item.post.time}
            </p>
            <div className="mx-4 mt-3 h-40 rounded-2xl bg-gradient-to-br from-[#1a2a18] via-surface-2 to-[#102428] sm:mx-5" />
            <p className="px-4 py-4 text-sm leading-6 text-zinc-300 sm:px-5">
              {item.post.body}
            </p>
            <div className="flex gap-2 border-t border-line px-3 py-2">
              <button
                type="button"
                onClick={() => onToggleLike(item.post.id)}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
                  liked ? "text-lime" : "text-zinc-400"
                }`}
              >
                <HeartIcon filled={liked} />
                Curtir
              </button>
              <button
                type="button"
                onClick={() => onToggleComments(item.post.id)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400"
              >
                <CommentIcon />
                Comentar
              </button>
            </div>
            {commentsOpen ? (
              <div className="space-y-3 border-t border-line px-4 py-4 sm:px-5">
                <p className="text-sm text-zinc-400">
                  <span className="font-semibold text-foreground">Rafa Iron:</span> Treino
                  consistente. Respeito.
                </p>
                <input
                  placeholder="Escreva um comentário..."
                  className="h-11 w-full rounded-xl border border-line bg-surface-2 px-3 text-sm outline-none focus:ring-2 focus:ring-lime/30"
                />
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function AccountRow({ account }: { account: CommunityAccount }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <div
        className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${account.accent}`}
      >
        {account.initials}
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm font-semibold">{account.name}</p>
        <p className="truncate text-xs text-zinc-500">
          {kindLabel(account.kind)} · {account.subtitle.split("·")[1]?.trim() ?? account.subtitle}
        </p>
      </div>
    </div>
  );
}

function ShortsView() {
  return (
    <section className="mx-auto max-w-sm">
      <div className="relative aspect-[9/16] overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-[#16301c] to-[#07090c]">
        <div className="absolute inset-x-0 top-0 p-4 text-sm font-semibold">
          Vídeos Curtos
        </div>
        <div className="absolute inset-0 grid place-items-center">
          <div className="grid h-16 w-16 place-items-center rounded-full bg-lime text-[#0b1204]">
            ▶
          </div>
        </div>
        <p className="absolute inset-x-0 bottom-6 px-5 text-sm">
          30s de agachamento livre — estilo Kwai, feito para o treino.
        </p>
      </div>
    </section>
  );
}

function AdsView({
  following,
  onToggleFollow,
}: {
  following: Record<string, boolean>;
  onToggleFollow: (id: string) => void;
}) {
  return (
    <section className="space-y-4">
      <h2 className="font-display text-3xl tracking-wide">Mavitai Ads</h2>
      <p className="text-sm text-zinc-400">
        Páginas de empresas e campanhas patrocinadas da comunidade fitness.
      </p>
      {SPONSORED_ADS.map((ad) => {
        const brand = ACCOUNTS[ad.brandId];
        return (
          <SponsoredAdCard
            key={ad.id}
            ad={ad}
            brand={brand}
            following={Boolean(following[brand.id])}
            onToggleFollow={() => onToggleFollow(brand.id)}
          />
        );
      })}
    </section>
  );
}

function ProView({ isPro }: { isPro: boolean }) {
  if (isPro) {
    return (
      <section className="rounded-3xl border border-gold/40 bg-gradient-to-b from-[#2a2108] to-surface p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-gold">Área Pro</p>
        <h2 className="mt-2 font-display text-4xl text-gold-soft">Bem-vindo, Diamante</h2>
        <p className="mt-3 text-sm text-zinc-300">
          Treinos avançados, nutrição personalizada e boost de Mavicoins estão liberados.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-gold/30 bg-surface p-6 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold">
        <LockIcon className="h-6 w-6" />
      </div>
      <h2 className="mt-4 font-display text-3xl">Área Pro bloqueada</h2>
      <p className="mt-2 text-sm text-zinc-400">
        Disponível no plano Diamante. Desbloqueie conteúdos premium, treinos avançados e
        recompensas extras.
      </p>
      <p className="mt-5 inline-flex rounded-full border border-gold/40 px-4 py-2 text-sm font-semibold text-gold">
        Upgrade para Diamante
      </p>
    </section>
  );
}

function RankingCard({
  following,
  onToggleFollow,
}: {
  following: Record<string, boolean>;
  onToggleFollow: (id: string) => void;
}) {
  return (
    <section className="rounded-3xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center gap-2 text-gold">
        <TrophyIcon className="h-5 w-5" />
        <h2 className="text-sm font-bold uppercase tracking-[0.14em]">Ranking da semana</h2>
      </div>
      <ul className="space-y-3">
        {RANKING.map((row) => {
          const account = ACCOUNTS[row.id];
          return (
            <li key={row.id} className="flex items-center justify-between gap-2 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                    row.place === 1 ? "bg-gold text-[#2a1d00]" : "bg-white/8 text-zinc-300"
                  }`}
                >
                  {row.place}
                </span>
                <span className="truncate">{account.name}</span>
              </span>
              <FollowButton
                following={Boolean(following[account.id])}
                onToggle={() => onToggleFollow(account.id)}
                compact
              />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
