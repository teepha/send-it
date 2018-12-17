const signup = (event) => {
    event.preventDefault();
    fetch('/api/v1/auth/signup', {
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
    }).then(res => res.json())
        .then(function (res) {
            const errorDiv = document.querySelector('#error-msg');
            errorDiv.innerHTML = ''
            if (res.token) {
                fetch('/api/v1/me', {
                    headers: {
                        'Authorization': res.token,
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.role === 'member') {
                            localStorage.setItem('token', res.token);
                            localStorage.setItem('userId', res.userId);
                            window.location.href = "./user-profile.html";
                        }
                    })
                    .catch(err => console.log('err occured', err));
            } else if (res.msg) {
                errorDiv.innerHTML = res.msg;
            } else {
                res.errors.forEach(err => {
                    const errorElement = document.createElement('div');
                    errorElement.innerHTML = `${err.param} ${err.msg}`;
                    errorDiv.appendChild(errorElement);
                });
            }
        }).catch(err => console.log('err occured', err));
}

const signupForm = document.querySelector('#sign-up-form');
signupForm.addEventListener('submit', signup);
