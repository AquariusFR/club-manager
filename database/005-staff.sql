CREATE TABLE
    staff_roles (
        name VARCHAR(30) NOT NULL,
        description TEXT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (name)
    );
INSERT INTO staff_roles (name, description) VALUES
    ('Entraineur', 'Entraineur principal'),
    ('Entraineur adjoint', 'Entraineur adjoint'),
    ('Préparateur physique', 'Préparateur physique'),
    ('Médecin', 'Médecin de l\'équipe'),
    ('Kinésithérapeute', 'Kinésithérapeute de l\'équipe'),
    ('Analyste vidéo', 'Analyste vidéo de l\'équipe'),
    ('Responsable logistique', 'Responsable logistique de l\'équipe'),
    ('Responsable administratif', 'Responsable administratif de l\'équipe'),
    ('Directeur sportif', 'Directeur sportif de l\'équipe'),
    ('Président', 'Président du club');
CREATE TABLE
    staffs (
        id INT NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(30) NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (role) REFERENCES staff_roles(name)
    );