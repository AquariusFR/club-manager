interface SendResult {
  success: boolean;
  provider: string;
  error?: string;
}

// Internal telemetry logging
async function logTelemetry(to: string, type: string, result: SendResult) {
  try {
    const { getDb } = await import('./db');
    const db = await getDb();
    
    // Status resolution
    const status = result.success ? 'Sent' : 'Failed';
    const message = `Dispatch via ${result.provider || 'unknown'}${result.error ? ': ' + result.error : ''}`;

    await db.run(
      "INSERT INTO NotifsLog (joueur_id, type, message, statut) SELECT id, ?, ?, ? FROM Joueurs WHERE email = ? LIMIT 1",
      [type, message, status, to]
    );
  } catch (e) {
    console.error(`[CRITICAL] Telemetry Logging Failed: ${e}`);
  }
}

// Internal email dispatcher (Ready for Resend/SendGrid)
async function dispatchEmail(to: string, subject: string, html: string, type: string): Promise<SendResult> {
  const isProd = process.env.NODE_ENV === 'production';
  const hasKey = !!process.env.RESEND_API_KEY;
  let result: SendResult = { success: true, provider: 'staging' };

  if (isProd && hasKey) {
    try {
      // Logic for actual provider (Resend/SendGrid) would go here
      result = { success: true, provider: 'resend' };
    } catch (e: any) {
      console.error(`[TELEMETRY_ERROR] Email dispatch failed for ${to}: ${e.message}`);
      result = { success: false, provider: 'resend', error: e.message };
    }
  } else {
    // In dev/test, just log to console
    console.log(`[STAGING_MAILER] DISPATCH -> To: ${to} | Subject: ${subject}`);
  }

  // Record Telemetry
  await logTelemetry(to, type, result);
  return result;
}

import { Joueur, Evenement, Staff } from '@/lib/types';

export async function sendLicenseReminder(player: Joueur, reason: 'paiement' | 'documents' | 'both') {
  const date = new Date().toLocaleDateString('fr-FR');
  
  const subjects = {
    paiement: "📊 Action requise : Régularisation Licence RCBA",
    documents: "📄 Rappel : Pièces manquantes Licence RCBA",
    both: "🚨 Dossier Incomplet : Action requise immédiate (RCBA)"
  };

  const messages = {
    paiement: "Nous n'avons pas encore reçu le règlement de votre cotisation pour la saison 2025/2026.",
    documents: "Certains documents obligatoires (assurance, certificat médical) manquent à votre dossier.",
    both: "Votre dossier administratif est bloqué : nous attendons le règlement et les documents manquants."
  };

  const html = `
    <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background: #01051a; color: #ffffff; padding: 60px; border-radius: 32px; border: 1px solid #d4af3722; max-width: 600px; margin: 0 auto; box-shadow: 0 20px 50px rgba(0,0,0,0.5);">
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="color: #d4af37; font-size: 10px; font-weight: 900; letter-spacing: 0.5em; margin-bottom: 10px;">RCBA PROTOCOL</div>
        <h2 style="color: #ffffff; margin: 0; text-transform: uppercase; letter-spacing: 0.2em; font-style: italic;">RELANCE <span style="color: #d4af37;">ADMINISTRATIVE</span></h2>
      </div>
      
      <div style="background: rgba(255,255,255,0.02); padding: 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 40px;">
        <h3 style="margin-top: 0; color: #d4af37;">Bonjour ${player.prenom},</h3>
        <p style="opacity: 0.7; line-height: 1.8; font-size: 14px;">${messages[reason]}</p>
      </div>

      <div style="text-align: center;">
        <a href="https://rcba-portal.vercel.app/parents/dashboard" style="background: #d4af37; color: #01051a; padding: 20px 40px; border-radius: 16px; font-weight: 900; text-decoration: none; display: inline-block; letter-spacing: 0.1em; transition: all 0.3s ease;">RÉGULARISER MON DOSSIER</a>
      </div>

      <div style="margin-top: 50px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); text-align: center;">
        <p style="font-size: 10px; opacity: 0.3; text-transform: uppercase; letter-spacing: 0.2em;">
          Ce message est généré automatiquement par le Système Central — ${date}
        </p>
      </div>
    </div>
  `;

  return await dispatchEmail(player.email, subjects[reason], html, `Relance ${reason}`);
}

export async function sendLicenseReminderSms(player: Joueur, reason: 'paiement' | 'documents' | 'both') {
  const messages = {
    paiement: `RCBA: Rappel règlement licence pour ${player.prenom}. Merci de régulariser sur le portail.`,
    documents: `RCBA: Dossier incomplet pour ${player.prenom} (pièces manquantes). Merci de régulariser sur le portail.`,
    both: `RCBA: ALERTE dossier bloqué pour ${player.prenom} (paiement + documents). Action requise sur le portail.`
  };

  const msg = `${messages[reason]} https://rcba-portal.vercel.app/parents/dashboard`;
  
  const result: SendResult = { success: true, provider: 'staging_sms' };
  console.log(`[STAGING_SMS] TO: ${player.telephone || 'N/A'} | MSG: ${msg}`);
  
  await logTelemetry(player.email || 'unknown', 'SMS_Relance', result);
  return result;
}

export async function sendConvocationEmail(player: Joueur, match: Evenement, convocationId?: number) {
  const dateStr = new Date(match.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const portalUrl = `https://rcba-portal.vercel.app/parents/dashboard${convocationId ? `?convocation=${convocationId}` : ''}`;

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; background: #01051a; color: #ffffff; padding: 60px; border-radius: 32px; border: 1px solid #d4af3722; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="color: #d4af37; font-size: 10px; font-weight: 900; letter-spacing: 0.8em; margin-bottom: 10px;">CONVOCATION</div>
        <h1 style="font-size: 42px; margin: 10px 0; font-style: italic; font-weight: 900;">VS ${match.adversaire?.toUpperCase() || 'ADVERSAIRE'}</h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); margin: 30px 0; border-left: 4px solid #d4af37;">
        <div style="margin-bottom: 15px; font-size: 18px;">📅 <b>${dateStr}</b></div>
        <div style="margin-bottom: 15px; font-size: 18px;">⏰ <b>${match.heure || 'N/A'}</b></div>
        <div style="font-size: 18px;">📍 <b>${match.lieu || 'N/A'}</b></div>
      </div>

      <p style="opacity: 0.8; font-size: 15px; text-align: center; margin-bottom: 40px;">Bonjour ${player.prenom}, ta présence est requise pour cette rencontre.</p>

      <div style="text-align: center;">
        <a href="${portalUrl}" style="background: #d4af37; color: #01051a; padding: 24px 48px; border-radius: 20px; font-weight: 900; text-decoration: none; display: inline-block; letter-spacing: 0.2em; box-shadow: 0 10px 30px rgba(212,175,55,0.2);">CONFIRMER MA PRÉSENCE</a>
      </div>
    </div>
  `;

  return await dispatchEmail(player.email, `Convocation : RCBA vs ${match.adversaire}`, html, 'Convocation');
}

export async function sendConvocationSms(player: Joueur, match: Evenement, convocationId?: number) {
  const portalUrl = `https://rcba-portal.vercel.app/parents/dashboard${convocationId ? `?convocation=${convocationId}` : ''}`;
  const msg = `RCBA: ${player.prenom}, convoqué vs ${match.adversaire} le ${match.date} à ${match.heure}. Confirme: ${portalUrl}`;
  
  const result: SendResult = { success: true, provider: 'staging_sms' };
  console.log(`[STAGING_SMS] TO: ${player.telephone || 'N/A'} | MSG: ${msg}`);
  
  await logTelemetry(player.email || 'unknown', 'SMS', result);
  return result;
}

export async function sendSubstitutionNotification(coach: Staff, substitution: { date: string, reason?: string }) {
  const dateStr = new Date(substitution.date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const portalUrl = `https://rcba-portal.vercel.app/coach/dashboard`;

  const html = `
    <div style="font-family: 'Segoe UI', sans-serif; background: #01051a; color: #ffffff; padding: 60px; border-radius: 32px; border: 1px solid #d4af3722; max-width: 600px; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 40px;">
        <div style="color: #d4af37; font-size: 10px; font-weight: 900; letter-spacing: 0.8em; margin-bottom: 10px;">MISSION ACCOMPLIE</div>
        <h1 style="font-size: 42px; margin: 10px 0; font-style: italic; font-weight: 900;">REMPLACEMENT <span style="color: #d4af37;">ASSIGNÉ</span></h1>
      </div>

      <div style="background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); padding: 30px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); margin: 30px 0; border-left: 4px solid #d4af37;">
        <p style="margin-bottom: 15px; font-size: 18px;">Bonjour <b>${coach.prenom}</b>,</p>
        <p style="opacity: 0.8; font-size: 15px; line-height: 1.6;">
          La Direction vous a assigné comme remplaçant pour la session du :
        </p>
        <div style="margin: 20px 0; font-size: 20px; color: #d4af37; font-weight: 700;">📅 ${dateStr}</div>
        <p style="opacity: 0.8; font-size: 14px;">Raison : ${substitution.reason || 'Non spécifiée'}</p>
      </div>

      <p style="opacity: 0.8; font-size: 15px; text-align: center; margin-bottom: 40px;">Merci pour votre engagement envers le club.</p>

      <div style="text-align: center;">
        <a href="${portalUrl}" style="background: #d4af37; color: #01051a; padding: 24px 48px; border-radius: 20px; font-weight: 900; text-decoration: none; display: inline-block; letter-spacing: 0.2em; box-shadow: 0 10px 30px rgba(212,175,55,0.2);">ACCÉDER À MON DASHBOARD</a>
      </div>
    </div>
  `;

  return await dispatchEmail(coach.email, `Assignation Remplacement RCBA - ${dateStr}`, html, 'SubstitutionAssignment');
}
