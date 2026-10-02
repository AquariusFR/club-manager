<?php

declare(strict_types=1);

require_once __DIR__ . '/../../api/public/data.php';
require_once __DIR__ . '/_template-tools.php';

function render(): string
{
    $html = findTemplate('home');
    $html = replaceElementContents($html, 'events-list', renderHomeEvents(events_data()));
    $html = replaceElementContents($html, 'news-list', renderHomeNews(news_data()));
    $html = replaceElementContents($html, 'partners-list', renderHomePartners(partners_data()));
    return $html;
}

function renderHomeEvents(array $events): string
{
    usort($events, static fn(array $first, array $second): int => homeTimestamp($first['date'] ?? '') <=> homeTimestamp($second['date'] ?? ''));

    if ($events === []) {
        return '<p class="text-muted">Aucun événement n’est disponible.</p>';
    }

    $html = '';
    foreach ($events as $event) {
        $html .= ($event['type'] ?? '') === 'event'
            ? renderHomeEvent($event)
            : renderHomeMatch($event);
    }

    return $html;
}

function renderHomeEvent(array $event): string
{
    $date = escapeHtml($event['date'] ?? '');
    $address = !empty($event['adress'])
        ? '<a class="typography-button-2 text-content-secondary md:typography-button-1 gap-xs duration-medium-1 hover:text-content-primary relative z-50 flex items-center transition-colors" aria-label="Résumé" href="' . escapeHtml($event['adress']) . '" style="color: antiquewhite;">' . escapeHtml($event['adress']) . '</a>'
        : '<div class="h-4" aria-hidden="true"></div>';
    $photoStyle = !empty($event['photoUrl'])
        ? ' style="background-image: url(' . escapeHtml($event['photoUrl']) . ');"'
        : '';

    return '<article class="calendar__event event min-w-0 shrink-0 grow-0 clip-corner duration-medium-1 bg-background-secondary relative flex w-[220px] flex-col overflow-hidden md:w-[293px] hover:bg-background-secondary-hover">'
        . '<div class="d-flex flex-column h-100 grow-1 absolute top-0 bottom-0 left-0 right-0"' . $photoStyle . '></div>'
        . '<div class="gap-lg d-flex h-100 w-100 flex-column relative p-lg lg:p-xl" style="background: linear-gradient(180deg, rgba(14, 27, 54, 0.4) 0%, rgba(14, 27, 54, 0) 100%), radial-gradient(121.6% 90.18% at 86.15% 0%, rgba(14, 27, 54, 0) 49.83%, rgba(14, 27, 54, 1) 100%);">'
        . '<div class="typography-overline-2 gap-sm flex items-center" style="z-index: 1;"><time datetime="' . $date . '" class="gap-xs flex"><span class="text-content-secondary" style="color: white">' . escapeHtml($event['shortDate'] ?? '') . '</span><span class="text-content-black" style="color: white">' . escapeHtml($event['shortHour'] ?? '') . '</span></time></div>'
        . '<div class="gap-lg d-flex flex-column h-100 grow-1 justify-between"><div class="gap-sm flex items-center flex-col"><div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none"><span style="color: white">' . escapeHtml($event['title'] ?? '') . '</span></div></div>' . $address . '</div>'
        . '</div></article>';
}

function renderHomeMatch(array $match): string
{
    $date = escapeHtml($match['date'] ?? '');
    $finished = !empty($match['date']) && empty($match['forfait']) && homeTimestamp($match['date']) < time()
        ? '<span class="mt-0.5 leading-none">Terminé</span>'
        : '';
    $forfeit = !empty($match['forfait'])
        ? '<div class="px-xs pt-0.75 pb-0.5 event-match__forfait-banner">forfait</div>'
        : '';
    $summary = !empty($match['summaryUrl'])
        ? '<a class="typography-button-2 text-content-secondary md:typography-button-1 gap-xs duration-medium-1 hover:text-content-primary relative z-50 flex items-center transition-colors" aria-label="Résumé" href="' . escapeHtml($match['summaryUrl']) . '">Résumé<svg class="inline h-4 w-4"><use href="./assets/icons/chevron-right.svg"></use></svg></a>'
        : '<div class="h-4" aria-hidden="true"></div>';

    return '<article class="calendar__event min-w-0 shrink-0 grow-0 clip-corner duration-medium-1 bg-background-secondary p-lg lg:p-xl relative flex w-[220px] flex-col overflow-hidden md:w-[293px] hover:bg-background-secondary-hover"><div class="gap-lg d-flex h-100 flex-column justify-between w-100">'
        . '<div class="typography-overline-2 gap-sm flex items-center"><div class="gap-sm flex items-center"><div class="gap-sm flex flex-none items-center"><span class="bg-background-tertiary px-xs pt-0.75 pb-0.5 uppercase">' . escapeHtml($match['category'] ?? '') . '</span>' . $finished . '<time datetime="' . $date . '" class="gap-xs flex"><span class="text-content-secondary">' . escapeHtml($match['shortDate'] ?? '') . '</span><span class="text-content-black">' . escapeHtml($match['shortHour'] ?? '') . '</span></time></div></div></div>'
        . '<div class="gap-lg d-flex flex-column"><div class="gap-md pointer-events-none flex flex-column relative"><div class="gap-sm flex items-center" style="z-index: 15;"><img alt="' . escapeHtml($match['homeTeam'] ?? '') . ' logo" loading="lazy" width="32" height="32" class="h-8 w-8 object-contain" src="' . escapeHtml($match['homeTeamLogo'] ?? '') . '"><div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none"><span>' . escapeHtml($match['homeTeam'] ?? '') . '</span><span class="text-content-secondary">' . escapeHtml($match['homeTeamScore'] ?? '') . '</span></div></div>'
        . '<div class="gap-sm flex items-center" style="z-index: 15;"><img alt="' . escapeHtml($match['awayTeam'] ?? '') . ' logo" loading="lazy" width="32" height="32" class="h-8 w-8 object-contain" src="' . escapeHtml($match['awayTeamLogo'] ?? '') . '"><div class="typography-title-4 gap-sm top-0-5 relative flex h-8 items-center leading-none"><span>' . escapeHtml($match['awayTeam'] ?? '') . '</span><span class="text-content-secondary">' . escapeHtml($match['awayTeamScore'] ?? '') . '</span></div></div>'
        . '<div class="typography-overline-2 bg-background-tertiary px-xs pt-0.75 pb-0.5 event-match_competition" style="box-shadow: var(--shadow-md);">' . escapeHtml($match['competition'] ?? '') . '</div>' . $forfeit . '</div>' . $summary . '</div></div></article>';
}

function renderHomeNews(array $articles): string
{
    usort($articles, static fn(array $first, array $second): int => homeTimestamp($second['date'] ?? '') <=> homeTimestamp($first['date'] ?? ''));
    if ($articles === []) {
        return '<p class="text-muted">Aucune actualité n’est disponible.</p>';
    }

    $main = null;
    foreach ($articles as $article) {
        if (!empty($article['main'])) {
            $main = $article;
            break;
        }
    }
    $main ??= $articles[0];
    $others = array_filter($articles, static fn(array $article): bool => $article['id'] !== $main['id']);

    return '<div class="mt-2xl md:mt-10"><div class="gap-y-2xl md:gap-x-2xl d-grid grid-cols-12"><div class="col-span-12 md:col-span-6"><div class="top-0 md:sticky"><div class="group relative cursor-pointer"><div class="relative opacity-0 animate-fade-in">'
        . renderHomeMainArticle($main)
        . '</div></div></div></div><div class="col-span-12 md:col-span-6"><div class="gap-x-md gap-y-2xl md:gap-2xl d-grid grid-cols-12">'
        . implode('', array_map('renderHomeOtherArticle', $others))
        . '</div></div></div></div>';
}

function renderHomeMainArticle(array $article): string
{
    return '<div class="relative h-100 w-100 overflow-hidden object-cover"><div class="aspect-square h-100 w-100 animate-image-scale-in"><img alt="" loading="lazy" width="2000" height="1334" class="aspect-square duration-medium-1 scale-100 transition-all group-hover:scale-105" style="color:transparent; object-fit:cover;" src="' . escapeHtml($article['photo'] ?? '') . '"></div></div>'
        . '<div class="absolute inset-0 h-100 w-100" style="background:var(--Gradient-G2, linear-gradient(0deg, rgb(20, 20, 40) 0%, rgba(20, 20, 40, 0) 75%))"></div><div class="p-lg md:p-2xl absolute inset-0 d-flex w-100 flex-column items-start justify-end"><span class="typography-overline-2 text-dark-content-secondary mb-sm">' . escapeHtml($article['category'] ?? '') . '</span><a class="static before:absolute before:inset-0 before:cursor-pointer mb-sm flex-column items-center overflow-hidden" href="./news/' . rawurlencode((string)($article['id'] ?? '')) . '"><h3 class="typography-title-3 text-content-primary-inverse opacity-0 animate-reveal-text-vertical">' . escapeHtml($article['title'] ?? '') . '</h3></a><time class="typography-body-6 text-dark-content-secondary mb-xl d-block">' . escapeHtml($article['date'] ?? '') . '</time></div>';
}

function renderHomeOtherArticle(array $article): string
{
    return '<div class="col-span-6"><div class="group cursor-pointer relative d-flex flex-column text-content-primary opacity-0 animate-slide-in-fade-up"><div class="relative aspect-video overflow-hidden"><img alt="" loading="lazy" width="6822" height="4548" class="transition-all group-hover:scale-105" src="' . escapeHtml($article['photo'] ?? '') . '"></div><div class="gap-sm pt-md d-flex flex-column"><div class="gap-xs d-flex h-5 items-center self-stretch"><h3 class="typography-overline-2 d-block text-content-secondary">' . escapeHtml($article['category'] ?? '') . '</h3></div><a class="static before:absolute before:inset-0 before:cursor-pointer typography-body-4-semibold gap-sm d-flex items-center" href="./news/' . rawurlencode((string)($article['id'] ?? '')) . '"><span class="[display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">' . escapeHtml($article['title'] ?? '') . '</span></a><time class="typography-body-6 d-d-block text-content-secondary">' . escapeHtml($article['date'] ?? '') . '</time></div></div></div>';
}

function renderHomePartners(array $partners): string
{
    if ($partners === []) {
        return '<p class="text-muted">Aucun partenaire n’est disponible.</p>';
    }

    $html = '';
    foreach ($partners as $partner) {
        $link = $partner['link'] ?? '#';
        $html .= '<div class="relative flex items-center flex-column gap-1"><a class="flex h-100 items-center transition-transform duration-300 ease-in-out hover:scale-110 md:hover:scale-110" aria-label="' . escapeHtml($partner['name'] ?? '') . '" target="_blank" href="' . escapeHtml($link) . '" rel="noopener noreferrer"><img alt="' . escapeHtml($partner['name'] ?? '') . '" title="' . escapeHtml($partner['desc'] ?? '') . '" loading="lazy" decoding="async" class="transition-opacity duration-300 ease-in object-contain" src="' . escapeHtml($partner['logo'] ?? '') . '" style="color:transparent; width:auto; height:90px; max-width:175px;"></a><h3 class="typography-overline-2 d-block text-content-secondary" style="width:175px; margin:0; text-align:center;">' . escapeHtml($partner['desc'] ?? '') . '</h3></div>';
    }

    return $html;
}

function escapeHtml(mixed $value): string
{
    return htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function homeTimestamp(string $value): int
{
    $date = DateTimeImmutable::createFromFormat('!d-m-Y', $value);
    if ($date !== false) {
        return $date->getTimestamp();
    }

    $timestamp = strtotime($value);
    return $timestamp === false ? 0 : $timestamp;
}