import type { ChannelData, VideoData } from "@/data/mockData";

export interface VideoWithEngagement extends VideoData {
  engagementRate: number;
  isViral: boolean;
}

export interface ChannelAnalytics {
  engagementRate: number;
  avgViewsPerVideo: number;
  avgLikesPerVideo: number;
  avgCommentsPerVideo: number;
  avgSharesPerVideo: number;
  viewToFollowerRatio: number;
  likesToViewRatio: number;
  videosWithEngagement: VideoWithEngagement[];
  topVideo: VideoWithEngagement | null;
  viralVideos: VideoWithEngagement[];
  avgDailyFollowerGrowth: number;
  avgDailyViewGrowth: number;
  predictedDaysTo: { milestone: string; days: number }[];
}

/** Tính engagement rate cho 1 video: (likes + comments + shares) / views * 100 */
function calcVideoEngagement(video: VideoData): number {
  if (video.views === 0) return 0;
  return ((video.likes + video.comments + video.shares) / video.views) * 100;
}

/** Phân tích toàn bộ dữ liệu 1 kênh */
export function analyzeChannel(channel: ChannelData): ChannelAnalytics {
  const videos = channel.recentVideos || [];
  const totalVideos = videos.length;

  // Tính engagement cho từng video
  const videosWithEngagement: VideoWithEngagement[] = videos.map((v) => ({
    ...v,
    engagementRate: calcVideoEngagement(v),
    isViral: false,
  }));

  // Tính trung bình
  const avgViews = totalVideos > 0 ? videos.reduce((s, v) => s + v.views, 0) / totalVideos : 0;
  const avgLikes = totalVideos > 0 ? videos.reduce((s, v) => s + v.likes, 0) / totalVideos : 0;
  const avgComments = totalVideos > 0 ? videos.reduce((s, v) => s + v.comments, 0) / totalVideos : 0;
  const avgShares = totalVideos > 0 ? videos.reduce((s, v) => s + v.shares, 0) / totalVideos : 0;
  const avgEngagement =
    totalVideos > 0 ? videosWithEngagement.reduce((s, v) => s + v.engagementRate, 0) / totalVideos : 0;

  // Phát hiện viral
  videosWithEngagement.forEach((v) => {
    v.isViral = totalVideos > 0 && (v.views > avgViews * 1.8 || v.engagementRate > avgEngagement * 1.5);
  });

  const viralVideos = videosWithEngagement.filter((v) => v.isViral);
  const sorted = [...videosWithEngagement].sort((a, b) => b.engagementRate - a.engagementRate);

  // Tốc độ tăng trưởng trung bình / ngày
  const growth = channel.dailyGrowth || [];
  const growthLen = growth.length;
  const avgDailyFollowerGrowth =
    growthLen > 1 ? (growth[growthLen - 1].followers - growth[0].followers) / (growthLen - 1) : 0;
  const avgDailyViewGrowth =
    growthLen > 1 ? (growth[growthLen - 1].views - growth[0].views) / (growthLen - 1) : 0;

  // Dự đoán mốc follower tiếp theo
  const currentFollowers = channel.stats.totalFollowers;
  const milestones = [500_000, 1_000_000, 2_000_000, 5_000_000, 10_000_000];
  const predictedDaysTo = milestones
    .filter((m) => m > currentFollowers)
    .slice(0, 3)
    .map((m) => ({
      milestone: formatMilestone(m),
      days: avgDailyFollowerGrowth > 0 ? Math.ceil((m - currentFollowers) / avgDailyFollowerGrowth) : -1,
    }));

  return {
    engagementRate: avgEngagement,
    avgViewsPerVideo: avgViews,
    avgLikesPerVideo: avgLikes,
    avgCommentsPerVideo: avgComments,
    avgSharesPerVideo: avgShares,
    viewToFollowerRatio: channel.stats.totalViews / channel.stats.totalFollowers,
    likesToViewRatio: (channel.stats.totalLikes / channel.stats.totalViews) * 100,
    videosWithEngagement: sorted,
    topVideo: sorted[0] ?? null,
    viralVideos,
    avgDailyFollowerGrowth,
    avgDailyViewGrowth,
    predictedDaysTo,
  };
}

function formatMilestone(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(0) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return n.toString();
}

