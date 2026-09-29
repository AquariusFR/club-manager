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
    $mail = trim($mail);

    if (!filter_var($mail, FILTER_VALIDATE_EMAIL)) {
        return false;
    }

    if ($password === '') {
        return false;
    }

    $db = database();

    $stmt = $db->prepare(
        'SELECT password
         FROM authentication
         WHERE login = :login
         LIMIT 1'
    );

    $stmt->execute([
        'login' => $mail
    ]);

    $user = $stmt->fetch();

    if ($user === false) {
        return false;
    }

    return password_verify(
        $password,
        $user['password']
    );
}