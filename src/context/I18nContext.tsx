import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "en" | "vi";

interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key) => key,
});

const translations: Record<Locale, Record<string, string>> = {
  en: {
    // Header
    "app.title": "Quang Mạnh",
    "app.subtitle": "Channel Dashboard",
    "header.placeholder": "Paste TikTok URL or ID (@hoangdidao)...",
    "header.add": "Add",

    // Tabs
    "tab.overview": "Overview",
    "tab.analytics": "Deep Analytics",
    "tab.compare": "Compare",

    // Stat Cards
    "stat.totalLikes": "Total Likes",
    "stat.followers": "Followers",
    "stat.videos": "Videos",
    "stat.totalViews": "Views (30d)",
    "stat.vsLastWeek": "vs last week",

    // Growth Chart
    "chart.growthTitle": "Growth Overview",
    "chart.growthDesc": "Followers & views over the last 30 days",
    "chart.followers": "Followers",
    "chart.views": "Views",

    // Engagement Chart
    "chart.engagementTitle": "Engagement Breakdown",
    "chart.engagementDesc": "Likes, comments & shares per recent video",
    "chart.likes": "Likes",
    "chart.comments": "Comments",
    "chart.shares": "Shares",

    // Recent Videos
    "videos.title": "Recent Videos",
    "videos.top": "Most Viewed Videos",
    "videos.desc": "Latest content performance at a glance",

    // Engagement Stats
    "engagement.title": "Engagement & Average Stats",
    "engagement.desc": "Key performance indicators for your content",
    "engagement.rate": "Engagement Rate",
    "engagement.rateDesc": "(Likes + Comments + Shares) / Views",
    "engagement.avgViews": "Avg Views / Video",
    "engagement.avgViewsDesc": "Average views per video",
    "engagement.avgLikes": "Avg Likes / Video",
    "engagement.avgLikesDesc": "Average likes per video",
    "engagement.avgComments": "Avg Comments / Video",
    "engagement.avgCommentsDesc": "Average comments per video",
    "engagement.avgShares": "Avg Shares / Video",
    "engagement.avgSharesDesc": "Average shares per video",
    "engagement.viewFollower": "View / Follower Ratio",
    "engagement.viewFollowerDesc": "Total views relative to follower count",
    "engagement.likeView": "Like-to-View Rate",
    "engagement.likeViewDesc": "% of viewers who liked",

    // Video Ranking
    "ranking.title": "Video Ranking",
    "ranking.desc": "Ranked by engagement rate \u2014 viral videos are highlighted",
    "ranking.video": "Video",
    "ranking.engRate": "Eng. Rate",
    "ranking.engagementRate": "Engagement Rate",
    "ranking.viral": "Viral",

    // Growth Prediction
    "prediction.title": "Growth Prediction",
    "prediction.desc": "Estimated milestones based on the 30-day growth trend",
    "prediction.dailyGrowth": "Daily Growth Rate",
    "prediction.followersDay": "Followers / day",
    "prediction.viewsDay": "Views / day",
    "prediction.days": "days",
    "prediction.achieved": "achieved",
    "prediction.unable": "Unable to predict at current rate",

    // Channel Comparison
    "compare.radar": "Performance Radar",
    "compare.detailed": "Detailed Comparison",
    "compare.tie": "Tie",
    "compare.followers": "Followers",
    "compare.totalViews": "Total Views",
    "compare.totalLikes": "Total Likes",
    "compare.videos": "Videos",
    "compare.engRate": "Engagement Rate",
    "compare.avgViews": "Avg Views/Video",
    "compare.avgLikes": "Avg Likes/Video",
    "compare.viewFollower": "View/Follower Ratio",
    "compare.followerGrowth": "Follower Growth/Day",
    "compare.viralVideos": "Viral Videos",
    "compare.growthDay": "Growth/Day",
    "compare.avgViewsShort": "Avg Views",

    // Dashboard & AccountRow
    "dashboard.title": "Account Management",
    "dashboard.subtitle": "Monitor and manage all your TikTok profiles in one place.",
    "dashboard.search": "Search accounts...",
    "dashboard.noAccounts": "No accounts found",
    "dashboard.addAccountDesc": "Paste a TikTok link in the bar above to get started.",
    "account.followers": "Followers",
    "account.likes": "Likes",
    "account.videos": "Videos",
    "account.totalViews": "Views (30d)",
    "account.creationDate": "Account Created",
    "account.recentActivity": "Recent Activity",
    "account.viewOnTikTok": "View on TikTok",
    "account.avgViews": "Avg. Views/Video",
    "account.engagement": "Engagement Rate",
    "account.status": "Status",
    "account.growing": "Active Growing",
    "account.createdDate": "Created on",
    "account.followersPerDay": "Followers/Day",
    "account.viewsPerDay": "Views/Day",
    "account.deleteConfirm": "Are you sure you want to delete this account?",
    "bulk.delete": "Delete Selected",
    "bulk.selected": "selected",
    "bulk.selectAll": "Select All",
    "bulk.deleteConfirm": "Are you sure you want to delete {count} selected accounts?",
    "bulk.import": "Bulk Import (CSV)",
     "dashboard.loadMore": "Load More Accounts",
     "app.preparing": "Preparing...",
    "error.import": "Error importing TikTok data. Please check the link.",

    // Footer
    "footer.text": "© 2026 TikTok Analytics Dashboard Premium",
  },
  vi: {
    // Header
    "app.title": "Quang Mạnh",
    "app.subtitle": "Bảng điều khiển kênh",
    "header.placeholder": "Dán Link hoặc ID TikTok (@hoangdidao)...",
    "header.add": "Thêm",

    // Tabs
    "tab.overview": "Tổng quan",
    "tab.analytics": "Phân tích sâu",
    "tab.compare": "So sánh",

    // Stat Cards
    "stat.totalLikes": "Tổng lượt tim",
    "stat.followers": "Người theo dõi",
    "stat.videos": "Video",
    "stat.totalViews": "Tổng xem (30 ngày)",
    "stat.vsLastWeek": "so với tuần trước",

    // Growth Chart
    "chart.growthTitle": "Tổng quan tăng trưởng",
    "chart.growthDesc": "Người theo dõi & lượt xem trong 30 ngày qua",
    "chart.followers": "Người theo dõi",
    "chart.views": "Lượt xem",

    // Engagement Chart
    "chart.engagementTitle": "Phân tích tương tác",
    "chart.engagementDesc": "Tim, bình luận & chia sẻ theo từng video",
    "chart.likes": "Tim",
    "chart.comments": "Bình luận",
    "chart.shares": "Chia sẻ",

    // Recent Videos
    "videos.title": "Video gần đây",
    "videos.top": "Video xem nhiều nhất",
    "videos.desc": "Hiệu suất nội dung mới nhất",

    // Engagement Stats
    "engagement.title": "Tương tác & Thống kê trung bình",
    "engagement.desc": "Các chỉ số hiệu suất chính của nội dung",
    "engagement.rate": "Tỷ lệ tương tác",
    "engagement.rateDesc": "(Tim + Bình luận + Chia sẻ) / Lượt xem",
    "engagement.avgViews": "TB lượt xem / Video",
    "engagement.avgViewsDesc": "Lượt xem trung bình mỗi video",
    "engagement.avgLikes": "TB lượt tim / Video",
    "engagement.avgLikesDesc": "Lượt tim trung bình mỗi video",
    "engagement.avgComments": "TB bình luận / Video",
    "engagement.avgCommentsDesc": "Bình luận trung bình mỗi video",
    "engagement.avgShares": "TB chia sẻ / Video",
    "engagement.avgSharesDesc": "Chia sẻ trung bình mỗi video",
    "engagement.viewFollower": "Tỷ lệ xem / Follower",
    "engagement.viewFollowerDesc": "Tổng xem so với số người theo dõi",
    "engagement.likeView": "Tỷ lệ tim / Xem",
    "engagement.likeViewDesc": "% người xem đã thả tim",

    // Video Ranking
    "ranking.title": "Xếp hạng Video",
    "ranking.desc": "Xếp theo tỷ lệ tương tác — video viral được đánh dấu",
    "ranking.video": "Video",
    "ranking.engRate": "Tỷ lệ TT",
    "ranking.engagementRate": "Tỷ lệ tương tác",
    "ranking.viral": "Viral",

    // Growth Prediction
    "prediction.title": "Dự đoán tăng trưởng",
    "prediction.desc": "Mốc ước tính dựa trên xu hướng 30 ngày",
    "prediction.dailyGrowth": "Tốc độ tăng trưởng / ngày",
    "prediction.followersDay": "Follower / ngày",
    "prediction.viewsDay": "Lượt xem / ngày",
    "prediction.days": "ngày",
    "prediction.achieved": "đã đạt",
    "prediction.unable": "Không thể dự đoán với tốc độ hiện tại",

    // Channel Comparison
    "compare.radar": "Radar hiệu suất",
    "compare.detailed": "So sánh chi tiết",
    "compare.tie": "Hòa",
    "compare.followers": "Người theo dõi",
    "compare.totalViews": "Tổng lượt xem",
    "compare.totalLikes": "Tổng lượt tim",
    "compare.videos": "Video",
    "compare.engRate": "Tỷ lệ tương tác",
    "compare.avgViews": "TB lượt xem/Video",
    "compare.avgLikes": "TB tim/Video",
    "compare.viewFollower": "Tỷ lệ xem/Follower",
    "compare.followerGrowth": "Tăng follower/Ngày",
    "compare.viralVideos": "Video Viral",
    "compare.growthDay": "Tăng trưởng/Ngày",
    "compare.avgViewsShort": "TB lượt xem",

    // Dashboard & AccountRow
    "dashboard.title": "Quản lý tài khoản",
    "dashboard.subtitle": "Theo dõi và quản lý tất cả hồ sơ TikTok của bạn tại một nơi.",
    "dashboard.search": "Tìm kiếm tài khoản...",
    "dashboard.noAccounts": "Không tìm thấy tài khoản",
    "dashboard.addAccountDesc": "Dán link TikTok vào thanh công cụ phía trên để bắt đầu.",
    "account.followers": "Người theo dõi",
    "account.likes": "Lượt tim",
    "account.videos": "Video",
    "account.totalViews": "Tổng xem (30 ngày)",
    "account.creationDate": "Ngày tạo hồ sơ",
    "account.recentActivity": "Hoạt động gần đây",
    "account.viewOnTikTok": "Xem trên TikTok",
    "account.avgViews": "TB xem/Video",
    "account.engagement": "Tỷ lệ tương tác",
    "account.status": "Trạng thái",
    "account.growing": "Đang phát triển",
    "account.createdDate": "Ngày tạo",
    "account.followersPerDay": "Follower/Ngày",
    "account.viewsPerDay": "Lượt xem/Ngày",
    "account.deleteConfirm": "Bạn có chắc chắn muốn xóa tài khoản này không?",
    "bulk.delete": "Xóa mục đã chọn",
    "bulk.selected": "mục đã chọn",
    "bulk.selectAll": "Chọn tất cả",
    "bulk.deleteConfirm": "Bạn có chắc chắn muốn xóa {count} tài khoản đã chọn?",
    "bulk.import": "Nhập hàng loạt (CSV)",
     "dashboard.loadMore": "Tải thêm tài khoản",
     "app.preparing": "Đang chuẩn bị...",
    "error.import": "Lỗi khi nhập dữ liệu TikTok. Vui lòng kiểm tra lại link.",

    // Footer
    "footer.text": "© 2026 TikTok Analytics Dashboard Premium",
  },
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("tiktok-locale") as Locale) || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("tiktok-locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string): string => translations[locale][key] ?? key;

  const setLocale = (l: Locale) => setLocaleState(l);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}