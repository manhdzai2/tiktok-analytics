import type { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/data/mockData";
import { useI18n } from "@/context/I18nContext";

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  icon: LucideIcon;
  delay?: string;
}

export function StatCard({ title, value, change, icon: Icon, delay }: StatCardProps) {
  const { t } = useI18n();
  const isPositive = change >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-5",
        "shadow-card transition-smooth hover:shadow-card-hover hover:border-primary/15",
        "animate-fade-in opacity-0",
        delay
      )}
    >
      {/* Subtle gradient hover overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-smooth group-hover:opacity-100 gradient-tiktok" style={{ opacity: 0 }} />
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-smooth group-hover:opacity-[0.03] gradient-tiktok" />

      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {formatNumber(value)}
          </p>
          <div className="flex items-center gap-1.5">
            {isPositive ? (
              <TrendingUp className="h-3.5 w-3.5 text-success" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-destructive" />
            )}
            <span
              className={cn(
                "text-xs font-medium",
                isPositive ? "text-success" : "text-destructive"
              )}
            >
              {isPositive ? "+" : ""}
              {change}%
            </span>
            <span className="text-xs text-muted-foreground">{t("stat.vsLastWeek")}</span>
          </div>
        </div>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}