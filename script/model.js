/**
 * Created by NEXUS on 19/03/2017.
 */
/**
 * ---------------------Model (data manipulation)-------------------------
 */
const MODEL = (function () {

  /**
   *
   * privet
   */


let appData = {
  lists: [],
  members: []
};
const isAjaxReady = [];
let taskCounter = 0;

  /**
   * public
   */

function getCacheData() {
  const cacheData = localStorage.getItem('appData');

  if (cacheData) {
    appData = JSON.parse(cacheData);

    return true;
  }

  return false;
}

function getBoardData() {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', MODEL.xhrBoardLoadHandler);

  xhr.open('GET', 'assets/board-advanced.json');
  xhr.send();
}
function getMembersData() {
  const xhr2 = new XMLHttpRequest();
  xhr2.addEventListener('load', MODEL.xhrMemLoadHandler);

  xhr2.open('GET', 'assets/members.json');
  xhr2.send();
}

function xhrMemLoadHandler(event) {
  const myXhr = event.target;
  const contentType = myXhr.getResponseHeader('content-type');

  let data;
  if (contentType.includes('json')) {
    data = JSON.parse(myXhr.response);
  }
  else {
    data = myXhr.response;
  }
  appData.members = data.members;
  for (const appDataMem of appData.members) {
    appDataMem.relatedCards = [];
    appDataMem.relatedCardsId = [];
  }

  //
  //
  updateAjaxState();
}
function xhrBoardLoadHandler(event) {
  const myXhr = event.target;
  const contentType = myXhr.getResponseHeader('content-type');

  let data;
  if (contentType.includes('json')) {
    data = JSON.parse(myXhr.response);
  }
  else {
    data = myXhr.response;
  }

  appData.lists = data.board;
  updateAjaxState();
}

function updateAjaxState() {
  isAjaxReady.push('true');

  if (isAjaxReady.length === 2) {
    saveToLocalStorage();
    return true;
  }
}

// members
function addNewMemberToAppData(newUser) {
  const newAppDataMember = {
    name: newUser
  };
  newAppDataMember.id = uuid();
  const id = newAppDataMember.id;
  appData.members.push(newAppDataMember);
  saveToLocalStorage();
  return id;
}

function deleteMemberFromAppData(index) {
  appData.members.splice(index, 1);
  saveToLocalStorage();
}

function editMemberNameInAppData(appDataRelevantMember, newName) {
  appDataRelevantMember.name = newName;
  saveToLocalStorage();
}

//list
function newListAddedToAppData(id) {
  const newList = {
    title: 'New list',
    tasks: [],
    id: id
  };
  appData.lists.push(newList);
  saveToLocalStorage();
}

function AppDataListTitleEdit(id, newName) {
  let appDataRelevantList = appData.lists.find((list) => {
    return list.id === id;
  });

  appDataRelevantList.title = newName;
  saveToLocalStorage();
}

function deleteListFromAppData(id) {
  let appDataRelevantList = appData.lists.find((list) => {
    return list.id === id;
  });
  const index = appData.lists.indexOf(appDataRelevantList);
  appData.lists.splice(index, 1);
  saveToLocalStorage();
}

//card

// function addMemberRelatedCardNumbersToAppData(appDataMem, taskCounter, id) {
//   appDataMem.relatedCards.push(taskCounter);
//   appDataMem.relatedCardsId.push(id);
// }

function newCardAddedByUserPushedToAppData(idTask, appDataRelevantList) {
  const cardData = {
    text: '?',
    members: [],
    taskCounter: taskCounter,
    id: idTask
  };
  appDataRelevantList.tasks.push(cardData);
  saveToLocalStorage();
}

//modal
function deleteCardFromAppData(listId, cardNumToDelete) {
  const oldAppDataList = appData.lists.find((list) => list.id === listId);
  for (const i in oldAppDataList.tasks) {
    if (oldAppDataList.tasks[i].id == cardNumToDelete) {
      oldAppDataList.tasks.splice(i, 1);
    }
  }
  saveToLocalStorage();
}

function changeCardTextInAppData(cardId, listId, cardText) {
  for (const list of appData.lists) {
    if (list.id === listId) {
      for (const task of list.tasks) {
        if (task.id === cardId) {
          task.text = cardText;
        }
      }
    }
  }
  saveToLocalStorage();
}

function changeMembersInAppData(cardId, listId, membersArray) {
  for (const list of appData.lists) {
    if (list.id === listId) {
      for (const task of list.tasks) {
        if (task.id === cardId) {
          task.members = membersArray;
        }
      }
    }
  }
  saveToLocalStorage();
}

function changeCardInListInAppData(cardId, newListId, listId) {
  // console.log('in appdata mode', cardId, newListId, listId);
  // console.log(appData);
  let taskIndex;
  let listIndex;
  // let movedTask;
  for (const list of appData.lists) {
    if (list.id === listId) {
      taskIndex = Array.from(list.tasks).findIndex((task) => task.id === cardId);

      listIndex = appData.lists.indexOf(list);
      // console.log('list index', listIndex);
    }
  }
  // console.log('list index', listIndex);
  // console.log(appData.lists[listIndex]);
  const movedTask = appData.lists[listIndex].tasks.splice(taskIndex, 1);
  // console.log(movedTask);
  for (const list of appData.lists) {
    if (list.id === newListId) {
      // console.log(movedTask);
      list.tasks.push(movedTask[0]);
    }
  }
  // console.log(appData);
  saveToLocalStorage();
}

// function appDataAddTheCard(members, memberList) {
//   let memberName;
//   for (let mem of members) {
//     for (const appDataMem of appData.members) {
//       if (mem === appDataMem.id) {
//         memberName = appDataMem.name;
//         let nameArray = memberName.split(' ');
//         let inital = '';
//         nameArray.forEach((arr) => inital += arr[0]);
//
//         memberList.innerHTML += `<span class="member-inital-on-card label label-primary" title="${memberName}">${inital}</span>`;
//
//       }
//     }
//   }
// }

function findAppDataRelevantList(listId) {
  return appData.lists.find((list) => {
    return list.id === listId;
  });
}

function getAppDataLists() {
  return appData.lists;
}

function getAppDataMembers() {
  return appData.members;
}

function saveToLocalStorage() {
  const localStorageAppData = JSON.stringify(appData);
  localStorage.setItem('appData', localStorageAppData);
}

  /**
   * exposing functions to public
   */

return{
  getCacheData,
  getBoardData,
  getMembersData,
  xhrMemLoadHandler,
  xhrBoardLoadHandler,
  updateAjaxState,
  addNewMemberToAppData,
  deleteMemberFromAppData,
  editMemberNameInAppData,
  newListAddedToAppData,
  AppDataListTitleEdit,
  deleteListFromAppData,
  newCardAddedByUserPushedToAppData,
  deleteCardFromAppData,
  changeCardTextInAppData,
  changeMembersInAppData,
  changeCardInListInAppData,
  findAppDataRelevantList,
  getAppDataLists,
  getAppDataMembers,
  saveToLocalStorage
}

})();
