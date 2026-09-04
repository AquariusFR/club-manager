import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platforms, content, imageUrl, imageBase64 } = body;

    const pageId = process.env.META_PAGE_ID;
    const igAccountId = process.env.META_IG_ACCOUNT_ID;
    const accessToken = process.env.META_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json({ success: false, error: "Le jeton d'accès Meta (META_ACCESS_TOKEN) n'est pas configuré sur le serveur." }, { status: 500 });
    }

    type PlatformResult = { success: boolean; error: string | null; id: string | null };
    const results: { facebook: PlatformResult; instagram: PlatformResult } = {
      facebook: { success: false, error: null, id: null },
      instagram: { success: false, error: null, id: null }
    };

    // 1. Publication Facebook
    if (platforms.facebook) {
      if (!pageId) {
        results.facebook.error = "L'ID de la page Facebook n'est pas configuré.";
      } else {
        try {
          let fbResponse;
          
          if (imageBase64) {
            // Conversion du base64 en Blob pour envoi en multipart/form-data
            const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Data, 'base64');
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            
            const formData = new FormData();
            formData.append('message', content || '');
            formData.append('source', blob, 'post.jpg');
            formData.append('access_token', accessToken);

            fbResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
              method: 'POST',
              body: formData,
            });
          } else if (imageUrl) {
            // Envoi de l'image par URL
            fbResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: content || '',
                url: imageUrl,
                access_token: accessToken
              }),
            });
          } else {
            // Uniquement du texte (Statut)
            fbResponse = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                message: content || '',
                access_token: accessToken
              }),
            });
          }

          const fbData = await fbResponse.json();
          if (fbData.error) {
            results.facebook.error = fbData.error.message;
          } else {
            results.facebook.success = true;
            results.facebook.id = fbData.id;
          }
        } catch (err: any) {
          results.facebook.error = err.message;
        }
      }
    }

    // 2. Publication Instagram
    if (platforms.instagram) {
      if (!igAccountId) {
        results.instagram.error = "L'ID du compte Instagram n'est pas configuré.";
      } else if (!imageUrl && !imageBase64) {
        results.instagram.error = "Instagram exige une image pour publier.";
      } else if (imageBase64 && !imageUrl) {
        // Instagram Graph API demande obligatoirement une URL publique (image_url)
        results.instagram.error = "L'API Instagram nécessite une image avec une URL publique. L'envoi de fichiers locaux (ordinateur) requiert un stockage Cloud préalablement configuré.";
      } else {
        try {
          // Étape 1 : Créer le conteneur de média
          const createMediaRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image_url: imageUrl,
              caption: content || '',
              access_token: accessToken
            }),
          });
          const mediaData = await createMediaRes.json();

          if (mediaData.error) {
            results.instagram.error = mediaData.error.message;
          } else {
            const creationId = mediaData.id;
            
            // Étape 2 : Publier le conteneur
            const publishRes = await fetch(`https://graph.facebook.com/v19.0/${igAccountId}/media_publish`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                creation_id: creationId,
                access_token: accessToken
              }),
            });
            const publishData = await publishRes.json();

            if (publishData.error) {
              results.instagram.error = publishData.error.message;
            } else {
              results.instagram.success = true;
              results.instagram.id = publishData.id;
            }
          }
        } catch (err: any) {
          results.instagram.error = err.message;
        }
      }
    }

    // Déterminer le succès global
    const totalSelected = (platforms.facebook ? 1 : 0) + (platforms.instagram ? 1 : 0);
    const totalSuccess = (results.facebook.success ? 1 : 0) + (results.instagram.success ? 1 : 0);
    
    const overallSuccess = totalSelected > 0 && totalSelected === totalSuccess;

    return NextResponse.json({
      success: overallSuccess,
      results
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
