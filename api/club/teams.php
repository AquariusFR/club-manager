<?php

declare(strict_types=1);

require_once __DIR__ . '/data.php';

function handle(string $method, array $params): void
{

    switch ($method) {
        case 'GET':

            $data = teams_data();
            if (count($params) === 0) {
                api_response($data);
            } else {

                $teamId = filter_var($params[0], FILTER_VALIDATE_INT);
                if ($teamId === false) {
                    api_error(
                        'INVALID_TEAM_ID',
                        'L identifiant de l équipe est invalide.',
                        400
                    );
                }

                foreach ($data as $group) {

                    foreach ($group['teams'] as $team) {

                        if ($team['id'] === $teamId) {
                            api_response($team);
                        }
                    }
                }

                api_error('TEAM_NOT_FOUND', 'Équipe introuvable.', 404);
            }

        case 'POST':
            $teamId = filter_var($params[0], FILTER_VALIDATE_INT);
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
            $teamId = filter_var($params[0], FILTER_VALIDATE_INT);
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

            $teamId = filter_var($params[0], FILTER_VALIDATE_INT);
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
