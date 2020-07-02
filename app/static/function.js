export function enableButton () {
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
