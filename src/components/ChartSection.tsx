import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { cn } from "@/lib/utils";
import type { DailyGrowth, VideoData } from "@/data/mockData";
import { formatNumber } from "@/data/mockData";
import { useI18n } from "@/context/I18nContext";
import { useTheme } from "@/context/ThemeContext";

function useChartColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    grid: isDark ? "hsl(225 12% 18%)" : "hsl(220 13% 91%)",
    tick: isDark ? "hsl(220 10% 55%)" : "hsl(220 9% 46%)",
    tooltipBg: isDark ? "hsl(225 15% 14%)" : "hsl(0 0% 100%)",
    tooltipBorder: isDark ? "hsl(225 12% 22%)" : "hsl(220 13% 91%)",
  };
}

interface GrowthChartProps {
  data: DailyGrowth[];
}

export function GrowthChart({ data }: GrowthChartProps) {
  const { t } = useI18n();
  const colors = useChartColors();

  const displayData = data.map((item, i) => ({
    ...item,
    displayDate: i % 5 === 0 ? item.date : "",
  }));

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-card",
        "animate-fade-in opacity-0 animation-delay-200"
      )}
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">{t("chart.growthTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("chart.growthDesc")}</p>
      </div>
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: colors.tick }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: colors.tick }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "0 10px 30px -8px rgba(0,0,0,0.15)",
              }}
              formatter={(value: number) => [formatNumber(value)]}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "16px" }} />
            <Line
              name={t("chart.followers")}
              type="monotone"
              dataKey="followers"
              stroke="hsl(343 80% 52%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "hsl(343 80% 52%)", stroke: "hsl(0 0% 100%)", strokeWidth: 2 }}
            />
            <Line
              name={t("chart.views")}
              type="monotone"
              dataKey="views"
              stroke="hsl(180 85% 50%)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: "hsl(180 85% 50%)", stroke: "hsl(0 0% 100%)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

interface EngagementChartProps {
  videos: VideoData[];
}

export function EngagementChart({ videos }: EngagementChartProps) {
  const { t } = useI18n();
  const colors = useChartColors();

  const chartData = videos.slice(0, 6).map((video) => ({
    name: video.title.length > 18 ? video.title.slice(0, 18) + "..." : video.title,
    likes: video.likes,
    comments: video.comments,
    shares: video.shares,
  }));

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-5 shadow-card",
        "animate-fade-in opacity-0 animation-delay-300"
      )}
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-foreground">{t("chart.engagementTitle")}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t("chart.engagementDesc")}</p>
      </div>
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 10, fill: colors.tick }}
              tickLine={false}
              axisLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 11, fill: colors.tick }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: number) => formatNumber(v)}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: colors.tooltipBg,
                border: `1px solid ${colors.tooltipBorder}`,
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "0 10px 30px -8px rgba(0,0,0,0.15)",
              }}
              formatter={(value: number) => [formatNumber(value)]}
            />
            <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
            <Bar name={t("chart.likes")} dataKey="likes" fill="hsl(343 80% 52%)" radius={[6, 6, 0, 0]} />
            <Bar name={t("chart.comments")} dataKey="comments" fill="hsl(180 85% 50%)" radius={[6, 6, 0, 0]} />
            <Bar name={t("chart.shares")} dataKey="shares" fill="hsl(38 92% 50%)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}