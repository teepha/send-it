const login = (event) => {
    event.preventDefault();
    fetch('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.json())
        .then(function (res) {
            if (res.token) {
                fetch('/api/v1/me', {
                    headers:{
                        'Authorization': res.token,
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.role === 'admin'){
                        localStorage.setItem('token', res.token);
                        window.location.href = "./admin-profile.html";
                    } else {
                        document.querySelector('#error-msg').innerHTML = 'Sorry, only ADMIN can log in to this page';
                    }
                })
                .catch(err => console.log('err occured', err));
            } else {
                document.querySelector('#error-msg').innerHTML = res.msg;
            }
        }).catch(err => console.log('err occured', err));
}

const adminLoginForm = document.querySelector('#admin-login-form');
adminLoginForm.addEventListener('submit', login);