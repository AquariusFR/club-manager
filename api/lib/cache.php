<?php

declare(strict_types=1);

const API_CACHE_DIR = __DIR__ . '/../cache';


function cache_get(string $key, int $ttl): ?string
{
    $file = API_CACHE_DIR . '/' . hash('sha256', $key) . '.cache';

    if (!is_file($file)) {
        return null;
    }

    if ((filemtime($file) + $ttl) < time()) {
        return null;
    }

    $content = file_get_contents($file);

    if ($content === false) {
        return null;
    }

    return $content;
}


function cache_set(string $key, string $content): void
{
    if (!is_dir(API_CACHE_DIR)) {
        mkdir(API_CACHE_DIR, 0755, true);
    }

    $file = API_CACHE_DIR . '/' . hash('sha256', $key) . '.cache';

    file_put_contents(
        $file,
        $content,
        LOCK_EX
    );
}


function cache_delete(string $key): void
{
    $file = API_CACHE_DIR . '/' . hash('sha256', $key) . '.cache';

    if (is_file($file)) {
        unlink($file);
    }
}