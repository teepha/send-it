const userId = localStorage.getItem('userId');
fetch(`/api/v1/users/${userId}/parcels`, {
    headers: {
        'Authorization': localStorage.getItem('token'),
    }
})
    .then(res => res.json())
    .then(data => {
        const ordersTable = document.querySelector('#orders');
        if (!data.length) {
            document.querySelector('#error-msg').innerHTML = 'No Parcel delivery order for this user!';
        } else {
            data.forEach(parcel => {
                let parcelRow = document.createElement('tr');
                parcelRow.innerHTML = `<td>${parcel.id}</td>
                                <td>${parcel.date.slice(0, 10)}</td>
                                <td>${parcel.pickup_location}</td>
                                <td>${parcel.destination}</td>
                                <td>${parcel.recipient_name}</td>
                                <td>${parcel.status}</td>
                                <td class="view"><i class="far fa-eye"></i></td>
                                <td><a href="./edit-order.html"><i id=${parcel.id} class="far fa-edit"></i></a></td>
                                <td class="cancel"><i class="fas fa-times"></i></td> `;
                ordersTable.append(parcelRow);

            });

                // Edit Icon
                document.querySelectorAll('.fa-edit').forEach(item => {
                    item.addEventListener('click', event => {
                        localStorage.setItem('parcelToEdit',event.target.id);
                    })
                });

                //View number of user orders
                const status1 = data.filter(val => {
                    return val.status === "Ready for Pickup";
                }).length;
                document.querySelector('#pickup_status').innerHTML = 'Ready for PickUp: ' + status1;
                const status2 = data.filter(val => {
                    return val.status === "In-Transit";
                }).length;
                document.querySelector('#transit_status').innerHTML = 'In-Transit: ' + status2;
                const status3 = data.filter(val => {
                    return val.status === "Delivered";
                }).length;
                document.querySelector('#deliver_status').innerHTML = 'Delivered:  ' + status3;


            // Modal for viewing a specific order by user
            document.querySelectorAll('.view').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelector('.bgv_modal').style.display = 'flex';
                });
            });
            document.querySelector('.close').addEventListener('click', () => {
                document.querySelector('.bgv_modal').style.display = 'none';
            });

            // Modal for canceling a specific order by user
            document.querySelectorAll('.cancel').forEach(item => {
                item.addEventListener('click', () => {
                    document.querySelector('.bgc_modal').style.display = 'flex';
                });
            })
            document.querySelector('.c_close').addEventListener('click', function () {
                document.querySelector('.bgc_modal').style.display = 'none';
            });

        }
    })
    .catch(err => console.log('err occured', err));



