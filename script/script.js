/**
 * Created by NEXUS on 26/02/2017.
 */
let addListBtn = document.getElementById('list-btn');
addListBtn.addEventListener('click', addList);

const listTemplate = `<div class="list panel panel-default">
      <div class="list-header panel-heading">
        <h3 class="panel-title" >New List</h3>
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

const cardTemplate = `<li class="card"><button type="button" class="edit-card btn btn-info btn-xs">Edit card</button><p class="card-content"></p><div class="member-list-on-card">
            </div></li>`;

const memberInitalTemplate = `<span class="member-inital-on-card label label-primary"></span>`;

function addCard() {
  const parent = event.target.closest('.list');
  console.log(parent);
  let ulElm = parent.querySelector('.card-list');
  ulElm.innerHTML += cardTemplate;
}

function addList() {
  addListBtn = document.getElementById('list-btn');
  let parent = addListBtn.closest('main');
  let helper = document.createElement('div');
  helper.innerHTML = listTemplate;
  while (helper.firstChild) {
    parent.insertBefore(helper.firstChild, addListBtn);
  }
  initListTitles();
  // addEventToAddCard(helper.firstChild);
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
  if (answer){
listElm.parentNode.removeChild(listElm);
  } else {
const editElm = listElm.querySelector('.dropdown-menu');
    editElm.style.display = 'none';
  }
  console.log(editElm);
}

// function editCardHandler() {
//
// }





function xhrLoadHandler(){
  const myXhr = event.target;
  const contentType = myXhr.getResponseHeader('content-type');

  let data;
  if (contentType.includes('json')){
    data = JSON.parse(myXhr.response);
  }
  else{
    data = myXhr.response;
  }
  console.log(data);
}

const xhr = new XMLHttpRequest();
xhr.addEventListener('load', xhrLoadHandler);

xhr.open('GET', 'board.json');
xhr.send();


function initListTitles(targetList) {
  const targetParent = targetList || document;

  const addCardBtn = targetParent.getElementsByClassName('card-btn');
  for (const card of addCardBtn) {
    card.addEventListener('click', addCard);
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

  // const EditCardElem = targetParent.querySelector('.edit-card');
  // for (const EditCard of EditCardElem) {
  //   EditBtn.addEventListener('click', editCardHandler);
  // }

}

initListTitles();
