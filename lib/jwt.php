<?php

declare(strict_types=1);

function jwt_secret(): string
{
    $secret = getenv('CLUB_MANAGER_JWT_SECRET');

    if ($secret === false || strlen($secret) < 32) {
        throw new RuntimeException(
            'CLUB_MANAGER_JWT_SECRET must be configured with at least 32 characters.'
        );
    }

    return $secret;
}

function jwt_base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function jwt_base64url_decode(string $data): string|false
{
    if ($data === '' || !preg_match('/^[A-Za-z0-9_-]+$/', $data)) {
        return false;
    }

    $padding = strlen($data) % 4;
    if ($padding !== 0) {
        $data .= str_repeat('=', 4 - $padding);
    }

    return base64_decode(strtr($data, '-_', '+/'), true);
}

function jwt_create_token(array $claims): string
{
    $header = jwt_base64url_encode(json_encode(
        ['typ' => 'JWT', 'alg' => 'HS256'],
        JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
    ));
    $payload = jwt_base64url_encode(json_encode(
        $claims,
        JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR
    ));
    $signature = hash_hmac(
        'sha256',
        $header . '.' . $payload,
        jwt_secret(),
        true
    );

    return $header . '.' . $payload . '.' . jwt_base64url_encode($signature);
}

/**
 * Returns the verified claims, or null when the token is invalid or expired.
 */
function jwt_verify_token(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }

    [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
    $headerJson = jwt_base64url_decode($encodedHeader);
    $payloadJson = jwt_base64url_decode($encodedPayload);
    $signature = jwt_base64url_decode($encodedSignature);

    if ($headerJson === false || $payloadJson === false || $signature === false) {
        return null;
    }

    $header = json_decode($headerJson, true);
    $claims = json_decode($payloadJson, true);

    if (!is_array($header) || ($header['alg'] ?? null) !== 'HS256' || !is_array($claims)) {
        return null;
    }

    $expectedSignature = hash_hmac(
        'sha256',
        $encodedHeader . '.' . $encodedPayload,
        jwt_secret(),
        true
    );

    if (!hash_equals($expectedSignature, $signature)) {
        return null;
    }

    if (!isset($claims['exp']) || !is_int($claims['exp']) || $claims['exp'] <= time()) {
        return null;
    }

    return $claims;
}
