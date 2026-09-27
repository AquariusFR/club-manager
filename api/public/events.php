<?php

declare(strict_types=1);

require_once __DIR__ . '/data.php';

function handle(string $method, array $params): void
{

    switch ($method) {
        case 'GET':

            $data = events_data();
            if (count($params) === 0) {
                // TODO getAll method in database.
                api_response(array_values($data));
            } else {

                $eventId = filter_var($params[0], FILTER_VALIDATE_INT);
                if ($eventId === false) {
                    api_error(
                        'INVALID_TEAM_ID',
                        'L identifiant de l event est invalide.',
                        400
                    );
                }

                foreach ($data['events'] as $event) {

                    if ($event['id'] === $eventId) {
                        api_response($event);
                    }
                }
                $event = array_find(
                    $data['events'],
                    fn(array $item): bool => $item['id'] === $eventId
                );
                if ($event !== null) {
                    api_response($event);
                }

                api_error('TEAM_NOT_FOUND', 'event introuvable.', 404);
            }

        case 'POST':
            $eventId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($eventId !== null) {
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
            $eventId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($eventId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant event est nécessaire pour PUT.',
                    400
                );
            }

            if (!isset($events[$eventId])) {
                api_error('TEAM_NOT_FOUND', 'event introuvable.', 404);
            }

            $body = request_json();

            api_response([
                'message' => 'Modification simulée.',
                'data' => array_merge($events[$eventId], $body)
            ]);

        case 'DELETE':

            $eventId = filter_var($params[0], FILTER_VALIDATE_INT);
            if ($eventId === null) {
                api_error(
                    'MISSING_TEAM_ID',
                    'Un identifiant event est nécessaire pour DELETE.',
                    400
                );
            }

            if (!isset($events[$eventId])) {
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
