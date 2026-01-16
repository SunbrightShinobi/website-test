// Load gallery images on page load
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('gallery')) {
    loadGallery();
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
