// PASTE YOUR APPS SCRIPT URL HERE
const SHEET_ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const messageDiv = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');
  const messageInput = document.getElementById('message');

  // Pre-fill message if coming from cart checkout
  const cartEnquiry = sessionStorage.getItem('haeza_cart_enquiry');
  if (cartEnquiry && messageInput) {
    messageInput.value = cartEnquiry;
    // Clear it so it doesn't persist on refresh if they don't want it to
    sessionStorage.removeItem('haeza_cart_enquiry');
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Check Honeypot
      const honeypot = document.getElementById('honeypot');
      if (honeypot && honeypot.value) {
        // Spam bot filled it out, pretend it was successful
        showMessage('Thank you for your message. We will get back to you soon!', 'success');
        form.reset();
        return;
      }

      // Gather data
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      // Basic client validation
      if (!data.name || !data.email || !data.message) {
        showMessage('Please fill out all required fields.', 'error');
        return;
      }

      // UI Update
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;
      hideMessage();

      // If user hasn't set the real URL, just fake success for testing
      if (SHEET_ENDPOINT === "PASTE_YOUR_APPS_SCRIPT_URL_HERE") {
        setTimeout(() => {
          showMessage('Test mode: Please configure your Apps Script URL. Form data was valid.', 'success');
          form.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 1000);
        return;
      }

      try {
        const response = await fetch(SHEET_ENDPOINT, {
          method: 'POST',
          mode: 'no-cors', // Important for Apps Script POST without preflight issues
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        showMessage('Thank you for your message. We will get back to you soon!', 'success');
        form.reset();
        
      } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('There was an error sending your message. Please try again later.', 'error');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  function showMessage(text, type) {
    if (!messageDiv) return;
    messageDiv.textContent = text;
    messageDiv.className = `form-message ${type}`;
  }

  function hideMessage() {
    if (!messageDiv) return;
    messageDiv.className = 'form-message hidden';
  }
});
