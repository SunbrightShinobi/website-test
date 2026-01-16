const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Photography Portfolio</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <h1>My Photography Portfolio</h1>
    <nav>
      <a href="index.html">Gallery</a>
      <a href="upload.html">Upload Photo</a>
    </nav>
  </header>
  <main>
    <div id="gallery" class="gallery"></div>
  </main>
  <div id="lightbox">
    <img id="lightboxImg" src="" alt="">
  </div>
  <script src="js/app.js"></script>
</body>
</html>`;

const UPLOAD_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Upload Photo</title>
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header>
    <h1>Upload a New Photo</h1>
    <nav>
      <a href="index.html">Gallery</a>
      <a href="upload.html">Upload Photo</a>
    </nav>
  </header>
  <main>
    <form id="uploadForm" enctype="multipart/form-data">
      <label for="image">Select Image:</label>
      <input type="file" id="image" name="image" accept="image/*" required>
      <button type="submit">Upload</button>
    </form>
    <div id="message"></div>
  </main>
  <script src="js/app.js"></script>
</body>
</html>`;

const STYLES_CSS = `body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}

header {
  background-color: #333;
  color: white;
  padding: 1rem;
  text-align: center;
}

nav a {
  color: white;
  margin: 0 1rem;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.gallery img {
  width: 100%;
  height: auto;
  cursor: pointer;
  transition: transform 0.2s;
}

.gallery img:hover {
  transform: scale(1.05);
}

#lightbox {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

#lightbox img {
  max-width: 90%;
  max-height: 90%;
}

#lightbox:target {
  display: flex;
}

form {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 0 auto;
}

form label {
  display: block;
  margin-bottom: 0.5rem;
}

form input[type="file"] {
  margin-bottom: 1rem;
}

form button {
  background-color: #333;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

form button:hover {
  background-color: #555;
}

#message {
  margin-top: 1rem;
  text-align: center;
}`;

const APP_JS = `// Load gallery images on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gallery')) {
    loadGallery();
  }

  // Handle upload form
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', handleUpload);
  }

  // Handle lightbox close
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.addEventListener('click', () => {
      window.location.hash = '';
    });
  }
});

// Function to load and display gallery
function loadGallery() {
  fetch('/api/images')
    .then(response => response.json())
    .then(images => {
      const gallery = document.getElementById('gallery');
      gallery.innerHTML = '';
      images.forEach(image => {
        const img = document.createElement('img');
        img.src = \`images/\${image}\`;
        img.alt = image;
        img.addEventListener('click', () => openLightbox(\`images/\${image}\`));
        gallery.appendChild(img);
      });
    })
    .catch(error => console.error('Error loading gallery:', error));
}

// Function to open lightbox
function openLightbox(src) {
  const lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = src;
  window.location.hash = 'lightbox';
}

// Function to handle upload
function handleUpload(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const message = document.getElementById('message');

  fetch('/api/upload', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    message.textContent = data.message || data.error;
    message.style.color = data.error ? 'red' : 'green';
    if (!data.error) {
      e.target.reset();
      // Optionally reload gallery if on same page, but since separate, maybe redirect
      // For now, just show message
    }
  })
  .catch(error => {
    message.textContent = 'Upload failed';
    message.style.color = 'red';
    console.error('Upload error:', error);
  });
}`;

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  if (url.pathname === '/' || url.pathname === '/index.html') {
    return new Response(INDEX_HTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  } else if (url.pathname === '/upload.html') {
    return new Response(UPLOAD_HTML, {
      headers: { 'Content-Type': 'text/html' },
    });
  } else if (url.pathname === '/css/styles.css') {
    return new Response(STYLES_CSS, {
      headers: { 'Content-Type': 'text/css' },
    });
  } else if (url.pathname === '/js/app.js') {
    return new Response(APP_JS, {
      headers: { 'Content-Type': 'application/javascript' },
    });
  } else if (url.pathname === '/api/images' && request.method === 'GET') {
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
  } else if (url.pathname.startsWith('/images/')) {
    // For now, return 404 for images
    return new Response('Image not found', { status: 404 });
  } else {
    return new Response('Not found', { status: 404 });
  }
}