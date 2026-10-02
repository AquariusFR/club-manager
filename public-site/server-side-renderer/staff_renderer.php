<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/public/data.php';
require_once __DIR__ . '/_template-tools.php';

function render(): string
{
    $html = findTemplate('staff');

    $staffData = staff_data();

    // build html for the following sections : school-teams, preformation-teams, senior-teams
    $html = replaceElementContents($html, 'staff-list', renderStaff($staffData));

    return $html;
}

function renderStaff(array $data): string
{
    if (count($data) === 0) {
        return '<p class="text-center">Aucun éducateur disponible pour le moment.</p>';
    }


    $html = '';
    foreach ($data as $person) {
        $html .= createStaffCard($person);
    }
    return $html;
}

function createStaffCard(mixed $person): string
{
    $initials = getInitials($person->firstName ?? '', $person->lastName ?? '');
    $label = formatPersonName($person);
    $role = $person->role ?? 'Éducateur';
    $pills = pills($person->teams ?? [] );

    $string = <<<EOT

<article class="person-card">
    <div class="person-card__avatar" aria-hidden="true">{$initials}</div>
    <div class="person-card__content">
        <h2>{$label}</h2>
        <p class="person-card__role">{$role}</p>
        <div class="person-card__teams">
            {$pills}
        </div>
    </div>
</article>

EOT;
    return $string;
}


function getInitials(string $firstName = "", string $lastName = "")
{
    $first = substr(trim($firstName), 0, 1);
    $last = substr(trim($lastName), 0, 1);

    return strtoupper($first . $last);
}


function formatTeamLabel(stdClass $team)
{
    $category = $team->category ?? "Équipe";

    return $team->teamNumber ? $category . " Équipe " . $team->teamNumber : $category;
}

function formatPersonName(stdClass $person)
{
    return $person->firstName . " " . $person->lastName;
}

function pills(array $teams): string
{
    $html = '';
    foreach ($teams as $team) {
        $label = formatTeamLabel($team);
        $html .= '<a class="meta-pill" href="./equipe.html?id=' . $team->id . '">' . htmlspecialchars($label, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . '</a>';
    }
    return $html;
}

function newsFormatDate(string $value): string
{
    $date = newsParseDate($value);
    if ($date === null) {
        return $value;
    }

    $months = [
        1 => 'janvier',
        2 => 'février',
        3 => 'mars',
        4 => 'avril',
        5 => 'mai',
        6 => 'juin',
        7 => 'juillet',
        8 => 'août',
        9 => 'septembre',
        10 => 'octobre',
        11 => 'novembre',
        12 => 'décembre',
    ];

    return $date->format('j') . ' ' . $months[(int)$date->format('n')] . ' ' . $date->format('Y');
}

function newsToIsoDate(string $value): string
{
    $date = newsParseDate($value);
    if ($date === null) {
        return '';
    }

    return $date->setTimezone(new DateTimeZone('UTC'))->format('Y-m-d');
}

function newsParseDate(string $value): ?DateTimeImmutable
{
    if ($value === '') {
        return null;
    }

    if (preg_match('/^\d{2}-\d{2}-\d{4}$/', $value) === 1) {
        $date = DateTimeImmutable::createFromFormat('!d-m-Y', $value);
        $errors = DateTimeImmutable::getLastErrors();

        if ($date === false || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
            return null;
        }

        return $date->format('d-m-Y') === $value ? $date : null;
    }

    if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value) === 1) {
        $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
        $errors = DateTimeImmutable::getLastErrors();

        if ($date === false || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
            return null;
        }

        return $date->format('Y-m-d') === $value ? $date : null;
    }

    try {
        return new DateTimeImmutable($value);
    } catch (Exception) {
        return null;
    }
}
