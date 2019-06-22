const parcelResponseAndErrors = (res, errorId, redirectUrl) => {
  const errorDiv = document.querySelector(errorId);
  errorDiv.innerHTML = "";
  if (res.id) {
    window.location.href = redirectUrl;
  } else if (res.msg) {
    errorDiv.innerHTML = res.msg;
  } else {
    appendErrorMessage(res, errorDiv);
  }
};
