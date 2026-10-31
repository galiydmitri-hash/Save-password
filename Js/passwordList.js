function renderItem(values, passwordListEl) {
  if (!passwordListEl) return;
  const passwordItem = document.createElement('div');
  passwordItem.className = 'password-container';
  
  passwordItem.dataset.id = values.id;
  
  passwordItem.innerHTML = `
    <p class="name-data">${escapeHTML(values.name)}</p>
    <hr class="line" />
    <p class="password-data">${escapeHTML(values.password)}</p>
    <div class="actions-container">
      <button class="delete-btn">Видалити</button>
    </div>
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

    const values = { 
      id: crypto.randomUUID(), 
      name: inputValueName, 
      password: inputValuePassword 
    };
    
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

export function initDeleteBtn() {
  const categories = document.querySelectorAll('.categories');

  categories.forEach((category) => {
    category.addEventListener('click', (event) => {
      const passwordContainer = event.target.closest('.password-container');
      if (!passwordContainer) return;

      const actionsContainer = passwordContainer.querySelector('.actions-container');
      if (!actionsContainer) return;

      const deleteBtn = actionsContainer.querySelector('.delete-btn');

      if (deleteBtn && deleteBtn.contains(event.target)) {
        event.stopPropagation();

        const itemId = passwordContainer.dataset.id;
        if (!itemId) return;

        const categoryNameEl = category.querySelector('.name');
        const categoryName = categoryNameEl ? categoryNameEl.textContent.trim() : 'default';
        const currentStorageKey = `passwords_${categoryName}`;

        let storage = JSON.parse(localStorage.getItem(currentStorageKey)) || [];
        storage = storage.filter((item) => String(item.id) !== String(itemId));
        localStorage.setItem(currentStorageKey, JSON.stringify(storage));

        const lengthEl = category.querySelector('.length');
        if (lengthEl) lengthEl.textContent = storage.length;

        passwordContainer.remove();
        return;
      }

      if (event.target === actionsContainer) return;

      if (actionsContainer.classList.contains('is-active')) {
        actionsContainer.classList.remove('is-active');
        return;
      }

      document.querySelectorAll('.actions-container.is-active').forEach((el) => {
        el.classList.remove('is-active');
      });

      const rect = passwordContainer.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      actionsContainer.classList.add('is-active');

      const containerWidth = actionsContainer.getBoundingClientRect().width;
      const containerHeight = actionsContainer.getBoundingClientRect().height;

      const spaceBelow = rect.height - y;
      const spaceRight = rect.width - x;

      if (spaceBelow < containerHeight && y > containerHeight) {
        actionsContainer.style.top = `${y - containerHeight}px`;
      } else {
        actionsContainer.style.top = `${Math.max(0, Math.min(y, rect.height - containerHeight))}px`;
      }

      if (spaceRight < containerWidth && x > containerWidth) {
        actionsContainer.style.left = `${x - containerWidth}px`;
      } else {
        actionsContainer.style.left = `${Math.max(0, Math.min(x, rect.width - containerWidth))}px`;
      }
    });
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
