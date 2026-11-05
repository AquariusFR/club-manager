<?php

declare(strict_types=1);

require_once __DIR__ . '/../lib/jwt.php';

function checkAuthentication(): void
{
    $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? '';

    if ($authorization === '' && function_exists('getallheaders')) {
        $headers = getallheaders();
        $authorization = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }

    if (!preg_match('/^Bearer\s+([A-Za-z0-9._~-]+)$/i', $authorization, $matches)) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Missing or invalid token.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    try {
        $claims = jwt_verify_token($matches[1]);
    } catch (RuntimeException $e) {
        error_log('JWT configuration error: ' . $e->getMessage());
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Authentication service is not configured.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($claims === null) {
        http_response_code(401);
        echo json_encode([
            'status' => 'error',
            'message' => 'Invalid or expired token.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}
