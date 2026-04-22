import {
  Activity,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/data/mockData";
import { useI18n } from "@/context/I18nContext";
import type { ChannelAnalytics } from "@/lib/analytics";

interface EngagementStatsProps {
  analytics: ChannelAnalytics;
}

export function EngagementStats({ analytics }: EngagementStatsProps) {
  const { t } = useI18n();

  const metrics = [
    {
      label: t("engagement.rate"),
      value: analytics.engagementRate.toFixed(2) + "%",
      icon: Percent,
      desc: t("engagement.rateDesc"),
      accent: true,
    },
    {
      label: t("engagement.avgViews"),
      value: formatNumber(Math.round(analytics.avgViewsPerVideo)),
      icon: Eye,
      desc: t("engagement.avgViewsDesc"),
      accent: false,
    },
    {
      label: t("engagement.avgLikes"),
      value: formatNumber(Math.round(analytics.avgLikesPerVideo)),
      icon: Heart,
      desc: t("engagement.avgLikesDesc"),
      accent: false,
    },
    {
      label: t("engagement.avgComments"),
      value: formatNumber(Math.round(analytics.avgCommentsPerVideo)),
      icon: MessageCircle,
      desc: t("engagement.avgCommentsDesc"),
      accent: false,
    },
    {
      label: t("engagement.avgShares"),
      value: formatNumber(Math.round(analytics.avgSharesPerVideo)),
      icon: Share2,
      desc: t("engagement.avgSharesDesc"),
      accent: false,
    },
    {
      label: t("engagement.viewFollower"),
      value: analytics.viewToFollowerRatio.toFixed(1) + "x",
      icon: BarChart3,
      desc: t("engagement.viewFollowerDesc"),
      accent: false,
    },
    {
      label: t("engagement.likeView"),
      value: analytics.likesToViewRatio.toFixed(2) + "%",
      icon: Activity,
      desc: t("engagement.likeViewDesc"),
      accent: false,
    },
  ];

  return (
    <div className="animate-fade-in opacity-0">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">{t("engagement.title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("engagement.desc")}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div
            key={m.label}
            className={cn(
              "group relative overflow-hidden rounded-2xl border p-4 transition-smooth",
              m.accent
                ? "border-primary/20 bg-primary/[0.03] hover:border-primary/30"
                : "border-border/60 bg-card hover:border-primary/15 hover:shadow-card-hover",
              "shadow-card animate-fade-in opacity-0"
            )}
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  m.accent ? "gradient-tiktok" : "bg-secondary"
                )}
              >
                <m.icon
                  className={cn(
                    "h-4 w-4",
                    m.accent ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                />
              </div>
              <p className="text-xs font-medium text-muted-foreground">{m.label}</p>
            </div>
            <p
              className={cn(
                "mt-3 text-xl font-bold tracking-tight",
                m.accent ? "text-primary" : "text-foreground"
              )}
            >
              {m.value}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/70">{m.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}