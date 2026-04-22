import { Trophy, Flame, TrendingUp, Eye, Heart, MessageCircle, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/data/mockData";
import { useI18n } from "@/context/I18nContext";
import type { VideoWithEngagement } from "@/lib/analytics";

interface VideoRankingProps {
  videos: VideoWithEngagement[];
}

export function VideoRanking({ videos }: VideoRankingProps) {
  const { t } = useI18n();

  return (
    <div className="animate-fade-in opacity-0 animation-delay-100">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">{t("ranking.title")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("ranking.desc")}</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-card">
        {/* Header */}
        <div className="hidden border-b border-border/50 bg-secondary/50 px-4 py-3 sm:grid sm:grid-cols-12 sm:gap-3">
          <div className="col-span-1 text-xs font-medium text-muted-foreground">#</div>
          <div className="col-span-4 text-xs font-medium text-muted-foreground">{t("ranking.video")}</div>
          <div className="col-span-2 text-xs font-medium text-muted-foreground text-right">{t("chart.views")}</div>
          <div className="col-span-1 text-xs font-medium text-muted-foreground text-right">{t("chart.likes")}</div>
          <div className="col-span-1 text-xs font-medium text-muted-foreground text-right">{t("chart.comments")}</div>
          <div className="col-span-1 text-xs font-medium text-muted-foreground text-right">{t("chart.shares")}</div>
          <div className="col-span-2 text-xs font-medium text-muted-foreground text-right">{t("ranking.engRate")}</div>
        </div>

        {/* Rows */}
        {videos.map((video, i) => (
          <div
            key={video.id}
            className={cn(
              "grid grid-cols-1 gap-2 border-b border-border/30 px-4 py-3 transition-base last:border-b-0",
              "sm:grid-cols-12 sm:items-center sm:gap-3",
              "hover:bg-secondary/30",
              video.isViral && "bg-primary/[0.02]"
            )}
          >
            {/* Rank */}
            <div className="col-span-1 flex items-center gap-2 sm:gap-0">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center">
                {i === 0 ? (
                  <Trophy className="h-4 w-4 text-warning" />
                ) : i === 1 ? (
                  <Trophy className="h-4 w-4 text-muted-foreground/50" />
                ) : i === 2 ? (
                  <Trophy className="h-4 w-4 text-warning/50" />
                ) : (
                  <span className="text-xs text-muted-foreground">{i + 1}</span>
                )}
              </span>
              <span className="line-clamp-1 text-sm font-medium text-foreground sm:hidden">
                {video.title}
              </span>
              {video.isViral && (
                <span className="ml-auto flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 sm:hidden">
                  <Flame className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">{t("ranking.viral")}</span>
                </span>
              )}
            </div>

            {/* Title - Desktop */}
            <div className="col-span-4 hidden items-center gap-2 sm:flex">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-9 w-7 shrink-0 rounded-md object-cover"
                loading="lazy"
              />
              <span className="line-clamp-1 text-sm font-medium text-foreground">
                {video.title}
              </span>
              {video.isViral && (
                <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                  <Flame className="h-3 w-3 text-primary" />
                  <span className="text-[10px] font-medium text-primary">{t("ranking.viral")}</span>
                </span>
              )}
            </div>

            {/* Mobile stats grid */}
            <div className="grid grid-cols-4 gap-2 sm:hidden">
              <MetricPill icon={Eye} value={formatNumber(video.views)} />
              <MetricPill icon={Heart} value={formatNumber(video.likes)} />
              <MetricPill icon={MessageCircle} value={formatNumber(video.comments)} />
              <MetricPill icon={Share2} value={formatNumber(video.shares)} />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-1.5 sm:hidden">
              <span className="text-xs text-muted-foreground">{t("ranking.engagementRate")}</span>
              <span className="flex items-center gap-1 text-sm font-semibold text-primary">
                <TrendingUp className="h-3 w-3" />
                {video.engagementRate.toFixed(2)}%
              </span>
            </div>

            {/* Desktop stats */}
            <div className="col-span-2 hidden text-right text-sm text-foreground sm:block">
              {formatNumber(video.views)}
            </div>
            <div className="col-span-1 hidden text-right text-sm text-foreground sm:block">
              {formatNumber(video.likes)}
            </div>
            <div className="col-span-1 hidden text-right text-sm text-foreground sm:block">
              {formatNumber(video.comments)}
            </div>
            <div className="col-span-1 hidden text-right text-sm text-foreground sm:block">
              {formatNumber(video.shares)}
            </div>
            <div className="col-span-2 hidden items-center justify-end gap-1.5 sm:flex">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-sm font-semibold text-primary">
                {video.engagementRate.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricPill({ icon: Icon, value }: { icon: typeof Eye; value: string }) {
  return (
    <div className="flex items-center gap-1 rounded-md bg-secondary/50 px-2 py-1">
      <Icon className="h-3 w-3 text-muted-foreground" />
      <span className="text-xs text-foreground">{value}</span>
    </div>
  );
}