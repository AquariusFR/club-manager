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

function events_data(): array
{
    return [
        [
            'type' => 'match',
            'category' => 'senior',
            'date' => '2026-09-13T15:20:45.000Z',
            'shortDate' => 'DIM 13 SEPT',
            'shortHour' => '15:20',
            'competition' => 'amical',
            'homeTeam' => 'RCBA',
            'awayTeam' => 'Gambais',
            'homeTeamLogo' => './assets/images/rcba.svg',
            'awayTeamLogo' => './assets/images/other-teams/as-gambais.jpg',
            'homeTeamScore' => 2,
            'awayTeamScore' => 1,
            'summaryUrl' => './match/senior/rcba-vs-as-gambais-2026-09-13',
            'forfait' => false
        ],
        [
            'type' => 'match',
            'category' => 'senior',
            'date' => '2026-09-20T15:20:45.000Z',
            'shortDate' => 'DIM 20 SEPT',
            'shortHour' => '15:20',
            'competition' => 'coupe d\'eure-et-loir',
            'homeTeam' => 'RCBA',
            'awayTeam' => 'Angervile',
            'homeTeamLogo' => './assets/images/rcba.svg',
            'awayTeamLogo' => './assets/images/other-teams/angerville.jpg',
            'homeTeamScore' => 3,
            'awayTeamScore' => 0,
            'forfait' => true
        ],
        [
            'type' => 'match',
            'category' => 'senior',
            'date' => '2026-09-27T20:45:45.000Z',
            'shortDate' => 'DIM 27 SEPT',
            'shortHour' => '20:45',
            'competition' => 'J2 District 3',
            'homeTeam' => 'RCBA',
            'awayTeam' => 'Chateauneuf',
            'homeTeamLogo' => './assets/images/rcba.svg',
            'awayTeamLogo' => './assets/images/other-teams/as-chateauneuf.jpg',
            'homeTeamScore' => '',
            'awayTeamScore' => '',
            'forfait' => false
        ],
        [
            'type' => 'match',
            'category' => 'U15',
            'date' => '2026-09-26T15:00:00.000Z',
            'shortDate' => 'DIM 26 SEPT',
            'shortHour' => '15:00',
            'competition' => 'J1 D3',
            'homeTeam' => 'RCBA',
            'awayTeam' => 'Senonches',
            'homeTeamLogo' => './assets/images/rcba.svg',
            'awayTeamLogo' => './assets/images/other-teams/fc-senonches.jpg',
            'homeTeamScore' => '',
            'awayTeamScore' => '',
            'forfait' => false
        ],
        [
            'type' => 'event',
            'date' => '2026-09-13T15:20:45.000Z',
            'shortDate' => 'DIM 09 SEPT',
            'shortHour' => '20:00',
            'title' => 'Tombola',
            'adress' => '1, Rue de la Paix, 78000 Versailles',
            'eventUrl' => './match/senior/rcba-vs-as-chateauneuf-2026-09-13',
            'photoUrl' => './assets/images/events/tombola-thumb.png'
        ]
    ];
}


function partners_data(): array
{
    $json = '
[
  {
    "name": "Garage AURIAU",
    "tag": "Mécanique & Carrosserie",
    "desc": "Atelier mécanique multimarque et dépannage au service des automobilistes.",
    "logo": "./assets/images/partners/garage-auriau.png"
  },
  {
    "name": "Les 3S Sports & Pub",
    "tag": "Équipementier Officiel",
    "desc": "Spécialiste de l\'équipement sportif, textile technique et marquage officiel.",
    "logo": "./assets/images/partners/les-3s-sport.png"
  },
  {
    "name": "Fillon Technologies",
    "tag": "Industrie & Innovation",
    "desc": "Leader mondial des équipements de préparation de peinture, ancré sur notre territoire.",
    "logo": "./assets/images/partners/fillon-technologies.png"
  },
  {
    "name": "Crédit Agricole",
    "tag": "Banque & Assurances",
    "desc": "Partenaire historique du football amateur et du Label Jeunes FFF.",
    "logo": "./assets/images/partners/credit-agricole.png"
  },
  {
    "name": "Garage CMA - Renault",
    "tag": "Automobile & Concession",
    "desc": "Votre agent Renault de proximité pour la vente, l\'entretien et la réparation.",
    "logo": "./assets/images/partners/groupe-cma-renault.png"
  },
  {
    "name": "O\'Plateau",
    "tag": "Restauration & Convivialité",
    "desc": "Bar-restaurant et lieu de rassemblement convivial au cœur de notre commune.",
    "logo": "./assets/images/partners/o-plateau.png"
  },
  {
    "name": "Générale d\'Optique",
    "tag": "Santé & Vision",
    "desc": "Opticien conseil à Dreux, partenaire de la santé visuelle de nos sportifs.",
    "logo": "./assets/images/partners/gunural-duoptique-dreux.png"
  },
  {
    "name": "ALF Aménagement",
    "tag": "Aménagement & Habitat",
    "desc": "Expert en aménagement intérieur, menuiserie et rénovation de l\'habitat.",
    "logo": "./assets/images/partners/alf.png"
  },
  {
    "name": "Tabac Presse",
    "tag": "Commerce de Proximité",
    "desc": "Presse, tabac et services du quotidien au centre-bourg de Bû.",
    "logo": "./assets/images/partners/bar-tabac-bu.png"
  },
  {
    "name": "HIBLOT.COM",
    "tag": "Agence Digitale & Web",
    "desc": "Partenaire digital officiel et concepteur de la plateforme web du RCBA.",
    "logo": "./assets/images/partners/hiblot.com.png",
    "link": "https://hiblot.com",
    "featured": true
  },
  {
    "name": "SFA",
    "tag": "Conseil & Services",
    "desc": "Accompagnement, expertise et soutien au développement associatif et sportif.",
    "logo": "./assets/images/partners/sfa.png"
  },
  {
    "name": "ProGreen",
    "tag": "Paysage & Espaces Verts",
    "desc": "Création et entretien professionnel des espaces verts et des pelouses sportives.",
    "logo": "./assets/images/partners/pro-green.png"
  }
]';

    return json_decode($json, true);
}

function staff_data(): array
{

    $json = '
[
  {
    "id": 12,
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U13",
        "teamNumber": 1,
        "label": "U13 Équipe 1"
      },
      {
        "id": 51,
        "category": "U15",
        "teamNumber": 1,
        "label": "U15 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Léo",
    "lastName": "Larousse",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Moïse",
    "lastName": "Béliveau",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Silvain",
    "lastName": "Deschanel",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Jonathan",
    "lastName": "Souchon",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Jean",
    "lastName": "Dupont",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Pierre",
    "lastName": "Martin",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Killian",
    "lastName": "LaRue",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Amadou",
    "lastName": "Portier",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Roméo",
    "lastName": "Édouard",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Louis",
    "lastName": "Bousquet",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Fabrice",
    "lastName": "Lestrange",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Matthieu",
    "lastName": "Bouleau",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Pierre",
    "lastName": "Martin",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Pierre",
    "lastName": "Martin",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  },
  {
    "id": 12,
    "firstName": "Claire",
    "lastName": "Bardin",
    "role": "Éducateur",
    "teams": [
      {
        "id": 42,
        "category": "U9",
        "teamNumber": 1,
        "label": "U9 Équipe 1"
      }
    ]
  }
]
    ';
    return json_decode($json);
}

function volunteers_data(): array
{
    $json = '[
  {
    "id": 12,
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  {
    "id": 12,
    "firstName": "Léo",
    "lastName": "Larousse"
  },
  {
    "id": 12,
    "firstName": "Moïse",
    "lastName": "Béliveau"
  },
  {
    "id": 12,
    "firstName": "Silvain",
    "lastName": "Deschanel"
  },
  {
    "id": 12,
    "firstName": "Jonathan",
    "lastName": "Souchon"
  },
  {
    "id": 12,
    "firstName": "Jean",
    "lastName": "Dupont"
  },
  {
    "id": 12,
    "firstName": "Pierre",
    "lastName": "Martin"
  },
  {
    "id": 12,
    "firstName": "Killian",
    "lastName": "LaRue"
  },
  {
    "id": 12,
    "firstName": "Amadou",
    "lastName": "Portier"
  },
  {
    "id": 12,
    "firstName": "Roméo",
    "lastName": "Édouard"
  },
  {
    "id": 12,
    "firstName": "Louis",
    "lastName": "Bousquet"
  },
  {
    "id": 12,
    "firstName": "Fabrice",
    "lastName": "Lestrange"
  },
  {
    "id": 12,
    "firstName": "Matthieu",
    "lastName": "Bouleau"
  },
  {
    "id": 12,
    "firstName": "Pierre",
    "lastName": "Martin"
  },
  {
    "id": 12,
    "firstName": "Pierre",
    "lastName": "Martin"
  },
  {
    "id": 12,
    "firstName": "Claire",
    "lastName": "Bardin"
  }
]
';

    return json_decode($json);
}
