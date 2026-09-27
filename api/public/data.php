<?php

declare(strict_types=1);

function teams_data(): array
{
    return [

        'school' => [
            'label' => 'École de football',
            'teams' => [

                [
                    'id' => 42,
                    'category' => 'U9',
                    'teamNumber' => 1,
                    'label' => 'U9 Équipe 1',
                    'season' => '2026-2027',
                    'competition' => 'D2',
                    'coach' => 'Léo Larousse',
                    'playersCount' => 12
                ],

                [
                    'id' => 43,
                    'category' => 'U9',
                    'teamNumber' => 2,
                    'label' => 'U9 Équipe 2',
                    'season' => '2026-2027',
                    'competition' => 'D3',
                    'coach' => 'Moïse Béliveau',
                    'playersCount' => 12
                ],

                [
                    'id' => 44,
                    'category' => 'U10',
                    'teamNumber' => 1,
                    'label' => 'U10 Équipe 1',
                    'season' => '2026-2027',
                    'competition' => 'D3',
                    'coach' => 'Silvain Deschanel',
                    'playersCount' => 12
                ],

                [
                    'id' => 45,
                    'category' => 'U10',
                    'teamNumber' => 2,
                    'label' => 'U10 Équipe 2',
                    'season' => '2026-2027',
                    'competition' => 'D3',
                    'coach' => 'Jonathan Souchon',
                    'playersCount' => 18
                ]

            ]
        ],

        'preformation' => [
            'label' => 'Préformation',
            'teams' => [

                [
                    'id' => 46,
                    'category' => 'U11',
                    'teamNumber' => 1,
                    'label' => 'U11 Équipe 1',
                    'season' => '2026-2027',
                    'competition' => 'D2',
                    'coach' => 'Jean Dupont',
                    'playersCount' => 14
                ],

                [
                    'id' => 47,
                    'category' => 'U11',
                    'teamNumber' => 2,
                    'label' => 'U11 Équipe 2',
                    'season' => '2026-2027',
                    'competition' => 'D3',
                    'coach' => 'Pierre Martin',
                    'playersCount' => 16
                ],

                [
                    'id' => 48,
                    'category' => 'U13',
                    'teamNumber' => 1,
                    'label' => 'U13 Équipe 1',
                    'season' => '2026-2027',
                    'competition' => 'D2',
                    'coach' => 'Killian LaRue',
                    'playersCount' => 14
                ],

                [
                    'id' => 49,
                    'category' => 'U13',
                    'teamNumber' => 2,
                    'label' => 'U13 Équipe 2',
                    'season' => '2026-2027',
                    'competition' => 'D3',
                    'coach' => 'Amadou Portier',
                    'playersCount' => 16
                ],

                [
                    'id' => 50,
                    'category' => 'U15',
                    'teamNumber' => 1,
                    'label' => 'U15 Équipe 1',
                    'season' => '2026-2027',
                    'competition' => 'D2',
                    'coach' => 'Roméo Édouard',
                    'playersCount' => 14
                ],

                [
                    'id' => 51,
                    'category' => 'U15',
                    'teamNumber' => 2,
                    'label' => 'U15 Équipe 2',
                    'season' => '2026-2027',
                    'competition' => 'D3',
                    'coach' => 'Louis Bousquet',
                    'playersCount' => 16
                ]

            ]
        ],

        'senior' => [
            'label' => 'Seniors',
            'teams' => [

                [
                    'id' => 52,
                    'category' => 'U18',
                    'teamNumber' => 1,
                    'label' => 'U18 Équipe 1',
                    'season' => '2026-2027',
                    'competition' => 'D2',
                    'coach' => 'Fabrice Lestrange',
                    'playersCount' => 20
                ],

                [
                    'id' => 53,
                    'category' => 'Seniors',
                    'teamNumber' => 1,
                    'label' => 'Seniors',
                    'season' => '2026-2027',
                    'competition' => 'D2',
                    'coach' => 'Matthieu Bouleau',
                    'playersCount' => 25
                ],

                [
                    'id' => 54,
                    'category' => 'Veterans',
                    'teamNumber' => 1,
                    'label' => 'Veterans Équipe 1',
                    'season' => '2026-2027',
                    'competition' => 'D1',
                    'coach' => 'Pierre Martin',
                    'playersCount' => 25
                ],

                [
                    'id' => 55,
                    'category' => 'Veterans',
                    'teamNumber' => 2,
                    'label' => 'Veterans Équipe 2',
                    'season' => '2026-2027',
                    'competition' => 'D3',
                    'coach' => 'Pierre Martin',
                    'playersCount' => 27
                ],

                [
                    'id' => 56,
                    'category' => 'Seniors',
                    'teamNumber' => 1,
                    'label' => 'Seniors Féminines',
                    'season' => '2026-2027',
                    'competition' => 'R1',
                    'coach' => 'Claire Bardin',
                    'playersCount' => 16
                ]

            ]
        ]

    ];
}

function players_data(): array
{
    return [
        12 => [
            12345678 => [
                'id' => 12345678,
                'firstName' => 'Lucas',
                'lastName' => 'Durand',
                'number' => 7
            ],
            87654321 => [
                'id' => 87654321,
                'firstName' => 'Hugo',
                'lastName' => 'Martin',
                'number' => 10
            ]
        ],
        13 => [
            11223344 => [
                'id' => 11223344,
                'firstName' => 'Tom',
                'lastName' => 'Bernard',
                'number' => 9
            ]
        ]
    ];
}


function news_data(): array
{
    return [
        1 => [
            'id' => 1,
            'main' => true,
            'category' => 'le club',
            'title' => 'Lancement du développement du site',
            'photo' => '/assets/images/news/kickoff.jpg',
            'date' => '19-06-2026'
        ],
        2 => [
            'id' => 2,
            'main' => false,
            'category' => 'le club',
            'title' => 'Example title 1',
            'photo' => '/assets/images/news/photo1.jfif',
            'date' => '24-12-2026'
        ],
        3 => [
            'id' => 3,
            'main' => false,
            'category' => 'le club',
            'title' => 'Example title 2',
            'photo' => '/assets/images/news/photo2.jfif',
            'date' => '24-12-2026'
        ],
        4 => [
            'id' => 4,
            'main' => false,
            'category' => 'le club',
            'title' => 'Example title 3',
            'photo' => '/assets/images/news/photo3.jfif',
            'date' => '24-12-2026'
        ],
        5 => [
            'id' => 5,
            'main' => false,
            'category' => 'le club',
            'title' => 'Example title 4',
            'photo' => '/assets/images/news/photo1.jfif',
            'date' => '24-12-2026'
        ],
        6 => [
            'id' => 6,
            'main' => false,
            'category' => 'le club',
            'title' => 'Example title 5',
            'photo' => '/assets/images/news/photo2.jfif',
            'date' => '24-12-2026'
        ],
        7 => [
            'id' => 7,
            'main' => false,
            'category' => 'le club',
            'title' => 'Example title 6',
            'photo' => '/assets/images/news/photo3.jfif',
            'date' => '24-12-2026'
        ]
    ];
}
