<?php

declare(strict_types=1);

require_once __DIR__ . '/data.php';
require_once __DIR__ . '/simpleResource.php';

function handle(string $method, array $params): void
{
    $data = events_data();
    handleRequest($method, $params, $data);
}
