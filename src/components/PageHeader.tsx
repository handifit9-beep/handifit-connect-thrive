import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, subtitle, right, className }: PageHeaderProps) => (
  <header className={cn("px-5 pt-8 pb-4 flex items-start justify-between gap-4 animate-fade-in", className)}>
    <div className="min-w-0">
      {subtitle && (
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary mb-1">{subtitle}</p>
      )}
      <h1 className="text-3xl font-display font-bold text-foreground leading-tight text-balance">{title}</h1>
    </div>
    {right && <div className="shrink-0">{right}</div>}
  </header>
);

export default PageHeader;
