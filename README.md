# Haeza - Premium Women's Fashion

Haeza is a beautiful, modern, and highly responsive premium women's fashion e-commerce storefront. Designed with minimalism and elegance in mind, the platform offers a seamless shopping experience across multiple categories including Clothes, Jewellery, Bags, Shoes, Beauty, and Perfume.

## Features
- **Stunning UI/UX**: Clean, minimalist design that puts the focus entirely on the high-quality product imagery.
- **Dynamic Product Rendering**: Products are dynamically loaded and injected via Vanilla JavaScript, making it incredibly easy to manage the catalog without touching the HTML.
- **Wishlist Functionality**: A fully functional wishlist system that persists user choices via `localStorage`. Users can effortlessly heart their favorite items across the site.
- **Smooth Animations**: High-performance scrolling animations, reveals, and micro-interactions powered by GSAP.
- **Responsive Design**: Flawless experience across all devices, from ultra-wide monitors to mobile phones, utilizing CSS Grid and Flexbox.
- **No Build Steps**: 100% Vanilla HTML, CSS, and JavaScript. No complex frameworks or build tools required.

## Tech Stack
- **HTML5**: Semantic and accessible markup.
- **CSS3**: Custom CSS with variables for design tokens. No CSS frameworks used to maintain absolute control over the design.
- **JavaScript (ES6)**: Modular vanilla JavaScript for routing, DOM manipulation, and dynamic rendering.
- **GSAP**: The GreenSock Animation Platform for buttery-smooth scroll interactions.

## Local Development
Since the project relies purely on static files, you can run it instantly:
1. Clone the repository to your local machine.
2. Open `index.html` in your browser.
3. *Optional*: Use an extension like **Live Server** in VS Code for hot-reloading during development.

## Project Structure
- `assets/` - Contains all images, videos, and favicons used across the site.
- `css/global.css` - The single source of truth for all styling, variables, and responsive breakpoints.
- `js/main.js` - Core logic for routing, animations, the wishlist system, and layout injection.
- `js/products.js` - The JSON-like catalog database containing all product details.
- `js/form.js` - Handles the logic for the contact/enquiry form.

## Author
Developed for Haeza to redefine elegance in the digital space.
