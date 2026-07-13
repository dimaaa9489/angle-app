/** Shared Tailwind class bundles for the light admin UI. */
export const admin = {
  page: "admin-root min-h-dvh bg-[#f5f5f7] text-[#111111]",
  container: "mx-auto max-w-6xl px-4 py-8",
  card: "rounded-[var(--radius-md)] border border-[rgba(0,0,0,0.08)] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06)]",
  cardMuted: "rounded-[var(--radius-md)] border border-[rgba(0,0,0,0.08)] bg-[#fafafa] p-4",
  title: "text-xl font-bold text-[#111111]",
  subtitle: "mt-1 text-sm text-[#6b6b6b]",
  label: "text-xs font-semibold uppercase tracking-wide text-[#a3a3a3]",
  input:
    "w-full rounded-[var(--radius-sm)] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2.5 text-sm text-[#111111] outline-none placeholder:text-[#a3a3a3] focus:border-[#111111]",
  btnPrimary:
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] bg-[#111111] px-4 py-2.5 text-sm font-bold text-white transition active:scale-[0.98] disabled:opacity-50",
  btnSecondary:
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 text-xs font-semibold text-[#111111] transition active:scale-[0.98] disabled:opacity-50",
  btnDanger:
    "inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[#fee2e2] px-2 py-1.5 text-[#b91c1c]",
  dropzone:
    "flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-[var(--radius-md)] border-2 border-dashed border-[rgba(0,0,0,0.12)] bg-[#fafafa] px-4 py-6 text-center transition hover:border-[rgba(0,0,0,0.22)] hover:bg-white",
  dropzoneActive: "border-[#111111] bg-white",
  badge: "rounded-full bg-[#f0f0f0] px-3 py-1 text-xs font-semibold text-[#6b6b6b]",
  link: "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border border-[rgba(0,0,0,0.1)] bg-white px-3 py-2 text-sm font-semibold text-[#111111]",
  overline: "text-xs font-semibold uppercase tracking-widest text-[#6b6b6b]",
  success: "text-sm font-medium text-[#15803d]",
  error: "text-sm text-[#dc2626]",
  warningBanner:
    "mb-6 rounded-[var(--radius-md)] border border-[#fde68a] bg-[#fffbeb] p-4 text-sm text-[#92400e]",
} as const;

export function AdminCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`${admin.card} ${className}`}>{children}</div>;
}
