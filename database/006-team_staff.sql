CREATE TABLE
    team_staff (
        team_id INT NOT NULL,
        staff_id INT NOT NULL,
        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (team_id, staff_id),
        CONSTRAINT fk_team_staff_team FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT fk_team_staff_staff FOREIGN KEY (staff_id) REFERENCES staffs (id) ON DELETE CASCADE ON UPDATE CASCADE
    );