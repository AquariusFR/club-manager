<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/lib/request.php';

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($method === 'OPTIONS') {
    api_response(null, 204);
}

$route = $_GET['route'] ?? '';

$segments = array_values(array_filter(
    explode('/', trim($route, '/')),
    static fn(string $segment): bool => $segment !== ''
));

if (count($segments) < 2) {
    api_error(
        'ROUTE_NOT_FOUND',
        'Route API invalide.',
        404
    );
}

$scope = $segments[0];
$resource = $segments[1];

if (
    !preg_match('/^[a-zA-Z0-9_-]+$/', $scope)
    || !preg_match('/^[a-zA-Z0-9_-]+$/', $resource)
) {
    api_error(
        'INVALID_ROUTE',
        'Route API invalide.',
        400
    );
}

/*
 * ----------------------------------------------------------
 * ROUTE SIMPLE
 * ----------------------------------------------------------
 *
 * /api/public/teams
 * /api/public/teams/13
 *
 * resource = teams
 * params   = [13]
 *
 *
 * ----------------------------------------------------------
 * ROUTE IMBRIQUEE
 * ----------------------------------------------------------
 *
 * /api/public/teams/13/players
 * /api/public/teams/13/players/12345678
 *
 * resource = players
 * params   = [13, 12345678]
 *
 * La ressource "players" est donc chargée depuis :
 *
 * /api/public/players.php
 *
 * Le premier paramètre reste l'identifiant de l'équipe.
 */

$params = array_slice($segments, 2);

/*
 * Si le troisième segment existe, il s'agit d'une ressource
 * enfant.
 *
 * Exemple :
 *
 * teams / 13 / players
 *             ^
 *             ressource réelle
 */
if (isset($segments[3])) {
    $nestedResource = $segments[3];

    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $nestedResource)) {
        api_error(
            'INVALID_ROUTE',
            'Route API invalide.',
            400
        );
    }

    /*
     * Le deuxième segment après la ressource parent est
     * l'identifiant parent.
     *
     * teams / 13 / players
     *         ^
     */
    $resource = $nestedResource;

    /*
     * On reconstruit les paramètres :
     *
     * /teams/13/players
     *
     * devient :
     *
     * [13]
     *
     * et
     *
     * /teams/13/players/12345678
     *
     * devient :
     *
     * [13, 12345678]
     */
    $params = [$segments[2]];

    if (isset($segments[4])) {
        $params[] = $segments[4];
    }

    /*
     * On refuse les routes trop profondes pour le moment.
     */
    if (isset($segments[5])) {
        api_error(
            'ROUTE_NOT_FOUND',
            'Route API trop profonde.',
            404
        );
    }
}

$resourceFile = __DIR__ . '/' . $scope . '/' . $resource . '.php';

if (!is_file($resourceFile)) {
    api_error(
        'RESOURCE_NOT_FOUND',
        sprintf(
            'La ressource "%s/%s" n’existe pas.',
            $scope,
            $resource
        ),
        404
    );
}

require $resourceFile;

if (!function_exists('handle')) {
    api_error(
        'RESOURCE_HANDLER_MISSING',
        'La ressource ne fournit pas de handler valide.',
        500
    );
}

handle($method, $params);