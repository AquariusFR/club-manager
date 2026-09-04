 import { NextRequest, NextResponse } from "next/server";

 import { getDb } from "@/lib/db";

 

 export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);

  const date = searchParams.get("date");

  

  if (!date) return NextResponse.json({ error: "Date required" }, { status: 400 });

 

  const db = await getDb();

  

  // Fetch all players already summoned for an event on that date (regardless of team)

  const conflictsRaw = await db.all(`

   SELECT c.joueur_id, ev.titre, e.nom as equipe_nom, ev.type

   FROM Convocations c

   JOIN Evenements ev ON c.evenement_id = ev.id

   JOIN Equipes e ON ev.equipe_id = e.id

   WHERE date(ev.date) = date( )

  `, [date]);

 

  // Convert to easy lookup map

  interface ConflictRaw {
    joueur_id: number;
    titre: string;
    equipe_nom: string;
    type: string;
  }

  const conflictMap: Record<number, Omit<ConflictRaw, 'joueur_id'>> = {};

  conflictsRaw.forEach((c: ConflictRaw) => {

   conflictMap[c.joueur_id] = {

    titre: c.titre,

    equipe_nom: c.equipe_nom,

    type: c.type

   };

  });

 

  return NextResponse.json(conflictMap);

 }

 
