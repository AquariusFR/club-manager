import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Simulate a brief delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const { getDb } = await import('@/lib/db');
    const db = await getDb();
    
    // Construct message body with subject
    const subjectPrefix = data.sujet ? `[${data.sujet}] ` : '';
    const fullMessage = `${subjectPrefix}${data.message}`;

    // Insert as type='contact' with recipient direction@rcba.fr
    await db.run(
      `INSERT INTO MessagesRecrutement (type, nom, prenom, email, telephone, categorie, experience, message, destinataire) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['contact', data.nom, data.prenom, data.email, data.telephone || '', data.sujet || 'Contact', '', fullMessage, 'direction@rcba.fr']
    );

    return NextResponse.json({ success: true, message: "Votre message a été transmis avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement du message de contact:", error);
    return NextResponse.json({ success: false, error: "Erreur interne du serveur" }, { status: 500 });
  }
}
