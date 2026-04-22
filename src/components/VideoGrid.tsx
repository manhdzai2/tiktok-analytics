import { Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VideoData } from "@/data/mockData";
import { formatNumber } from "@/data/mockData";
import { useI18n } from "@/context/I18nContext";

interface VideoItemProps {
  video: VideoData;
  index: number;
}

export function VideoItem({ video, index }: VideoItemProps) {
  return (
    <div
      className={cn(
        "group overflow-hidden rounded-2xl border border-border/60 bg-card",
        "shadow-card transition-smooth hover:shadow-card-hover hover:border-primary/15",
        "animate-fade-in opacity-0"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-secondary">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover transition-smooth group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-foreground/0 transition-smooth group-hover:bg-foreground/10" />
        <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-lg bg-foreground/70 px-2 py-1 backdrop-blur-sm">
          <Eye className="h-3 w-3 text-primary-foreground" />
          <span className="text-xs font-medium text-primary-foreground">
            {formatNumber(video.views)}
          </span>
        </div>
      </div>
      <div className="p-3.5">
        <h4 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {video.title}
        </h4>
        <div className="mt-2.5 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs text-muted-foreground">{formatNumber(video.likes)}</span>
          </div>
          <span className="text-xs text-muted-foreground">{video.postedAt}</span>
        </div>
      </div>
    </div>
  );
}

interface VideoGridProps {
  videos: VideoData[];
  title?: string;
}

export function VideoGrid({ videos, title }: VideoGridProps) {
  const { t } = useI18n();

  return (
    <div className="animate-fade-in opacity-0 animation-delay-400">
      <div className="mb-5">
        <h3 className="text-base font-semibold text-foreground">{title || t("videos.title")}</h3>
        {!title && <p className="mt-1 text-sm text-muted-foreground">{t("videos.desc")}</p>}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {videos.map((video, index) => (
          <VideoItem key={video.id} video={video} index={index} />
        ))}
      </div>
    </div>
  );
}