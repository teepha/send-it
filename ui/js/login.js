const selectLoginDetails = () => ({
    method: 'POST',
    body: JSON.stringify({
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }),
    headers: {
        'Content-Type': 'application/json'
    }
});

const setUserToken = (res) => {
    fetch('/api/v1/user', {
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
            } else if (data.role === 'admin') {
                localStorage.setItem('token', res.token);
                window.location.href = "./admin-profile.html";
            } else {
                document.querySelector('#error-msg').innerHTML = 'Sorry, only a MEMBER can log in to this page';
            }
        })
        .catch(err => console.log('err occured', err));
}

const login = (event) => {
    event.preventDefault();
    fetch('/api/v1/auth/login', selectLoginDetails()).then(res => res.json())
        .then(function (res) {
            const errorDiv = document.querySelector('#error-msg');
            errorDiv.innerHTML = ''
            if (res.token) {
                setUserToken(res)
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

const loginForm = document.querySelector('#login-form');
loginForm.addEventListener('submit', login);
