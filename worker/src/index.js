addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith('/api/')) {
    return new Response('Not Found', { status: 404 });
  }

  const targetBase = TARGET_BASE; // from wrangler.toml env var
  const upstreamPath = url.pathname.replace(/^\/api/, '');
  const upstreamUrl = `${targetBase}${upstreamPath}${url.search}`;

  const init = {
    method: request.method,
    body: request.body,
    headers: {
      ...Object.fromEntries(request.headers),
      'Authorization': `Bearer ${API_KEY}`,
    },
    redirect: 'follow',
  };

  const upstreamResponse = await fetch(upstreamUrl, init);

  const corsHeaders = new Headers(upstreamResponse.headers);
  corsHeaders.set('Access-Control-Allow-Origin', '*');
  corsHeaders.set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  corsHeaders.set('Access-Control-Allow-Headers', '*');

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: corsHeaders,
  });
}
