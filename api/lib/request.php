<?php
declare(strict_types=1);

function request_json(): array
{
    $raw = file_get_contents('php://input');

    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $data = json_decode($raw, true);

    if (!is_array($data) || json_last_error() !== JSON_ERROR_NONE) {
        api_error('INVALID_JSON', 'Le body JSON est invalide.', 400);
    }

    return $data;
}
