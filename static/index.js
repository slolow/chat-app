var animationEnd = true;

if (!localStorage.getItem('username')) {
  // redirect to '/name'
  location.replace('name');
}
else {
  document.addEventListener('DOMContentLoaded', () => {

    // welcome user
    welcomeUser();

    // Connect to websocket
    var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

    socket.on('connect', () => {});

    // When a new chat is announced, add to menu
    socket.on('new chat created', data => {
      add_chat_room(data.new_chat);
      showInfo(`new chat room: ${data.new_chat}`);
    });

    // When send button is clicked, emit new messsage
    const sendButton = document.querySelector('.form-submit');
    sendButton.onclick = () => {
      const message = document.querySelector('#message-form-input').value;
      document.querySelector('#message-form-input').value = '';
      socket.emit('send new message', {'message': message, 'chat_room': localStorage.getItem('actual-chat-room'), 'user': localStorage.getItem('username')});
      return false;
    };

    // show message to everyone
    socket.on('broadcast new message', data => {
      if (data.chat_room == localStorage.getItem('actual-chat-room')) {
        add_message(data);
        showLatestMessages();
      }
      else {
        showInfo(`new message in ${data.chat_room}`);
      }
    });

    loadChatRooms();
    activateButton('#create-new-chat');
    activateButton('#draw');
    enableButton();

    if (!localStorage.getItem('actual-chat-room')) {
      const actualChatRoom = 'Info-Chat'
      loadMessages(actualChatRoom);
      localStorage.setItem('actual-chat-room', actualChatRoom);
    }
    else {
      loadMessages(localStorage.getItem('actual-chat-room'));
    }

  });
}


// functions
function welcomeUser() {

  const headerTitle = document.querySelector('#header-title');
  headerTitle.innerHTML = 'Welcome ' + localStorage.getItem('username') + '!';
  headerTitle.addEventListener('welcomeAnimationEnd', welcomeAnimationEndCallback(headerTitle));

}


function welcomeAnimationEndCallback(headerTitle) {

  headerTitle.style.position = 'fixed';

}


function activateButton(elementId) {
  document.querySelector(elementId).onclick = () => {
    location.replace(elementId.substring(1));
    return false;
  };
}


function loadChatRooms() {

  // Open new request to get chat-rooms.
  const request = new XMLHttpRequest();
  request.open('POST', '/chats');
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      data.forEach(add_chat_room);
      showActualChatRoom();
  };

  request.send();

};


function showActualChatRoom() {

  document.querySelectorAll('.chat-rooms').forEach(button => {
	   if (button.innerText == localStorage.getItem('actual-chat-room')) {
		     button.style.backgroundColor = '#80EAFF';
    }
  });

};


// this function runs onclick of chat room in menu (see index.html)
function linkChatRoomsToMessages(chatRoomLink) {

  const chatRoom = chatRoomLink.innerText;

  // remove all messages of old chat room
  const messageContainer = document.querySelector('#message-container');
  while (messageContainer.firstChild) {
    messageContainer.removeChild(messageContainer.lastChild)
  }

  loadMessages(chatRoom);

  // change backgroundColors of actual chat and cliked link
  //const actualChatRoomId = '#' + localStorage.getItem('actual-chat-room').replaceAll(' ', '-');
  const actualChatRoomId = '#' + localStorage.getItem('actual-chat-room').split(' ').join('-');
  document.querySelector(actualChatRoomId).style.backgroundColor = 'hotpink';
  localStorage.setItem('actual-chat-room', chatRoom);
  chatRoomLink.style.backgroundColor = '#80EAFF';

}


function loadMessages(chatRoom) {

  // Open new request to get messages.
  const request = new XMLHttpRequest();
  request.open('POST', '/messages');
  request.onload = () => {
      const data = JSON.parse(request.responseText);
      data.forEach(add_message);
      showLatestMessages();
  };

  // Add start and end points to request data.
  const data = new FormData();
  data.append('chat_room', chatRoom);

  // Send request.
  request.send(data);

}


function showLatestMessages() {

  // show latest messages
  const messageContainer = document.querySelector('#message-container');
  messageContainer.scrollTo(0, messageContainer.scrollHeight)
}


// Add a new chat-room with given contents to DOM.
const chat_room_template = Handlebars.compile(document.querySelector('#chat-room').innerHTML);
function add_chat_room(contents) {

    //console.log('contents: ' + contents + ' typeof: ' + typeof(contents) + ' value');
    //const id = contents.replaceAll(" ", "-");

    const id = contents.split(' ').join('-');

    // Create new chat-room.
    const chatRoom = chat_room_template({'id': id, 'contents': contents});

    // Add chat-room to DOM.
    document.querySelector('#chat-container').innerHTML += chatRoom;
}


function showInfo(infoMessage) {

  if (window.animationEnd) {
    window.animationEnd = false;
    const h1 = document.createElement('h1');
    h1.id = 'header-info';
    h1.innerHTML = infoMessage;
    const header = document.querySelector('#header');

    // make header-info first child of header for style reason
    header.insertBefore(h1, header.firstChild);
    h1.style.animationPlayState = 'running';

    // trigger code when animation finished loading
    h1.addEventListener('animationend', animationEndCallback);
  }

}

animationEndCallback = (e) => {
  const h1 = document.querySelector('#header-info');
  h1.removeEventListener('animationend', animationEndCallback);
  h1.remove();
  window.animationEnd = true;
}


// Add a new message with given contents to DOM.
const message_template = Handlebars.compile(document.querySelector('#message').innerHTML);
function add_message(contents) {

    // Create new message.
    if (localStorage.getItem('username') === contents['user']) {
      var message = message_template({'contents': contents['message'], 'info': contents['user'] + " " + contents['time'], 'class': 'own-message'});
    }
    else {
      var message = message_template({'contents': contents['message'], 'info': contents['user'] + " " + contents['time'], 'class': 'friends-message'});
    }

    // Add message to DOM.
    document.querySelector('#message-container').innerHTML += message;
}

// try to import enableButton (also used in form.js)
function enableButton () {
  const input = document.querySelector('.form-input');
  const button = document.querySelector('.form-submit');
  input.onkeyup = () => {
    if (input.value.length > 0) {
      button.disabled = false;
    }
    else {
      button.disabled = true;
    }
  };
}
