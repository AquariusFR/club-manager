<?php

require_once __DIR__ . '/../lib/authentication.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Restriction à la méthode POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Méthode non autorisée. Utilisez POST."], JSON_UNESCAPED_UNICODE);
    exit();
}

// Récupération du JSON envoyé
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

try {

    if (isMailAlreadyExists($mail) || createAccount($mail, $password)) {

        http_response_code(202);

        echo json_encode([
            'success' => true,
            'message' => 'mail waiting for confirmation'
        ]);
    }
} catch (InvalidArgumentException $e) {

    // Données invalides
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (RuntimeException $e) {

    // Par exemple : email déjà utilisé
    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
} catch (Throwable $e) {

    // Erreur inattendue
    error_log(
        'Register error: ' . $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        'success' => false,
        'message' => 'Internal server error.' . $e->getMessage()
    ]);
}
