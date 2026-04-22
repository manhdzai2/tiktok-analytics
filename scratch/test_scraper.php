<?php
require 'backend/vendor/autoload.php';

use GuzzleHttp\Client;
use Symfony\Component\DomCrawler\Crawler;

$urlOriginal = 'https://www.tiktok.com/@giaminh.2618';
$url = "https://www.tiktok.com/oembed?url=" . urlencode($urlOriginal);

$client = new Client([
    'timeout'  => 10.0,
    'headers' => [
        'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    ]
]);

try {
    $response = $client->get($url);
    echo "Status: " . $response->getStatusCode() . "\n";
    echo "Body: " . $response->getBody() . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
