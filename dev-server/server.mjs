import { createServer } from 'node:http';

const host = 'localhost';
const port = 8081;
const staticJwt =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJsb2NhbC1kZXYiLCJ1c2VyIjp7ImxvZ2luIjoiZGV2Iiwicm9sZSI6ImFkbWluIn0sImV4cCI6NDEwMjQ0NDgwMH0.bG9jYWwtZGV2ZWxvcG1lbnQtc2lnbmF0dXJl';

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const body = Buffer.concat(chunks).toString('utf8');
  if (body.length === 0) {
    return {};
  }

  return JSON.parse(body);
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? '/', `http://${host}:${port}`);

  console.log(`receive request at ${url}`);
  if (request.method === 'OPTIONS') {
    response.writeHead(204);
    response.end();
    return;
  }

  if (url.pathname === '/authentication/login') {
    if (request.method !== 'POST') {
      response.setHeader('Allow', 'POST, OPTIONS');
      sendJson(response, 405, { success: false, message: 'Method not allowed.' });
      return;
    }

    sendJson(response, 200, {
      success: true,
      token: staticJwt,
      expires_in: 3600,
    });
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'GET') {
      sendJson(response, 200, []);
      return;
    }

    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const body = await readJson(request);
        sendJson(response, request.method === 'POST' ? 201 : 200, {
          message: request.method === 'POST' ? 'Création simulée.' : 'Modification simulée.',
          data: body,
        });
      } catch (error) {
        if (error instanceof SyntaxError) {
          sendJson(response, 400, { message: 'Invalid JSON.' });
          return;
        }

        console.error('Failed to read mock API request:', error);
        sendJson(response, 500, { message: 'Mock server error.' });
      }
      return;
    }

    if (request.method === 'DELETE') {
      response.writeHead(204);
      response.end();
      return;
    }

    response.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS');
    sendJson(response, 405, { message: 'Method not allowed.' });
    return;
  }

  sendJson(response, 404, { message: 'Not found.' });
});

server.listen(port, host, () => {
  console.log(`Mock backend listening at http://${host}:${port}`);
});

server.on('error', (error) => {
  console.error('Mock backend failed to start:', error);
  process.exitCode = 1;
});
