<?php
declare(strict_types=1);

function teams_data() : array
{
    return [
      42 => [
        "id" => 42,
        "category" => "U9",
        "teamNumber" => 1,
        "label" => "U9 Équipe 1",
        "season" => "2026-2027",
        "competition" => "D2",
        "coach" => "Léo Larousse",
        "playersCount" => 12
      ],
      43 => [
        "id" => 43,
        "category" => "U9",
        "teamNumber" => 2,
        "label" => "U9 Équipe 2",
        "season" => "2026-2027",
        "competition" => "D3",
        "coach" => "Moïse Béliveau",
        "playersCount" => 12
      ],
      44 => [
        "id" => 43,
        "category" => "U10",
        "teamNumber" => 2,
        "label" => "U10 Équipe 2",
        "season" => "2026-2027",
        "competition" => "D3",
        "coach" => "Silvain Deschanel",
        "playersCount" => 12
      ],
      45 => [
        "id" => 43,
        "category" => "U10",
        "teamNumber" => 2,
        "label" => "U10 Équipe 2",
        "season" => "2026-2027",
        "competition" => "D3",
        "coach" => "Jonathan Souchon",
        "playersCount" => 18
      ]
    ];
}

function players_data() : array
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
