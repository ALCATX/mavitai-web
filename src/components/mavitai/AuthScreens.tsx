import { useState, type ReactNode } from "react";
import { isValidContact, isValidPassword } from "@/lib/auth";
import { LogoMark } from "./icons";

const fieldClass =
  "h-14 w-full rounded-2xl border border-line bg-surface px-4 text-base outline-none ring-lime/40 placeholder:text-zinc-600 focus:ring-2";

type LoginScreenProps = {
  onBack: () => void;
  onLogin: (contact: string) => void;
  onForgotPassword: () => void;
  onCreateAccount: () => void;
};

export function LoginScreen({
  onBack,
  onLogin,
  onForgotPassword,
  onCreateAccount,
}: LoginScreenProps) {
  const [contact, setContact] = useState("");
  const [password, setPassword] = useState("");
  const canSubmit = isValidContact(contact) && isValidPassword(password);

  return (
    <AuthShell
      title="Entrar"
      subtitle="Use o e-mail ou celular da sua conta MAVITAI."
      onBack={onBack}
    >
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) return;
          onLogin(contact.trim());
        }}
      >
        <ContactField value={contact} onChange={setContact} />
        <div className="space-y-2">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-300">Senha</span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              className={fieldClass}
            />
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm font-semibold text-lime"
          >
            Esqueci minha senha
          </button>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="h-14 w-full rounded-2xl bg-lime text-base font-bold text-[#0b1204] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Entrar
        </button>
        <p className="text-center text-sm text-zinc-400">
          Ainda não tem conta?{" "}
          <button
            type="button"
            onClick={onCreateAccount}
            className="font-semibold text-lime"
          >
            Criar Conta Grátis
          </button>
        </p>
      </form>
    </AuthShell>
  );
}

type RecoverScreenProps = {
  onBackToLogin: () => void;
};

export function RecoverScreen({ onBackToLogin }: RecoverScreenProps) {
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);
  const canSubmit = isValidContact(contact);

  return (
    <AuthShell
      title="Recuperar senha"
      subtitle="Digite o e-mail ou celular da conta para enviarmos o código."
      onBack={onBackToLogin}
    >
      {sent ? (
        <div className="space-y-5">
          <p className="rounded-2xl border border-lime/30 bg-lime/10 px-4 py-4 text-sm leading-6 text-zinc-200">
            Enviamos um código de recuperação para{" "}
            <span className="font-semibold text-lime">{contact.trim()}</span>.
            Verifique sua caixa de entrada ou mensagens.
          </p>
          <button
            type="button"
            onClick={onBackToLogin}
            className="h-14 w-full rounded-2xl bg-lime text-base font-bold text-[#0b1204]"
          >
            Voltar para o login
          </button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!canSubmit) return;
            setSent(true);
          }}
        >
          <ContactField value={contact} onChange={setContact} />
          <button
            type="submit"
            disabled={!canSubmit}
            className="h-14 w-full rounded-2xl bg-lime text-base font-bold text-[#0b1204] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Enviar código de recuperação
          </button>
          <button
            type="button"
            onClick={onBackToLogin}
            className="w-full text-center text-sm font-semibold text-zinc-300"
          >
            Voltar para o login
          </button>
        </form>
      )}
    </AuthShell>
  );
}

function ContactField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-zinc-300">E-mail ou Celular</span>
      <input
        autoFocus
        required
        autoComplete="username"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="voce@email.com ou (11) 99999-0000"
        className={fieldClass}
      />
    </label>
  );
}

function AuthShell({
  title,
  subtitle,
  onBack,
  children,
}: {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-background px-6 py-8 sm:px-8">
      <div className="mx-auto w-full max-w-lg">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-medium text-zinc-400 transition hover:text-foreground"
        >
          ← Voltar
        </button>
        <div className="mt-8 flex items-center gap-3">
          <LogoMark className="h-8 w-8" />
          <h1 className="font-display text-4xl tracking-wide">{title}</h1>
        </div>
        <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
