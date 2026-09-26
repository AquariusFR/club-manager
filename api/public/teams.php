<?php
declare(strict_types=1);

require_once __DIR__ . '/data.php';

function handle(string $method, array $params): void
{
    $teams = teams_data();
    $teamId = isset($params[0]) ? (int) $params[0] : null;

    switch ($method) {
        case 'GET':
            if ($teamId === null) {
                api_response(array_values($teams));
            }

            if (!isset($teams[$teamId])) {
                api_error('TEAM_NOT_FOUND', 'Équipe introuvable.', 404);
            }

            api_response($teams[$teamId]);

        case 'POST':
            if ($teamId !== null) {
                header('Allow: GET, POST, OPTIONS');
                api_error(
                    'METHOD_NOT_ALLOWED',
                    'POST doit être utilisé sur /teams.',
                    405
                );
            }

            $body = request_json();

            api_response([
                'message' => 'Création simulée.',
                'data' => $body
            ], 201);

        case 'PUT':
            if ($teamId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant équipe est nécessaire pour PUT.',
                    400
                );
            }

            if (!isset($teams[$teamId])) {
                api_error('TEAM_NOT_FOUND', 'Équipe introuvable.', 404);
            }

            $body = request_json();

            api_response([
                'message' => 'Modification simulée.',
                'data' => array_merge($teams[$teamId], $body)
            ]);

        case 'DELETE':
            if ($teamId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant équipe est nécessaire pour DELETE.',
                    400
                );
            }

            if (!isset($teams[$teamId])) {
                api_error('TEAM_NOT_FOUND', 'Équipe introuvable.', 404);
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
