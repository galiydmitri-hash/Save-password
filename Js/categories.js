import closeContainer from "./close.js";
import openContainer from "./passwordList.js";

export default function categories() {
  const addBtn = document.querySelector('.add-btn');
  const categoriesList = document.querySelector('.categories-container');
  const inputContainer = document.querySelector('.categories-input-container');
  const categoriesName = document.querySelector('.categories-name');
  const addCategoriesBtn = document.querySelector('.add-categories-btn');
  const plus = document.querySelector('.plus');
  const closeBtn = document.querySelector('.close-btn');

  let renderCategories = JSON.parse(localStorage.getItem('categories_list')) || [];

  function icon(text) {
    const iconArray = [
      {
        id: "ережа", 
        code: `<svg xmlns="http://www.w3.org/2000/svg" class="icon" viewBox="0 0 64 64" width="64" height="64" fill="none"><circle cx="32" cy="32" r="24" stroke="currentColor" stroke-width="4"/><path d="M8 32H56 M32 8C22 18 22 46 32 56 M32 8C42 18 42 46 32 56 M13 20H51 M13 44H51" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/></svg>`
      },
      {
        id: "Банк",
        code: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" fill="currentColor" class="icon"><path d="M7 23.5L29.9 9.8a4 4 0 0 1 4.2 0L57 23.5a2.5 2.5 0 0 1-1.3 4.6H8.3A2.5 2.5 0 0 1 7 23.5Z"/><rect x="8" y="30" width="48" height="4" rx="2"/><rect x="13" y="35" width="7" height="14" rx="3.5"/><rect x="23" y="35" width="7" height="14" rx="3.5"/><rect x="34" y="35" width="7" height="14" rx="3.5"/><rect x="44" y="35" width="7" height="14" rx="3.5"/><rect x="10" y="51" width="44" height="5" rx="2.5"/><rect x="6" y="57" width="52" height="3" rx="1.5"/></svg>`
      }
    ];

    const matchedIcon = iconArray.find(item => text.includes(item.id));
    return matchedIcon ? matchedIcon.code : '';
  }

  function createItem(text) {
    if (!categoriesList) return;
    const item = document.createElement('div');
    item.className = 'categories';
    item.innerHTML = `
      <div>${icon(text)}</div>
      <p class="name">${escapeHTML(text)}</p>
      <p class="length">0</p>
      <div class="container close">
        <div class="password-list"></div>
        <button class="add-password">Додати пароль</button>
      </div>`;
    categoriesList.appendChild(item);
    openContainer()
    closeContainer()
  }

  renderCategories.forEach(element => {
    createItem(element);
  });

  if (addBtn && inputContainer && plus) {
    addBtn.addEventListener('click', () => {
      addBtn.classList.add('is-active');
      inputContainer.classList.add('is-active');
      plus.classList.add('is-disable');
    });
  }

  function closeInputForm() {
    if (addBtn) addBtn.classList.remove('is-active');
    if (inputContainer) inputContainer.classList.remove('is-active');
    if (plus) plus.classList.remove('is-disable');
    if (categoriesName) categoriesName.value = ''; 
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeInputForm();
    });
  }

  if (addCategoriesBtn) {
    addCategoriesBtn.addEventListener('click', () => {
      if (!categoriesName) return;
      const inputValueName = categoriesName.value.trim();

      if (inputValueName.length === 0) return;

      renderCategories.push(inputValueName);
      localStorage.setItem('categories_list', JSON.stringify(renderCategories));

      createItem(inputValueName);
      closeInputForm();
    });
  }    
}

function escapeHTML(str) {
  if (str === undefined || str === null) return '';
  return String(str).replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}
