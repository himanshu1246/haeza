/* main.js - Haeza E-commerce Phase 2 */

// 1. GA4 Injection
const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Replace with real GA4 ID

function injectGlobalElements() {
  // GA4
  if (GA4_MEASUREMENT_ID !== "G-XXXXXXXXXX") {
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA4_MEASUREMENT_ID}');
    `;
    document.head.appendChild(script2);
  }
}

// 2. Wishlist Logic
window.wishlist = JSON.parse(localStorage.getItem('haeza_wishlist')) || [];

function saveWishlist() {
  localStorage.setItem('haeza_wishlist', JSON.stringify(window.wishlist));
  updateWishlistIcons();
}

function toggleWishlist(productId) {
  if (window.wishlist.includes(productId)) {
    window.wishlist = window.wishlist.filter(id => id !== productId);
  } else {
    window.wishlist.push(productId);
  }
  saveWishlist();
  
  // If on wishlist page, re-render
  if (window.location.pathname.includes('wishlist.html')) {
    renderWishlistPage();
  }
}

function updateWishlistIcons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.dataset.id;
    if (window.wishlist.includes(id)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Update badges in nav
  const count = window.wishlist.length;
  document.querySelectorAll('.wishlist-badge').forEach(badge => {
    if (count > 0) {
      badge.textContent = count;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  });
}

// 3. Search Logic
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchToggle = document.querySelector('.search-toggle');
  const searchContainer = document.querySelector('.search-container');
  
  if (!searchInput || !searchContainer) return;

  searchToggle.addEventListener('click', () => {
    searchContainer.classList.toggle('active');
    if (searchContainer.classList.contains('active')) {
      searchInput.focus();
    }
  });

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      searchResults.style.display = 'none';
      return;
    }

    const results = window.haezaProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );

    renderSearchResults(results, searchResults);
  });

  // Close search on click outside or Escape
  document.addEventListener('click', (e) => {
    if (!searchContainer.contains(e.target)) {
      searchContainer.classList.remove('active');
      searchResults.style.display = 'none';
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchContainer.classList.remove('active');
      searchResults.style.display = 'none';
    }
  });
}

function renderSearchResults(results, container) {
  container.innerHTML = '';
  if (results.length === 0) {
    container.innerHTML = '<div class="search-result-item">No products found.</div>';
    container.style.display = 'block';
    return;
  }

  results.slice(0, 5).forEach(product => {
    const a = document.createElement('a');
    a.href = `product.html?id=${product.id}`;
    a.className = 'search-result-item';
    a.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div>
        <h4>${product.name}</h4>
        <p>₹${product.price.toFixed(2)}</p>
      </div>
    `;
    container.appendChild(a);
  });
  container.style.display = 'block';
}

// 4. Product Grid Generator
function renderCategoryGrid() {
  const grid = document.getElementById('dynamicProductGrid');
  if (!grid) return;

  const category = grid.dataset.category;
  let products = window.haezaProducts.filter(p => p.category === category);

  // Sorting
  const sortSelect = document.getElementById('sortProducts');
  if (sortSelect) {
    const criteria = sortSelect.value;
    products.sort((a, b) => {
      switch (criteria) {
        case 'price-low-high': return a.price - b.price;
        case 'price-high-low': return b.price - a.price;
        case 'newest': return b.dateAdded - a.dateAdded;
        case 'oldest': return a.dateAdded - b.dateAdded;
        default: return 0;
      }
    });
    
    sortSelect.onchange = renderCategoryGrid;
  }

  grid.innerHTML = '';
  products.forEach(product => {
    const isWishlisted = window.wishlist.includes(product.id) ? 'active' : '';
    const item = document.createElement('div');
    item.className = 'product-item';
    item.innerHTML = `
      <div class="product-image-wrapper">
        <a href="product.html?id=${product.id}" tabindex="-1">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
        </a>
        <button class="wishlist-btn ${isWishlisted}" data-id="${product.id}" aria-label="Add to Wishlist">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
        </button>
        <button class="add-to-cart-btn" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-image="${product.image}">Add to Cart</button>
      </div>
      <div class="product-info">
        <a href="product.html?id=${product.id}" class="product-title-link">
          <h3 class="product-title">${product.name}</h3>
        </a>
        <p class="product-price">₹${product.price.toFixed(2)}</p>
      </div>
    `;
    grid.appendChild(item);
  });

  // Re-attach listeners
  grid.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleWishlist(btn.dataset.id);
    });
  });

  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const product = {
        id: btn.dataset.id,
        name: btn.dataset.name,
        price: parseFloat(btn.dataset.price),
        image: btn.dataset.image
      };
      if (typeof addToCart === 'function') addToCart(product);
    });
  });

  // Refresh GSAP
  if (typeof ScrollTrigger !== 'undefined') {
    ScrollTrigger.refresh();
  }
}

// 5. General DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  injectGlobalElements();
  initSearch();
  renderCategoryGrid();
  updateWishlistIcons();

  /* --- Mobile Navigation --- */
  const navToggle = document.querySelector('.nav-toggle');
  const navMobile = document.querySelector('.nav-mobile');
  const navOverlay = document.querySelector('.nav-overlay');

  function toggleNav() {
    navMobile.classList.toggle('open');
    navOverlay.classList.toggle('open');
    const isOpen = navMobile.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleNav);
  }
  if (navOverlay) {
    navOverlay.addEventListener('click', toggleNav);
  }

  // Keyboard accessibility
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (navMobile && navMobile.classList.contains('open')) toggleNav();
      const cartDrawer = document.querySelector('.cart-drawer');
      if (cartDrawer && cartDrawer.classList.contains('open') && typeof closeCartDrawer === 'function') {
        closeCartDrawer();
      }
    }
  });

  /* --- Sticky Header --- */
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* --- GSAP Animations --- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Hero Parallax
    const heroVideo = document.querySelector('.hero-video-wrapper');
    if (heroVideo) {
      gsap.to(heroVideo, {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true
        }
      });
    }

    // Hero Text
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroTitle && heroSubtitle) {
      gsap.to([heroTitle, heroSubtitle], {
        opacity: 1,
        y: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power3.out",
        delay: 0.5
      });
    }

    // Reveals
    const introImage = document.querySelector('.intro-image img');
    if (introImage) gsap.from(introImage, { scale: 1.1, duration: 1.5, scrollTrigger: { trigger: ".intro", start: "top 80%" }});
    
    const introTexts = document.querySelectorAll('.intro-text > *');
    if (introTexts.length > 0) gsap.from(introTexts, { y: 30, opacity: 0, duration: 1, stagger: 0.2, scrollTrigger: { trigger: ".intro-text", start: "top 85%" }});
    
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length > 0) gsap.from(categoryCards, { y: 50, opacity: 0, duration: 1, stagger: 0.15, scrollTrigger: { trigger: ".categories", start: "top 80%" }});
  }

  /* --- Newsletter Logic --- */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletterEmail').value;
      const submitBtn = document.getElementById('newsletterSubmitBtn');
      const messageDiv = document.getElementById('newsletterMessage');
      
      submitBtn.textContent = 'Subscribing...';
      submitBtn.disabled = true;

      const endpoint = (typeof SHEET_ENDPOINT !== 'undefined') ? SHEET_ENDPOINT : "PASTE_YOUR_APPS_SCRIPT_URL_HERE";

      if (endpoint === "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
        setTimeout(() => {
          messageDiv.textContent = 'Test mode: Subscribed successfully!';
          messageDiv.className = 'newsletter-message success';
          newsletterForm.reset();
          submitBtn.textContent = 'Subscribe';
          submitBtn.disabled = false;
        }, 1000);
        return;
      }

      try {
        const data = { email: email, source: 'newsletter' };
        await fetch(endpoint, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        messageDiv.textContent = 'Thank you for subscribing!';
        messageDiv.className = 'newsletter-message success';
        newsletterForm.reset();
      } catch (error) {
        messageDiv.textContent = 'Error subscribing. Please try again.';
        messageDiv.className = 'newsletter-message error';
      } finally {
        submitBtn.textContent = 'Subscribe';
        submitBtn.disabled = false;
      }
    });
  }

  /* --- Cookie / LocalStorage Notice --- */
  if (!localStorage.getItem('haeza_cookie_consent')) {
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <p>We use localStorage to save your cart and wishlist. <a href="privacy.html" style="text-decoration:underline;">Learn more</a>.</p>
        <button id="acceptCookies" class="btn-cookie">Got it</button>
      </div>
    `;
    document.body.appendChild(banner);
    
    document.getElementById('acceptCookies').addEventListener('click', () => {
      localStorage.setItem('haeza_cookie_consent', 'true');
      banner.style.display = 'none';
    });
  }

});
