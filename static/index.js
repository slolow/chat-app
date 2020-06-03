// function definitions
function alertName() {
  alert('Hello friend make sure to submit a user name! Otherwise you\'ll not be able to chat');
  document.querySelector('#create-new-chat').disabled = true;
}

function fillInNameForm() {

  const form = createForm(id="form-name", classList="form-header");
  const input = createInput(id='name', autocomplete='off', autofocus=true, placeholder='name');
  const submit = createSubmit(id='submit-name', disbaled=true);
  document.querySelector('#header').appendChild(form);
  form.appendChild(input);
  form.appendChild(submit);
  form.scrollIntoView();
  // disable submit button if no text in input
  disableButtonUntilFormFilledOut(inputId='#name', submitId='#submit-name');
  // Add user name to local storage and remove form-name
  document.querySelector('#form-name').onsubmit = function() {
    const name = document.querySelector('#name').value;
    localStorage.setItem('name', name);
    document.querySelector('#form-name').remove();
    alert('Gracias Amigo! Meet interesting people in our chatroom or create a new chatroom with a topic of your choice');
    showUserName();
    document.querySelector('#create-new-chat').disabled = false;
    return false;
  }
}

function showUserName() {
  const h4 = document.createElement('h4');
  h4.id = "welcome"
  h4.innerHTML = "Welcome " + localStorage.getItem('name') + "!"
  document.querySelector('#header').appendChild(h4);
}

function createDiv(id, classList) {
  const div = document.createElement('div');
  div.id = id;
  div.classList.add(classList);
  return div;
}

function createForm(id, classList) {
  const form = document.createElement('form');
  form.id = id;
  form.classList.add(classList);
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

function disableButtonUntilFormFilledOut(inputId, submitId) {
  document.querySelector(inputId).onkeyup = () => {
    if (document.querySelector(inputId).value.length > 0) {
      document.querySelector(submitId).disabled = false;
    }
    else {
      document.querySelector(submitId).disabled = true;
    }
  };
}

function disableAllMessageButtons() {
  document.querySelectorAll('.message-form').forEach(form => {
    const inputId = '#' + form.children[0].id;
    const submitId = '#' + form.children[1].id;
    disableButtonUntilFormFilledOut(inputId, submitId);
  });
}

function initializeLocalStorage(name, value) {
  if (!localStorage.getItem(name))
      localStorage.setItem(name, value);
}

function linkChatMenuToChatCarousel() {
  document.querySelectorAll('.chatLinkItem').forEach(link => {
    link.onclick = function () {
      carouselNumber = parseInt(link.id.substr(-1));
      $('.carousel').carousel(carouselNumber);
    }
  });
}


initializeLocalStorage(name='counter', value=1);

// replace later
localStorage.setItem('actual-chat-room', 'About-the-world');

document.addEventListener('DOMContentLoaded', function() {
  // Show form for user name if no name in local storage
  if (!localStorage.getItem('name')) {
    alertName();
    fillInNameForm();
  }
  else {
    showUserName();
  }

  //disableAllMessageButtons();

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected
  socket.on('connect', () => {
    // configure submit message
    const sendMessage = document.querySelector('#message-submit');
    sendMessage.onclick = () => {
      const chatRoomId = localStorage.getItem('actual-chat-room');
      const message = document.querySelector('#message-input').value;
      socket.emit('new message', {'message': message, 'chat-room-id': chatRoomId});
      alert(`send message: ${message} and chatroom-id: ${chatRoomId}`);
      return false;
    };

    // and chat links
    document.querySelectorAll('.chatLinkItem').forEach(link => {
      link.onclick = () => {
        //const linkId = link.id;
        //const chatRoomName  = linkId.substring(5, linkId.lenght);
        const chatRoomName  = link.innerHTML;
        console.log(chatRoomName);
        socket.emit('chat room request', {'chatRoomName': chatRoomName});
        alert(`request for chat room: ${chatRoomName}`);
        return false;
      };
    });

    // and create a new chat
    const createNewChat = document.querySelector('#create-new-chat');
    createNewChat.onclick = () => {
      createNewChat.disabled = true;
      alert('Fill out the form to create a new chat');
      const form = createForm(id='form-create-new-chat', classList='form-header');
      const inputChat = createInput(id='chat-name', autocomplete='off', autofocus=true, placeholder='chat name');
      const inputTopic = createInput(id='topic', autocomplete='off', autofocus=true, placeholder='topic');
      const submit = createSubmit(id='submit-chat-name', disbaled=true);
      document.querySelector('#welcome').remove();
      document.querySelector('#header').appendChild(form);
      form.appendChild(inputChat);
      form.appendChild(inputTopic);
      form.appendChild(submit);
      disableButtonUntilFormFilledOut(inputId='#chat-name', submitId='#submit-chat-name');
      inputChat.scrollIntoView();
      form.onsubmit = function() {
        const chatRoomName = inputChat.value;
          //check if chatRoomName is available
        /*const examplechatRoomName = document.querySelector('#link-About-the-world').innerHTML;
        const chatRoomNameEqualsExampleChat = chatRoomName === examplechatRoomName;
        if (chatRoomNameEqualsExampleChat) {
          alert('chat name is already taken!');
          return false;
        }*/
        const localStorageKeys = Object.keys(localStorage);
        for (const key of localStorageKeys) {
          if (key.startsWith('chat-name-')) {
            const chatRoomNameExist = localStorage[key] === chatRoomName;
            if (chatRoomNameExist) {
              alert('chat name is already taken!');
              return false;
            }
          }
        }

        form.remove();
        showUserName();

        const chatContent = document.querySelector('#chatContent');
        if (chatContent.children.length > 0) {
          chatContent.removeChild(chatContent.lastElementChild);
        }
        //let counter = localStorage.getItem('counter');
        const chatRoom = createDiv(id=chatRoomName, classList="chat-room");
        chatContent.append(chatRoom);
        const h1 = document.createElement('h1');
        h1.innerHTML = chatRoomName;
        chatRoom.append(h1);
        //disableButtonUntilFormFilledOut(inputId='message-input', submitId='message-submit');


        // add chat link in menu bar
        //const span = createSpan(id="link-" + chatRoomName, classList='chatLinkItem', innerHTML=chatRoomName);
        const button = document.createElement('button');
        button.id = "link-" + chatRoomName;
        button.classList.add("chatLinkItem", "btn", "btn-outline-info");

        button.innerHTML = chatRoomName;
        //document.querySelector('#chatLinkContainer').appendChild(span);
        document.querySelector('#chatLinkContainer').appendChild(button);

        localStorage.setItem('chat-name-' + chatRoomName, chatRoomName);
        //counter++;
        //localStorage.setItem('counter', counter);

        document.querySelector('#create-new-chat').disabled = false;

        socket.emit('create new chat room', {'chatRoomName': chatRoomName});
        alert(`send new chat: ${chatRoomName}`);

        return false;
      };
    };

  });

  // When a new message is send, add to chatroom and show the 100 latest messages
  socket.on('latest messages', data => {

    alert('made');
    alert(`received message: ${data.message} with message id: ${data.messageId} and chat room id: ${data.chatRoomId}`);
    const carouselItem = document.querySelector('#carousel-item-' + data.chatRoomId);
    const div = createDiv(id="message-" + data.messageId, classList="messages");
    div.innerHTML = data.message + ' at \n' + data.time;
    carouselItem.append(div);
    document.querySelector('#header').style.color = 'red';
    //return false;
  });

  socket.on('new chat room created', data => {
    alert(`received new chat: ${data.chatRoomName}`);
    // here create chat link. Only link!!! User bekommt den chat erst wenn er auf den link klickt
  });

  socket.on('chat room access', data => {
    alert(`new chat acces: ${data.chatRoomName}`);
  });

});
