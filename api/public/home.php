<?php

declare(strict_types=1);

require_once __DIR__ . '/data.php';
require_once __DIR__ . '/simpleResource.php';

function handle(string $method, array $params, string $cacheKey): void
{
  $events = events_data();
  $news = news_data();
  $partners = partners_data();

  $data = [
    'events' => $events,
    'news' => $news,
    'partners' => $partners,
  ];

  if ($method === 'OPTIONS') {
    header('Allow: GET');
    http_response_code(204);
    exit;
  }


  if ($method != 'GET') {
    header('Allow: GET, POST, OPTIONS');
    api_error(
      'METHOD_NOT_ALLOWED',
      'POST doit être utilisé sur /events.',
      405
    );
    exit;
  }

  $cached = cache_get($cacheKey, 300);

  if ($cached !== null) {
    http_response_code(201);
    header('Content-Type: application/json; charset=utf-8');
    echo $cached;
    exit;
  }

  $response = $data;

  cache_set(
    $cacheKey,
    json_encode(
      $response,
      JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    )
  );

  api_response($response);
}
