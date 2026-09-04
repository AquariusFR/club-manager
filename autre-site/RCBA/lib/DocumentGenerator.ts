/**
 * DocumentGenerator.ts
 * Generates semantic HTML templates for administrative documents (Receipts, Attestations, Invoices).
 * Optimized for "High-Performance" club standards.
 */

export const DocumentGenerator = {
  /**
   * Generates a payment receipt for a license.
   */
  generateLicenseReceipt(data: {
    playerName: string;
    amount: number;
    date: string;
    receiptId: string;
    paymentMethod: string;
  }) {
    return `
      <div style="font-family: sans-serif; padding: 40px; border: 1px solid #eee; max-width: 800px; margin: auto; color: #333;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 30px;">
          <div>
            <h1 style="margin: 0; color: #020617; text-transform: uppercase; font-style: italic;">RCBA <span style="color: #D4AF37;">OFFICIEL</span></h1>
            <p style="margin: 5px 0 0 0; font-size: 10px; letter-spacing: 2px; color: #666;">RACING CLUB BÛ ABONDANT // POLE ADMIN</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-weight: bold;">REÇU DE PAIEMENT</p>
            <p style="margin: 5px 0 0 0; font-size: 12px; color: #D4AF37;">#${data.receiptId}</p>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <p>Le <strong>${data.date}</strong>,</p>
          <p>Nous confirmons avoir reçu la somme de :</p>
          <div style="font-size: 32px; font-weight: 900; color: #020617; margin: 20px 0;">${data.amount.toFixed(2)} €</div>
          <p>De la part de : <strong>${data.playerName}</strong></p>
          <p>Pour le règlement de : <strong>Cotisation Licence Saison 2025/2026</strong></p>
          <p>Mode de paiement : <strong>${data.paymentMethod}</strong></p>
        </div>

        <div style="border-top: 1px solid #eee; padding-top: 20px; font-size: 12px; color: #999;">
          <p>Ce document vaut attestation de paiement pour votre Comité d'Entreprise ou organisme social.</p>
          <p style="margin-top: 20px;">Fait à Bû, le ${new Date().toLocaleDateString()}</p>
          <div style="margin-top: 30px; text-align: right;">
            <p style="margin: 0; font-weight: bold; color: #020617;">Le Secrétariat Général RCBA</p>
            <div style="height: 60px;"></div>
            <p style="font-size: 10px; font-style: italic;">Document généré numériquement - Signature non requise</p>
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Generates a sponsorship invoice.
   */
  generateSponsorshipInvoice(data: {
    partnerName: string;
    amount: number;
    invoiceId: string;
    packageType: string;
  }) {
    return `
      <div style="font-family: sans-serif; padding: 40px; max-width: 800px; margin: auto; color: #333;">
        <div style="display: flex; justify-content: space-between; border-bottom: 3px solid #020617; padding-bottom: 20px;">
          <h1 style="margin: 0;">FACTURE PARTENARIAT</h1>
          <div style="text-align: right;">
            <p style="margin: 0; font-weight: bold;">RACING CLUB BÛ ABONDANT</p>
            <p style="margin: 0;">Stade Municipal</p>
            <p style="margin: 0;">28410 BÛ</p>
          </div>
        </div>

        <div style="margin: 40px 0;">
          <p style="margin: 0; font-size: 12px; color: #666;">Destinataire :</p>
          <h2 style="margin: 10px 0;">${data.partnerName}</h2>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px;">
          <thead>
            <tr style="background: #020617; color: #fff;">
              <th style="padding: 15px; text-align: left;">DÉSIGNATION</th>
              <th style="padding: 15px; text-align: right;">MONTANT HT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 20px; border-bottom: 1px solid #eee;">
                <strong>Partenariat Sportif - Pack ${data.packageType}</strong><br>
                <span style="font-size: 12px; color: #666;">Visibilité stade, site web et réseaux sociaux.</span>
              </td>
              <td style="padding: 20px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">${data.amount.toFixed(2)} €</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 20px; text-align: right; font-weight: bold;">TOTAL À PAYER</td>
              <td style="padding: 20px; text-align: right; font-size: 24px; font-weight: 900; color: #D4AF37;">${data.amount.toFixed(2)} €</td>
            </tr>
          </tfoot>
        </table>

        <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; font-size: 12px;">
          <p><strong>Conditions de règlement :</strong> Règlement à réception.</p>
          <p><strong>Mode de règlement :</strong> Par virement bancaire ou chèque à l'ordre du RCBA.</p>
        </div>
      </div>
    `;
  },
  
  /**
   * Generates a membership attestation.
   */
  generateMembershipAttestation(data: {
    playerName: string;
    category: string;
    season: string;
    birthDate?: string;
  }) {
    return `
      <div style="font-family: sans-serif; padding: 50px; border: 1px solid #020617; max-width: 800px; margin: auto; color: #020617; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -100px; right: -100px; width: 300px; height: 300px; background: rgba(212,175,55,0.05); border-radius: 50%;"></div>
        
        <div style="text-align: center; margin-bottom: 50px;">
          <h1 style="margin: 0; font-size: 32px; letter-spacing: 5px;">RACING CLUB <span style="color: #D4AF37;">BÛ ABONDANT</span></h1>
          <p style="margin: 10px 0; font-size: 10px; font-weight: bold; letter-spacing: 3px; color: #666;">CLUB AFFILIÉ FFF (N° 582697) • DISTRICT D&apos;EURE-ET-LOIR</p>
        </div>

        <div style="text-align: center; margin-bottom: 60px;">
          <h2 style="text-decoration: underline; text-underline-offset: 10px; font-size: 24px; margin-bottom: 40px;">ATTESTATION DE LICENCE</h2>
          <p style="font-size: 16px; line-height: 1.8; text-align: justify;">
            Je soussigné, Président du Racing Club Bû Abondant, atteste par la présente que :
          </p>
          <div style="margin: 30px 0; font-size: 20px; font-weight: 900; background: #f8f8f8; padding: 20px; border-left: 5px solid #D4AF37;">
            ${data.playerName} ${data.birthDate ? `<br><span style="font-size: 14px; font-weight: normal; color: #666;">Né(e) le ${data.birthDate}</span>` : ''}
          </div>
          <p style="font-size: 16px; line-height: 1.8; text-align: justify;">
            est licencié(e) au sein de notre association sportive pour la saison <strong>${data.season}</strong>, 
            dans la catégorie <strong>${data.category}</strong>.
          </p>
          <p style="font-size: 16px; line-height: 1.8; text-align: justify;">
            Le/La licencié(e) est à jour de ses cotisations et de son dossier administratif pour la période susmentionnée.
          </p>
        </div>

        <div style="margin-top: 80px; display: flex; justify-content: space-between;">
          <div style="font-size: 12px; color: #666;">
            <p><strong>RCBA - Bureau de Direction</strong></p>
            <p>Stade Municipal, 28410 BÛ</p>
            <p>contact@rcba.fr</p>
          </div>
          <div style="text-align: right;">
            <p>Fait à Bû, le ${new Date().toLocaleDateString()}</p>
            <div style="height: 80px; margin-top: 10px; border: 1px dashed #ddd; width: 200px; display: inline-block; position: relative;">
               <span style="font-size: 10px; color: #ccc; position: absolute; top: 35px; left: 60px;">Cachet du Club</span>
            </div>
            <p style="font-weight: bold; margin-top: 10px;">Le Président du RCBA</p>
          </div>
        </div>
      </div>
    `;
  }
};
