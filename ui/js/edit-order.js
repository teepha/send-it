const userId = localStorage.getItem("userId");
const id = localStorage.getItem("parcelToEdit");

fetch(`/api/v1/parcels/${id}`, {
  headers: {
    Authorization: localStorage.getItem("token")
  }
})
  .then(res => res.json())
  .then(data => {
    document.querySelector("#pickup_location").value = data.pickup_location;
    document.querySelector("#new_destination").value = data.destination;
    document.querySelector("#recipient_name").value = data.recipient_name;
    document.querySelector("#recipient_phone").value = data.recipient_phone;
  })
  .catch(err => console.log("err occured", err));

const editOrder = event => {
  event.preventDefault();
  fetch(`/api/v1/parcels/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      pickupLocation: document.getElementById("pickup_location").value,
      destination: document.getElementById("new_destination").value,
      recipientName: document.getElementById("recipient_name").value,
      recipientPhone: document.getElementById("recipient_phone").value
    }),
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(res => {
      parcelResponseAndErrors(res, "#error-msg", "./user-profile.html");
    })
    .catch(err => console.log("err occured", err));
};

const editOrderForm = document.querySelector("#edit-order-form");
editOrderForm.addEventListener("submit", editOrder);
