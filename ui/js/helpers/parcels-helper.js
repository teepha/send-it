const createEditOrderResponse = (res) => {
  const errorDiv = document.querySelector('#error-msg');
  errorDiv.innerHTML = ''
  if (res.id) {
    window.location.href = "./user-profile.html";
  } else if (res.msg) {
    errorDiv.innerHTML = res.msg;
  } else {
    appendErrorMessage(res, errorDiv);
  }
};
