 import { getSession } from "@/lib/authentication";

 import { getDb } from "@/lib/db";

 import { NextResponse } from "next/server";

 

 export async function GET() {

  const session = await getSession();

  if (!session || (session.roleName !== 'Coach' && session.roleName.toLowerCase() !== 'admin')) {

   return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  }

 

  const db = await getDb();

  

  // Get Coach Info

  const coach = await db.get("SELECT * FROM Staff WHERE email = ?", [session.email]);

  const equipeId = coach?.equipe_id || 1;

 

  // Get Players sorted by performance

  const players = await db.all(`

   SELECT id, nom, prenom, poste, 

      (aptitude_physique + aptitude_technique + aptitude_tactique + aptitude_mentale) / 4.0 as avg_skill

   FROM Joueurs 

   WHERE equipe_id = ?

   ORDER BY avg_skill DESC

  `, [equipeId]);

 

  return NextResponse.json({ players, equipeId });

 }

 
