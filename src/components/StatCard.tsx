import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  unit?: string;
  label: string;
  className?: string;
}

const StatCard = ({ icon: Icon, value, unit, label, className }: StatCardProps) => (
  <div
    className={cn(
      "glass rounded-2xl p-4 flex flex-col gap-2 transition-transform duration-300 hover:-translate-y-0.5",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <Icon className="size-4 text-primary" aria-hidden />
      {unit && <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{unit}</span>}
    </div>
    <div>
      <div className="text-2xl font-display font-bold tabular-nums text-foreground leading-none">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  </div>
);

export default StatCard;
