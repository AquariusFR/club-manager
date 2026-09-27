<?php

declare(strict_types=1);

function checkAuthentication()
{
    // Extraction et vérification du Token JWT
    $headers = getallheaders();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';

    if (empty($authHeader) || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Missing token."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    $jwt = $matches[1];
    // ATTENTION : Utilisez exactement la même clé secrète que votre premier endpoint !
    $secret_key = "VOTRE_CLE_SECRETE_SUPER_SECURISEE_IONOS"; // devra être stocké à l'exterieur des sources.

    // Séparation des 3 parties du JWT
    $jwtParts = explode('.', $jwt);
    if (count($jwtParts) !== 3) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "invalid token format."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    list($base64UrlHeader, $base64UrlPayload, $base64UrlSignature) = $jwtParts;


    // Recalcul de la signature pour validation
    $signature = hash_hmac('sha256', $base64UrlHeader . "." . $base64UrlPayload, $secret_key, true);
    $expectedSignature = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    if ($base64UrlSignature !== $expectedSignature) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "invalid token signature ."], JSON_UNESCAPED_UNICODE);
        exit();
    }

    // Vérification de la date d'expiration (exp)
    $payload = json_decode(base64UrlDecode($base64UrlPayload), true);
    if (isset($payload['exp']) && $payload['exp'] < time()) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "token has expired."], JSON_UNESCAPED_UNICODE);
        exit();
    }
}
// Fonction utilitaire pour décoder le format Base64Url
function base64UrlDecode(string $data)
{
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(str_replace(['-', '_'], ['+', '/'], $data));
}
