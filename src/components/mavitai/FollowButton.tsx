type FollowButtonProps = {
  following: boolean;
  onToggle: () => void;
  compact?: boolean;
};

export function FollowButton({ following, onToggle, compact = false }: FollowButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={following}
      className={`shrink-0 rounded-full font-semibold transition ${
        compact ? "h-8 px-3 text-xs" : "h-9 px-3.5 text-sm"
      } ${
        following
          ? "border border-lime/40 bg-lime/10 text-lime"
          : "bg-lime text-[#0b1204] hover:brightness-95"
      }`}
    >
      {following ? "Seguindo" : "Seguir"}
    </button>
  );
}
