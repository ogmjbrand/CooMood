const COLORS: Record<string, string> = {
  pending: "bg-ink/10 text-ink/60",
  processing: "bg-gold/20 text-gold-dark",
  shipped: "bg-blue-100 text-blue-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-cherry/10 text-cherry",
};

export default function StatusPill({ status }: { status: string }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs capitalize ${COLORS[status] ?? "bg-ink/10 text-ink/60"}`}>
      {status}
    </span>
  );
}
