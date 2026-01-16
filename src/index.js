export default {
  async fetch(request, env) {
    return handleRequest(request, env);
  },
};

async function handleRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(INDEX_HTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  }

  if (url.pathname === '/css/styles.css') {
    return new Response(STYLES_CSS, {
      headers: { 'Content-Type': 'text/css' },
    });
  }

  if (url.pathname === '/js/app.js') {
    return new Response(APP_JS, {
      headers: { 'Content-Type': 'application/javascript' },
    });
  }

  if (url.pathname === '/api/images' && request.method === 'GET') {
    const list = await env.IMAGES.list();
    const images = list.objects.map(obj => obj.key);
    return new Response(JSON.stringify(images), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (url.pathname.startsWith('/images/')) {
    const key = url.pathname.slice(8);
    const object = await env.IMAGES.get(key);

    if (!object) {
      return new Response('Image not found', { status: 404 });
    }

    return new Response(object.body, {
      headers: {
        'Content-Type':
          object.httpMetadata?.contentType || 'image/jpeg',
      },
    });
  }

  return new Response('Not found', { status: 404 });
}
