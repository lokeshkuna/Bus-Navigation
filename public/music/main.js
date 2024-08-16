const progress = document.getElementById("progress");
const song = document.getElementById("song");
const controlIcon = document.getElementById("controlIcon");
const playPauseButton = document.querySelector(".play-pause-btn");
const forwardButton = document.querySelector(".controls button.forward");
const backwardButton = document.querySelector(".controls button.backward");
const songName = document.querySelector(".music-player h1");
const artistName = document.querySelector(".music-player p");

function openSidebar() {
  document.getElementById("sidebar").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
  document.querySelector(".openbtn").style.marginLeft = "250px"; // Adjust the margin-left of the button
}

function closeSidebar() {
  document.getElementById("sidebar").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
  document.querySelector(".openbtn").style.marginLeft = "20px"; // Reset the margin-left of the button
}

const songs = [
  {
    title: "Nijame Ne Chebutunna",
    name: "Ooru Peru Bhairavakona",
    source: "https://paglasongs.com/files/download/id/14594",
  },
  {
    title: "Oh My Baby",
    name: "Guntur Kaaram",
    source: "./songs/Oh My Baby.mp3",
  },
  {
    title: "Katchi Sera ",
    name: "Think Indie",
    source: "./songs/Katchi Sera - Sai Abhyankka.mp3",
  },
  {
    title: "Rooba Rooba",
    name: "Orange | Shahil Hada",
    source: "./songs/6-Rooba Rooba-SenSongsMp3.Co.mp3",
  },
  {
    title: "As It Was",
    name: "Harry Styles",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Harry-Styles-As-It-Was.mp3",
  },

  {
    title: "Physical",
    name: "Dua Lipa",
    source:
      "https://github.com/ecemgo/mini-samples-great-tricks/raw/main/song-list/Dua-Lipa-Physical.mp3",
  },
  {
    title: "Sweety",
    name: "Race Gurram",
    source: "./songs/Sweety-SenSongsMp3.Com.mp3",
  },
];

let currentSongIndex = 3;

function updateSongInfo() {
  songName.textContent = songs[currentSongIndex].title;
  artistName.textContent = songs[currentSongIndex].name;
  song.src = songs[currentSongIndex].source;

  song.addEventListener("loadeddata", function () {});
}

song.addEventListener("timeupdate", function () {
  if (!song.paused) {
    progress.value = song.currentTime;
  }
});

song.addEventListener("loadedmetadata", function () {
  progress.max = song.duration;
  progress.value = song.currentTime;
});

function pauseSong() {
  song.pause();
  controlIcon.classList.remove("fa-pause");
  controlIcon.classList.add("fa-play");
}

function playSong() {
  song.play();
  controlIcon.classList.add("fa-pause");
  controlIcon.classList.remove("fa-play");
}

function playPause() {
  if (song.paused) {
    playSong();
  } else {
    pauseSong();
  }
}

playPauseButton.addEventListener("click", playPause);

progress.addEventListener("input", function () {
  song.currentTime = progress.value;
});

progress.addEventListener("change", function () {
  playSong();
});

forwardButton.addEventListener("click", function () {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  updateSongInfo();
  playPause();
});

backwardButton.addEventListener("click", function () {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  updateSongInfo();
  playPause();
});

updateSongInfo();

var swiper = new Swiper(".swiper", {
  effect: "coverflow",
  centeredSlides: true,
  initialSlide: 3,
  slidesPerView: "auto",
  allowTouchMove: false,
  spaceBetween: 40,
  coverflowEffect: {
    rotate: 25,
    stretch: 0,
    depth: 50,
    modifier: 1,
    slideShadows: false,
  },
  navigation: {
    nextEl: ".forward",
    prevEl: ".backward",
  },
});

// Inspiration: https://dribbble.com/shots/5455156-Car-HMI-assistant-Album-switching

// document.addEventListener("DOMContentLoaded", function () {
//   // Get the sidebar and the toggle button
//   const sidebar = document.getElementById("sidebar");
//   const sidebarToggle = document.getElementById("sidebarToggle");

//   // Add a click event listener to the toggle button
//   sidebarToggle.addEventListener("click", function () {
//     // Toggle the 'open' class on the sidebar
//     sidebar.classList.toggle("open");
//   });
// });
