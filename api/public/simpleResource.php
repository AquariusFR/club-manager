<?php

declare(strict_types=1);

require_once __DIR__ . '/data.php';

function handleRequest(string $method, array $params, array $data): void
{

    switch ($method) {
        case 'GET':
            if (count($params) === 0) {
                // TODO getAll method in database.
                api_response(array_values($data));
            } else {

                $resourceId = filter_var($params[0], FILTER_VALIDATE_INT);
                if ($resourceId === false) {
                    api_error(
                        'INVALID_RESOURCE_ID',
                        'L\'identifiant est invalide.',
                        400
                    );
                }

                $single = array_find($data, fn(array $item): bool => $item['id'] === $resourceId);
                if ($single !== null) {
                    api_response($single);
                }

                api_error('TEAM_NOT_FOUND', 'event introuvable.', 404);
            }

        case 'POST':
            $resourceId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($resourceId !== null) {
                header('Allow: GET, POST, OPTIONS');
                api_error(
                    'METHOD_NOT_ALLOWED',
                    'POST doit être utilisé sur /events.',
                    405
                );
            }

            $body = request_json();

            api_response([
                'message' => 'Création simulée.',
                'data' => $body
            ], 201);

        case 'PUT':
            $resourceId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($resourceId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant event est nécessaire pour PUT.',
                    400
                );
            }

            if (!isset($singles[$resourceId])) {
                api_error('TEAM_NOT_FOUND', 'event introuvable.', 404);
            }

            $body = request_json();

            api_response([
                'message' => 'Modification simulée.',
                'data' => array_merge($singles[$resourceId], $body)
            ]);

        case 'DELETE':

            $resourceId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($resourceId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant event est nécessaire pour DELETE.',
                    400
                );
            }

            if (!isset($singles[$resourceId])) {
                api_error('TEAM_NOT_FOUND', 'event introuvable.', 404);
            }

            api_response(null, 204);

        default:
            header('Allow: GET, POST, PUT, DELETE, OPTIONS');
            api_error(
                'METHOD_NOT_ALLOWED',
                'Méthode HTTP non supportée.',
                405
            );
    }
}
