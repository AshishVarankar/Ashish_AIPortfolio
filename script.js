document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.querySelectorAll('.nav-links a');
  const contactForm = document.getElementById('contact-form');
  const successMessage = document.querySelector('.success-message');
  const hamburger = document.querySelector('.hamburger');
  const navLinksMenu = document.querySelector('.nav-links');

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  // Hamburger menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navLinksMenu.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked
  if (navLinksMenu) {
    navLinksMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navLinksMenu.classList.remove('active');
      });
    });
  }

  navLinks.forEach(link => {
    const href = link.getAttribute('href').split('#')[0];
    const normalizedHref = href === '' ? 'index.html' : href;
    const isCurrentPage = normalizedHref === currentPage || 
                          (currentPage === '' && normalizedHref === 'index.html') ||
                          (currentPage === '/' && normalizedHref === 'index.html');

    if (isCurrentPage) {
      link.classList.add('nav-active');
    } else {
      link.classList.remove('nav-active');
    }
  });

  const statusCard = document.getElementById('status-card');
  const dismissStatus = document.getElementById('dismiss-status');
  const spinner = document.getElementById('spinner');
  const statusText = document.getElementById('status-text');

  if (contactForm && statusCard && spinner && statusText && dismissStatus) {
    contactForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      
      // Show loading state
      statusCard.classList.remove('hidden');
      spinner.classList.remove('hidden');
      statusText.textContent = 'Sending your message...';
      dismissStatus.style.display = 'none';
      
      if (!supabaseClient) {
        spinner.classList.add('hidden');
        statusText.textContent = 'Supabase client unavailable. Check the script order or network.';
        statusCard.style.borderColor = '#ef4444';
        statusCard.style.backgroundColor = '#fef2f2';
        dismissStatus.style.display = 'inline-block';
        return;
      }

      const formData = new FormData(contactForm);
      const submissionData = {
        full_name: formData.get('fullName'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
      };
      
      try {
        const { error } = await supabaseClient
          .from('contact_submissions')
          .insert([submissionData]);
        
        if (error) throw error;
        
        spinner.classList.add('hidden');
        statusCard.classList.add('hidden');
        successMessage.classList.add('visible');
        contactForm.reset();
        
        setTimeout(() => {
          successMessage.classList.remove('visible');
        }, 5000);
      } catch (error) {
        console.error('Error submitting form:', error);
        spinner.classList.add('hidden');
        statusText.textContent = error?.message || 'Failed to send message. Please try again.';
        statusCard.style.borderColor = '#ef4444';
        statusCard.style.backgroundColor = '#fef2f2';
        dismissStatus.style.display = 'inline-block';
      }
    });
  }

  if (dismissStatus && statusCard) {
    dismissStatus.addEventListener('click', function () {
      statusCard.classList.add('hidden');
      // Reset styles
      statusCard.style.borderColor = '';
      statusCard.style.backgroundColor = '';
      dismissStatus.style.display = '';
    });
  }
});

