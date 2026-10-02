<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/public/data.php';
require_once __DIR__ . '/_template-tools.php';

function render(): string
{
    $html = findTemplate('teams');

    $teamsData = teams_data();


    // build html for the following sections : school-teams, preformation-teams, senior-teams
    $html = replaceElementContents($html, 'school-teams', renderTeamsSection($teamsData['school']['teams']));
    $html = replaceElementContents($html, 'preformation-teams', renderTeamsSection($teamsData['preformation']['teams']));
    $html = replaceElementContents($html, 'senior-teams', renderTeamsSection($teamsData['senior']['teams']));
    return $html;
}

function renderTeamsSection(array $data): string
{
    if (count($data) === 0) {
        return '<p class="text-center">Aucune équipe disponible pour le moment.</p>';
    }


    $html = '';
    foreach ($data as $team) {
        $html .= createTeamCard($team);
    }
    return $html;
}

function createTeamCard(array $team): string
{
    $id = $team['id'] ?? '';
    $category = $team['category'] ?? 'Equipe';
    $teamNumber = $team['teamNumber'] ?? 'Equipe';
    $coach = $team['coach'] ?? 'À venir';
    $playersCount = $team['playersCount'] ?? 0;
    $competition = $team['competition'] ?? 'À venir';
    $season = $team['season'] ?? 'À venir';

    $string = <<<EOT

<a class="team-card" href="./equipe.html?id={$id}">
    <div class="team-card__category">{$category}</div>
    <div class="team-card__content">
        <p class="team-card__subtitle">Équipe {$teamNumber}</p>
        <dl class="team-card__details">
            <div>
                <dt>Éducateur</dt>
                <dd>{$coach}</dd>
            </div>
            <div>
                <dt>Effectif</dt>
                <dd>{$playersCount}</dd>
            </div>
        </dl>
    </div>
    <ul class="team-card__meta">
        <li class="meta-pill--competition">{$category}</li>
        <li class="meta-pill">{$competition}</li>
        <li class="meta-pill">{$season}</li>
    </ul>
    <div href="./equipe.html?id={$id}" class="team-card__link">
        Découvrir l'équipe<span class="team-card__arrow" aria-hidden="true">→</span>
    </div>
</a>

EOT;
        return $string;

}
