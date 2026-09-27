<?php

declare(strict_types=1);

require_once __DIR__ . '/data.php';

function handle(string $method, array $params): void
{

    switch ($method) {
        case 'GET':

            $data = news_data();
            if (count($params) === 0) {
                // TODO getAll method in database.
                api_response(array_values($data));
            } else {

                $newId = filter_var($params[0], FILTER_VALIDATE_INT);
                if ($newId === false) {
                    api_error(
                        'INVALID_TEAM_ID',
                        'L identifiant de l New est invalide.',
                        400
                    );
                }

                foreach ($data['news'] as $new) {

                    if ($new['id'] === $newId) {
                        api_response($new);
                    }
                }
                $new = array_find(
                    $data['news'],
                    fn(array $item): bool => $item['id'] === $newId
                );
                if ($new !== null) {
                    api_response($new);
                }

                api_error('TEAM_NOT_FOUND', 'New introuvable.', 404);
            }

        case 'POST':
            $newId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($newId !== null) {
                header('Allow: GET, POST, OPTIONS');
                api_error(
                    'METHOD_NOT_ALLOWED',
                    'POST doit être utilisé sur /news.',
                    405
                );
            }

            $body = request_json();

            api_response([
                'message' => 'Création simulée.',
                'data' => $body
            ], 201);

        case 'PUT':
            $newId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($newId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant New est nécessaire pour PUT.',
                    400
                );
            }

            if (!isset($news[$newId])) {
                api_error('TEAM_NOT_FOUND', 'New introuvable.', 404);
            }

            $body = request_json();

            api_response([
                'message' => 'Modification simulée.',
                'data' => array_merge($news[$newId], $body)
            ]);

        case 'DELETE':

            $newId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($newId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant New est nécessaire pour DELETE.',
                    400
                );
            }

            if (!isset($news[$newId])) {
                api_error('TEAM_NOT_FOUND', 'New introuvable.', 404);
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
