<?php

require_once __DIR__ . '/database.php';

/**
 * Vérifie l'existence d'un mail dans la table authentication.
 *
 * @return true si elle est déjà présente.
 *
 */
function isMailAlreadyExists(string $mail): bool
{
    $mail = trim($mail);
    $db = database();
    // Vérification que l'email n'existe pas déjà
    $stmt = $db->prepare(
        'SELECT EXISTS( SELECT id FROM authentication WHERE login = :login)'
    );

    $stmt->execute(['login' => trim($mail)]);

    return (int) $stmt->fetchColumn() === 1;
}

function createAccount(string $mail, string $password): bool
{
    $mail = trim($mail);

    // Validation du format de l'email
    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Adresse email invalide.');
    }

    if ($password === '') {
        throw new InvalidArgumentException('Le mot de passe est obligatoire.');
    }

    $db = database();

    // Vérification que l'email n'existe pas déjà
    $stmt = $db->prepare(
        'SELECT id FROM authentication WHERE login = :login LIMIT 1'
    );

    $stmt->execute([
        'login' => $mail
    ]);

    if ($stmt->fetch() !== false) {
        throw new RuntimeException('Cette adresse email existe déjà.');
    }

    // Hash sécurisé du mot de passe
    $passwordHash = password_hash(
        $password,
        PASSWORD_DEFAULT
    );

    if ($passwordHash === false) {
        throw new RuntimeException('Impossible de sécuriser le mot de passe.');
    }

    // Création du compte
    $stmt = $db->prepare(
        'INSERT INTO authentication
            (login, password, role)
         VALUES
            (:login, :password, :role)'
    );

    $stmt->execute([
        'login' => $mail,
        'password' => $passwordHash,
        'role' => 'USER'
    ]);

    return true;
}


/**
 * Vérifie les identifiants.
 *
 * @return bool true si le couple email / mot de passe est valide.
 */
function checkAuthentication(string $mail, string $password): bool
{
    return authenticateUser($mail, $password) !== null;
}

/**
 * Vérifie les identifiants et renvoie les informations non sensibles du compte.
 *
 * @return array{id: int, login: string, role: string}|null
 */
function authenticateUser(string $mail, string $password): ?array
{
    $mail = trim($mail);

    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        return null;
    }

    if ($password === '') {
        return null;
    }

    $db = database();

    $stmt = $db->prepare(
        'SELECT id, login, password, role
         FROM authentication
         WHERE login = :login
         LIMIT 1'
    );

    $stmt->execute([
        'login' => $mail
    ]);

    $user = $stmt->fetch();

    if ($user === false) {
        return null;
    }

    if (!password_verify(
        $password,
        $user['password']
    )) {
        return null;
    }

    return [
        'id' => (int) $user['id'],
        'login' => $user['login'],
        'role' => $user['role']
    ];
}