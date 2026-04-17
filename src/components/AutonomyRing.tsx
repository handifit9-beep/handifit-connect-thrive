import { cn } from "@/lib/utils";

interface AutonomyRingProps {
  score: number; // 0..100
  size?: number;
  className?: string;
  label?: string;
}

const AutonomyRing = ({ score, size = 88, className, label = "Autonomie" }: AutonomyRingProps) => {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div
      role="img"
      aria-label={`Score d'autonomie : ${score} sur 100`}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={6}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#ringGrad)"
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-display font-bold text-gradient leading-none">{score}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
          {label}
        </span>
      </div>
    </div>
  );
};

export default AutonomyRing;
