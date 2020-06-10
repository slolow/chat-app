// code user name form
if (window.location.pathname === '/name') {
  // Only show user name prompt page if no user name in local Storage
  if (localStorage.getItem('username') !== null) {
    location.replace('/');
  }
  else {
    document.addEventListener('DOMContentLoaded', () => {
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
// Only show new chat prompt page if user name in local Storage
if (window.location.pathname === '/new-chat' && !localStorage.getItem('username')) {
  location.replace('/name');
}
