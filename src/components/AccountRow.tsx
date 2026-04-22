import { useState, useMemo, useEffect } from "react";
import { ChevronDown, ExternalLink, Calendar, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import type { ChannelData } from "@/data/mockData";

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

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img 
            src={channel.avatar} 
            alt={channel.name} 
            className="h-11 w-11 rounded-full object-cover border border-border/50 shrink-0 shadow-sm"
          />
          <div className="flex flex-col min-w-0">
            <h3 className="font-bold text-foreground tracking-tight text-[15px] truncate">{channel.name}</h3>
            <span className="text-[11px] text-primary font-bold truncate">@{channel.handle.replace('@', '')}</span>
            
            {/* Mobile Quick Stats - Collapsed view only */}
            {!isExpanded && (
              <div className="flex gap-4 mt-1 md:hidden">
                <span className="text-[10px] font-bold text-muted-foreground">
                  <span className="text-foreground">{formatNumber(stats.totalFollowers)}</span> F
                </span>
                <span className="text-[10px] font-bold text-muted-foreground">
                  <span className="text-foreground">{formatNumber(stats.totalLikes)}</span> L
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Grid - Desktop Only */}
        <div className="hidden md:flex flex-1 justify-around gap-1 px-4">
          <StatMini label={t("account.followers")} value={formatNumber(stats.totalFollowers)} />
          <StatMini label={t("account.likes")} value={formatNumber(stats.totalLikes)} />
          <StatMini label={t("account.totalViews")} value={formatNumber(stats.totalViews)} />
          <StatMini label={t("account.videos")} value={formatNumber(stats.totalVideos)} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full bg-secondary/40 transition-transform duration-300",
            isExpanded ? "rotate-180 text-primary bg-primary/10" : "text-muted-foreground"
          )}>
            <ChevronDown className="h-4 w-4" />
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
            <div className="border-t border-border/30 bg-secondary/5 p-4 sm:p-5">
              {isDetailLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary/50" />
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t("app.preparing")}...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Stats Grid for Mobile (Expanded) */}
                  <div className="grid grid-cols-2 gap-3 md:hidden">
                    <div className="rounded-xl bg-card/40 border border-border/40 p-3">
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Followers</p>
                      <p className="text-lg font-black text-foreground">{formatNumber(stats.totalFollowers)}</p>
                    </div>
                    <div className="rounded-xl bg-card/40 border border-border/40 p-3">
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Likes</p>
                      <p className="text-lg font-black text-foreground">{formatNumber(stats.totalLikes)}</p>
                    </div>
                    <div className="rounded-xl bg-card/40 border border-border/40 p-3">
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Views</p>
                      <p className="text-lg font-black text-foreground">{formatNumber(stats.totalViews)}</p>
                    </div>
                    <div className="rounded-xl bg-card/40 border border-border/40 p-3">
                      <p className="text-[9px] font-black text-muted-foreground uppercase mb-1">Videos</p>
                      <p className="text-lg font-black text-foreground">{formatNumber(stats.totalVideos)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={handleDelete}
                        className="flex items-center gap-2 text-xs font-bold text-destructive hover:opacity-80 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" /> {t("bulk.delete")}
                      </button>
                      <a 
                        href={`https://www.tiktok.com/${channel.handle}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                      >
                        {t("account.viewOnTikTok")} <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </div>
                </div>
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


