/**
 * Created by NEXUS on 26/02/2017.
 */
/**
 * --------------------VIew (UI manipulation)-------------------
 */
function getAppData() {
  const cacheData = MODEL.getCacheData();

  if (cacheData) {
    initPageByHash();
  }
  else {
    MODEL.getBoardData();
    MODEL.getMembersData();
  }
}
// no hash checked + corrected => create UI function was called.
function initPageByHash() {
  window.addEventListener('hashchange', changeMainView);
  if (window.location.hash === '') {
    window.location.hash = '#board';
    return;
  }

  changeMainView();
}

//---------------------creating basic UI--------------------------------------

function changeMainView() {
  const hash = window.location.hash;
  const navbar = document.querySelector('.navbar-nav');
  const main = document.querySelector('main');

  if (hash === '#board') {
    main.innerHTML = `<button class="add-list panel panel-info panel-heading" id="list-btn"><h3 class="panel-title">Add a list...</h3>
    </button>
    <div class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span
              aria-hidden="true">&times;</span></button>
            <h4 class="modal-title">Edit card</h4>
          </div>
          <div class="modal-body">
            <form class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-2 control-label">Card text:</label>
                <div class="col-sm-10">
                  <textarea class="form-control card-text" rows="3"></textarea>
                  <span class="relevent-card-id"></span>
                  <span class="relevent-list-id"></span>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label">Move to:</label>
                <div class="col-sm-10">
                  <select class="form-control lists-options">
                    
                  </select>
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-2 control-label">Members:</label>
                <div class="col-sm-10">
                  <div class="panel panel-default panel-for-members">
                    <div class="panel-body card-members-list">
                      
                    </div>

                  </div>
                </div>
              </div>
            </form>
            <button type="button" class="btn btn-danger delete-card-btn">Delete card</button>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default close-modal-btn" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary save-changes-btn">Save changes</button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->`;
    navbar.innerHTML = `<li class="active board-btn"><a href="#board">Board <span class="sr-only">(current)</span></a></li><li class="members-btn"><a href="#members">Members</a></li>`;
    // initListsFromData(appData.lists);

    let addListBtn = document.getElementById('list-btn');
    addListBtn.addEventListener('click', addList);

    const modal = document.querySelector('.modal');
    const xBtn = modal.querySelector('span');
    const closeEditBtn = modal.querySelector('.close-modal-btn');
    const saveChangesBtn = modal.querySelector('.save-changes-btn');
    const deleteCardBtn = modal.querySelector('.delete-card-btn');
    const lists = MODEL.getAppDataLists();

    closeEditBtn.addEventListener('click', editModalHide);
    xBtn.addEventListener('click', editModalHide);
    saveChangesBtn.addEventListener('click', editCardSaved);
    deleteCardBtn.addEventListener('click', deleteCard);


// loop over the lists
    for (const list of lists) {
      addList(list);
    }
  }

  if (hash === '#members') {
    const members = MODEL.getAppDataMembers();
    navbar.innerHTML = `<li class="board-btn"><a href="#board">Board </a></li><li class="members-btn active"><a href="#members">Members<span class="sr-only">(current)</span></a></li>`;
    main.innerHTML = `<section id="member-section">
  <h1>Taskboard Members</h1>
  <ul class="list-group members-group">
    <li class="list-group-item add-member input-group-lg">
      <input type="text" maxlength="30" placeholder="Add new member" class="add-member-input form-control">
      <button type="button" class="btn btn-primary add-member-btn" data-toggle="button" aria-pressed="false" autocomplete="off">
        Add
      </button>
    </li>
  </ul>
</section>`;

    initMembersFromData(members);
  }

}


// ---------------------board UI functions---------------------------------


function addList(list) {
  let title = list.title || 'New list';
  let id = list.id || uuid();

  const listTemplate = `<div class="list panel panel-default" data-id="${id}">
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

  const addListBtn = document.getElementById('list-btn');
  let parent = addListBtn.closest('main');
  let helper = document.createElement('div');
  helper.innerHTML = listTemplate;

  const newList = parent.insertBefore(helper.firstChild, addListBtn);
  const addCardBtn = newList.querySelector('.card-btn');
  addCardBtn.addEventListener('click', addEmptyNewCard);

  initListTitles();

  if (list.title) {
    if (list.tasks.length > 0) {
      for (const task of list.tasks) {
        addCard(task, newList);
      }
    }
  }
// // loop over list.tasks
//   for (const task of list.tasks) {
//     addCard(task, newList);
//   }

  if (!list.title) {
    MODEL.newListAddedToAppData(id);
  }
}

function initListTitles(targetList) {
  const targetParent = targetList || document;

  // const addCardBtn = targetParent.getElementsByClassName('card-btn');
  // // for (const card of addCardBtn) {
  // //   card.addEventListener('click', function (e) {
  // //     const emptyCard = {
  // //       "text": "",
  // //       "members": []
  // //     };
  // //     addCard(emptyCard, e.target.closest('.list'));
  // //   });
  // // }

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

function titleClickHandler(event) {

  const target = event.target;
  target.style.display = 'none';
  const inputElm = target.parentNode.querySelector('input');
  inputElm.value = target.textContent;
  inputElm.style.display = 'inline-block';
  inputElm.focus();
}

function titleInputKeyHandler(event) {
  const target = event.target;
  const list = target.closest('.list');
  const id = list.getAttribute('data-id');
  if (event.keyCode === 13) {
    const value = event.target.value;
    const titleElm = target.parentNode.querySelector('h3');

    MODEL.AppDataListTitleEdit(id, value);
    titleElm.innerHTML = value;
    target.style.display = 'none';
    titleElm.style.display = 'inline-block';
  }
}

function titleInputBlurHandler(event) {
  const target = event.target;
  const list = target.closest('.list');
  const id = list.getAttribute('data-id');
  const value = target.value;
  const titleElm = target.parentNode.querySelector('h3');
  AppDataListTitleEdit(id, value);
  titleElm.innerHTML = value;
  target.style.display = 'none';
  titleElm.style.display = 'inline-block';
}

function titleDeleteClickHandler(event) {
  const target = event.target;
  const editElm = target.closest('.dropdown').querySelector('.dropdown-menu');
  const parentElm = target.parentNode;
  if(editElm.style.display === 'inline-block'){
    editElm.style.display = 'none';
  }
  else {
    editElm.style.display = 'inline-block';
  }
  parentElm.blur();
  editElm.focus();
}

function deleteListHandler(event) {
  const target = event.target;
  const list = target.closest('.list');
  const id = list.getAttribute('data-id');
  const titleElm = target.closest('.list-header').querySelector('h3');
  const listName = titleElm.innerHTML;
  let answer = confirm(`Deleting ${listName} list. Are you sure?`);

  const listElm = target.closest('.list');
  if (answer) {
    listElm.parentNode.removeChild(listElm);
    MODEL.deleteListFromAppData(id);

  } else {
    const editElm = listElm.querySelector('.dropdown-menu');
    editElm.style.display = 'none';
  }
}

function addCard(task, target) {
  let ulElm = target.querySelector('.card-list');
  let helper = document.createElement('div');
  const idTask = task.id;

  helper.innerHTML = `<li class="card" data-id="${idTask}">
      <button type="button" class="edit-card btn btn-info btn-xs" data-toggle="modal" data-target="#myModal">Edit card</button>
      <p class="card-content">${task.text}</p>
      <div class="member-list-on-card"></div>
  </li>`;
  const newCard = ulElm.appendChild(helper.querySelector('.card'));

  const memberList = newCard.querySelector('div');
  const members = task.members;
const fullMembersList = MODEL.getAppDataMembers();

  if (members.length > 0) {
    let memberName;
    for (let mem of members) {
      for (const appDataMem of fullMembersList) {
        if (mem === appDataMem.id) {
          memberName = appDataMem.name;
          let nameArray = memberName.split(' ');
          let inital = '';
          nameArray.forEach((arr) => inital += arr[0]);

          memberList.innerHTML += `<span class="member-inital-on-card label label-primary" title="${memberName}">${inital}</span>`;

        }
      }
    }
  }

  let editBtn = newCard.querySelector('.edit-card');
  editBtn.addEventListener('click', editModalShow);
}

function addEmptyNewCard(event) {
  const list = event.target.closest('.list');
  const listId = list.getAttribute('data-id');
  let ulElm = list.querySelector('.card-list');
  let helper = document.createElement('div');
  const idTask = uuid();

  helper.innerHTML = `<li class="card taskCounter-${taskCounter}" data-id="${idTask}">
      <button type="button" class="edit-card btn btn-info btn-xs" data-toggle="modal" data-target="#myModal">Edit card</button>
      <p class="card-content">?</p>
      <div class="member-list-on-card"></div>
  </li>`;

  const newCard = ulElm.appendChild(helper.querySelector('.card'));
  let editBtn = newCard.querySelector('.edit-card');
  editBtn.addEventListener('click', editModalShow);

  const title = list.querySelector('.panel-title').textContent;

  let appDataRelevantList = MODEL.findAppDataRelevantList(listId);

  MODEL.newCardAddedByUserPushedToAppData(idTask, appDataRelevantList);
}

function editModalShow(event) {
  const modal = document.querySelector('.modal');
  modal.style.display = 'block';
  modal.style.opacity = 1;

  const card = event.target.closest('.card');
  const cardNumber = card.getAttribute('data-id');
  // console.log(card);
  modal.querySelector('.relevent-card-id').textContent = cardNumber;
  const list = card.closest('.list');
  // const listTitle = list.querySelector('.panel-title').textContent;
  const listId = list.getAttribute('data-id');
  modal.querySelector('.relevent-list-id').textContent = listId;
  const editContent = modal.querySelector('.card-text');
  const moveToList = modal.querySelector('.lists-options');
  const lists = MODEL.getAppDataLists();

  //fills the move to list
  for (const list of lists) {
    if (list.id === listId) {
      moveToList.innerHTML += `<option value="${list.title}" data-id="${list.id}" selected>${list.title}</option>`;
    }
    else {
      moveToList.innerHTML += `<option value="${list.title}" data-id="${list.id}">${list.title}</option>`;
    }
  }
  const appDataRelevantList = lists.find((list) => {
    return list.id === listId;
  });

  //fills the card edit content with the text
  const appDataRelevantCard = appDataRelevantList.tasks.find((task) => task.id === cardNumber);
  editContent.textContent = appDataRelevantCard.text;
  editContent.value = appDataRelevantCard.text;

  //fills the members list
  const cardMemberList = modal.querySelector('.card-members-list');
  const membersList = MODEL.getAppDataMembers();
  for (const mem of membersList) {
    cardMemberList.innerHTML += `<div class="checkbox member-in-modal">
                        <label>
                          <input type="checkbox" value="${mem.name}" data-id="${mem.id}">
                          ${mem.name}
                        </label>
                      </div>`;
    const taskMembers = findTaskMembersByCardId(cardNumber);
    for (const member of taskMembers) {
      if (member === mem.id) {
        const inputElm = cardMemberList.querySelectorAll('input');
        for (const input of inputElm) {
          if (input.value === mem.name) {
            input.checked = true;
            input.setAttribute('checked', 'true');
          }
        }
      }
    }

  }
}

function findTaskMembersByCardId(cardNumber) {
  const lists = MODEL.getAppDataLists();
  for (const list of lists) {
    for (const task of list.tasks) {
      if (cardNumber === task.id) {
        return task.members;
      }
    }
  }
}

function editModalHide() {
  const modal = document.querySelector('.modal');
  modal.style.display = 'none';
  modal.style.opacity = 0;
  const cardMemberList = modal.querySelector('.card-members-list');
  cardMemberList.innerHTML = '';
  const moveToList = modal.querySelector('.lists-options');
  moveToList.innerHTML = '';
  const editContent = modal.querySelector('.card-text');
  editContent.textContent = '';
  editContent.value = '';

}

function editCardSaved(event) {
  const modal = event.target.closest('.modal');
  const cardText = modal.querySelector('.card-text').value;
  const listId = modal.querySelector('.relevent-list-id').textContent;
  const cardId = modal.querySelector('.relevent-card-id').textContent;
  const cardsInUi = document.querySelectorAll('.card');
  const membersArray = [];

  //save input text
  const inputs = modal.querySelector('.card-members-list').querySelectorAll('input');
  for (const input of inputs) {
    if (input.checked) {
      membersArray.push(input.getAttribute('data-id'));
    }
  }


//save members change
  for (const card of cardsInUi) {
    const members = MODEL.getAppDataMembers();
    if (card.getAttribute('data-id') === cardId) {
      const memberList = card.querySelector('div');
      memberList.innerHTML = '';
      if (membersArray.length > 0) {
        let memberName;
        for (let mem of membersArray) {
          // console.log(mem);
          for (const appDataMem of members) {
            // console.log(appDataMem);
            if (mem === appDataMem.id) {
              // && !appDataMem.relatedCards.includes(cardNumber
              memberName = appDataMem.name;
              // console.log(appDataMem);
              // appDataMem.relatedCards.push(cardNumber);
            }
          }

          const nameArray = memberName.split(' ');

          let inital = '';
          nameArray.forEach((arr) => inital += arr[0]);
          // const inital = nameArray[0].split('')[0] + nameArray[1].split('')[0];

          memberList.innerHTML += `<span class="member-inital-on-card label label-primary" title="${memberName}">${inital}</span>`;
        }

      }

      card.querySelector('.card-content').textContent = cardText;
    }
  }
  MODEL.changeMembersInAppData(cardId, listId, membersArray);
  MODEL.changeCardTextInAppData(cardId, listId, cardText);

  //save moved card
  let cardLi = document.createElement('li');
  const cardinUI = document.querySelector(`[data-id="${cardId}"]`);
  cardLi.innerHTML = cardinUI.innerHTML;
  cardLi.setAttribute('class', 'card');
  cardLi.setAttribute('data-id', cardId);
  // console.log(cardinUI, cardLi);



  const helper = document.createElement('div');
  helper.innerHTML = cardLi;
  let listsInModal = modal.querySelectorAll('.lists-options > option');
  const newList = Array.from(listsInModal).find((list) => list.selected == true);
  const newListId = newList.getAttribute('data-id');

  if(newListId !== listId){
    MODEL.changeCardInListInAppData(cardId, newListId, listId);
    // console.log('info sent', cardId, newListId, listId);

    const newListInUi = document.querySelector(`[data-id="${newListId}"]`);

    const ulElm = newListInUi.querySelector('.card-list');
//   console.log(ulElm);
// ulElm.innerHTML += cardLi;
    const newUiCard = ulElm.appendChild(cardLi);
    // console.log(cardLi);
    const editBtn = newUiCard.querySelector('.edit-card');
    editBtn.addEventListener('click', editModalShow);


    cardinUI.remove();
  }






  editModalHide();
}

function deleteCard(event) {
  const modal = event.target.closest('.modal');
  const cardNumToDelete = modal.querySelector('.relevent-card-id').textContent;
  // const oldListTitle = modal.querySelector('.relevent-list-title').textContent;
  const listId = modal.querySelector('.relevent-list-id').textContent;
  const releventPageLists = document.querySelectorAll('.list');
  let releventPageListforDelete;

  for (const releventPageList of releventPageLists) {
    if (releventPageList.getAttribute('data-id') === listId) {
      releventPageListforDelete = releventPageList;
    }
  }

  const cardsInReleventList = releventPageListforDelete.querySelectorAll('.card');
  // let cardToDelete;
  for (const card of cardsInReleventList) {
    const cardNumCheck = card.getAttribute('data-id');
    if (cardNumCheck === cardNumToDelete) {
      card.remove();
    }
  }
  // cardToDelete.remove();
  MODEL.deleteCardFromAppData(listId, cardNumToDelete);
  // const oldAppDataList = appData.lists.find((list) => list.id === listId);

  // let indexOfAppDataToDelete;
  // for (const task of oldAppDataList.tasks) {
  //   if (task.id === cardNumToDelete) {
  // console.log(oldAppDataList.tasks);
  // console.log(typeof oldAppDataList.tasks);
  // indexOfAppDataToDelete = indexOf(task);
  editModalHide();
  // }
}


//----------------------members UI functions----------------------------

function initMembersFromData(members) {

  for (const member of members) {

    addMember(member.name, member.id);
  }
  const addMemberBtn = document.querySelector('.add-member-btn');
  const addMemberInput = document.querySelector('.add-member-input');
  addMemberBtn.addEventListener('click', addMemberByUser);
  addMemberInput.addEventListener('keydown', addMemberByUserEnter)

  // const liElm = event.target.closest('.member-item');
  // liElm.classList.toggle('edit-mode');
}

function addMember(member, id) {
  const membersGroup = document.querySelector('.members-group');
  const addMemberSection = document.querySelector('.add-member');
  const helper = document.createElement('div');
  helper.innerHTML += `<li class="list-group-item member-item" data-id="${id}"><h3 class="member-name">${member}</h3>
<input type="text" class="edit-input-mem form-control">
<div class="edit-member-btn">
<button type="button" class="btn btn-default cancel-edit-mem">Cancel</button>
<button type="button" class="btn btn-success save-edit-mem">Save</button>
</div>
<div class="member-btns">
<button type="button" class="btn btn-info edit-member">Edit</button>
<button type="button" class="btn btn-danger delete-member">Delete</button>
</div></li>`;
  const newMember = membersGroup.insertBefore(helper.firstChild, addMemberSection);
  newMember.querySelector('.delete-member').addEventListener('click', deleteMember);
  newMember.querySelector('.edit-member').addEventListener('click', editMemberModeToggle);
  newMember.querySelector('.cancel-edit-mem').addEventListener('click', editMemberModeToggle);
  newMember.querySelector('.save-edit-mem').addEventListener('click', editMemberSave);
}

function addMemberByUser() {
  const membersGroup = document.querySelector('.members-group');
  const addMemberSection = document.querySelector('.add-member');
  const helper = document.createElement('div');
  const newUser = document.querySelector('.add-member-input').value;

  if (newUser !== '') {
    const id = MODEL.addNewMemberToAppData(newUser);
    helper.innerHTML += `<li class="list-group-item member-item" data-id="${id}"><h3 class="member-name">${newUser}</h3>
<input type="text" class="edit-input-mem form-control">
<div class="edit-member-btn">
<button type="button" class="btn btn-default cancel-edit-mem">Cancel</button>
<button type="button" class="btn btn-success save-edit-mem">Save</button>
</div>
<div class="member-btns">
<button type="button" class="btn btn-info edit-member">Edit</button>
<button type="button" class="btn btn-danger delete-member">Delete</button>
</div></li>`;
    const newMember = membersGroup.insertBefore(helper.firstChild, addMemberSection);
    document.querySelector('.add-member-input').value = '';
    newMember.querySelector('.delete-member').addEventListener('click', deleteMember);
    newMember.querySelector('.edit-member').addEventListener('click', editMemberModeToggle);
    newMember.querySelector('.cancel-edit-mem').addEventListener('click', editMemberModeToggle);
    newMember.querySelector('.save-edit-mem').addEventListener('click', editMemberSave);
    return newMember;
  }
}

function addMemberByUserEnter(event) {
  if (event.keyCode === 13) {
    addMemberByUser();
  }
}

function deleteMember(event) {
  const target = event.target;
  const liElm = target.closest('.member-item');
  const members = MODEL.getAppDataMembers();

  const id = liElm.getAttribute('data-id');
  let appDataRelevantMember = members.find((member) => {
    return member.id === id;
  });
  const index = members.indexOf(appDataRelevantMember);
  MODEL.deleteMemberFromAppData(index);
  liElm.remove();
  onDeleteShowUnicorn();
}

function editMemberModeToggle(event) {
  const liElm = event.target.closest('.member-item');
  liElm.classList.toggle('edit-mode');
  const name = liElm.querySelector('.member-name').innerHTML;
  const editInput = liElm.querySelector('.edit-input-mem');
  editInput.value = name;
}

function editMemberSave(event) {
  const target = event.target;
  const liElm = target.closest('.member-item');
  const inputName = liElm.querySelector('.edit-input-mem').value;
  const name = liElm.querySelector('.member-name');
  const id = liElm.getAttribute('data-id');
  const members = MODEL.getAppDataMembers();

  name.textContent = inputName;

  let appDataRelevantMember = members.find((member) => {
    return member.id === id;
  });

  MODEL.editMemberNameInAppData(appDataRelevantMember, inputName);
  console.log(appData);
  liElm.classList.toggle('edit-mode');
}


//-----------------jquery----------------

function onDeleteShowUnicorn(){
  console.log('hello');
  $('main').after('<div class="unicorn"><img src="https://addyosmani.com/lxjs-slides/images/supercorn.gif"></div>');
  $('.unicorn').animate({
    width: '500px',
    height: '500px'
  }, 1000, function () {
    $('.unicorn').fadeOut(800);
  });
}

// let num = uuid.v4();
// console.log(num);

/**
 * Init the app
 */

getAppData();
