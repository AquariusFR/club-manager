import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.nom || !data.prenom || !data.email || !data.telephone) {
      return NextResponse.json({ success: false, error: "Veuillez renseigner tous les champs obligatoires (nom, prénom, email, téléphone)." }, { status: 400 });
    }
    
    // Pour les postes autres que joueur, l'email va à la direction
    const directionEmail = 'direction@rcba.fr';

    // Log de simulation d'envoi
    console.log(`[EMAIL SIMULÉ] Destinataire: ${directionEmail}`);
    console.log(`Sujet: Nouvelle candidature - ${data.typeCandidature}`);

    // Enregistrement en base de données pour générer la notification
    const { getDb } = await import('@/lib/db');
    const db = await getDb();
    await db.run(
      `INSERT INTO MessagesRecrutement (type, nom, prenom, email, telephone, poste, experience, message, destinataire) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['staff', data.nom, data.prenom, data.email, data.telephone, data.poste || '', data.experience || '', data.message || '', directionEmail]
    );

    return NextResponse.json({ success: true, message: "Candidature envoyée à la direction." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la candidature staff:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
