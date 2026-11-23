import type { CommunityAccount, SponsoredAd } from "@/lib/community";
import { FollowButton } from "./FollowButton";

type SponsoredAdCardProps = {
  ad: SponsoredAd;
  brand: CommunityAccount;
  following: boolean;
  onToggleFollow: () => void;
};

export function SponsoredAdCard({
  ad,
  brand,
  following,
  onToggleFollow,
}: SponsoredAdCardProps) {
  return (
    <article className="overflow-hidden rounded-3xl border border-sport/35 bg-surface">
      <div className="flex items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className={`grid h-10 w-10 place-items-center rounded-full text-sm font-bold ${brand.accent}`}>
            {brand.initials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{brand.name}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sport">
              Patrocinado
            </p>
          </div>
        </div>
        <FollowButton following={following} onToggle={onToggleFollow} compact />
      </div>

      <div className="mx-4 overflow-hidden rounded-2xl sm:mx-5">
        {ad.product === "whey" ? <WheyArt /> : <WearArt />}
      </div>

      <div className="space-y-3 px-4 py-4 sm:px-5">
        <div>
          <h3 className="text-lg font-semibold">{ad.title}</h3>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{ad.description}</p>
        </div>
        <button
          type="button"
          className="h-11 w-full rounded-xl bg-sport text-sm font-bold text-[#04120f] transition hover:brightness-95"
        >
          {ad.cta}
        </button>
      </div>
    </article>
  );
}

function WheyArt() {
  return (
    <div className="relative h-44 bg-gradient-to-br from-[#12352c] via-[#0d1c18] to-[#1a2a14]">
      <img
        src="/ads/whey-protein.svg"
        alt="Pote de whey protein Nitro Lab"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function WearArt() {
  return (
    <div className="relative h-44 bg-gradient-to-br from-[#1c2430] via-[#10151c] to-[#243018]">
      <img
        src="/ads/sportswear.svg"
        alt="Regata esportiva Volt Wear"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
