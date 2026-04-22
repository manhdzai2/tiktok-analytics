import { useState, useMemo, useEffect } from "react";
import { ChevronDown, Heart, Users, Video, Eye, ExternalLink, Calendar, TrendingUp, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { ChannelData } from "@/data/mockData";
import { VideoGrid } from "./VideoGrid";
import { useI18n } from "@/context/I18nContext";
import { getChannelDetail } from "@/lib/api";

interface AccountRowProps {
  channel: ChannelData;
  isSelected?: boolean;
  onSelect?: (id: string, selected: boolean) => void;
  onDelete?: (id: string) => void;
}

export function AccountRow({ channel, isSelected, onSelect, onDelete }: AccountRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [detailedData, setDetailedData] = useState<ChannelData | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (isExpanded && !detailedData && !isDetailLoading) {
      loadDetails();
    }
  }, [isExpanded]);

  const loadDetails = async () => {
    setIsDetailLoading(true);
    try {
      const data = await getChannelDetail(channel.id);
      setDetailedData(data);
    } catch (error) {
      console.error("Failed to load channel details:", error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  const formatNumber = (num: any) => {
    if (typeof num !== 'number' || isNaN(num)) return "0";
    return num.toLocaleString();
  };

  const stats = channel?.stats || { totalLikes: 0, totalFollowers: 0, totalVideos: 0, totalViews: 0, likesChange: 0, followersChange: 0, videosChange: 0, viewsChange: 0 };
  const activeStats = detailedData?.stats || stats;

  // Calculate top videos
  const topVideos = useMemo(() => {
    const videos = detailedData?.recentVideos || channel?.recentVideos || [];
    return [...videos]
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [channel?.recentVideos, detailedData]);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (channel?.id && window.confirm(t("account.deleteConfirm"))) {
      onDelete?.(channel.id);
    }
  };

  return (
    <div className={cn(
      "mb-2 overflow-hidden rounded-2xl border border-border/40 bg-card/30 backdrop-blur-sm transition-all duration-300",
      isExpanded ? "ring-1 ring-primary/30 shadow-md bg-card/50" : "hover:bg-card/40 hover:border-border/60",
      isSelected && "border-primary/40 bg-primary/5 ring-1 ring-primary/20"
    )}>
      {/* Summary Row - High Density */}
      <div 
        className="flex cursor-pointer items-center gap-4 px-4 py-3"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Selection Checkbox */}
        <div 
          className="flex items-center" 
          onClick={(e) => e.stopPropagation()}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect?.(channel.id, e.target.checked)}
            className="h-4 w-4 rounded-md border-border/60 bg-white/5 text-primary focus:ring-primary/30 transition-all cursor-pointer accent-primary"
          />
        </div>

        <div className="flex items-center gap-3 min-w-[200px]">
          <img 
            src={channel.avatar} 
            alt={channel.name} 
            className="h-10 w-10 rounded-full object-cover border border-border/50"
          />
          <div className="flex flex-col">
            <h3 className="font-semibold text-foreground tracking-tight text-sm leading-none">{channel.name}</h3>
            <span className="text-[11px] text-primary font-medium mt-1">{channel.handle}</span>
          </div>
        </div>

        {/* Stats Grid - High Density Summary */}
        <div className="hidden md:flex flex-1 justify-around gap-1 px-4">
          <StatMini label={t("account.followers")} value={formatNumber(stats.totalFollowers)} />
          <StatMini label={t("account.likes")} value={formatNumber(stats.totalLikes)} />
          <StatMini label={t("account.totalViews")} value={formatNumber(stats.totalViews)} />
          <StatMini label={t("account.videos")} value={formatNumber(stats.totalVideos)} />
        </div>

        <div className="flex items-center gap-2">
          {/* Action Icons */}
          <button
            onClick={handleDelete}
            className="hidden group-hover:flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            title={t("account.delete")}
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-3">
            {channel.tiktok_created_at && !isExpanded && (
              <span className="hidden xl:flex items-center gap-1 text-[10px] text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded-full border border-border/20">
                <Calendar className="h-3 w-3" /> {
                  channel.tiktok_created_at.includes("-") 
                    ? new Date(channel.tiktok_created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : channel.tiktok_created_at
                }
              </span>
            )}
            <div className={cn(
              "flex h-7 w-7 items-center justify-center rounded-full bg-secondary/40 transition-transform duration-300",
              isExpanded ? "rotate-180 text-primary" : "text-muted-foreground"
            )}>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="border-t border-border/30 bg-secondary/10 p-5">
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                  <p className="text-xs font-medium text-muted-foreground animate-pulse">{t("app.preparing")}...</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">

                  <div className="hidden md:block">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">Ngày đăng đầu tiên</p>
                    <span className="text-xs font-semibold text-foreground">
                      {detailedData && detailedData.recentVideos.length > 0 
                        ? [...detailedData.recentVideos].sort((a, b) => new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime())[0].postedAt
                        : t("app.preparing")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                   <button
                     onClick={handleDelete}
                     className="flex items-center gap-2 text-xs font-semibold text-destructive hover:opacity-80 transition-opacity"
                   >
                     <Trash2 className="h-3.5 w-3.5" /> {t("bulk.delete")}
                   </button>
                   <a 
                     href={`https://www.tiktok.com/${channel.handle}`}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:opacity-80 transition-opacity"
                   >
                     {t("account.viewOnTikTok")} <ExternalLink className="h-3 w-3" />
                   </a>
                </div>
              </div>
              
              {/* Removed Performance Cards Section */}
            </>
          )}
        </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatMini({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col items-center min-w-[80px]">
      <span className="text-[9px] uppercase tracking-tighter text-muted-foreground font-bold leading-none mb-1">{label}</span>
      <span className={cn(
        "text-sm font-extrabold leading-none",
        highlight ? "text-primary" : "text-foreground"
      )}>{value}</span>
    </div>
  );
}

function DetailBox({ label, value }: { label: string, value: string }) {
  return (
    <div className="rounded-xl bg-card/40 p-3 border border-border/20">
      <p className="text-[9px] font-bold uppercase tracking-tight text-muted-foreground mb-1">{label}</p>
      <p className="text-base font-bold text-foreground leading-tight">{value}</p>
    </div>
  );
}
