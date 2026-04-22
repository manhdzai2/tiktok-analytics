<?php

namespace App\Http\Controllers;

use App\Models\Channel;
use App\Models\ImportTask;
use App\Jobs\ProcessTikTokImport;
use App\Services\TikTokScraperService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ChannelController extends Controller
{
    protected $scraper;

    public function __construct(TikTokScraperService $scraper)
    {
        $this->scraper = $scraper;
    }

    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 10);

        $paginated = Channel::orderBy('created_at', 'desc')->paginate($perPage);
        
        $paginated->getCollection()->transform(function($channel) {
            return $this->formatChannelSummary($channel);
        });

        return response()->json($paginated->toArray());
    }

    public function show($id)
    {
        $cacheKey = 'channel_detail_' . $id;

        $channelData = \Illuminate\Support\Facades\Cache::remember($cacheKey, 60, function() use ($id) {
            $channel = Channel::with(['dailyGrowths' => function($q) {
                $q->orderBy('created_at', 'desc')->limit(30);
            }, 'videos' => function($q) {
                $q->orderBy('posted_at', 'desc')->limit(20);
            }])->find($id);
            
            if (!$channel) return null;

            return $this->formatChannelDetail($channel);
        });
        
        if (!$channelData) {
            return response()->json(['message' => 'Channel not found'], 404);
        }

        return response()->json($channelData);
    }

    public function import(Request $request)
    {
        $request->validate([
            'url' => 'required|string'
        ]);

        $result = $this->scraper->scrapeFromUrl($request->url);

        if (!$result) {
            return response()->json(['message' => 'Could not fetch data from TikTok.'], 400);
        }

        $id = ($result instanceof Channel) ? $result->id : $result->channel_id;
        $channel = Channel::with(['dailyGrowths', 'videos'])->find($id);

        return response()->json([
            'message' => 'Import successful',
            'data' => $this->formatChannelDetail($channel)
        ]);
    }

    public function bulkImport(Request $request)
    {
        $file = $request->file('file');
        
        if ($file) {
            \Illuminate\Support\Facades\Log::info("Bulk Import Upload Attempt", [
                'original_name' => $file->getClientOriginalName(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'extension' => $file->getClientOriginalExtension()
            ]);
        }

        $request->validate([
            'file' => [
                'required',
                'file',
                'mimes:csv,txt,xlsx,xls',
                // Bổ sung thêm mimetypes đề phòng mimes detection bị lỗi trên Windows
                'mimetypes:text/csv,text/plain,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/octet-stream'
            ]
        ]);

        $path = $file->store('imports');
        
        $task = ImportTask::create([
            'status' => 'pending'
        ]);

        ProcessTikTokImport::dispatch($task, $path);

        return response()->json([
            'import_id' => $task->id,
            'message' => 'Import started'
        ]);
    }

    public function getImportStatus($id)
    {
        $task = ImportTask::find($id);
        if (!$task) {
            return response()->json(['message' => 'Task not found'], 404);
        }

        return response()->json($task);
    }

    protected function formatChannelSummary($channel)
    {
        // Tối ưu: Lấy trực tiếp từ thuộc tính nếu có thể, hoặc dùng truy vấn rút gọn
        // Để tránh N+1 nặng nề ở index, ta có thể dùng giá trị mặc định 
        // hoặc tính toán nhanh từ các video đã load (nhưng ở index ta không load videos)
        
        // Giải pháp: Ở Index, tạm thời chấp nhận total_views hoặc một giá trị đã cache 
        // Trong thực tế, nên lưu views_30d vào bảng channels
        
        return [
            'id' => $channel->id,
            'name' => $channel->name,
            'handle' => $channel->handle,
            'avatar' => $channel->avatar,
            'tiktok_created_at' => $channel->tiktok_created_at,
            'stats' => [
                'totalLikes' => (int) $channel->total_likes,
                'totalFollowers' => (int) $channel->total_followers,
                'totalVideos' => (int) $channel->total_videos,
                'totalViews' => (int) $channel->views_30d,
                'likesChange' => (float) $channel->likes_change,
                'followersChange' => (float) $channel->followers_change,
                'videosChange' => (float) $channel->videos_change,
                'viewsChange' => (float) $channel->views_change,
            ],
            'is_summary' => true, // Flag để Frontend biết cần load thêm
            'dailyGrowth' => [],
            'recentVideos' => []
        ];
    }

    protected function formatChannel($channel)
    {
        $totalViews30d = (int) $channel->views_30d;

        return [
            'id' => $channel->id,
            'name' => $channel->name,
            'handle' => $channel->handle,
            'avatar' => $channel->avatar,
            'tiktok_created_at' => $channel->tiktok_created_at,
            'stats' => [
                'totalLikes' => (int) $channel->total_likes,
                'totalFollowers' => (int) $channel->total_followers,
                'totalVideos' => (int) $channel->total_videos,
                'totalViews' => $totalViews30d,
                'likesChange' => (float) $channel->likes_change,
                'followersChange' => (float) $channel->followers_change,
                'videosChange' => (float) $channel->videos_change,
                'viewsChange' => (float) $channel->views_change,
            ],
            'dailyGrowth' => [],
            'recentVideos' => []
        ];
    }

    protected function formatChannelDetail($channel)
    {
        $data = $this->formatChannel($channel);
        
        $data['dailyGrowth'] = $channel->dailyGrowths->map(function($g) {
            return [
                'date' => $g->date,
                'followers' => (int) $g->followers,
                'views' => (int) $g->views,
            ];
        });

        $data['recentVideos'] = $channel->videos->sortByDesc('posted_at')->values()->map(function($v) {
            return [
                'id' => $v->id,
                'title' => $v->title,
                'thumbnail' => $v->thumbnail,
                'views' => (int) $v->views,
                'likes' => (int) $v->likes,
                'comments' => (int) $v->comments,
                'shares' => (int) $v->shares,
                'postedAt' => $v->posted_at,
            ];
        });

        return $data;
    }

    public function destroy($id)
    {
        $channel = Channel::find($id);
        if (!$channel) {
            return response()->json(['message' => 'Channel not found'], 404);
        }
        $channel->delete();
        return response()->json(['message' => 'Channel deleted successfully']);
    }

    public function bulkDestroy(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'string'
        ]);

        Channel::whereIn('id', $request->ids)->delete();
        return response()->json(['message' => 'Channels deleted successfully']);
    }
}
