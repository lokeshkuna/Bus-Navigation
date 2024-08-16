function openSidebar() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "80px";
  document.querySelector(".openbtn").style.marginLeft = "250px"; // Adjust the margin-left of the button
}

// const cardsContainer = document.querySelector(".cards");
// cardsContainer.innerHTML = "";

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.querySelector(".openbtn").style.marginLeft = "20px"; // Reset the margin-left of the button
}

// // Define a function to fetch and render buses data
// function fetchAndRenderBuses() {
//   // Clear existing cards container
//   const cardsContainer = document.querySelector(".cards");
//   cardsContainer.innerHTML = "";
//   while (cardsContainer.firstChild) {
//     cardsContainer.removeChild(cardsContainer.firstChild);
//   }

//   // Fetch the buses data
//   fetch("/api/busesdata")
//     .then((response) => response.json())
//     .then((data) => {
//       // Iterate over each bus object and create a card for it
//       data.forEach((bus) => {
//         const card = document.createElement("li");
//         card.classList.add("card");

//         // Log the bus object to check its contents
//         console.log("Bus object:", bus);

//         // Check if busId property is properly defined
//         if (bus.hasOwnProperty("busId")) {
//           // Assign data-busid attribute to the card with the bus ID
//           card.setAttribute("data-busid", bus.busId);

//           const busName = document.createElement("span");
//           busName.textContent = `Bus: ${bus.name}`;

//           const infoContainer = document.createElement("div");
//           infoContainer.classList.add("info");

//           const route = document.createElement("span");
//           route.textContent = bus.route;

//           // Append elements to the card
//           infoContainer.appendChild(route);
//           card.appendChild(busName);
//           card.appendChild(infoContainer);

//           // Append the card to the cards container
//           cardsContainer.appendChild(card);
//         } else {
//           console.error("Bus object does not contain busId property:", bus);
//         }
//       });
//     })
//     .catch((error) => console.error("Error fetching buses data:", error));
// }

// // // Function to check and set the localStorage flag
// // function checkAndSetInitialLoadFlag() {
// //   // Check if the flag is already set
// //   if (!localStorage.getItem("initialLoad")) {
// //     // If not set, run the fetchAndRenderBuses function
// //     fetchAndRenderBuses();
// //     // Set the flag in localStorage
// //     localStorage.setItem("initialLoad", "true");
// //   } else {
// //     // If the flag is set, remove any existing <li> elements and run the function again
// //     const cardsContainer = document.querySelector(".cards");
// //     // Remove all <li> elements
// //     while (cardsContainer.firstChild) {
// //       cardsContainer.removeChild(cardsContainer.firstChild);
// //     }
// //     fetchAndRenderBuses();
// //   }
// // }

// // Call the checkAndSetInitialLoadFlag function on page load
// // document.addEventListener("DOMContentLoaded", checkAndSetInitialLoadFlag);
// function bb() {
//   // const buses = document.querySelectorAll(".card");
//   // buses.forEach((bus) => {
//   //   const busId = bus.getAttribute("data-busid");
//   //   console.log(busId);
//   // });
//   fetch("/api/busesdata")
//     .then((response) => response.json())
//     .then((data) => {
//       data.forEach((bus) => {
//         console.log(`${bus.name} : ${bus.busId}`);
//       });
//     });
// }

// // bb();

// // Function to toggle visibility of bus information
// function toggleBusInfo() {
//   const cardsContainer = document.querySelector(".cards");
//   const busInfoContainer = document.getElementById("busInfo");

//   // Toggle visibility of cards container and bus info container
//   if (cardsContainer.style.display === "none") {
//     cardsContainer.style.display = "grid";
//     busInfoContainer.style.display = "none";
//   } else {
//     cardsContainer.style.display = "none";
//     busInfoContainer.style.display = "block";
//   }
// }

// // Add event listener to the button
// document
//   .getElementById("showBusesButton")
//   .addEventListener("click", toggleBusInfo);

// // Function to handle bus card click event
// function handleBusCardClick(event) {
//   // Get the clicked card element
//   const card = event.currentTarget;
//   ConvolverNode.log(card);

//   // Get the bus ID from the data-busid attribute of the clicked card
//   const busId = card.getAttribute("data-busid");
//   window.location.href = `/businfo/${busId}`;

//   // Hide cards container
//   const cardsContainer = document.querySelector(".cards");
//   cardsContainer.style.display = "none";

//   // Show bus info container
//   const busInfoContainer = document.getElementById("busInfo");
//   busInfoContainer.style.display = "grid";

//   // Set the data-busid attribute of busInfoContainer
//   busInfoContainer.setAttribute("data-busid", busId);

//   // Fetch bus information based on busId
//   // fetch(`/api/bus/${busId}`)
//   //   .then((response) => response.json())
//   //   .then((bus) => {
//   //     // Render bus information
//   //     renderBusInfo(bus);
//   //   })
//   //   .catch((error) => console.error("Error fetching bus data:", error));
// }

// // Function to render bus information
// function renderBusInfo(bus) {
//   // Update the bus information in the bus info container
//   document.getElementById("busName").textContent = bus.name;
//   document.getElementById("busRoute").textContent = `Route: ${bus.route}`;
//   document.getElementById("busTimings").textContent = `Timings: ${bus.timings}`;

//   // Clear previous reviews
//   const busReviewsElement = document.getElementById("busReviews");
//   busReviewsElement.innerHTML = "";

//   // Render reviews
//   bus.reviews.forEach((review) => {
//     const reviewElement = document.createElement("div");
//     reviewElement.textContent = `Rating: ${review.rating}, Review: ${review.review}`;
//     busReviewsElement.appendChild(reviewElement);
//   });

//   // Update rating
//   document.getElementById("busRating").textContent = `Rating: ${bus.rating}`;
// }
// // // Get all the bus card elements and attach event listener to each one
// // const busCards = document.querySelectorAll(".card");
// // busCards.forEach((card) => {
// //   card.addEventListener("click", handleBusCardClick);
// // });

document.addEventListener("DOMContentLoaded", () => {
  // Get all the bus card elements
  const busCards = document.querySelectorAll(".cards li");

  // Add event listener to each bus card element
  busCards.forEach((card) => {
    card.addEventListener("click", () => {
      // Get the bus ID from the data-busid attribute of the clicked card
      const busId = card.getAttribute("data-busid");

      // Redirect to the /businfo/:id route with the appropriate ID
      window.location.href = `/businfo/${busId}`;
    });
  });
});
