export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="12" fill="#c8ff3d" />
      <path
        d="M12 26.5V13.5h5.1c3.4 0 5.4 1.7 5.4 4.4 0 1.6-.8 2.9-2.1 3.6 1.6.6 2.6 2 2.6 3.8 0 3-2.2 4.7-5.8 4.7H12Zm3.1-7.6h1.8c1.6 0 2.5-.8 2.5-2s-.9-1.9-2.4-1.9h-1.9v3.9Zm0 5.7h2.1c1.8 0 2.8-.8 2.8-2.2s-1-2.1-2.8-2.1h-2.1v4.3Z"
        fill="#0b1204"
      />
    </svg>
  );
}

export function CoinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" fill="#f5c518" />
      <circle cx="12" cy="12" r="6.2" stroke="#8a6a08" strokeWidth="1.4" />
      <path
        d="M10.2 15.4V8.6h1.9c1.7 0 2.7.8 2.7 2.1 0 .9-.5 1.6-1.3 1.9.9.3 1.5 1 1.5 2 0 1.5-1.1 2.3-2.9 2.3h-1.9Zm1.4-4h.6c.7 0 1.1-.4 1.1-.9s-.4-.9-1.1-.9h-.6v1.8Zm0 2.9h.7c.8 0 1.3-.4 1.3-1s-.5-1-1.3-1h-.7v2Z"
        fill="#8a6a08"
      />
    </svg>
  );
}

export function FeedIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M4 7.5h16M4 12h16M4 16.5h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ShortsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect
        x="7"
        y="3.5"
        width="10"
        height="17"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M10.5 11.2 14.5 12l-4 1.8v-3.6Z" fill="currentColor" />
    </svg>
  );
}

export function AdsIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M4.5 17V7l10-2.5v15L4.5 17Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M14.5 9.5h3.2A1.8 1.8 0 0 1 19.5 11.3v1.4a1.8 1.8 0 0 1-1.8 1.8H14.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

export function LockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <rect
        x="5"
        y="11"
        width="14"
        height="9"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M8 11V8.2a4 4 0 0 1 8 0V11"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HeartIcon({
  className = "h-5 w-5",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 20s-7-4.4-7-9.2C5 8 6.8 6.2 9 6.2c1.3 0 2.4.6 3 1.6.6-1 1.7-1.6 3-1.6 2.2 0 4 1.8 4 4.6C19 15.6 12 20 12 20Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CommentIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M5 17.5 4 20.5l3.4-1.2A8.5 8.5 0 1 0 5 17.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrophyIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M8 5h8v4.2a4 4 0 0 1-8 0V5Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M8 7H5.5A2.5 2.5 0 0 0 8 9.5" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M16 7h2.5A2.5 2.5 0 0 1 16 9.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path d="M12 13.2V16M9 19h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function MenuIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CloseIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6 6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
