/**
 * Created by NEXUS on 26/02/2017.
 */
let addListBtn = document.getElementById('list-btn');
const addCardBtn = document.getElementsByClassName('card-btn');


addListBtn.addEventListener("click", addList);

for (const card of addCardBtn){
  card.addEventListener("click", addCard);
}

function addList() {
  addListBtn = document.getElementById('list-btn');
  let parent = addListBtn.parentNode;
  let helper = document.createElement('div');
  helper.innerHTML = `<div class="inside-list">
   <div class="list panel panel-default">
    <header class="list-header panel-heading"><h3 class="panel-title">Done</h3></header>
    <ul>
    </ul>
    <button class="card-btn add-card panel-footer">Add a card...</button>
  </div>
  </div>`;
  while (helper.firstChild) {
    parent.insertBefore(helper.firstChild, addListBtn);
  }
  const addCardBtn = document.getElementsByClassName('card-btn');
  for (const card of addCardBtn){
    card.addEventListener("click", addCard);
  }
}


function addCard() {
  console.log(event);
let ulElm = event.target.parentNode.querySelector('ul');
ulElm.innerHTML += `<li class="card"></li>`;
}

