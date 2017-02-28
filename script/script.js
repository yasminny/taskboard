/**
 * Created by NEXUS on 26/02/2017.
 */
let addListBtn = document.getElementById('list-btn');
const addCardBtn = document.getElementsByClassName('card-btn');

addListBtn.addEventListener('click', addList);
addEventToAddCard();

function addEventToAddCard() {
  for (const card of addCardBtn) {
    card.addEventListener('click', addCard);
  }
}

function addCard() {
  console.log(event);
  let ulElm = event.target.parentNode.querySelector('ul');
  ulElm.innerHTML += `<li class="card"></li>`;
}

const listTemplate = `<div class="list panel panel-default">
  <button class="list-header panel-heading"><h3 class="panel-title">New List</h3><input type="text"></button>
  <ul>
  </ul>
  <button class="card-btn add-card panel-footer">Add a card...</button>
</div>`;


function addList() {
  addListBtn = document.getElementById('list-btn');
  let parent = addListBtn.parentNode;
  let helper = document.createElement('div');
  helper.innerHTML = listTemplate;
  while (helper.firstChild) {
    parent.insertBefore(helper.firstChild, addListBtn);
  }
  initListTitles();
  addEventToAddCard(helper.firstChild);
}

function titleClickHandler() {

    const target = event.target;
    target.style.display = 'none';
    const inputElm = target.parentNode.querySelector('input');
    inputElm.value = target.textContent;
    inputElm.style.display = 'inline-block';
    inputElm.focus();
}

function titleInputKeyHandler() {
  const target = event.target;
  if (event.keyCode === 13) {
    const value = event.target.value;
    const titleElm = target.parentNode.querySelector('h3');

    titleElm.innerHTML = value;
    target.style.display = 'none';
    titleElm.style.display = 'inline-block';
  }
}

function initListTitles(targetList) {
  const targetParent = targetList || document;
  const titleElem = targetParent.querySelectorAll('.list-header h3');
  for (const title of titleElem) {
    title.addEventListener('click', titleClickHandler);

  }
  const titleInputElem = targetParent.querySelectorAll('.list-header input');
  for (const titleInput of titleInputElem) {
    titleInput.addEventListener('keydown', titleInputKeyHandler);
    titleInput.addEventListener('blur', titleInputKeyHandler);
  }
}

initListTitles();

