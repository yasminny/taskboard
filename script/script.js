/**
 * Created by NEXUS on 26/02/2017.
 */
let addListBtn = document.getElementById('list-btn');
addListBtn.addEventListener('click', addList);
const modal = document.querySelector('.modal');
console.log(modal);

function addCard(task, target) {
  let ulElm = target.querySelector('.card-list');
  let helper = document.createElement('div');

  helper.innerHTML = `
    <li class="card">
      <button type="button" class="edit-card btn btn-info btn-xs" data-toggle="modal" data-target="#myModal">Edit card</button>
      <p class="card-content">${task.text}</p>
      <div class="member-list-on-card"></div>
  </li>`;

  const newCard = ulElm.appendChild(helper.querySelector('.card'));
  const memberList = newCard.querySelector('div');
  const members = task.members;

  if (members.length > 0) {
    for (let mem of members) {
      const memberName = mem;
      const nameArray = mem.split(' ');

      const inital = nameArray[0].split('')[0] + nameArray[1].split('')[0];

      memberList.innerHTML += `<span class="member-inital-on-card label label-primary" title="${memberName}">${inital}</span>`;
    }
  }

  let editBtn = newCard.querySelector('.edit-card');
  editBtn.addEventListener('click', editModalShow);
}

function editModalShow() {
  modal.style.display = 'block';
  modal.style.opacity = 1;
const card = event.target.closest('.card');
const list = card.closest('.list');

const cardContent = card.querySelector('.card-content').innerHTML;
console.log(cardContent);
const editContent = modal.querySelector('textarea');
editContent.innerHTML = cardContent;

const listLists = modal.querySelector('.form-control');
  const listHeader = list.querySelector('.panel-title').innerHTML;
  const listHeaders = document.querySelectorAll('.panel-title');
  for (const header of listHeaders){
    let header = header.innerHTML;
    console.log(header);
    listLists.innerHTML = `<option>${header}</option>`;
  }
}

function addList(list) {
  let title = list.title || 'New List';
  const listTemplate = `<div class="list panel panel-default">
      <div class="list-header panel-heading">
        <h3 class="panel-title" >${title}</h3>
        <input type="text" maxlength="30">
        <div class="dropdown">
          <button class="list-arrow btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            <span class="caret"></span>
          </button>
          <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
            <li class="delete-list"><a href="#">Delete List</a></li>
          </ul>
        </div>
      </div>
      <div class="panel-body">
  <ul class="card-list">
  </ul>
  </div>
  <button class="card-btn add-card panel-footer">Add a card...</button>
</div>`;

  addListBtn = document.getElementById('list-btn');
  let parent = addListBtn.closest('main');
  let helper = document.createElement('div');
  helper.innerHTML = listTemplate;
  const newList = parent.insertBefore(helper.firstChild, addListBtn);
  initListTitles();
  return newList;
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

function titleInputBlurHandler() {
  const target = event.target;
  const value = event.target.value;
  const titleElm = target.parentNode.querySelector('h3');

  titleElm.innerHTML = value;
  target.style.display = 'none';
  titleElm.style.display = 'inline-block';
}

function titleDeleteClickHandler() {
  const target = event.target;
  const editElm = target.closest('.dropdown').querySelector('.dropdown-menu');
  editElm.style.display = 'inline-block';
  const parentElm = target.parentNode;
  parentElm.blur();
  editElm.focus();
}

function deleteListHandler() {
  const target = event.target;
  const titleElm = target.closest('.list-header').querySelector('h3');
  const listName = titleElm.innerHTML;
  let answer = confirm(`Deleting ${listName} list. Are you sure?`);

  const listElm = target.closest('.list');
  console.log(target.parentNode.parentNode.parentNode);
  if (answer) {
    listElm.parentNode.removeChild(listElm);
  } else {
    const editElm = listElm.querySelector('.dropdown-menu');
    editElm.style.display = 'none';
  }
  console.log(editElm);
}


function xhrLoadHandler() {
  const myXhr = event.target;
  const contentType = myXhr.getResponseHeader('content-type');

  let data;
  if (contentType.includes('json')) {
    data = JSON.parse(myXhr.response);
  }
  else {
    data = myXhr.response;
  }
  const lists = data.board;

  initListsFromData(lists);
}

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', xhrLoadHandler);

xhr.open('GET', 'assets/board.json');
xhr.send();


function initListTitles(targetList) {
  const targetParent = targetList || document;

  //TODO: move inside creatio

  const addCardBtn = targetParent.getElementsByClassName('card-btn');
  for (const card of addCardBtn) {
    card.addEventListener('click', function (e) {
      const emptyCard = {
        "text": "",
        "members": []
      };
      addCard(emptyCard, e.target.closest('.list'));
    });
  }

  const titleElem = targetParent.querySelectorAll('.list-header h3');
  for (const title of titleElem) {
    title.addEventListener('click', titleClickHandler);

  }
  const titleInputElem = targetParent.querySelectorAll('.list-header input');
  for (const titleInput of titleInputElem) {
    titleInput.addEventListener('keydown', titleInputKeyHandler);
    titleInput.addEventListener('blur', titleInputBlurHandler);
  }

  const titleEditElem = targetParent.querySelectorAll('.list-arrow');
  for (const titleEdit of titleEditElem) {
    titleEdit.addEventListener('click', titleDeleteClickHandler);
  }

  const EditBtnElem = targetParent.querySelectorAll('.delete-list');
  for (const EditBtn of EditBtnElem) {
    EditBtn.addEventListener('click', deleteListHandler);
  }

}

initListTitles();

function initListsFromData(lists) {
  let newList;
  for (const list of lists) {
    newList = addList(list);
    if (list.tasks.length > 0) {
      for (task of list.tasks) {
        addCard(task, newList);
      }
    }
  }
}

const xBtn = modal.querySelector('span');
const closeEditBtn = modal.querySelector('.close-modal-btn');
closeEditBtn.addEventListener('click', editModalHide);

xBtn.addEventListener('click', editModalHide);

function editModalHide() {
  modal.style.display = 'none';
  modal.style.opacity = 0;
}
