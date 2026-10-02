<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/public/data.php';
require_once __DIR__ . '/_template-tools.php';

function render(): string
{
    $html = findTemplate('volunteers');

    $volunteersData = volunteers_data();

    // build html for the following sections : school-teams, preformation-teams, senior-teams
    $html = replaceElementContents($html, 'volunteers-list', renderVolunteers($volunteersData));
    
    return $html;
}

function renderVolunteers(array $data): string
{
    if (count($data) === 0) {
        return '<p class="text-center">Aucun bénévole disponible pour le moment.</p>';
    }


    $html = '';
    foreach ($data as $volunteer) {
        $html .= createVolunteerCard($volunteer);
    }
    return $html;
}

function createVolunteerCard(mixed $person): string
{
    $initials = getInitials($person->firstName ?? '', $person->lastName ?? '');
    $label = formatPersonName($person);

    $string = <<<EOT

<article class="person-card">
    <div class="person-card__avatar" aria-hidden="true">$initials</div>
    <div class="person-card__content">
        <h2>$label</h2>
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

function formatPersonName(stdClass $person)
{
    return $person->firstName . " " . $person->lastName;
}