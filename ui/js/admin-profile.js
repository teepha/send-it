function capitalizeStatus(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const renderTableData = (data, ordersTable) => {
    data.forEach(parcel => {
        let parcelRow = document.createElement('tr');
        parcelRow.innerHTML = `<td>${parcel.id}</td>
                            <td class="remove-first">${parcel.user_id}</td>
                            <td class="remove-second">${parcel.date.slice(0, 10)}</td>
                            <td class="remove-first">${parcel.pickup_location}</td>
                            <td>${parcel.destination}</td>
                            <td class="remove-second">${parcel.recipient_name}</td>
                            <td>
                                <select ${parcel.status === 'cancelled' && 'disabled'} id=${parcel.id} name="status" class="status">
                                    <option disabled ${parcel.status === 'cancelled' && 'selected'} value="cancelled">Cancelled</option>
                                    <option ${parcel.status === 'ready_for_pickup' && 'selected'} value="ready_for_pickup">Ready For Pickup</option>
                                    <option ${parcel.status === 'in_transit' && 'selected'} value="in_transit">In-Transit</option>
                                    <option ${parcel.status === 'delivered' && 'selected'} value="delivered">Delivered</option>
                                </select>
                            </td>
                            <td>${parcel.present_location}</td>
                            <td class="view"><i id=${parcel.id} class="far fa-eye"></i></td>
                            <td class="edit"><i id=${parcel.id} class="far fa-edit"></i></td>`;
        ordersTable.append(parcelRow);
    });
}


fetch('/api/v1/parcels', {
    headers: {
        'Authorization': localStorage.getItem('token'),
    }
})
    .then(res => res.json())
    .then(data => {
        const ordersTable = document.querySelector('.orders-data');
        if (!data.length) {
            document.querySelector('#error-msg').innerHTML = 'No Parcel delivery order yet!';
        } else {
            data.sort((a, b) => a.id - b.id);
            renderTableData(data, ordersTable);

            // Search Bar to Search for all parcels by a specific user using User ID
            const searchBar = document.querySelector('#search-user-id');
            const parcels = data;
            searchBar.addEventListener('input', function () {
                ordersTable.innerHTML = ''
                const searchUserId = document.getElementById('search-user-id').value;
                const newUsersParcels = parcels.filter((item) => item.user_id.toString().includes(searchUserId));
                renderTableData(newUsersParcels, ordersTable);
            });


            // Status option
            document.querySelectorAll('.status').forEach(item => {
                item.addEventListener('change', (event) => {
                    // make api call
                    const id = event.target.id;
                    const value = event.target.value;
                    fetch(`/api/v1/parcels/${id}/status`, {
                        method: 'PUT',
                        body: JSON.stringify({
                            status: value,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        }
                    }).then(res => res.json())
                        .then(res => {
                            window.location.href = "./admin-profile.html";
                        }).catch(err => console.log('err occured', err));
                })
            })


            //Count number of orders
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

        // Modal for editing order present location by admin
        document.querySelectorAll('.fa-edit').forEach(item => {
            item.addEventListener('click', e => {
                const errorDiv = document.querySelector('#location-error-msg');
                errorDiv.innerHTML = ''
                document.querySelector('.main-location-modal-wrapper').style.display = 'flex';
                const parcelId = e.target.id;
                document.querySelector('#location-button').parcelId = parcelId
                const parcelToUpdate = data.find((parcel) => parcel.id == parcelId);
                document.querySelector('#present_location').value = parcelToUpdate.present_location;
            });
        });
        document.querySelector('.location-close').addEventListener('click', () => {
            document.querySelector('.main-location-modal-wrapper').style.display = 'none';
        });

        document.querySelector('#location-button').addEventListener('click', event => {
            event.preventDefault();
            const id = event.target.parcelId;
            fetch(`/api/v1/parcels/${id}/presentLocation`, {
                method: 'PUT',
                body: JSON.stringify({
                    presentLocation: document.getElementById('new_location').value,
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            }).then(res => res.json())
                .then(res => {
                    const errorDiv = document.querySelector('#location-error-msg');
                    errorDiv.innerHTML = ''
                    if (res.id) {
                        window.location.href = "./admin-profile.html";
                    } else if (res.msg) {
                        errorDiv.innerHTML = res.msg;
                    } else {
                        res.errors.forEach(err => {
                            const errorElement = document.createElement('div');
                            errorElement.innerHTML = `${err.param} ${err.msg}`;
                            errorDiv.appendChild(errorElement);
                        });
                    }
                });
        })

        }
    }).catch(err => console.log('err occured', err));
