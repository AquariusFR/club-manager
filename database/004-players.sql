CREATE TABLE
    injury_status (
        name VARCHAR(20) NOT NULL,
        description TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (name)
    );

CREATE TABLE
    position (
        name VARCHAR(30) NOT NULL,
        abbreviation VARCHAR(3) NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (name)
    );

INSERT INTO injury_status (name, description) VALUES
    ('ok', 'Le joueur est en bonne forme et prêt à jouer.'),
    ('blessé', 'Le joueur est actuellement blessé et incapable de jouer.'),
    ('suspendu', 'Le joueur est suspendu et ne peut pas participer aux matchs.'),
    ('malade', 'Le joueur est malade et incapable de jouer.');

INSERT INTO position (name, abbreviation) VALUES
    ('Gardien', 'G'),
    ('Défenseur droit', 'DD'),
    ('Défenseur gauche', 'DG'),
    ('Défenseur central', 'DC'),
    ('Latéral droit', 'LD'),
    ('Latéral gauche', 'LG'),
    ('Milieu défensif central', 'MDC'),
    ('Milieu central', 'MC'),
    ('Milieu offensif central', 'MOC'),
    ('Milieu droit', 'MD'),
    ('Milieu gauche', 'MG'),
    ('Ailier droit','AD'),
    ('Ailier gauche','AG'),
    ('Buteur','BU');

CREATE TABLE
    players (
        id INT NOT NULL AUTO_INCREMENT,
        team_id INT NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        licence VARCHAR(10) NULL,
        injury_status VARCHAR(20) NOT NULL DEFAULT 'healthy',
        position VARCHAR(50) NOT NULL,
        birth_date DATE NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY idx_players_team (team_id),
        CONSTRAINT fk_players_team FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_players_injury_status FOREIGN KEY (injury_status) REFERENCES injury_status (name) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT fk_players_position FOREIGN KEY (position) REFERENCES position (name) ON DELETE RESTRICT ON UPDATE CASCADE
    );