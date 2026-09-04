import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.nom || !data.prenom || !data.email || !data.telephone) {
      return NextResponse.json({ success: false, error: "Veuillez renseigner tous les champs obligatoires (nom, prénom, email, téléphone)." }, { status: 400 });
    }

    // Détermination de l'email du coach en fonction de la catégorie
    let coachEmail = '';
    switch (data.categorie) {
      case 'U6 / U7':
      case 'U8 / U9':
      case 'U10 / U11':
        coachEmail = 'ecoledefoot@rcba.fr';
        break;
      case 'U12 / U13':
      case 'U14 / U15':
        coachEmail = 'preformation@rcba.fr';
        break;
      case 'U16 / U17 / U18':
        coachEmail = 'formation@rcba.fr';
        break;
      case 'Séniors':
      case 'Vétérans':
        coachEmail = 'seniors@rcba.fr';
        break;
      case 'Pôle Féminin':
        coachEmail = 'feminines@rcba.fr';
        break;
      default:
        coachEmail = 'contact@rcba.fr';
    }

    // Log de simulation d'envoi
    console.log(`[EMAIL SIMULÉ] Destinataire: ${coachEmail}`);
    console.log(`Sujet: Nouvelle demande de recrutement Joueur - ${data.categorie}`);

    // Enregistrement en base de données pour générer la notification
    const { getDb } = await import('@/lib/db');
    const db = await getDb();
    await db.run(
      `INSERT INTO MessagesRecrutement (type, nom, prenom, email, telephone, categorie, experience, message, destinataire) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['joueur', data.nom, data.prenom, data.email, data.telephone, data.categorie, data.experience || '', data.message || '', coachEmail]
    );

    return NextResponse.json({ success: true, message: "Demande envoyée au coach concerné." });
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande joueur:", error);
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 });
  }
}
