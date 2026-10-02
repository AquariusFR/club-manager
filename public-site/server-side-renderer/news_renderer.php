<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/public/data.php';
require_once __DIR__ . '/_template-tools.php';

function render(): string
{
    $html = findTemplate('news');

    $newsData = news_data();

    // build html for the following sections : school-teams, preformation-teams, senior-teams
    $html = replaceElementContents($html, 'articles-list', renderNews($newsData));
    
    return $html;
}

function renderNews(array $data): string
{
    if (count($data) === 0) {
        return '<p class="text-center">Aucune actualité disponible pour le moment.</p>';
    }


    $html = '';
    foreach ($data as $news) {
        $html .= createNewsCard($news);
    }
    return $html;
}

function createNewsCard(array $news): string
{
    $title = htmlspecialchars((string)($news['title'] ?? 'Sans titre'), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $date = (string)($news['date'] ?? '');
    $formattedDate = htmlspecialchars(newsFormatDate($date), ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
    $photo = $news['photo'] ?? '';
    $category = $news['category'] ?? '';
    $id = $news['id'] ?? '';

    $string = <<<EOT

<div class="col-span-6">
    <div
    class="group cursor-pointer relative d-flex flex-column text-content-primary opacity-0 animate-slide-in-fade-up"
    style="animation-delay: calc(0 * var(--duration-instant));">
    <div class="relative aspect-video overflow-hidden">
        <div class="relative h-100 w-100"><img alt="" loading="lazy" width="6822" height="4548"
            decoding="async" data-nimg="1"
            class="duration-300 ease-in duration-medium-1 ease-standard scale-100 transition-all group-hover:scale-105"
            sizes="(max-width: 719px) 50vw, 293px"
            style="color: transparent;"
            src="{$photo}"></div>
    </div>
    <div class="gap-sm pt-md d-flex flex-column">
        <div class="gap-xs d-flex h-5 items-center self-stretch">
        <h3 class="typography-overline-2 d-block text-content-secondary">{$category}</h3>
        </div>
        <a
        class="static before:absolute before:inset-0 before:cursor-pointer typography-body-4-semibold gap-sm d-flex items-center"
        href="./news/{$id}">
            <span class="[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">{$title}</span>
        </a>
        <time datetime="2026-09-14T12:25:48.657Z" class="typography-body-6 d-d-block text-content-secondary">{$formattedDate}</time>
    </div>
    </div>
</div>

EOT;
    return $string;

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