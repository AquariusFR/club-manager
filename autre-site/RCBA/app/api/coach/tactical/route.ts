import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSession } from '@/lib/authentication';
import { calculateSquadSynergy, getPlayerCombatGrade } from '@/lib/tactical';

export async function GET() {
  try {
    const session = await getSession();
    if (!session || (session.roleName !== 'Coach' && session.roleName !== 'Direction' && session.roleName.toLowerCase() !== 'admin')) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    const db = await getDb();
    
    // Fetch staff info to get equipe_id
    const staff = await db.get("SELECT equipe_id FROM Staff WHERE email = ?", [session.email]);
    const equipe_id = staff?.equipe_id || 1; // Fallback or handle appropriately

    // Fetch players
    const players = await db.all("SELECT * FROM Joueurs WHERE equipe_id = ?", [equipe_id]);
    
    // Calculate Synergy
    const synergy = calculateSquadSynergy(players);
    
    // Enrich players with grades
    const enrichedPlayers = players.map((p: any) => ({
      ...p,
      tactical: getPlayerCombatGrade(p)
    }));

    // Identify Top Player
    const topPlayer = [...enrichedPlayers].sort((a: any, b: any) => {
      const avgA = ((a.aptitude_technique || 3) + (a.aptitude_tactique || 3) + (a.aptitude_physique || 3) + (a.aptitude_mentale || 3)) / 4;
      const avgB = ((b.aptitude_technique || 3) + (b.aptitude_tactique || 3) + (b.aptitude_physique || 3) + (b.aptitude_mentale || 3)) / 4;
      return avgB - avgA;
    })[0];

    // Find the weakest squad attribute
    const avgs = synergy.averages;
    const weakest = Object.entries(avgs || {}).sort((a: any, b: any) => a[1] - b[1])[0] || ["N/A", 0];

    return NextResponse.json({
      synergy: synergy.score,
      status: synergy.status,
      metrics: synergy.averages,
      insights: {
        top_operative: topPlayer ? `${topPlayer.prenom} ${topPlayer.nom}` : "N/A",
        tactical_gap: weakest[0].toUpperCase(),
        health: synergy.score > 80 ? "PEAK PERFORMANCE" : synergy.score > 60 ? "STABLE" : "RECALIBRATION REQUIRED"
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Tactical API Error:', error);
    return NextResponse.json({ error: 'Internal Signal Error' }, { status: 500 });
  }
}
