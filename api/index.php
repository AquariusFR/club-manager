<?php

declare(strict_types=1);

require_once __DIR__ . '/lib/response.php';
require_once __DIR__ . '/lib/request.php';
require_once __DIR__ . '/lib/cache.php';
require_once __DIR__ . '/checkAuthentication.php';

$securedScope = ['club'];

$method = strtoupper($_SERVER['REQUEST_METHOD'] ?? 'GET');

if ($method === 'OPTIONS') {
    api_response(null, 204);
}

/*
|--------------------------------------------------------------------------
| Récupération de la route
|--------------------------------------------------------------------------
|
| Exemple :
| /api/public/teams/13/players/123
|
| .htaccess transmet :
|
| route=public/teams/13/players/123
|
*/

$route = $_GET['route'] ?? '';

$segments = array_values(
    array_filter(
        explode('/', trim($route, '/')),
        static fn(string $segment): bool => $segment !== ''
    )
);

if (count($segments) < 2) {
    api_error(
        'ROUTE_NOT_FOUND',
        'Route API invalide.',
        404
    );
}

/*
|--------------------------------------------------------------------------
| Scope
|--------------------------------------------------------------------------
|
| Exemple :
|
| public/teams/13
| ^------
| scope = public
|
*/

$scope = $segments[0];

if (!preg_match('/^[a-zA-Z0-9_-]+$/', $scope)) {
    api_error(
        'INVALID_SCOPE',
        'Scope API invalide.',
        400
    );
}

/*
|--------------------------------------------------------------------------
| Check Authentication if route is secured
|--------------------------------------------------------------------------
*/
if (in_array($scope, $securedScope)) {
    checkAuthentication();
}

/*
|--------------------------------------------------------------------------
| Partie REST
|--------------------------------------------------------------------------
|
| On travaille sur :
|
| teams
| teams/13
| teams/13/players
| teams/13/players/123
| teams/13/players/123/photos
| teams/13/players/123/photos/42
|
*/

$path = array_slice($segments, 1);

foreach ($path as $segment) {
    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $segment)) {
        api_error(
            'INVALID_ROUTE',
            'Route API invalide.',
            400
        );
    }
}

/*
|--------------------------------------------------------------------------
| Recherche de la ressource
|--------------------------------------------------------------------------
|
| Convention REST :
|
| resource / id / resource / id / resource / id
|
| Exemple :
|
| teams / 13 / players / 123 / photos / 42
| ^^^^^       ^^^^^^^       ^^^^^^
| resource    resource      resource
|
| On cherche la ressource la plus profonde qui possède
| réellement un fichier PHP.
|
*/

$resourceIndex = null;
$resourceFile = null;

for ($i = 0; $i < count($path); $i += 2) {

    $candidateResource = $path[$i];

    $candidateFile = __DIR__
        . '/'
        . $scope
        . '/'
        . $candidateResource
        . '.php';

    if (is_file($candidateFile)) {
        $resourceIndex = $i;
        $resourceFile = $candidateFile;
    }
}

/*
|--------------------------------------------------------------------------
| Aucune ressource trouvée
|--------------------------------------------------------------------------
*/

if ($resourceIndex === null || $resourceFile === null) {
    api_error(
        'RESOURCE_NOT_FOUND',
        sprintf(
            '1-La ressource "%s" n\'existe pas.',
            $path[0] ?? ''
        ),
        404
    );
}

/*
|--------------------------------------------------------------------------
| Vérification de la structure de la route
|--------------------------------------------------------------------------
|
| Si nous avons :
|
| teams/13/unknown/123
|
| "unknown" est censé être une nouvelle ressource.
| Si son fichier PHP n'existe pas, on ne doit surtout pas
| laisser teams.php traiter silencieusement la requête.
|
*/

$nextResourceIndex = $resourceIndex + 2;

if ($nextResourceIndex < count($path)) {

    $expectedResource = $path[$nextResourceIndex];

    $expectedFile = __DIR__
        . '/'
        . $scope
        . '/'
        . $expectedResource
        . '.php';

    if (!is_file($expectedFile)) {
        api_error(
            'RESOURCE_NOT_FOUND',
            sprintf(
                '2-La ressource "%s/%s" n\'existe pas.',
                $scope,
                $expectedResource
            ),
            404
        );
    }
}

/*
|--------------------------------------------------------------------------
| Paramètres
|--------------------------------------------------------------------------
|
| Les éléments situés aux positions impaires sont les IDs.
|
| teams/13
|        ^^
|
| teams/13/players/123
|        ^^         ^^^
|
| teams/13/players/123/photos/42
|        ^^         ^^^          ^^
|
*/

$params = [];

for ($i = 1; $i < count($path); $i += 2) {
    $params[] = $path[$i];
}

/*
|--------------------------------------------------------------------------
| Chargement de la ressource
|--------------------------------------------------------------------------
*/

require $resourceFile;

/*
|--------------------------------------------------------------------------
| Vérification du handler
|--------------------------------------------------------------------------
*/

if (!function_exists('handle')) {
    api_error(
        'RESOURCE_HANDLER_MISSING',
        'La ressource ne fournit pas de handler valide.',
        500
    );
}

/*
|--------------------------------------------------------------------------
| Exécution
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Check Cache
|--------------------------------------------------------------------------
*/

$cached = cache_get($route, 300);

if ($cached !== null) {
    http_response_code(201);
    header('Content-Type: application/json; charset=utf-8');
    echo $cached;
    exit;
}

handle($method, $params, $route);
