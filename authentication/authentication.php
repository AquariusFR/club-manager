<?php
// 1. Configuration des entêtes HTTP pour une API REST et CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

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

// 3. Récupération du login (JSON ou Formulaire)
$data = json_decode(file_get_contents("php://input"), true) ?? $_POST;
$login = isset($data['login']) ? trim($data['login']) : 'guest';

// 4. Clé secrète pour signer le JWT
// ATTENTION : Changez cette clé par une chaîne complexe et gardez-la secrète !
$secret_key = "VOTRE_CLE_SECRETE_SUPER_SECURISEE_IONOS";

// 5. Construction du JWT (Header + Payload)
$header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);

$issuedAt = time();
$expirationTime = $issuedAt + 3600; // Valable 1 heure

$payload = json_encode([
    'iss' => "https://" . $_SERVER['HTTP_HOST'], // Émetteur
    'iat' => $issuedAt,                         // Date de création
    'exp' => $expirationTime,                  // Date d'expiration
    'user' => [
        'login' => htmlspecialchars($login),
        'role' => 'user'
    ]
]);

// Fonction utilitaire pour le formatage Base64Url (requis pour le standard JWT)
function base64UrlEncode($data) {
    return str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($data));
}

$base64UrlHeader = base64UrlEncode($header);
$base64UrlPayload = base64UrlEncode($payload);

// 6. Création de la signature HMAC-SHA256
$signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
$base64UrlSignature = base64UrlEncode($signature);

// Assemblage du JWT final
$jwt = $base64UrlHeader . "." . $base64UrlPayload . "." . $base64UrlSignature;

// 7. Envoi de la réponse de succès
http_response_code(200);
echo json_encode([
    "status" => "success",
    "message" => "Authentification réussie (sans vérification)",
    "token" => $jwt,
    "expires_in" => 3600
], JSON_UNESCAPED_UNICODE);
