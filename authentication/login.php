<?php

require_once __DIR__ . '/../lib/authentication.php';
require_once __DIR__ . '/../lib/jwt.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ], JSON_UNESCAPED_UNICODE);
    exit();
}

$input = json_decode(
    file_get_contents('php://input'),
    true
);

if (!is_array($input)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON.'
    ]);

    exit;
}

$mail = $input['mail'] ?? '';
$password = $input['password'] ?? '';
if (!is_string($mail) || !is_string($password)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

try {
    $user = authenticateUser($mail, $password);

    if ($user === null) {
        http_response_code(401);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $issuedAt = time();
    $expiresAt = $issuedAt + 3600;
    $token = jwt_create_token([
        'iat' => $issuedAt,
        'exp' => $expiresAt,
        'sub' => (string) $user['id'],
        'user' => [
            'login' => $user['login'],
            'role' => $user['role']
        ]
    ]);

    echo json_encode([
        'success' => true,
        'token' => $token,
        'expires_in' => $expiresAt - $issuedAt
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
    error_log('Authentication login error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error.'
    ], JSON_UNESCAPED_UNICODE);
}
