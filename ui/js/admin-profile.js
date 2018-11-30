fetch('/api/v1/parcels', {
    headers: {
        'Authorization': localStorage.getItem('token'),
    }
})
    .then(res => res.json())
    .then(data => {
        const ordersTable = document.querySelector('#orders2');
        data.forEach(parcel => {
            let parcelRow = document.createElement('tr');
            parcelRow.innerHTML = `<td>${parcel.id}</td>
                                <td>${parcel.user_id}</td>
                                <td>${parcel.date.slice(0, 10)}</td>
                                <td>${parcel.destination}</td>
                                <td>${parcel.recipient_name}</td>
                                <td>${parcel.recipient_phone}</td>
                                <td>
                                    <select name="status" class="status">
                                        <option value="ready_for_pickup">Ready For Pickup</option>
                                        <option value="in_transit">In-Transit</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                </td>
                                <td>${parcel.present_location}</td>
                                <td class="edit"><i class="far fa-edit"></i></td>`;
            ordersTable.append(parcelRow);
        });

        // Modal for editing order by admin
        document.querySelectorAll('.edit').forEach(item => {
            item.addEventListener('click', function (items) {
                document.querySelector('.bge_modal').style.display = 'flex';
            });
        })
        document.querySelector('.close').addEventListener('click', function () {
            document.querySelector('.bge_modal').style.display = 'none';
        });
    })
    .catch(err => console.log('err occured', err));



