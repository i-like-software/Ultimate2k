const application = document.querySelector('#sales-application');

application.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(application);
  const sections = [
    ['Full name', 'name'], ['Email', 'email'], ['Phone', 'phone'],
    ['LinkedIn or CV', 'profile'], ['1. Sales experience and clients', 'experience'],
    ['2. Largest deal closed', 'deal'], ['3. Five organisations to approach', 'prospects'],
    ['4. Commission-only experience', 'commission'],
  ];
  const body = sections.map(([label, name]) => `${label}:\r\n${fields.get(name).trim()}`).join('\r\n\r\n');
  const draft = document.querySelector('#application-draft');
  document.querySelector('#application-body').value = body;
  document.querySelector('#application-email').href = `mailto:info@ultimate2k.co.za?subject=Ultimate2k%20sales%20application&body=${encodeURIComponent(body)}`;
  draft.hidden = false;
  application.querySelector('.form-status').textContent = 'Your draft is ready. Open your email app to send it, or copy the draft into webmail.';
  document.querySelector('#application-body').focus();
});
