const selectSignUpDetails = () => ({
    method: 'POST',
    body: JSON.stringify({
        firstName: document.getElementById('first_name').value,
        lastName: document.getElementById('last_name').value,
        phoneNumber: document.getElementById('phone_number').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    }),
    headers: {
        'Content-Type': 'application/json'
    }
})

const signup = (event) => {
    event.preventDefault();
    fetch('/api/v1/auth/signup', selectSignUpDetails()).then(res => res.json())
        .then(function (res) {
            const errorDiv = document.querySelector('#error-msg');
            errorDiv.innerHTML = ''
            if (res.token) {
                fetch('/api/v1/user', {
                    headers: {
                        'Authorization': res.token,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        setUserToken(res);
                    })
                    .catch(err => console.log('err occured', err));
            } else if (res.msg) {
                errorDiv.innerHTML = res.msg;
            } else {
                appendErrorMessage(res, errorDiv)
            }
        }).catch(err => console.log('err occured', err));
}

const signupForm = document.querySelector('#sign-up-form');
signupForm.addEventListener('submit', signup);
