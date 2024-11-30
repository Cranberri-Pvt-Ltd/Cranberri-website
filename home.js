// Mobile menu
const hamburger = document.querySelector("#hamburger");
const menu = document.querySelector("#menu");
const faSolid = document.querySelector(".fa-solid");

hamburger.addEventListener("click", () => {
  menu.classList.toggle("hidden");
  faSolid.classList.toggle("fa-xmark");
});

// Add event listeners to all mobile menu links
const hLinks = document.querySelectorAll("#menu a");
hLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.add("hidden");
    faSolid.classList.remove("fa-xmark");
    faSolid.classList.add("fa-bars");
  });
});

// Testimonial
const userTexts = document.getElementsByClassName("user-text");
const userPics = document.getElementsByClassName("user-pic");

function showReview() {
  // Logic to show the review based on the clicked user picture
}

// side bar start

function openNav() {
  "use strict";
  const sidepanel = document.getElementById("mySidepanel");
  if (sidepanel) {
    sidepanel.style.left = "0"; // FIX: Open the side panel
  } else {
    console.error("Error: Side panel not found");
  }
}

function closeNav() {
  "use strict";
  const sidepanel = document.getElementById("mySidepanel");
  if (sidepanel) {
    sidepanel.style.left = "-360px"; // FIX: Close the side panel
  } else {
    console.error("Error: Side panel not found");
  }
}