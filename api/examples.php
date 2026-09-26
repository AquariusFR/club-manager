<?php
// 1. Configuration des entêtes HTTP et CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Restriction stricte à la méthode PUT
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Méthode non autorisée. Utilisez PUT."], JSON_UNESCAPED_UNICODE);
    exit();
}

// 3. Récupération de l'ID depuis l'URL
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
if (empty($id)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "L'identifiant (id) est manquant ou invalide."], JSON_UNESCAPED_UNICODE);
    exit();
}

// 4. Extraction et vérification du Token JWT
$headers = getallheaders();
$authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Accès refusé. Jeton JWT manquant."], JSON_UNESCAPED_UNICODE);
    exit();
}

$jwt = $matches[1];
// ATTENTION : Utilisez exactement la même clé secrète que votre premier endpoint !
$secret_key = "VOTRE_CLE_SECRETE_SUPER_SECURISEE_IONOS";

// Séparation des 3 parties du JWT
$jwtParts = explode('.', $jwt);
if (count($jwtParts) !== 3) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Format de jeton invalide."], JSON_UNESCAPED_UNICODE);
    exit();
}

list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $jwtParts;

// Fonction utilitaire pour décoder le format Base64Url
function base64UrlDecode($data) {
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
}

// Recalcul de la signature pour validation
$signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
$expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

if ($base64UrlSignature !== $expectedSignature) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Signature du jeton invalide."], JSON_UNESCAPED_UNICODE);
    exit();
}

// Vérification de la date d'expiration (exp)
$payload = json_decode(base64UrlDecode($base64UrlPayload), true);
if (isset($payload['exp']) && $payload['exp'] < time()) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Le jeton JWT a expiré."], JSON_UNESCAPED_UNICODE);
    exit();
}

// 5. Envoi de la réponse de succès (Code 201 Created)
http_response_code(201);
echo json_encode([
    "example" => [
        "id" => $id
    ]
], JSON_UNESCAPED_UNICODE);
