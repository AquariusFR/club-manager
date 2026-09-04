"use server";

import { getDb } from "@/lib/db";
import { getSession, type UserSession } from "@/lib/authentication";
import { revalidatePath } from "next/cache";

export async function getLabProgress() {
  const session = await getSession() as UserSession | null;
  if (!session) return [];

  const db = await getDb();
  const progress = await db.all(
    "SELECT phase_id, status FROM UserLabProgress WHERE user_id = ?",
    [session.userId]
  );
  
  return progress;
}

export async function updatePhaseStatus(phaseId: number, status: 'LOCKED' | 'UNLOCKED' | 'COMPLETED') {
  const session = await getSession() as UserSession | null;
  if (!session) return { error: "Non autorisé" };

  const db = await getDb();
  
  try {
    await db.run(
      `INSERT INTO UserLabProgress (user_id, phase_id, status) 
       VALUES (?, ?, ?)
       ON CONFLICT(user_id, phase_id) DO UPDATE SET 
       status = excluded.status,
       updated_at = CURRENT_TIMESTAMP`,
      [session.userId, phaseId, status]
    );

    // If a phase is completed, automatically unlock the next one (if phase locking is desired)
    if (status === 'COMPLETED' && phaseId < 19) {
      await db.run(
        `INSERT INTO UserLabProgress (user_id, phase_id, status) 
         VALUES (?, ?, 'UNLOCKED')
         ON CONFLICT(user_id, phase_id) DO NOTHING`,
        [session.userId, phaseId + 1]
      );
    }

    revalidatePath('/dev/ai-lab');
    return { success: true };
  } catch (error) {
    console.error("Error updating lab progress:", error);
    return { error: "Erreur serveur" };
  }
}
