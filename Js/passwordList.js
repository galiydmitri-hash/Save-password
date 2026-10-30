function renderItem(values, passwordListEl) {
  if (!passwordListEl) return;
  const passwordItem = document.createElement('div');
  passwordItem.className = 'password-container';
  passwordItem.innerHTML = `
    <p class="name-data">${escapeHTML(values.name)}</p>
    <hr class="line"/>
    <p class="password-data">${escapeHTML(values.password)}</p>
  `;
  passwordListEl.appendChild(passwordItem);
}

let activePasswordListEl = null;
let activeCategoryName = '';

export default function openContainer() {
  const categories = document.querySelectorAll('.categories');
  categories.forEach((category) => {
    const openPasswordInputBtn = category.querySelector('.add-password');
    const categoryNameEl = category.querySelector('.name');
    const passwordListEl = category.querySelector('.password-list');
    const categoryName = categoryNameEl ? categoryNameEl.textContent.trim() : 'default';

    if (passwordListEl) {
      const storedItems = JSON.parse(localStorage.getItem(`passwords_${categoryName}`)) || [];
      passwordListEl.innerHTML = '';
      storedItems.forEach(el => renderItem(el, passwordListEl));
      const lengthEl = category.querySelector('.length');
      if (lengthEl) lengthEl.textContent = storedItems.length;
    }

    if (openPasswordInputBtn) {
      openPasswordInputBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        activePasswordListEl = passwordListEl;
        activeCategoryName = categoryName;
        const modal = document.querySelector('.password-input-container');
        if (modal) modal.classList.add('is-active');
      });
    }

    category.addEventListener('click', (event) => {
      if (event.target.closest('.add-password')) return;
      const target = category.querySelector('.container');
      if (target) {
        target.classList.add('is-active');
      }
    });
  });
}

export function passwordList() {
  const addPassword = document.querySelector('.add-password-btn');
  if (!addPassword) return;

  const newAddPassword = addPassword.cloneNode(true);
  addPassword.parentNode.replaceChild(newAddPassword, addPassword);

  newAddPassword.addEventListener('click', (event) => {
    event.stopPropagation();
    const currentStorageKey = `passwords_${activeCategoryName}`;
    let renderContainerItems = JSON.parse(localStorage.getItem(currentStorageKey)) || [];
    const modal = document.querySelector('.password-input-container');
    if (!modal || !activePasswordListEl) return;

    const nameInput = modal.querySelector('.password-name');
    const passwordInput = modal.querySelector('.password');
    if (!nameInput || !passwordInput) return;

    const inputValueName = nameInput.value.trim();
    const inputValuePassword = passwordInput.value.trim();

    if (!inputValueName || !inputValuePassword) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    const isDuplicate = renderContainerItems.some(
      item => item.name.toLowerCase() === inputValueName.toLowerCase()
    );
    if (isDuplicate) {
      alert('У вас есть такое имя пароля');
      return;
    }

    const values = { name: inputValueName, password: inputValuePassword };
    renderContainerItems.push(values);
    localStorage.setItem(currentStorageKey, JSON.stringify(renderContainerItems));
    renderItem(values, activePasswordListEl);

    const categoryEl = activePasswordListEl.closest('.categories');
    if (categoryEl) {
      const lengthEl = categoryEl.querySelector('.length');
      if (lengthEl) lengthEl.textContent = renderContainerItems.length;
    }

    nameInput.value = '';
    passwordInput.value = '';
    modal.classList.remove('is-active');
  });
}

function escapeHTML(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}
