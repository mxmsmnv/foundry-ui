const staticForm = document.querySelector('[data-static-form]');

if (staticForm) {
  staticForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = staticForm.querySelector('[data-form-status]');
    status.textContent = 'Preview complete — secure form delivery will be enabled at launch.';
    status.focus();
  });
}
