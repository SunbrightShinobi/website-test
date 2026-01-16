addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === '/api/images' && request.method === 'GET') {
    // In a real deployment, you would fetch from R2 or KV
    // For now, return an empty array
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  } else if (url.pathname === '/api/upload' && request.method === 'POST') {
    // File upload not supported in this basic Worker setup
    // You would need to integrate with Cloudflare R2 for storage
    return new Response(JSON.stringify({ error: 'Upload not supported in this Worker' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  } else {
    return new Response('Not found', { status: 404 });
  }
}