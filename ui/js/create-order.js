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
            const errorDiv = document.querySelector('#error-msg');
            errorDiv.innerHTML = ''
            if (res.id){
                window.location.href = "./user-profile.html";
            } else if (res.msg){
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

const createOrderForm = document.querySelector('#create-order-form');
createOrderForm.addEventListener('submit', createOrder);
