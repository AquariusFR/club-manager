import json
import sqlite3
import re

def split_name(full_name):
    parts = full_name.split()
    if not parts:
        return "", ""
    
    prenom_parts = []
    nom_parts = []
    
    for part in parts:
        # Check if the part is uppercase (ignoring non-alpha chars like hyphen)
        alpha_part = re.sub(r'[^a-zA-Z]', '', part)
        if alpha_part and alpha_part.isupper():
            nom_parts.append(part)
        else:
            prenom_parts.append(part)
            
    if not nom_parts and prenom_parts:
        # If no uppercase part found, assume the last part is the name
        nom_parts = [prenom_parts.pop()]
    
    return " ".join(prenom_parts), " ".join(nom_parts)

def get_role_priority(role):
    role = role.lower()
    if "président" in role or "secrétaire" in role or "trésorier" in role:
        return 1
    if "responsable" in role:
        return 2
    if "entraineur" in role or "coordinateur" in role:
        return 2
    return 3

def main():
    try:
        with open('scraped_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
    except FileNotFoundError:
        print("Error: scraped_data.json not found.")
        return

    leaders = data.get('leaders', [])
    
    conn = sqlite3.connect('rcba.db')
    cursor = conn.cursor()
    
    updated_count = 0
    inserted_count = 0
    
    for leader in leaders:
        full_name = leader.get('name', '')
        role = leader.get('role', 'Membre')
        photo_url = leader.get('image', '')
        
        prenom, nom = split_name(full_name)
        role_priority = get_role_priority(role)
        
        # Check if exists
        cursor.execute("SELECT id FROM Staff WHERE nom = ? AND prenom = ?", (nom, prenom))
        row = cursor.fetchone()
        
        if row:
            staff_id = row[0]
            # Update
            cursor.execute("""
                UPDATE Staff 
                SET role = ?, photo_url = ?, role_priority = ?
                WHERE id = ?
            """, (role, photo_url if photo_url else None, role_priority, staff_id))
            updated_count += 1
        else:
            # Insert
            cursor.execute("""
                INSERT INTO Staff (nom, prenom, role, photo_url, role_priority)
                VALUES (?, ?, ?, ?, ?)
            """, (nom, prenom, role, photo_url if photo_url else None, role_priority))
            inserted_count += 1
            
    conn.commit()
    conn.close()
    
    print(f"Finished processing staff members.")
    print(f"Updated: {updated_count}")
    print(f"Inserted: {inserted_count}")

if __name__ == "__main__":
    main()
