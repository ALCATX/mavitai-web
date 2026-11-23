import { LogoMark } from "./icons";

type WelcomeScreenProps = {
  onCreateAccount: () => void;
  onSeePlans: () => void;
  onLogin: () => void;
};

export function WelcomeScreen({
  onCreateAccount,
  onSeePlans,
  onLogin,
}: WelcomeScreenProps) {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-lime/20 blur-3xl" />
        <div className="absolute bottom-10 -left-16 h-64 w-64 rounded-full bg-sport/15 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-between px-6 py-10 sm:px-8">
        <header className="flex items-center gap-3">
          <LogoMark />
          <span className="font-display text-2xl tracking-[0.22em] text-foreground">
            MAVITAI
          </span>
        </header>

        <section className="mt-12 space-y-6">
          <p className="inline-flex rounded-full border border-lime/30 bg-lime/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-lime">
            Rede social fitness
          </p>
          <h1 className="font-display text-6xl leading-[0.9] tracking-wide text-foreground sm:text-7xl">
            Treine.
            <br />
            Compartilhe.
            <br />
            <span className="text-lime">Suba de nível.</span>
          </h1>
          <p className="max-w-md text-base leading-7 text-zinc-400 sm:text-lg">
            A rede social gamificada para quem vive treino, dieta e consistência.
            Ganhe Mavicoins, dispute o ranking e evolua com a sua comunidade.
          </p>
        </section>

        <div className="mt-12 flex flex-col gap-3 pb-4">
          <button
            type="button"
            onClick={onCreateAccount}
            className="flex h-14 w-full items-center justify-center rounded-2xl bg-lime text-base font-bold text-[#0b1204] shadow-[0_0_32px_rgba(200,255,61,0.25)] transition hover:brightness-95 active:scale-[0.99]"
          >
            Criar Conta Grátis
          </button>
          <button
            type="button"
            onClick={onSeePlans}
            className="flex h-14 w-full items-center justify-center rounded-2xl border border-gold/40 bg-gold/10 text-base font-semibold text-gold-soft transition hover:bg-gold/16 active:scale-[0.99]"
          >
            Conhecer Planos (Básico/Diamante)
          </button>
          <p className="pt-1 text-center text-sm text-zinc-400">
            <button
              type="button"
              onClick={onLogin}
              className="font-semibold text-lime"
            >
              Já tenho uma conta
            </button>
          </p>
          <p className="text-center text-xs text-zinc-500">
            Sem cartão no plano Básico. Diamante desbloqueia a Área Pro.
          </p>
        </div>
      </div>
    </main>
  );
}
