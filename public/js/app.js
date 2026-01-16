// Load gallery images on page load
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
        img.src = `images/${image}`;
        img.alt = image;
        img.addEventListener('click', () => openLightbox(`images/${image}`));
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
}