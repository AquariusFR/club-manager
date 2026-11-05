CREATE TABLE
    teams (
        id INT NOT NULL AUTO_INCREMENT,
        section VARCHAR(50) NOT NULL,
        category VARCHAR(20) NOT NULL,
        team_number INT NOT NULL DEFAULT 1,
        label VARCHAR(100) NOT NULL,
        season VARCHAR(20) NOT NULL,
        competition VARCHAR(50) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY uk_team_season (category, team_number, season),
        KEY idx_teams_section (section),
        KEY idx_teams_season (season)
    );