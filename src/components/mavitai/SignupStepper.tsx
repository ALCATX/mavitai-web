import { useMemo, useState } from "react";
import { isValidContact, isValidPassword, passwordsMatch } from "@/lib/auth";
import { ageFromBirthDate, isBirthdayToday, isValidBirthDate, maxBirthDateInput, minBirthDateInput } from "@/lib/profile";
import {
  DIET_OPTIONS,
  GOAL_OPTIONS,
  type Diet,
  type Goal,
  type UserProfile,
} from "@/lib/types";

const STEPS = ["Credenciais", "Identidade", "Métricas", "Objetivo", "Dieta"] as const;

const fieldClass =
  "h-14 w-full rounded-2xl border border-line bg-surface px-4 text-base outline-none ring-lime/40 placeholder:text-zinc-600 focus:ring-2";

type SignupStepperProps = {
  profile: UserProfile;
  onChange: (next: UserProfile) => void;
  onBack: () => void;
  onComplete: () => void;
  onGoToLogin: () => void;
};

export function SignupStepper({
  profile,
  onChange,
  onBack,
  onComplete,
  onGoToLogin,
}: SignupStepperProps) {
  const [step, setStep] = useState(0);

  const canContinue = useMemo(() => {
    if (step === 0) {
      return (
        isValidContact(profile.contact) &&
        isValidPassword(profile.password) &&
        passwordsMatch(profile.password, profile.passwordConfirm)
      );
    }
    if (step === 1) {
      return profile.name.trim().length >= 2 && isValidBirthDate(profile.birthDate);
    }
    if (step === 2) {
      return (
        Number(profile.age) > 0 &&
        Number(profile.height) > 0 &&
        Number(profile.weight) > 0
      );
    }
    if (step === 3) return Boolean(profile.goal);
    return Boolean(profile.diet);
  }, [profile, step]);

  const showPasswordHint =
    step === 0 &&
    profile.passwordConfirm.length > 0 &&
    !passwordsMatch(profile.password, profile.passwordConfirm);

  function next() {
    if (!canContinue) return;
    if (step === STEPS.length - 1) {
      onComplete();
      return;
    }
    setStep((current) => current + 1);
  }

  return (
    <main className="min-h-dvh bg-background px-6 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-lg">
        <button
          type="button"
          onClick={step === 0 ? onBack : () => setStep((current) => current - 1)}
          className="text-sm font-medium text-zinc-400 transition hover:text-foreground"
        >
          ← Voltar
        </button>

        <h1 className="mt-6 font-display text-4xl tracking-wide">Criar conta</h1>
        <p className="mt-1 text-sm text-zinc-400">
          {step === 0
            ? "Primeiro crie o acesso. Os dados físicos vêm na sequência."
            : `Etapa ${step + 1} de ${STEPS.length} — ${STEPS[step]}`}
        </p>

        <ol className="mt-6 flex gap-2" aria-label="Progresso do cadastro">
          {STEPS.map((label, index) => (
            <li key={label} className="flex-1">
              <div
                className={`h-1.5 rounded-full ${
                  index <= step ? "bg-lime" : "bg-white/10"
                }`}
              />
            </li>
          ))}
        </ol>

        <form
          className="mt-8 space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            next();
          }}
        >
          {step === 0 ? (
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">
                  E-mail ou Celular
                </span>
                <input
                  autoFocus
                  required
                  autoComplete="username"
                  value={profile.contact}
                  onChange={(event) =>
                    onChange({ ...profile, contact: event.target.value })
                  }
                  placeholder="voce@email.com ou (11) 99999-0000"
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">Senha</span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={profile.password}
                  onChange={(event) =>
                    onChange({ ...profile, password: event.target.value })
                  }
                  placeholder="Mínimo de 6 caracteres"
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">
                  Confirmação de Senha
                </span>
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={profile.passwordConfirm}
                  onChange={(event) =>
                    onChange({ ...profile, passwordConfirm: event.target.value })
                  }
                  placeholder="Repita a senha"
                  className={fieldClass}
                />
              </label>
              {showPasswordHint ? (
                <p className="text-sm text-red-400">As senhas não coincidem.</p>
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">Nome</span>
                <input
                  autoFocus
                  required
                  value={profile.name}
                  onChange={(event) =>
                    onChange({ ...profile, name: event.target.value })
                  }
                  placeholder="Como você quer aparecer no feed"
                  className={fieldClass}
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-zinc-300">
                  Data de Nascimento
                </span>
                <input
                  type="date"
                  required
                  min={minBirthDateInput()}
                  max={maxBirthDateInput()}
                  value={profile.birthDate}
                  onChange={(event) => {
                    const birthDate = event.target.value;
                    onChange({
                      ...profile,
                      birthDate,
                      age: ageFromBirthDate(birthDate) || profile.age,
                    });
                  }}
                  className={`${fieldClass} [color-scheme:dark]`}
                />
                <span className="block text-xs text-zinc-500">
                  Obrigatório. Se o dia e o mês forem os de hoje, um banner de
                  parabéns aparece no app.
                </span>
              </label>
              {isBirthdayToday(profile.birthDate) ? (
                <p
                  role="status"
                  className="rounded-2xl border border-gold/40 bg-gold/10 px-4 py-3 text-sm text-gold-soft"
                >
                  Simulação: Parabéns pelo seu aniversário!
                </p>
              ) : null}
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 sm:grid-cols-3">
              <NumberField
                label="Idade"
                suffix="anos"
                value={profile.age}
                onChange={(age) => onChange({ ...profile, age })}
              />
              <NumberField
                label="Altura"
                suffix="cm"
                value={profile.height}
                onChange={(height) => onChange({ ...profile, height })}
              />
              <NumberField
                label="Peso"
                suffix="kg"
                value={profile.weight}
                onChange={(weight) => onChange({ ...profile, weight })}
              />
            </div>
          ) : null}

          {step === 3 ? (
            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-zinc-300">
                Objetivo
              </legend>
              {GOAL_OPTIONS.map((option) => {
                const selected = profile.goal === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => onChange({ ...profile, goal: option.id as Goal })}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition ${
                      selected
                        ? "border-lime bg-lime/10"
                        : "border-line bg-surface hover:border-white/20"
                    }`}
                  >
                    <span>
                      <span className="block font-semibold">{option.label}</span>
                      <span className="text-sm text-zinc-500">{option.hint}</span>
                    </span>
                    <span
                      className={`h-4 w-4 rounded-full border ${
                        selected ? "border-lime bg-lime" : "border-zinc-500"
                      }`}
                    />
                  </button>
                );
              })}
            </fieldset>
          ) : null}

          {step === 4 ? (
            <label className="block space-y-2">
              <span className="text-sm font-medium text-zinc-300">
                Tipo de dieta
              </span>
              <select
                value={profile.diet}
                onChange={(event) =>
                  onChange({ ...profile, diet: event.target.value as Diet })
                }
                className={`${fieldClass} appearance-none`}
              >
                <option value="">Selecione uma opção</option>
                {DIET_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <button
            type="submit"
            disabled={!canContinue}
            className="h-14 w-full rounded-2xl bg-lime text-base font-bold text-[#0b1204] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {step === STEPS.length - 1 ? "Entrar no MAVITAI" : "Continuar"}
          </button>

          {step === 0 ? (
            <p className="text-center text-sm text-zinc-400">
              <button
                type="button"
                onClick={onGoToLogin}
                className="font-semibold text-lime"
              >
                Já tenho uma conta
              </button>
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}

function NumberField({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <div className="relative">
        <input
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value.replace(/[^\d.]/g, ""))}
          className={`${fieldClass} pr-12`}
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-xs text-zinc-500">
          {suffix}
        </span>
      </div>
    </label>
  );
}
