const menu = document.querySelector('#mobile-menu');
const menuToggle = document.querySelector('#menu-toggle');
const menuClose = document.querySelector('.menu-close');

menuToggle?.addEventListener('click', () => {
  menu?.showModal();
  menuToggle.setAttribute('aria-expanded', 'true');
});

menuClose?.addEventListener('click', () => {
  menu?.close();
  menuToggle?.setAttribute('aria-expanded', 'false');
});

menu?.addEventListener('click', event => {
  if (event.target === menu) menu.close();
});

menu?.addEventListener('close', () => menuToggle?.setAttribute('aria-expanded', 'false'));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(item => observer.observe(item));

const form = document.querySelector('[data-brief-form]');
if (form) {
  const service = new URLSearchParams(location.search).get('service');
  if (service && form.elements.service) {
    const option = [...form.elements.service.options].find(item => item.text === service);
    if (option) form.elements.service.value = service;
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const button = form.querySelector('[type="submit"]');
    const status = form.querySelector('.form-message');
    const data = new FormData(form);
    data.append('_subject', `New Creovo Media enquiry — ${data.get('service') || 'Project'}`);
    data.append('form_type', 'Project enquiry');
    data.append('source_page', location.href);
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    if (status) status.textContent = 'Sending your enquiry…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' }
      });
      if (!response.ok) throw new Error('Submission failed');
      form.reset();
      if (status) status.textContent = 'Thank you — your enquiry has been sent. Our team will contact you shortly.';
    } catch {
      if (status) status.textContent = "We couldn't send your enquiry. Please check your connection and try again.";
    } finally {
      button.disabled = false;
      button.removeAttribute('aria-busy');
    }
  });
}
