// code user name form
if (window.location.pathname === '/name') {
  // Only show user name prompt page if no user name in local Storage
  if (localStorage.getItem('username') !== null) {
    location.replace('/');
  }
  else {
    document.addEventListener('DOMContentLoaded', () => {
      enableButton();
      const button = document.querySelector('.form-submit');
      button.onclick = () => {
        const username = document.querySelector('.form-input').value;
        localStorage.setItem('username', username);
        location.replace('/');
      };
    });
  }
}

// code new chat form
if (window.location.pathname === '/new-chat') {
  // Only show new chat prompt page if user name in local Storage
  if (!localStorage.getItem('username')) {
    location.replace('/name');
  }
  else {
    document.addEventListener('DOMContentLoaded', () => {
      enableButton();

      // Connect to websocket
      var socket = io.connect(location.protocol + '//' + document.domain + ':' + location.port);

      // When connected, configure button
      socket.on('connect', () => {
        document.querySelector('.form-submit').onclick = () => {
          const newChat = document.querySelector('.form-input').value;

          // Open new request to see if chat name is available.
          const request = new XMLHttpRequest();
          request.open('POST', '/is_chat_name_available');
          request.onload = () => {
              const chatNameIsAvailable = JSON.parse(request.responseText);
              if (chatNameIsAvailable) {
                socket.emit('create new chat', {'new_chat': newChat});

                // set time out before runing afterTimeOut function. Otherwise new chat is not emit to flask
                window.setTimeout('afterTimeOut()', 1);
              }
              else {
                alert('chat name is already taken. Choose an other one!');
              }
          };

          // Add chat name to request data.
          const data = new FormData();
          data.append('chat_name', newChat);

          // Send request.
          request.send(data);

          return false;
        };
      });

    });
  }
}


// functions
function afterTimeOut(){
  location.replace('/');
}

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
