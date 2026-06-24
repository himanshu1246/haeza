document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = urlParams.get('id');
  const container = document.getElementById('productDetailContainer');
  const breadcrumb = document.getElementById('productBreadcrumb');

  if (!productId || !window.haezaProducts) {
    container.innerHTML = '<h2>Product not found.</h2><a href="index.html" style="text-decoration:underline;">Return Home</a>';
    return;
  }

  const product = window.haezaProducts.find(p => p.id === productId);

  if (!product) {
    container.innerHTML = '<h2>Product not found.</h2><a href="index.html" style="text-decoration:underline;">Return Home</a>';
    return;
  }

  document.title = `${product.name} | Haeza`;
  breadcrumb.innerHTML = `Home / <a href="${product.category}.html" style="text-transform:capitalize; color:var(--color-text);">${product.category}</a> / ${product.name}`;

  // Build images
  const images = product.images || [product.image];
  let thumbnailsHtml = '';
  if (images.length > 1) {
    thumbnailsHtml = `
      <div class="product-thumbnails">
        ${images.map((img, idx) => `<img src="${img}" class="product-thumbnail ${idx === 0 ? 'active' : ''}" onclick="setMainImage(this, '${img}')">`).join('')}
      </div>
    `;
  }

  const isWishlisted = (window.wishlist && window.wishlist.includes(product.id)) ? 'active' : '';

  // Render main product
  container.innerHTML = `
    <div class="product-detail-container">
      <div class="product-gallery">
        <img src="${product.image}" alt="${product.name}" class="product-main-image" id="mainProductImage">
        ${thumbnailsHtml}
      </div>
      <div class="product-info-panel">
        <h1>${product.name}</h1>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <p class="product-description">${product.description}</p>
        
        <div class="product-actions">
          <button class="btn-add-cart" id="detailAddToCart">Add to Cart</button>
          <button class="btn-wishlist ${isWishlisted}" id="detailWishlist" aria-label="Add to Wishlist">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          </button>
        </div>
      </div>
    </div>
    
    <div class="related-products">
      <h2>You may also like</h2>
      <div class="related-grid" id="relatedProductsGrid"></div>
    </div>
  `;

  // Attach events
  document.getElementById('detailAddToCart').addEventListener('click', () => {
    if (typeof addToCart === 'function') {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
    }
  });

  document.getElementById('detailWishlist').addEventListener('click', (e) => {
    if (typeof toggleWishlist === 'function') {
      toggleWishlist(product.id);
      e.currentTarget.classList.toggle('active');
    }
  });

  // Render related
  const relatedGrid = document.getElementById('relatedProductsGrid');
  const related = window.haezaProducts
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  relatedGrid.innerHTML = related.map(p => `
    <div class="related-item">
      <a href="product.html?id=${p.id}"><img src="${p.image}" alt="${p.name}" loading="lazy"></a>
      <a href="product.html?id=${p.id}" style="color:var(--color-text); text-decoration:none;">
        <h4 style="margin:0.5rem 0 0.2rem;">${p.name}</h4>
      </a>
      <p style="margin:0; font-size:0.9rem;">$${p.price.toFixed(2)}</p>
    </div>
  `).join('');
});

// Global helper for thumbnails
window.setMainImage = function(thumbElement, src) {
  document.getElementById('mainProductImage').src = src;
  document.querySelectorAll('.product-thumbnail').forEach(el => el.classList.remove('active'));
  thumbElement.classList.add('active');
};
