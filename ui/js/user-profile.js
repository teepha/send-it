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
                                <td><a href="./edit-order.html"><i class="far fa-edit"></i></a></td>
                                <td class="cancel"><i class="fas fa-times"></i></td> `;
                ordersTable.append(parcelRow);
            });

            // Modal for viewing a specific order by user
            document.querySelectorAll('.view').forEach(item => {
                item.addEventListener('click', function (items) {
                    document.querySelector('.bgv_modal').style.display = 'flex';
                });
            });
            document.querySelector('.close').addEventListener('click', function () {
                document.querySelector('.bgv_modal').style.display = 'none';
            });
            
            // Modal for canceling a specific order by user
            document.querySelectorAll('.cancel').forEach(item => {
                item.addEventListener('click', function (items) {
                    document.querySelector('.bgc_modal').style.display = 'flex';
                });
            })
            document.querySelector('.c_close').addEventListener('click', function () {
                document.querySelector('.bgc_modal').style.display = 'none';
            });

        }
    })
    .catch(err => console.log('err occured', err));
