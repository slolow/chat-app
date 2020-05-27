function alertName () {
  alert('Hello friend make sure to submit a user name! Otherwise you\'ll not be able to chat');
  document.querySelector('#form-name').scrollIntoView();
}

function fillInName () {
  /*document.querySelector('#name').remove();
  document.querySelector('#submit-name').remove();*/
  const input = createInput(id='name', autocomplete='off', autofocus=true, placeholder='name');
  const submit = createSubmit(id='submit-name', disbaled=true);
  document.querySelector('#form-name').appendChild(input);
  document.querySelector('#form-name').appendChild(submit);
  // disable submit button if no text in input
  disableButton(inputId='#name', submitId='#submit-name');
  // Add user name to local storage and remove form-name
  document.querySelector('#form-name').onsubmit = function() {
    const name = document.querySelector('#name').value;
    localStorage.setItem('name', name);
    document.querySelector('#form-name').remove();
    alert('Gracias Amigo! Meet interesting people in our chatroom or create a new chatroom with a topic of your choice');
    return false;
  }
}

function createDiv(id, classList) {
  const div = document.createElement('div');
  div.id = id;
  div.classList.add(classList);
  return div;
}

function createForm(id) {
  const form = document.createElement('form');
  form.id = id;
  return form;
}

function createSpan(id, classList, innerHTML) {
  const span = document.createElement('span');
  span.id = id;
  span.classList.add(classList);
  span.innerHTML = innerHTML;
  return span;
}

function createInput(id, autocomplete, autofocus, placeholder) {
  const input = document.createElement('input');
  input.id = id;
  input.autocomplete = autocomplete;
  input.autofocus = autofocus;
  input.placeholder = placeholder;
  return input;
}

function createSubmit(id, disabled) {
  const submit = document.createElement('input');
  submit.type = 'submit';
  submit.id = id;
  submit.disabled = disabled;
  return submit;
}

function disableButton(inputId, submitId) {
  document.querySelector(inputId).onkeyup = () => {
    if (document.querySelector(inputId).value.length > 0) {
      document.querySelector(submitId).disabled = false;
    }
    else {
      document.querySelector(submitId).disabled = true;
    }
  };
}

function initializeLocalStorage(name, value) {
  if (!localStorage.getItem(name))
      localStorage.setItem(name, value);
}

initializeLocalStorage(name='counter', value=1);

function linkChatMenuToChatCarousel() {
  document.querySelectorAll('.chatLinkItem').forEach(link => {
    link.onclick = function () {
      $('.carousel').carousel(parseInt(link.id.substr(-1)));
    }
  });
}
//initializeLocalStorage(name='chatCounter', value=0);
/*if (!localStorage.getItem('counter'))
    localStorage.setItem('counter', 1);*/

//load existing chats
/*function loadChatsFromLocalStorage () {
  for (i = 0; i < localStorage.length; i++) {
    if (keys(localStorage)[i].startsWith('chat-name-')) {
      console.log(keys(localStorage)[i]);
    }
  }
  if (localStorage.getItem('chat-name-0')) {

  }
  const chats = str.startswith()
}*/



document.addEventListener('DOMContentLoaded', function() {

  // Show form for user name if no name in local storage
  if (!localStorage.getItem('name')) {
    alertName();
    fillInName();
    // create input tag and submit button in form
    /*const input = createInput(id='name', autocomplete='off', autofocus=true, placeholder='name');
    const submit = createSubmit(id='submit-name', disbaled=true);
    document.querySelector('#form-name').appendChild(input);
    document.querySelector('#form-name').appendChild(submit);
    // disable submit button if no text in input
    disableButton(inputId='#name', submitId='#submit-name');
    // Add user name to local storage and remove form-name
    document.querySelector('#form-name').onsubmit = function() {
      const name = document.querySelector('#name').value;
      localStorage.setItem('name', name);
      document.querySelector('#form-name').remove();
      alert('Gracias Amigo! Meet interesting people in our chatroom or create a new chatroom with a topic of your choice');
      return false;
    }*/
  }

  //load existing chats

  /*if (!localStorage.getItem('cha'))*/

  //create a new chat
  document.querySelector('#create-new-chat').onclick = function() {
    document.querySelector('#create-new-chat').disabled = true;
    if (!localStorage.getItem('name')) {
      alertName();
  }
    else {
      alert('Fill out the form to create a new chat');
      // here load form (name of chat, topic and background-color, color)
      const form = createForm(id='form-create-new-chat');
      const inputChat = createInput(id='chat-name', autocomplete='off', autofocus=true, placeholder='chat name');
      const inputTopic = createInput(id='topic', autocomplete='off', autofocus=true, placeholder='topic');
      const submit = createSubmit(id='submit-chat-name', disbaled=true);
      document.querySelector('#header').appendChild(form);
      form.appendChild(inputChat);
      form.appendChild(inputTopic);
      form.appendChild(submit);
      /*document.querySelector('#form-create-new-chat').appendChild(inputChat);
      document.querySelector('#form-create-new-chat').appendChild(inputTopic);
      document.querySelector('#form-create-new-chat').appendChild(submit);*/
      disableButton(inputId='#chat-name', submitId='#submit-chat-name');
      inputChat.scrollIntoView();
      //create new chat
      /*document.querySelector('#form-create-new-chat').onsubmit = function() {*/
      form.onsubmit = function() {
        /*const chatName = document.querySelector('#chat-name').value;*/
        const chatName = inputChat.value;
        //let chatCounter = localStorage.getItem('chatCounter');
        //localStorage.setItem('chat-name-' + chatCounter, chatName);
        form.remove();
        //return false;
        let counter = localStorage.getItem('counter');
        const divCarouselItem = createDiv(id="carousel-item-" + counter, classList="carousel-item");
        /*const divCarouselItem = document.createElement('div');
        // change number item-2 with counter!
        divCarouselItem.id = "carousel-item-" + counter;
        divCarouselItem.classList.add("carousel-item");*/
        document.querySelector('.carousel-inner').appendChild(divCarouselItem);
        const h1 = document.createElement('h1');
        // change 'second chat with name of the chat'
        h1.innerHTML = chatName;
        document.querySelector('#carousel-item-' + counter).appendChild(h1);

        // add chat link in menu bar
        const span = createSpan(id="link-" + counter, classList='chatLinkItem', innerHTML=chatName)
        /*const span = document.createElement('span');
        span.classList.add('chatLinkItem');
        span.id = "link-" + counter;
        span.innerHTML = chatName;*/
        document.querySelector('#chatLinkContainer').appendChild(span);

        localStorage.setItem('chat-name-' + counter, chatName);
        counter++;
        localStorage.setItem('counter', counter);

        document.querySelector('#create-new-chat').disabled = false;
        //show selected chat in menu
        /*document.querySelectorAll('.chatLinkItem').forEach(link => {
          link.onclick = function () {
            $('.carousel').carousel(parseInt(link.id.substr(-1)));
          }
        });*/
        linkChatMenuToChatCarousel();
    }
  }
  };

  //show selected chat in menu
  /*const chatLinkItemClass = document.querySelector('.chatLinkItem')
  chatLinkItemClass.onclick = function () {

    $('.carousel').carousel(2)
  }*/

/*  document.querySelectorAll('.chatLinkItem').forEach(link => {
    link.onclick = function () {
      alert('Clicked on: ' + link.id.substr(-1));
      $('.carousel').carousel(parseInt(link.id.substr(-1)));
    }
  });*/

});
