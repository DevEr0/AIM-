// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
      // Toggle menu on hamburger click
      hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
      });

      // Close menu when a nav link is clicked
      document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navLinks.classList.remove('active');
        });
      });
    }

    // Global form handling: the contact form (index) and the newsletter
    // form (present in every page's footer) previously reloaded the page
    // on submit because no handler was attached.
    document.querySelectorAll('.contact-form, .footer-newsletter form').forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = new FormData(form).get('email') || '';
        alert('Շնորհակալություն, մենք կկապվենք ձեզ հետ՝ ' + email);
        form.reset();
      });
    });
  });