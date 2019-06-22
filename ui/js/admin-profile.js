const renderTableData = (data, ordersTable) => {
  data.forEach(parcel => {
    let parcelRow = document.createElement("tr");
    parcelRow.innerHTML = `<td>${parcel.id}</td>
                            <td class="remove-first">${parcel.user_id}</td>
                            <td class="remove-second">${parcel.date.slice(
                              0,
                              10
                            )}</td>
                            <td class="remove-first">${
                              parcel.pickup_location
                            }</td>
                            <td>${parcel.destination}</td>
                            <td class="remove-second">${capitalizeString(
                              parcel.recipient_name
                            )}</td>
                            <td>
                                <select ${parcel.status === "cancelled" &&
                                  "disabled"} id=${
      parcel.id
    } name="status" class="status">
                                    <option disabled ${parcel.status ===
                                      "cancelled" &&
                                      "selected"} value="cancelled">Cancelled</option>
                                    <option ${parcel.status ===
                                      "ready_for_pickup" &&
                                      "selected"} value="ready_for_pickup">Ready For Pickup</option>
                                    <option ${parcel.status === "in_transit" &&
                                      "selected"} value="in_transit">In-Transit</option>
                                    <option ${parcel.status === "delivered" &&
                                      "selected"} value="delivered">Delivered</option>
                                </select>
                            </td>
                            <td>${capitalizeString(
                              parcel.present_location
                            )}</td>
                            <td class="view"><i id=${
                              parcel.id
                            } class="far fa-eye"></i></td>
                            <td class="edit"><i id=${
                              parcel.id
                            } class="far fa-edit"></i></td>`;
    ordersTable.append(parcelRow);
  });
};

fetch("/api/v1/parcels", {
  headers: {
    Authorization: localStorage.getItem("token")
  }
})
  .then(res => res.json())
  .then(data => {
    const ordersTable = document.querySelector(".orders-data");
    if (!data.length) {
      document.querySelector("#error-msg").innerHTML =
        "No Parcel delivery order yet!";
    } else {
      data.sort((a, b) => a.id - b.id);
      renderTableData(data, ordersTable);

      // Search Bar to Search for all parcels by a specific user using User ID
      searchByUserId(data, ordersTable);

      // Status option
      document.querySelectorAll(".status").forEach(item => {
        item.addEventListener("change", event => {
          // make api call
          const id = event.target.id;
          const value = event.target.value;
          fetch(`/api/v1/parcels/${id}/status`, {
            method: "PUT",
            body: JSON.stringify({
              status: value
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token")
            }
          })
            .then(res => res.json())
            .then(res => {
              window.location.href = "./admin-profile.html";
            })
            .catch(err => console.log("err occured", err));
        });
      });

      //Count number of orders
      populateParcelStatusCard(data);

      // Modal for viewing a specific order by user
      viewModalPopup();

      // Modal for editing order present location by admin
      document.querySelectorAll(".fa-edit").forEach(item => {
        item.addEventListener("click", e => {
          const errorDiv = document.querySelector("#location-error-msg");
          errorDiv.innerHTML = "";
          document.querySelector(".main-location-modal-wrapper").style.display =
            "flex";
          const parcelId = e.target.id;
          document.querySelector("#location-button").parcelId = parcelId;
          const parcelToUpdate = data.find(parcel => parcel.id == parcelId);
          document.querySelector("#present_location").value =
            parcelToUpdate.present_location;
        });
      });
      closeModals(".main-location-modal-wrapper", ".location-close");

      document
        .querySelector("#location-button")
        .addEventListener("click", event => {
          event.preventDefault();
          const id = event.target.parcelId;
          fetch(`/api/v1/parcels/${id}/presentLocation`, {
            method: "PUT",
            body: JSON.stringify({
              presentLocation: document.getElementById("new_location").value
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token")
            }
          })
            .then(res => res.json())
            .then(res => {
              parcelResponseAndErrors(
                res,
                "#location-error-msg",
                "./admin-profile.html"
              );
            });
        });
    }
  })
  .catch(err => console.log("err occured", err));
