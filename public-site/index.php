<?php

$initialBufferLevel = ob_get_level();

set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }

    throw new ErrorException($message, 0, $severity, $file, $line);
});

try {
    ob_start();
    require_once __DIR__ . '/_render.php';

    $uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $basePath = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    if ($basePath !== '' && $basePath !== '.' && ($uri === $basePath || strpos($uri, $basePath . '/') === 0)) {
        $uri = substr($uri, strlen($basePath));
    }
    $page = trim($uri, '/');
    if ($page === '') {
        $page = 'home';
    }

    renderPublicPage($page);
} catch (Throwable $error) {
    while (ob_get_level() > $initialBufferLevel) {
        ob_end_clean();
    }

    http_response_code(500);
    header('Content-Type: text/plain; charset=UTF-8');
    error_log(sprintf(
        '[public-site] %s in %s:%d',
        $error->getMessage(),
        $error->getFile(),
        $error->getLine()
    ));
    echo $error;
} finally {
    restore_error_handler();
}
