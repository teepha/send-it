const setUserToken = (res) => {
  localStorage.setItem('token', res.token);
  localStorage.setItem('userId', res.userId);
  window.location.href = "./user-profile.html";
}

const appendErrorMessage = (res, errorDiv) => {
  res.errors.forEach(err => {
    const errorElement = document.createElement('div');
    errorElement.innerHTML = `${err.param} ${err.msg}`;
    errorDiv.appendChild(errorElement);
  });
}