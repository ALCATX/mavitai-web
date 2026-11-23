import { CloseIcon } from "./icons";

type BirthdayBannerProps = {
  name: string;
  onDismiss: () => void;
};

export function BirthdayBanner({ name, onDismiss }: BirthdayBannerProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-50 flex justify-center px-4 sm:top-24">
      <div
        role="status"
        className="pointer-events-auto flex w-full max-w-lg items-start gap-3 rounded-2xl border border-gold/40 bg-surface-2/95 px-4 py-3 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-md"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-lg">
          🎉
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-display text-2xl tracking-wide text-gold-soft">
            Parabéns pelo seu aniversário!
          </p>
          <p className="text-sm text-zinc-300">
            {name}, a comunidade MAVITAI está comemorando com você hoje.
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Fechar parabéns"
          className="grid h-8 w-8 place-items-center rounded-lg text-zinc-400 hover:text-foreground"
        >
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
