<?php

declare(strict_types=1);

function findTemplate(string $page): ?string
{
    $source = __DIR__ . '/../components/' . $page . '.html';

    if (!file_exists($source)) {
        http_response_code(404);
        exit('Page non trouvée >' . $page . '>' . $source);
    }

    $html = file_get_contents($source);
    if ($html === false) {
        http_response_code(500);
        exit('Impossible de charger la page.');
    }
    return $html;
}

function replaceElementContents(string $html, string $id, string $content): string
{
    $idPattern = preg_quote($id, '~');

    if (!preg_match('~<([a-z][a-z0-9:-]*)\b[^>]*\bid=["\']' . $idPattern . '["\'][^>]*>~i', $html, $opening, PREG_OFFSET_CAPTURE)) {
        return $html;
    }

    $tag = $opening[1][0];
    $openingStart = (int)$opening[0][1];
    $openingEnd = $openingStart + strlen($opening[0][0]);
    $tagPattern = '~</?' . preg_quote($tag, '~') . '\b[^>]*>~i';
    preg_match_all($tagPattern, $html, $tags, PREG_OFFSET_CAPTURE, $openingEnd);

    $depth = 1;
    foreach ($tags[0] as [$tagMarkup, $tagOffset]) {
        if (str_starts_with($tagMarkup, '</')) {
            $depth--;
        } else {
            $depth++;
        }

        if ($depth === 0) {
            if ($id === 'events-list') {
                $openingTag = substr($html, $openingStart, strlen($opening[0][0]));
                $updatedOpeningTag = preg_replace('/\bclass="skeleton /', 'class="', $openingTag, 1);
                $html = substr_replace(
                    $html,
                    $updatedOpeningTag,
                    $openingStart,
                    strlen($opening[0][0])
                );
                $offsetChange = strlen($updatedOpeningTag) - strlen($opening[0][0]);
                $tagOffset += $offsetChange;
                $openingEnd += $offsetChange;
            }

            return substr_replace($html, $content, $openingEnd, $tagOffset - $openingEnd);
        }
    }

    return $html;
}
