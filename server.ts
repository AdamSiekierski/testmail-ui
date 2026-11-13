// Tiny local Testmail browser. The API key stays on the server; the page only talks to /api/*.
// Run: mise exec -- bun server.ts   (reads TESTMAIL_API_KEY and TESTMAIL_NAMESPACE from .env)

const API = 'https://api.testmail.app/api/json';
const PORT = Number(process.env.PORT ?? 4777);
const apiKey = process.env.TESTMAIL_API_KEY;
const defaultNamespace = process.env.TESTMAIL_NAMESPACE;

if (!apiKey) {
  console.error('TESTMAIL_API_KEY is missing (put it in .env).');
  process.exit(1);
}

async function emails(url: URL): Promise<Response> {
  const params = new URLSearchParams({
    apikey: apiKey!,
    namespace: url.searchParams.get('namespace') || defaultNamespace || '',
    limit: String(Math.min(Number(url.searchParams.get('limit') ?? 100), 100)),
    offset: url.searchParams.get('offset') ?? '0',
  });
  const tag = url.searchParams.get('tag');
  if (tag) params.set('tag', tag);
  const prefix = url.searchParams.get('tag_prefix');
  if (prefix) params.set('tag_prefix', prefix);

  const res = await fetch(`${API}?${params}`);
  return new Response(await res.text(), {
    status: res.status,
    headers: { 'content-type': 'application/json' },
  });
}

Bun.serve({
  hostname: '127.0.0.1',
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    if (url.pathname === '/api/config') return Response.json({ namespace: defaultNamespace ?? '' });
    if (url.pathname === '/api/emails') return emails(url);
    if (url.pathname === '/') return new Response(Bun.file(`${import.meta.dir}/index.html`));
    return new Response('Not found', { status: 404 });
  },
});

console.log(`Testmail UI on http://localhost:${PORT}`);
