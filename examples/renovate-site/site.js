const staticForm = document.querySelector('[data-static-form]');

if (staticForm) {
  staticForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = staticForm.querySelector('[data-form-status]');
    status.textContent = 'Preview only — form delivery will be connected in ProcessWire.';
    status.focus();
  });
}
