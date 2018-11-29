const userId = localStorage.getItem('userId');
const createOrder = (event) => {
    event.preventDefault();
    fetch('/api/v1/parcels', {
        method: 'POST',
        body: JSON.stringify({
            userId,
            pickupLocation: document.getElementById('pickup_location').value,
            destination: document.getElementById('destination').value,
            recipientName: document.getElementById('recipient_name').value,
            recipientPhone: document.getElementById('recipient_phone').value
        }),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    }).then(res => res.json())
        .then(res => {
            if (res.token) {
                fetch('/api/v1/me', {
                    headers:{
                        'Authorization': res.token,
                    }
                })
                .then(res => res.json())
                .then(data => {
                    if (data.role === 'member'){
                        window.location.href = "./user-profile.html";
                    } else {
                        document.querySelector('#error-msg').innerHTML = 'Sorry, only a MEMBER can create Parcel Deliver Order';
                    }
                })
                .catch(err => console.log('err occured', err));
            } else {
                document.querySelector('#error-msg').innerHTML = res.msg;
            }
        }).catch(err => console.log('err occured', err));
}

const createOrderForm = document.querySelector('#create-order-form');
createOrderForm.addEventListener('submit', createOrder);
