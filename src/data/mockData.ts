export interface VideoData {
  id: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  postedAt: string;
}

export interface DailyGrowth {
  date: string;
  followers: number;
  views: number;
}

export interface ChannelData {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  stats: {
    totalLikes: number;
    totalFollowers: number;
    totalVideos: number;
    totalViews: number;
    likesChange: number;
    followersChange: number;
    videosChange: number;
    viewsChange: number;
  };
  dailyGrowth: DailyGrowth[];
  recentVideos: VideoData[];
  tiktok_created_at?: string;
}

function generateDailyGrowth(
  baseFollowers: number,
  baseViews: number,
  days: number
): DailyGrowth[] {
  const data: DailyGrowth[] = [];
  let followers = baseFollowers;
  let views = baseViews;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    followers += Math.floor(Math.random() * 800 + 200);
    views += Math.floor(Math.random() * 50000 + 10000);

    data.push({ date: dateStr, followers, views });
  }
  return data;
}

export const channelsData: ChannelData[] = [
  {
    id: "ch-1",
    name: "TechVibes Studio",
    handle: "@techvibes",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=TV&backgroundColor=fe2c55&textColor=ffffff",
    stats: {
      totalLikes: 2_450_000,
      totalFollowers: 385_200,
      totalVideos: 248,
      totalViews: 18_700_000,
      likesChange: 12.5,
      followersChange: 8.3,
      videosChange: 4.2,
      viewsChange: 15.7,
    },
    dailyGrowth: generateDailyGrowth(350_000, 16_000_000, 30),
    recentVideos: [
      {
        id: "v1",
        title: "5 AI Tools You NEED in 2026",
        thumbnail: "https://picsum.photos/seed/techvid1/400/600",
        views: 5_230_000,
        likes: 98_500,
        comments: 3_200,
        shares: 12_400,
        postedAt: "2 days ago",
      },
      {
        id: "v2",
        title: "Building a Smart Home on a Budget",
        thumbnail: "https://picsum.photos/seed/techvid2/400/600",
        views: 856_000,
        likes: 67_200,
        comments: 2_100,
        shares: 8_900,
        postedAt: "5 days ago",
      },
      {
        id: "v3",
        title: "iPhone vs Android - The REAL Truth",
        thumbnail: "https://picsum.photos/seed/techvid3/400/600",
        views: 2_100_000,
        likes: 145_000,
        comments: 8_400,
        shares: 25_600,
        postedAt: "1 week ago",
      },
      {
        id: "v4",
        title: "Coding a Full App in 60 Seconds",
        thumbnail: "https://picsum.photos/seed/techvid4/400/600",
        views: 650_000,
        likes: 52_300,
        comments: 1_800,
        shares: 6_700,
        postedAt: "1 week ago",
      },
      {
        id: "v5",
        title: "The Future of Wearable Tech",
        thumbnail: "https://picsum.photos/seed/techvid5/400/600",
        views: 430_000,
        likes: 34_100,
        comments: 1_200,
        shares: 4_500,
        postedAt: "2 weeks ago",
      },
      {
        id: "v6",
        title: "React vs Vue in 2026 - Which One?",
        thumbnail: "https://picsum.photos/seed/techvid6/400/600",
        views: 780_000,
        likes: 61_400,
        comments: 4_100,
        shares: 9_800,
        postedAt: "2 weeks ago",
      },
    ],
    tiktok_created_at: "Jan 15, 2024",
  },
  {
    id: "ch-2",
    name: "FoodieJourney",
    handle: "@foodiejourney",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=FJ&backgroundColor=25f4ee&textColor=000000",
    stats: {
      totalLikes: 5_120_000,
      totalFollowers: 720_400,
      totalVideos: 412,
      totalViews: 42_300_000,
      likesChange: -2.1,
      followersChange: 5.6,
      videosChange: 6.8,
      viewsChange: -0.8,
    },
    dailyGrowth: generateDailyGrowth(680_000, 38_000_000, 30),
    recentVideos: [
      {
        id: "v7",
        title: "Street Food in Bangkok - Top 10",
        thumbnail: "https://picsum.photos/seed/foodvid1/400/600",
        views: 3_400_000,
        likes: 256_000,
        comments: 9_800,
        shares: 45_200,
        postedAt: "1 day ago",
      },
      {
        id: "v8",
        title: "Making Perfect Ramen at Home",
        thumbnail: "https://picsum.photos/seed/foodvid2/400/600",
        views: 1_870_000,
        likes: 142_000,
        comments: 5_600,
        shares: 22_100,
        postedAt: "3 days ago",
      },
      {
        id: "v9",
        title: "$1 vs $100 Sushi Challenge",
        thumbnail: "https://picsum.photos/seed/foodvid3/400/600",
        views: 8_200_000,
        likes: 318_000,
        comments: 12_400,
        shares: 56_000,
        postedAt: "6 days ago",
      },
      {
        id: "v10",
        title: "Italian Grandma Rates My Pasta",
        thumbnail: "https://picsum.photos/seed/foodvid4/400/600",
        views: 2_560_000,
        likes: 198_000,
        comments: 7_200,
        shares: 31_400,
        postedAt: "1 week ago",
      },
      {
        id: "v11",
        title: "Midnight Snacks Around the World",
        thumbnail: "https://picsum.photos/seed/foodvid5/400/600",
        views: 1_120_000,
        likes: 87_600,
        comments: 3_100,
        shares: 14_800,
        postedAt: "10 days ago",
      },
      {
        id: "v12",
        title: "5-Minute Meals That Actually Taste Good",
        thumbnail: "https://picsum.photos/seed/foodvid6/400/600",
        views: 920_000,
        likes: 71_200,
        comments: 2_800,
        shares: 11_300,
        postedAt: "2 weeks ago",
      },
    ],
    tiktok_created_at: "Mar 10, 2024",
  },
];

export function formatNumber(num: number): string {
  return num.toLocaleString();
}