import type { UserProfile } from "@/lib/types";
import { CloseIcon } from "./icons";

type ProfilePanelProps = {
  profile: UserProfile;
  onClose: () => void;
  onToggleVisibility: () => void;
};

export function ProfilePanel({
  profile,
  onClose,
  onToggleVisibility,
}: ProfilePanelProps) {
  const isPrivate = profile.profileVisibility === "private";
  const firstName = profile.name.trim().split(" ")[0] || "Atleta";

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        aria-label="Fechar configurações"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-[min(92vw,400px)] flex-col border-l border-line bg-surface p-5 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-3xl tracking-wide">Perfil</h2>
          <button type="button" onClick={onClose} aria-label="Fechar">
            <CloseIcon />
          </button>
        </div>

        <p className="text-sm text-zinc-400">
          {firstName}
          {profile.contact ? ` · ${profile.contact}` : ""}
        </p>

        <section className="mt-6 rounded-2xl border border-line bg-surface-2 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Privacidade do perfil</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                {isPrivate
                  ? "Privado: apenas seguidores aprovados podem ver suas rotinas."
                  : "Público: qualquer pessoa no MAVITAI pode ver suas rotinas."}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={isPrivate}
              aria-label={isPrivate ? "Perfil privado" : "Perfil público"}
              onClick={onToggleVisibility}
              className={`relative h-7 w-12 shrink-0 rounded-full transition ${
                isPrivate ? "bg-lime" : "bg-white/15"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white transition ${
                  isPrivate ? "left-5" : "left-0.5"
                }`}
              />
            </button>
          </div>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-lime">
            {isPrivate ? "Privado" : "Público"}
          </p>
        </section>
      </aside>
    </div>
  );
}
