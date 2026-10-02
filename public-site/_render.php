<?php

declare(strict_types=1);

function renderPublicPage(string $page): void
{
    require_once dirname(__DIR__) . '/api/lib/cache.php';

    $cacheKey = 'public/page/' . $page;
    $cached = cache_get($cacheKey, 300);
    if ($cached !== null) {
        echo $cached;
        return;
    }

    $renderer = __DIR__ . '/server-side-renderer/' . $page . '_renderer.php';
    if (!is_file($renderer)) {
        http_response_code(404);
        exit('Renderer non trouvé pour la page : ' . $page);
    }

    require_once $renderer;

    if (!function_exists('render')) {
        throw new RuntimeException('La fonction render() est absente du renderer : ' . $renderer);
    }
    $before = findTemplate('_before');

    $after = findTemplate('_after');


    $html = $before . render() . $after;

    cache_set($cacheKey, $html);
    echo $html;
}
