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
    });
  }
}


// functions
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
