# RCBA API PHP

API REST PHP sans Composer et sans base de données.

## Installation

Copier le contenu de ce dossier dans `/public/api/`.

Structure :

/public/api/
- .htaccess
- index.php
- lib/request.php
- lib/response.php
- public/data.php
- public/teams.php
- public/players.php

## Routage

Le `.htaccess` envoie toutes les routes vers `index.php`.

Le routeur déduit automatiquement :

`/api/{scope}/{resource}/...`

Exemples :

`GET /api/public/teams/13`
-> `/api/public/teams.php`

`GET /api/public/teams/12/players/12345678`
-> `/api/public/players.php`

Le routeur transmet les paramètres à `handle($method, $params)`.

## Ajouter une ressource

Créer simplement `/api/public/staff.php`.

Sans modifier `index.php`, les routes deviennent :

GET    /api/public/staff
GET    /api/public/staff/12
POST   /api/public/staff
PUT    /api/public/staff/12
DELETE /api/public/staff/12

Pour une autre zone, créer `/api/club/staff.php` :

/api/club/staff
/api/club/staff/12

## Important

POST, PUT et DELETE sont simulés dans cette première version.
Les données sont recréées à chaque requête depuis `public/data.php`.

Lorsque PostgreSQL sera ajouté, la couche de données pourra être remplacée
sans changer le mécanisme de routage.
