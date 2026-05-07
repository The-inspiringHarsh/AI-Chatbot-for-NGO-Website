import { LucideIcon } from "lucide-react";

export function MetricCard({
  icon: Icon,
  value,
  label
}: {
  icon: LucideIcon;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.06] p-4">
      <Icon className="mb-3 h-5 w-5 text-foundation-gold" />
      <div className="text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{label}</div>
    </div>
  );
}
