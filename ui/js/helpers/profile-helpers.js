const capitalizeString = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const viewModalPopup = () => {
  document.querySelectorAll(".fa-eye").forEach(item => {
    item.addEventListener("click", event => {
      document.querySelector(".main-view-modal-wrapper").style.display = "flex";
      event.preventDefault();
      const id = event.target.id;
      fetch(`/api/v1/parcels/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(res => {
          document.querySelector("#id").innerHTML = "ID: " + res.id;
          document.querySelector("#user-id").innerHTML =
            "User ID: " + res.user_id;
          document.querySelector("#date").innerHTML =
            "Date: " + res.date.slice(0, 10);
          document.querySelector("#pickup-location").innerHTML =
            "Pick Up Location: " + res.pickup_location;
          document.querySelector("#destination").innerHTML =
            "Destination: " + res.destination;
          document.querySelector("#recipient-name").innerHTML =
            "Recipient Name: " + capitalizeString(res.recipient_name);
          document.querySelector("#recipient-phone").innerHTML =
            "Recipient Phone Number: " + res.recipient_phone;
          document.querySelector("#status").innerHTML =
            "Status: " + capitalizeString(res.status.replace(/_/g, " "));
          document.querySelector("#present-location").innerHTML =
            "Present Location: " + capitalizeString(res.present_location);
        })
        .catch(err => console.log("err occured", err));
    });
  });
  document.querySelector(".view-close").addEventListener("click", () => {
    document.querySelector(".main-view-modal-wrapper").style.display = "none";
  });
};

const populateParcelStatusCard = (data) => {
  const status1 = data.filter(val => {
    return val.status === "ready_for_pickup";
  }).length
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
}
