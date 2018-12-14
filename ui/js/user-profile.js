const userId = localStorage.getItem('userId');
fetch(`/api/v1/users/${userId}/parcels`, {
    headers: {
        'Authorization': localStorage.getItem('token'),
    }
})
    .then(res => res.json())
    .then(data => {
        const ordersTable = document.querySelector('.orders');
        if (!data.length) {
            document.querySelector('#error-msg').innerHTML = 'You do not have any Parcel delivery order yet!';
        } else {
            data.sort((a, b) => a.id - b.id);
            data.forEach(parcel => {
                let parcelRow = document.createElement('tr');
                parcelRow.innerHTML = `<td>${parcel.id}</td>
                                <td class="remove-second">${parcel.date.slice(0, 10)}</td>
                                <td class="remove-first">${parcel.pickup_location}</td>
                                <td class="remove-second">${parcel.destination}</td>
                                <td>${parcel.recipient_name}</td>
                                <td>${capitalizeStatus(parcel.status.replace(/_/g, ' '))}</td>
                                <td class="view"><i id=${parcel.id} class="far fa-eye"></i></td>
                                <td>${parcel.status !== "cancelled" ? `<a href="./edit-order.html"><i id=${parcel.id} class="far fa-edit"></i></a>` : ''}</td>
                                <td class="cancel">${parcel.status !== "cancelled" ? `<i id=${parcel.id} class="fas fa-times"></i>` : ''}</td> `;
                ordersTable.append(parcelRow);
            });
 
            //Count number of user orders
            const status1 = data.filter(val => {
                return val.status === "ready_for_pickup";
            }).length;
            document.querySelector('#pickup-status').innerHTML = status1;
            
            const status2 = data.filter(val => {
                return val.status === "in_transit";
            }).length;
            document.querySelector('#transit-status').innerHTML = status2;
            
            const status3 = data.filter(val => {
                return val.status === "delivered";
            }).length;
            document.querySelector('#deliver-status').innerHTML = status3;
    
            const status4 = data.filter(val => {
                return val.status === "cancelled";
            }).length;
            document.querySelector('#cancel-status').innerHTML = status4;
            

            function capitalizeStatus(string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        

            // Edit Icon
            document.querySelectorAll('.fa-edit').forEach(item => {
                item.addEventListener('click', event => {
                    localStorage.setItem('parcelToEdit', event.target.id);
                })
            });

            // Modal for viewing a specific order by user
            document.querySelectorAll('.fa-eye').forEach(item => {
                item.addEventListener('click', (event) => {
                    document.querySelector('.main-view-modal-wrapper').style.display = 'flex';
                    event.preventDefault();
                    const id = event.target.id;
                    fetch(`/api/v1/parcels/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        }
                    }).then(res => res.json())
                        .then(res => {
                            document.querySelector('#id').innerHTML = 'ID: ' + res.id;
                            document.querySelector('#user-id').innerHTML = 'User ID: ' + res.user_id;
                            document.querySelector('#date').innerHTML = 'Date: ' + res.date.slice(0, 10);
                            document.querySelector('#pickup-location').innerHTML = 'Pick Up Location: ' + res.pickup_location;
                            document.querySelector('#destination').innerHTML = 'Destination: ' + res.destination;
                            document.querySelector('#recipient-name').innerHTML = 'Recipient Name: ' + res.recipient_name;
                            document.querySelector('#recipient-phone').innerHTML = 'Recipient Phone Number: ' + res.recipient_phone;
                            document.querySelector('#status').innerHTML = 'Status: ' + capitalizeStatus(res.status);
                            document.querySelector('#present-location').innerHTML = 'Present Location: ' + res.present_location;
                        }).catch(err => console.log('err occured', err));
                });
            });
            document.querySelector('.view-close').addEventListener('click', () => {
                document.querySelector('.main-view-modal-wrapper').style.display = 'none';
            });

            // Modal for canceling a specific order by user
            document.querySelectorAll('.fa-times').forEach(item => {
                item.addEventListener('click', (e) => {
                    document.querySelector('.bgc_modal').style.display = 'flex';
                    document.querySelector('#cancel_btn').parcelId = e.target.id
                });
            });
            document.querySelector('#cancel_btn').addEventListener('click', event => {
                event.preventDefault();
                const id = event.target.parcelId;
                fetch(`/api/v1/parcels/${id}/cancel`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token')
                    }
                }).then(res => res.json())
                    .then(res => {
                        if (res.id) {
                            window.location.href = "./user-profile.html";
                        } else {
                            document.querySelector('#error-msg').innerHTML = res.msg;
                        }
                    })
            });
            document.querySelector('.c_close').addEventListener('click', () => {
                document.querySelector('.bgc_modal').style.display = 'none';
            });

        }
    }).catch(err => console.log('err occured', err));




