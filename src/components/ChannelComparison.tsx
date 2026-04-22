import { cn } from "@/lib/utils";
import { formatNumber } from "@/data/mockData";
import type { ChannelData } from "@/data/mockData";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";
import { analyzeChannel } from "@/lib/analytics";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ComparisonMetricLocal {
  label: string;
  channel1Value: number;
  channel2Value: number;
  format: "number" | "percent" | "ratio";
  higherIsBetter: boolean;
}

interface ChannelComparisonProps {
  channel1: ChannelData;
  channel2: ChannelData;
}

export function ChannelComparison({ channel1, channel2 }: ChannelComparisonProps) {
  const { t } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const a1 = analyzeChannel(channel1);
  const a2 = analyzeChannel(channel2);

  const metrics: ComparisonMetricLocal[] = [
    { label: t("compare.followers"), channel1Value: channel1.stats.totalFollowers, channel2Value: channel2.stats.totalFollowers, format: "number", higherIsBetter: true },
    { label: t("compare.totalViews"), channel1Value: channel1.stats.totalViews, channel2Value: channel2.stats.totalViews, format: "number", higherIsBetter: true },
    { label: t("compare.totalLikes"), channel1Value: channel1.stats.totalLikes, channel2Value: channel2.stats.totalLikes, format: "number", higherIsBetter: true },
    { label: t("compare.videos"), channel1Value: channel1.stats.totalVideos, channel2Value: channel2.stats.totalVideos, format: "number", higherIsBetter: true },
    { label: t("compare.engRate"), channel1Value: a1.engagementRate, channel2Value: a2.engagementRate, format: "percent", higherIsBetter: true },
    { label: t("compare.avgViews"), channel1Value: a1.avgViewsPerVideo, channel2Value: a2.avgViewsPerVideo, format: "number", higherIsBetter: true },
    { label: t("compare.avgLikes"), channel1Value: a1.avgLikesPerVideo, channel2Value: a2.avgLikesPerVideo, format: "number", higherIsBetter: true },
    { label: t("compare.viewFollower"), channel1Value: a1.viewToFollowerRatio, channel2Value: a2.viewToFollowerRatio, format: "ratio", higherIsBetter: true },
    { label: t("compare.followerGrowth"), channel1Value: a1.avgDailyFollowerGrowth, channel2Value: a2.avgDailyFollowerGrowth, format: "number", higherIsBetter: true },
    { label: t("compare.viralVideos"), channel1Value: a1.viralVideos.length, channel2Value: a2.viralVideos.length, format: "number", higherIsBetter: true },
  ];

  // Radar: pick 5 key metrics by index
  const radarIndices = [0, 1, 4, 5, 8];
  const radarLabels = [t("compare.followers"), t("compare.totalViews"), t("compare.engRate"), t("compare.avgViewsShort"), t("compare.growthDay")];
  const radarData = radarIndices.map((idx, ri) => {
    const m = metrics[idx];
    const max = Math.max(m.channel1Value, m.channel2Value);
    return {
      metric: radarLabels[ri],
      ch1: max > 0 ? (m.channel1Value / max) * 100 : 0,
      ch2: max > 0 ? (m.channel2Value / max) * 100 : 0,
    };
  });

  const gridColor = isDark ? "hsl(225 12% 18%)" : "hsl(220 13% 91%)";
  const tickColor = isDark ? "hsl(220 10% 55%)" : "hsl(220 9% 46%)";

  return (
    <div className="animate-fade-in opacity-0 space-y-8">
      {/* Channel Headers */}
      <div className="grid grid-cols-3 gap-4 items-center">
        <ChannelBadge channel={channel1} />
        <div className="text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-muted-foreground">vs</span>
        </div>
        <ChannelBadge channel={channel2} align="right" />
      </div>

      {/* Radar Chart */}
      <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-card">
        <h3 className="mb-4 text-base font-semibold text-foreground">{t("compare.radar")}</h3>
        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: tickColor }} />
              <Radar
                name={channel1.name}
                dataKey="ch1"
                stroke="hsl(343 80% 52%)"
                fill="hsl(343 80% 52%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Radar
                name={channel2.name}
                dataKey="ch2"
                stroke="hsl(180 85% 50%)"
                fill="hsl(180 85% 50%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
              <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metric-by-metric comparison */}
      <div className="rounded-2xl border border-border/60 bg-card shadow-card overflow-hidden">
        <div className="border-b border-border/50 bg-secondary/50 px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">{t("compare.detailed")}</h3>
        </div>
        <div className="divide-y divide-border/30">
          {metrics.map((m) => (
            <ComparisonRow key={m.label} metric={m} ch1Name={channel1.name} ch2Name={channel2.name} tieLabel={t("compare.tie")} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChannelBadge({ channel, align = "left" }: { channel: ChannelData; align?: "left" | "right" }) {
  return (
    <div className={cn("flex items-center gap-3", align === "right" && "flex-row-reverse")}>
      <img src={channel.avatar} alt={channel.name} className="h-10 w-10 rounded-full shadow-card" />
      <div className={cn(align === "right" && "text-right")}>
        <p className="text-sm font-semibold text-foreground">{channel.name}</p>
        <p className="text-xs text-muted-foreground">{channel.handle}</p>
      </div>
    </div>
  );
}

function ComparisonRow({
  metric,
  ch1Name,
  ch2Name,
  tieLabel,
}: {
  metric: ComparisonMetricLocal;
  ch1Name: string;
  ch2Name: string;
  tieLabel: string;
}) {
  const { label, channel1Value, channel2Value, format, higherIsBetter } = metric;
  const winner = channel1Value === channel2Value ? "tie" : channel1Value > channel2Value ? "ch1" : "ch2";
  const actualWinner = higherIsBetter ? winner : winner === "ch1" ? "ch2" : winner === "ch2" ? "ch1" : "tie";

  function fmtValue(v: number): string {
    if (format === "percent") return v.toFixed(2) + "%";
    if (format === "ratio") return v.toFixed(1) + "x";
    return formatNumber(Math.round(v));
  }

  const total = channel1Value + channel2Value;
  const pct1 = total > 0 ? (channel1Value / total) * 100 : 50;

  return (
    <div className="px-4 py-3 transition-base hover:bg-secondary/20">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="text-[10px] text-muted-foreground">
          {actualWinner === "ch1" ? ch1Name : actualWinner === "ch2" ? ch2Name : tieLabel}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className={cn("min-w-[60px] text-right text-sm font-semibold", actualWinner === "ch1" ? "text-primary" : "text-foreground")}>
          {fmtValue(channel1Value)}
        </span>
        <div className="flex h-2 flex-1 overflow-hidden rounded-full bg-secondary">
          <div className="h-full rounded-l-full bg-primary/60 transition-smooth" style={{ width: `${pct1}%` }} />
          <div className="h-full rounded-r-full bg-tiktok-cyan/60 transition-smooth" style={{ width: `${100 - pct1}%` }} />
        </div>
        <span className={cn("min-w-[60px] text-sm font-semibold", actualWinner === "ch2" ? "text-tiktok-cyan" : "text-foreground")}>
          {fmtValue(channel2Value)}
        </span>
      </div>
    </div>
  );
}