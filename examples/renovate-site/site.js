const menuButton = document.querySelector('[data-menu-button]');
const navigation = document.querySelector('[data-navigation]');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = navigation.classList.toggle('is-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      navigation.classList.remove('is-open');
      menuButton.setAttribute('aria-expanded', 'false');
    }
  });
}

const staticForm = document.querySelector('[data-static-form]');

if (staticForm) {
  staticForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const status = staticForm.querySelector('[data-form-status]');
    if (status) {
      status.textContent = 'Preview only — form delivery will be connected in ProcessWire.';
      status.focus();
    }
  });
}
