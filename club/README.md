# Club

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.6.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

The development server proxies `/api` and `/authentication` requests to
`http://localhost:8081`. Start the local mock backend in another terminal from
the repository root with `npm --prefix dev-server start`. See
[`dev-server/README.md`](../dev-server/README.md) for the mock endpoints.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## Authentification

L'écran d'accueil permet de se connecter avec une adresse e-mail et un mot de
passe. La connexion appelle `POST /authentication/login` avec `{ mail,
password }`. Le JWT reçu est conservé dans `localStorage` avec sa date
d'expiration, ajouté aux requêtes HTTP suivantes dans l'en-tête
`Authorization: Bearer <token>`, puis supprimé à son expiration ou après une
réponse HTTP 401.

L'application suppose que l'API d'authentification est disponible à
`/authentication/login` sur la même origine que le client.
