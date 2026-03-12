interface BadgeProps {
  children: React.ReactNode;
  color?: string;
  bg?: string;
  className?: string;
}

export function Badge({ children, color, bg, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-[var(--radius-sm)] ${className}`}
      style={{ color: color || undefined, backgroundColor: bg || undefined }}
    >
      {children}
    </span>
  );
}

export function DotBadge({ children, dot, bg, className = '' }: BadgeProps & { dot?: string }) {
  return (
    <Badge color={dot} bg={bg} className={className}>
      {dot && (
        <span
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{ backgroundColor: dot }}
        />
      )}
      {children}
    </Badge>
  );
}
