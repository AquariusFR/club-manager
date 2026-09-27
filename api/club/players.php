<?php
declare(strict_types=1);

require_once __DIR__ . '/data.php';

function handle(string $method, array $params): void
{
    $players = players_data();

    if (!isset($params[0])) {
        api_error('MISSING_TEAM_ID', 'Identifiant équipe manquant.', 400);
    }

    $teamId = (int) $params[0];

    if (!isset($players[$teamId])) {
        api_error('TEAM_NOT_FOUND', 'Équipe introuvable.', 404);
    }

    $playerId = isset($params[1]) ? (int) $params[1] : null;

    switch ($method) {
        case 'GET':
            if ($playerId === null) {
                api_response(array_values($players[$teamId]));
            }

            if (!isset($players[$teamId][$playerId])) {
                api_error(
                    'PLAYER_NOT_FOUND',
                    'Joueur introuvable dans cette équipe.',
                    404
                );
            }

            api_response($players[$teamId][$playerId]);

        case 'POST':
            if ($playerId !== null) {
                header('Allow: GET, POST, OPTIONS');
                api_error(
                    'METHOD_NOT_ALLOWED',
                    'POST doit être utilisé sur /teams/{teamId}/players.',
                    405
                );
            }

            $body = request_json();

            api_response([
                'message' => 'Création du joueur simulée.',
                'teamId' => $teamId,
                'data' => $body
            ], 201);

        case 'PUT':
            if ($playerId === null) {
                api_error(
                    'MISSING_PLAYER_ID',
                    'Un identifiant joueur est nécessaire pour PUT.',
                    400
                );
            }

            if (!isset($players[$teamId][$playerId])) {
                api_error(
                    'PLAYER_NOT_FOUND',
                    'Joueur introuvable dans cette équipe.',
                    404
                );
            }

            $body = request_json();

            api_response([
                'message' => 'Modification du joueur simulée.',
                'data' => array_merge(
                    $players[$teamId][$playerId],
                    $body
                )
            ]);

        case 'DELETE':
            if ($playerId === null) {
                api_error(
                    'MISSING_PLAYER_ID',
                    'Un identifiant joueur est nécessaire pour DELETE.',
                    400
                );
            }

            if (!isset($players[$teamId][$playerId])) {
                api_error(
                    'PLAYER_NOT_FOUND',
                    'Joueur introuvable dans cette équipe.',
                    404
                );
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
