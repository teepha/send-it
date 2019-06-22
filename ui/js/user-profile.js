const renderTableData = (data, ordersTable) => {
  data.forEach(parcel => {
    let parcelRow = document.createElement("tr");
    parcelRow.innerHTML = `<td>${parcel.id}</td>
                        <td class="remove-second">${parcel.date.slice(
                          0,
                          10
                        )}</td>
                        <td class="remove-first">${parcel.pickup_location}</td>
                        <td class="remove-second">${parcel.destination}</td>
                        <td>${capitalizeString(parcel.recipient_name)}</td>
                        <td>${capitalizeString(
                          parcel.status.replace(/_/g, " ")
                        )}</td>
                        <td class="view"><i id=${
                          parcel.id
                        } class="far fa-eye"></i></td>
                        <td>${
                          parcel.status !== "cancelled"
                            ? `<a href="./edit-order.html"><i id=${
                                parcel.id
                              } class="far fa-edit"></i></a>`
                            : ""
                        }</td>
                        <td class="cancel">${
                          parcel.status !== "cancelled"
                            ? `<i id=${parcel.id} class="fas fa-times"></i>`
                            : ""
                        }</td> `;
    ordersTable.append(parcelRow);
  });
};

const userId = localStorage.getItem("userId");
fetch(`/api/v1/users/${userId}/parcels`, {
  headers: {
    Authorization: localStorage.getItem("token")
  }
})
  .then(res => res.json())
  .then(data => {
    const ordersTable = document.querySelector(".orders-data");
    if (!data.length) {
      document.querySelector("#error-msg").innerHTML =
        "You do not have any Parcel delivery order yet!";
    } else {
      data.sort((a, b) => a.id - b.id);
      renderTableData(data, ordersTable);

      // Search Bar to search for a specific parcel order using Recipient name
        searchByRecipientName(data, ordersTable);

        // Count number of user orders
        populateParcelStatusCard(data);

      // Edit Icon
        document.querySelectorAll(".fa-edit").forEach(item => {
            item.addEventListener("click", event => {
            localStorage.setItem("parcelToEdit", event.target.id);
            });
        });

      // Modal for viewing a specific order by user
        viewModalPopup();

      // Modal for canceling a specific order by user
        document.querySelectorAll(".fa-times").forEach(item => {
            item.addEventListener("click", e => {
            document.querySelector(".main-cancel-modal-wrapper").style.display =
                "flex";
            document.querySelector("#cancel-btn").parcelId = e.target.id;
            });
        });
        document.querySelector("#cancel-btn").addEventListener("click", event => {
            event.preventDefault();
            const id = event.target.parcelId;
            fetch(`/api/v1/parcels/${id}/cancel`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("token")
                }
            }).then(res => res.json())
                .then(res => {
                    if (res.id) {
                        window.location.href = "./user-profile.html";
                    } else {
                        document.querySelector("#cancel-error-msg").innerHTML = res.msg;
                    }
                });
        });
        closeModals(".main-cancel-modal-wrapper", ".cancel-close");
    }
  }).catch(err => console.log("err occured", err));
