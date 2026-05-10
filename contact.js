// Email obfuscation
(function() {

    const user = 'genpeh.work';
    const domain = 'gmail.com';
    const link = document.getElementById('email-link');
    if (link){
        link.href = 'mailto:' + user +'@' + domain;
        link.textContent = user + '@' + domain
    }
})();


// Backend url

const BACKEND_URL = 'https://genpxy-cvbackend.onrender.com/api/contact';


// form
const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const statusBox = document.getElementById('form-status');

form.addEventListener('submit', async function (e) {

  // Stop the browser from doing its default form submit (page reload)
  e.preventDefault();

  // Clear any previous errors
  clearErrors();

  // Collect what the user typed
  const salutation = document.getElementById('salutation').value.trim();
  const name       = document.getElementById('name').value.trim();
  const email      = document.getElementById('email').value.trim();
  const subject    = document.getElementById('subject').value.trim();
  const message    = document.getElementById('message').value.trim();


  // Frontend validation
  let hasError = false;

  if (!salutation) {
    showError('salutation-error', 'Please enter a salutation.');
    hasError = true;
  }

  if (!name) {
      showError('name-error', 'Please enter your name.');
      hasError = true;
  }

  if (!email || !email.includes('@')) {
    showError('email-error', 'Please enter a valid email address.');
    hasError = true;
  }

  if (!subject) {
    showError('subject-error', 'Please enter a subject.');
    hasError = true;
  }

  if (!message) {
    showError('message-error', 'Please enter your message.');
    hasError = true;
  } else if (message.length > 2500) {
    showError('message-error', 'Message must be under 2500 characters.');
    hasError = true;
  }

  // Stop here if any field failed
  if (hasError) return;

  // Send to backend
  // Disable the button so cannot double-submit
  submitBtn.disabled    = true;
  submitBtn.textContent = 'Sending...';

  try {
    const response = await fetch(BACKEND_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      // JSON.stringify converts JS object → text to send over the internet
      body: JSON.stringify({ salutation, name, email, subject, message })
    });

    const result = await response.json();

    if (response.ok) {
      // Success
      showStatus('success', 'Message sent! I\'ll get back to you soon.');
      form.reset(); // clears all the fields
    } else {
      // Backend returned an error (e.g. rate limit, validation fail)
      const errorMsg = result.errors
        ? result.errors.map(e => e.msg).join(', ')
        : result.error || 'Something went wrong.';
      showStatus('error', errorMsg);
    }

  } catch (err) {
    // Network error — couldn't reach the backend at all
    showStatus('error', 'Could not connect. Please try emailing me directly.');
  } finally {
    // Re-enable the button regardless of outcome
    submitBtn.disabled    = false;
    submitBtn.textContent = 'Send Message';
  }
});


// ── Helpers ──

// Shows a red error message under a specific field
function showError(fieldId, message) {
  const el = document.getElementById(fieldId);
  if (el) el.textContent = message;
}

// Clears all field error messages
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  statusBox.textContent  = '';
  statusBox.className    = 'form-status';
}

// Shows a success or error banner at the bottom of the form
function showStatus(type, message) {
  statusBox.textContent = message;
  statusBox.className   = 'form-status ' + type; 
}

