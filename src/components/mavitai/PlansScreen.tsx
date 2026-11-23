import type { PlanId } from "@/lib/types";
import { LogoMark } from "./icons";

type PlansScreenProps = {
  onBack: () => void;
  onSelectPlan: (plan: PlanId) => void;
};

export function PlansScreen({ onBack, onSelectPlan }: PlansScreenProps) {
  return (
    <main className="min-h-dvh bg-background px-6 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-zinc-400 transition hover:text-foreground"
        >
          ← Voltar
        </button>

        <div className="mt-8 flex items-center gap-3">
          <LogoMark className="h-8 w-8" />
          <h1 className="font-display text-4xl tracking-wide">Escolha seu plano</h1>
        </div>
        <p className="mt-2 text-zinc-400">
          Comece grátis e evolua para Diamante quando quiser a Área Pro.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <article className="flex flex-col rounded-3xl border border-line bg-surface p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sport">
              Básico
            </p>
            <p className="mt-2 font-display text-4xl">Grátis</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-300">
              <li>• Feed de rotinas</li>
              <li>• Vídeos curtos</li>
              <li>• Ranking semanal</li>
              <li className="text-zinc-500">• Área Pro bloqueada</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPlan("basic")}
              className="mt-6 h-12 rounded-xl bg-lime font-bold text-[#0b1204]"
            >
              Começar no Básico
            </button>
          </article>

          <article className="relative flex flex-col overflow-hidden rounded-3xl border border-gold/40 bg-gradient-to-b from-[#2a2108] to-surface p-6">
            <div className="absolute right-4 top-4 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#2a1d00]">
              Premium
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gold">
              Diamante
            </p>
            <p className="mt-2 font-display text-4xl text-gold-soft">R$ 29,90</p>
            <p className="text-xs text-zinc-500">por mês</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm text-zinc-300">
              <li>• Tudo do Básico</li>
              <li>• Área Pro desbloqueada</li>
              <li>• Boost de Mavicoins</li>
              <li>• Sem anúncios na timeline</li>
            </ul>
            <button
              type="button"
              onClick={() => onSelectPlan("diamond")}
              className="mt-6 h-12 rounded-xl bg-gold font-bold text-[#2a1d00]"
            >
              Quero Diamante
            </button>
          </article>
        </div>
      </div>
    </main>
  );
}
