// function definitions
function alertName() {
  alert('Hello friend make sure to submit a user name! Otherwise you\'ll not be able to chat');
  document.querySelector('#create-new-chat').disabled = true;
}

function fillInNameForm() {

  const form = createForm(id="form-name", classList="form-header");
  const input = createInput(id='name', autocomplete='off', autofocus=true, placeholder='name');
  const submit = createSubmit(id='submit-name', disbaled=true);
  document.querySelector('#header').append(form);
  form.append(input);
  form.append(submit);
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
  document.querySelector('#header').append(h4);
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

function loadChatRoom(chatRoomName) {
  const chatContent = document.querySelector('#chatContent');
  if (chatContent.children.length > 1) {
    const child = chatContent.firstChild;
    child.remove();
  }
  const chatRoom = createDiv(id=chatRoomName, classList="chatRoom");
  const h1 = document.createElement('h1');
  h1.innerHTML = chatRoomName;
  chatRoom.append(h1);
  chatContent.append(chatRoom);
  chatContent.insertBefore(chatRoom, chatContent.firstChild);
  localStorage.setItem('actualChatRoom', chatRoomName);
}


function loadMessages(messageId, message, time, user, chatRoomName) {
  const div = createDiv(id="message-" + messageId, classList="messages");
  div.innerHTML = message + ' at \n' + time + ' from ' + user;
  const chatRoom = document.querySelector('#' + chatRoomName);
  chatRoom.append(div);
}

initializeLocalStorage(name='counter', value=1);

// replace later
//localStorage.setItem('actualChatRoom', 'About-the-world');

document.addEventListener('DOMContentLoaded', () => {
  // Show form for user name if no name in local storage
  if (!localStorage.getItem('name')) {
    alertName();
    fillInNameForm();
  }
  else {
    showUserName();
  }

  disableButtonUntilFormFilledOut(inputId='#messageInput', submitId='#messageSubmit')

  // Connect to websocket
  var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

  // When connected
  socket.on('connect', () => {

    // configure submit message
    const sendMessage = document.querySelector('#messageSubmit');
    sendMessage.onclick = () => {
      const chatRoomName = localStorage.getItem('actualChatRoom');
      const message = document.querySelector('#messageInput').value;
      user = localStorage.getItem('name');
      socket.emit('new message', {'message': message, 'chatRoomName': chatRoomName, 'user': user});
      alert(`send message: ${message} and chatroom-id: ${chatRoomName}`);
      return false;
    };

    // and create a new chat
    const createNewChat = document.querySelector('#createNewChat');
    createNewChat.onclick = () => {
      createNewChat.disabled = true;
      alert('Fill out the form to create a new chat');
      const form = createForm(id='form-create-new-chat', classList='form-header');
      const inputChat = createInput(id='chat-name', autocomplete='off', autofocus=true, placeholder='chat name');
      const inputTopic = createInput(id='topic', autocomplete='off', autofocus=true, placeholder='topic');
      const submit = createSubmit(id='submit-chat-name', disbaled=true);
      document.querySelector('#welcome').remove();
      document.querySelector('#header').append(form);
      form.append(inputChat);
      form.append(inputTopic);
      form.append(submit);
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

        /*const chatContent = document.querySelector('#chatContent');
        if (chatContent.children.length > 1) {
          const child = chatContent.firstChild;
          child.remove();
        }
        const chatRoom = createDiv(id=chatRoomName, classList="chatRoom");
        const h1 = document.createElement('h1');
        h1.innerHTML = chatRoomName;
        chatRoom.append(h1);
        chatContent.append(chatRoom);
        chatContent.insertBefore(chatRoom, chatContent.firstChild);
        localStorage.setItem('actualChatRoom', chatRoomName);*/
        loadChatRoom(chatRoomName);

        //disableButtonUntilFormFilledOut(inputId='message-input', submitId='message-submit');


        // add chat link in menu bar
        //const span = createSpan(id="link-" + chatRoomName, classList='chatLinkItem', innerHTML=chatRoomName);
        const button = document.createElement('button');
        button.id = "link-" + chatRoomName;
        button.classList.add("chatLinkItem", "btn", "btn-outline-info");

        button.innerHTML = chatRoomName;
        //document.querySelector('#chatLinkContainer').append(span);
        document.querySelector('#chatLinkContainer').append(button);

        localStorage.setItem('chat-name-' + chatRoomName, chatRoomName);
        //localStorage.setItem('actualChatRoom', chatRoomName);
        //counter++;
        //localStorage.setItem('counter', counter);

        document.querySelector('#createNewChat').disabled = false;

        socket.emit('create new chat room', {'chatRoomName': chatRoomName});
        alert(`send new chat: ${chatRoomName}`);

        return false;
      };
    };

  });

  // When a new message is send, add to chatroom and show the 100 latest messages
  socket.on('latest messages', data => {

    alert(`received message: ${data.message} with message id: ${data.messageId} and chat room id: ${data.chatRoomName} from user: ${data.user}`);
    loadMessages(messageId=data.messageId, message=data.message, time=data.time, user=data.user, chatRoomName=data.chatRoomName);
    /*const div = createDiv(id="message-" + data.messageId, classList="messages");
    div.innerHTML = data.message + ' at \n' + data.time + ' from ' + data.user;
    const chatRoom = document.querySelector('#' + data.chatRoomName);
    chatRoom.append(div);*/
    //chatContent.insertBefore(div, chatContent.lastChildElement);
    //document.querySelector('#header').style.color = 'red';
    //return false;
  });

  socket.on('new chat room created', data => {
    // and chat links
    document.querySelectorAll('.chatLinkItem').forEach(button => {
      button.onclick = () => {
        const chatRoomName  = button.innerHTML;
        alert(`request for chat room: ${chatRoomName}`);
        console.log(chatRoomName);
        socket.emit('chat room request', {'chatRoomName': chatRoomName});
        return false;
      };
    });
    alert(`received new chat: ${data.chatRoomName}`);
    // here create chat link. Only link!!! User bekommt den chat erst wenn er auf den link klickt
  });

  socket.on('chat room access', data => {
    alert(`new chat acces: ${data.chatRoomName}`);
    loadChatRoom(data.chatRoomName);
    data.messages.forEach(function(messageInfo, index) {
      const time = messageInfo.time;
      const user = messageInfo.user;
      const message = messageInfo.message;
      //console.log(data.messages);
      //console.log(message);
      loadMessages(messageId=index, message, time, user, chatRoomName=data.chatRoomName);
      console.log('time: ' + time + ' message ' + message + 'user: ' + user + 'index: ' + index);
    });
    //console.log(data.messages);
  });

});
