<?php
declare(strict_types=1);

function api_response(
    mixed $data = null,
    int $status = 200,
    array $headers = []
): never {
    http_response_code($status);

    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');

    foreach ($headers as $name => $value) {
        header($name . ': ' . $value);
    }

    if ($status === 204) {
        exit;
    }

    echo json_encode(
        $data,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
    );

    exit;
}

function api_error(
    string $code,
    string $message,
    int $status
): never {
    api_response([
        'error' => [
            'code' => $code,
            'message' => $message
        ]
    ], $status);
}
