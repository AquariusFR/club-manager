# Serveur backend local

Ce serveur Node.js utilise uniquement les modules intégrés à Node, sans
dépendance à installer. Depuis la racine du dépôt, lancez :

```bash
npm --prefix dev-server start
```

Le serveur écoute sur `http://localhost:8081`.

- `POST /authentication/login` répond toujours avec succès et renvoie un JWT
  statique valable côté client une heure. Les identifiants envoyés ne sont pas
  vérifiés.
- `GET /api/...` renvoie une liste vide.
- `POST` et `PUT /api/...` renvoient le corps reçu dans une réponse simulée.
- `DELETE /api/...` renvoie `204 No Content`.

Le JWT est une valeur de test dont la signature n'est pas valide. Ce serveur ne
doit être utilisé qu'en développement local, jamais en production.
