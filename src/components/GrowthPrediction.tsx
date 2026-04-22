import { Target, TrendingUp, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/data/mockData";
import { useI18n } from "@/context/I18nContext";
import type { ChannelAnalytics } from "@/lib/analytics";

interface GrowthPredictionProps {
  analytics: ChannelAnalytics;
  currentFollowers: number;
}

export function GrowthPrediction({ analytics, currentFollowers }: GrowthPredictionProps) {
  const { t, locale } = useI18n();
  const { avgDailyFollowerGrowth, avgDailyViewGrowth, predictedDaysTo } = analytics;

  return (
    <div className="animate-fade-in opacity-0 animation-delay-200">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">{t("prediction.title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("prediction.desc")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Daily Growth Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            {t("prediction.dailyGrowth")}
          </div>
          <div className="mt-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">{t("prediction.followersDay")}</span>
              <span className="text-lg font-bold text-foreground">
                +{formatNumber(Math.round(avgDailyFollowerGrowth))}
              </span>
            </div>
            <div className="h-px bg-border/60" />
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-muted-foreground">{t("prediction.viewsDay")}</span>
              <span className="text-lg font-bold text-foreground">
                +{formatNumber(Math.round(avgDailyViewGrowth))}
              </span>
            </div>
          </div>
        </div>

        {/* Milestone Cards */}
        {predictedDaysTo.map((milestone, i) => (
          <div
            key={milestone.milestone}
            className={cn(
              "rounded-2xl border p-5 shadow-card transition-smooth",
              i === 0
                ? "border-primary/20 bg-primary/[0.02]"
                : "border-border/60 bg-card"
            )}
          >
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Target className={cn("h-4 w-4", i === 0 && "text-primary")} />
              {milestone.milestone} {t("stat.followers")}
            </div>
            <div className="mt-4">
              {milestone.days > 0 ? (
                <>
                  <div className="flex items-baseline gap-1">
                    <span className={cn("text-2xl font-bold", i === 0 ? "text-primary" : "text-foreground")}>
                      {milestone.days}
                    </span>
                    <span className="text-sm text-muted-foreground">{t("prediction.days")}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {estimateDate(milestone.days, locale)}
                  </div>
                  <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={cn(
                        "h-full rounded-full transition-smooth",
                        i === 0 ? "gradient-tiktok" : "bg-muted-foreground/30"
                      )}
                      style={{
                        width: `${Math.min((currentFollowers / parseMilestone(milestone.milestone)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {((currentFollowers / parseMilestone(milestone.milestone)) * 100).toFixed(1)}% {t("prediction.achieved")}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">{t("prediction.unable")}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function estimateDate(daysFromNow: number, locale: string): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const loc = locale === "vi" ? "vi-VN" : "en-US";
  return d.toLocaleDateString(loc, { month: "short", day: "numeric", year: "numeric" });
}

function parseMilestone(s: string): number {
  if (s.endsWith("M")) return parseFloat(s) * 1_000_000;
  if (s.endsWith("K")) return parseFloat(s) * 1_000;
  return parseFloat(s);
}