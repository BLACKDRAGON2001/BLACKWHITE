const wrapper = document.querySelector(".wrapper");
const coverArea = wrapper.querySelector(".img-area");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const mainAudio = wrapper.querySelector("#main-audio");
const videoAd = wrapper.querySelector("#video");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = progressArea.querySelector(".progress-bar");
const musicList = wrapper.querySelector(".music-list");
const moreMusicBtn = wrapper.querySelector("#more-music");
const closeMoreMusicBtn = musicList.querySelector("#close");
const modeToggle = document.getElementById("modeToggle");
const muteButton = document.getElementById("muteButton");
const header = document.querySelector(".row")

let musicIndex = 1;
let isMusicPaused = true;
let isShuffleMode = false;
let originalOrder = [...allMusic]; // Store the original order
let shuffledOrder = []; // To store the shuffled order

document.addEventListener("DOMContentLoaded", () => {
  const storedMusicIndex = localStorage.getItem("musicIndex");
  if (storedMusicIndex) {
    musicIndex = parseInt(storedMusicIndex, 10);
    loadMusic(musicIndex);
    if (localStorage.getItem("isMusicPaused") === "false") {
      playMusic();
    }
  } else {
    loadMusic(musicIndex);
  }
  populateMusicList(originalOrder); // Populate the original order on load
  updatePlayingSong();
});

// Function to load music
function loadMusic(index) {
  const music = isShuffleMode ? shuffledOrder[index - 1] : originalOrder[index - 1];
  musicName.innerText = music.name;
  musicArtist.innerText = music.artist;

  const { coverType = 'Images', src, type = 'jpg' } = music;
  coverArea.innerHTML = ''; // Clear the cover area

  const mediaElement = coverType === 'video' 
    ? createVideoElement(src, type) 
    : createImageElement(src, type);

  coverArea.appendChild(mediaElement);
  mainAudio.src = `Audio/${src}.mp3`;
  videoAd.src = `Videos/${src}.mp4`;
}

// Functions to create video and image elements
function createVideoElement(src, type) {
  const videoElement = document.createElement('video');
  videoElement.src = `Videos/${src}.${type}`;
  videoElement.controls = true;
  videoElement.autoplay = true;
  videoElement.loop = true;
  return videoElement;
}

function createImageElement(src, type) {
  const imgElement = document.createElement('img');
  imgElement.src = `Images/${src}.${type}`;
  imgElement.alt = musicName.innerText;
  return imgElement;
}

// Functions to play and pause music
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  isMusicPaused = false;
  localStorage.setItem("isMusicPaused", false);
  toggleVideoDisplay(false);
}

function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
    isMusicPaused = true;
    localStorage.setItem("isMusicPaused", true);
    toggleVideoDisplay(true);
  
    // Mute the video audio when the music is paused
    const video = document.getElementById("video");
    if (video) {
      video.muted = true; // Mute the video audio
    }
}
  

function toggleVideoDisplay(show) {
  const video = document.getElementById("video");
  video.style.display = show ? "block" : "none";
  if (show) {
    video.play();
  } else {
    video.pause();
  }
}

// Function to change music
function changeMusic(direction) {
  if (isShuffleMode) {
    musicIndex = (musicIndex + direction + shuffledOrder.length - 1) % shuffledOrder.length + 1;
  } else {
    musicIndex = (musicIndex + direction + originalOrder.length - 1) % originalOrder.length + 1;
  }
  
  loadMusic(musicIndex);
  playMusic();
  muteVideo();
}

// Function to mute video
function muteVideo() {
  const video = document.getElementById("video");
  if (video) {
    video.muted = true; // Mute the video audio
  }
}

// Play/Pause Button Event Listener
playPauseBtn.addEventListener("click", () => {
  isMusicPaused ? playMusic() : pauseMusic();
});

// Previous/Next Button Event Listeners
prevBtn.addEventListener("click", () => changeMusic(-1));
nextBtn.addEventListener("click", () => changeMusic(1));

// Update progress bar
mainAudio.addEventListener("timeupdate", (e) => {
  const { currentTime, duration } = e.target;
  progressBar.style.width = `${(currentTime / duration) * 100}%`;

  const currentMin = Math.floor(currentTime / 60);
  const currentSec = Math.floor(currentTime % 60).toString().padStart(2, "0");
  wrapper.querySelector(".current-time").innerText = `${currentMin}:${currentSec}`;

  if (!isNaN(duration)) {
    const totalMin = Math.floor(duration / 60);
    const totalSec = Math.floor(duration % 60).toString().padStart(2, "0");
    wrapper.querySelector(".max-duration").innerText = `${totalMin}:${totalSec}`;
}});

// Progress bar click event
progressArea.addEventListener("click", (e) => {
  const clickedOffsetX = e.offsetX;
  const songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressArea.clientWidth) * songDuration;
  playMusic();
});

// Repeat and Shuffle Button Event Listener
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  switch (repeatBtn.innerText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      isShuffleMode = true;

      // Shuffle the order and update musicIndex
      shuffledOrder = [...originalOrder].sort(() => Math.random() - 0.5);
      musicIndex = 1; // Reset to first song in shuffled order
      loadMusic(musicIndex);
      populateMusicList(shuffledOrder); // Populate with shuffled order
      playMusic();
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      isShuffleMode = false;

      musicIndex = 1; // Reset to first song in original order
      loadMusic(musicIndex);
      populateMusicList(originalOrder); // Populate with original order
      playMusic();
      break;
  }
});

// Handle end of the song
mainAudio.addEventListener("ended", () => {
  if (isShuffleMode) {
    musicIndex = Math.floor(Math.random() * shuffledOrder.length) + 1;
  } else {
    musicIndex = (musicIndex % originalOrder.length) + 1; // Loop to next song
  }
  loadMusic(musicIndex);
  playMusic();
});

// Show/Hide Music List
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMoreMusicBtn.addEventListener("click", () => {
  musicList.classList.remove("show");
});

// Populate music list
const ulTag = wrapper.querySelector("ul");

function populateMusicList(musicArray) {
  ulTag.innerHTML = ""; // Clear the existing list
  musicArray.forEach((music, i) => {
    const liTag = document.createElement("li");
    liTag.setAttribute("li-index", i + 1);

    liTag.innerHTML = `
      <div class="row">
        <span>${music.name}</span>
        <p>${music.artist}</p>
      </div>
      <span id="${music.src}" class="audio-duration">3:40</span>
      <audio class="${music.src}" src="Audio/${music.src}.mp3"></audio>
    `;

    ulTag.appendChild(liTag);

    const liAudioDurationTag = ulTag.querySelector(`#${music.src}`);
    const liAudioTag = ulTag.querySelector(`.${music.src}`);
    
    liAudioTag.addEventListener("loadeddata", () => {
      const duration = liAudioTag.duration;
      const totalMin = Math.floor(duration / 60);
      const totalSec = Math.floor(duration % 60).toString().padStart(2, "0");
      liAudioDurationTag.innerText = `${totalMin}:${totalSec}`;
      liAudioDurationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
    });

    liTag.addEventListener("click", () => {
      musicIndex = i + 1;
      loadMusic(musicIndex);
      playMusic();
    });
  });
}

// Update playing song in the list
function updatePlayingSong() {
  const allLiTags = ulTag.querySelectorAll("li");
  allLiTags.forEach(liTag => {
    const audioTag = liTag.querySelector(".audio-duration");
    liTag.classList.toggle("playing", liTag.getAttribute("li-index") == musicIndex-1);
    audioTag.innerText = liTag.classList.contains("playing") ? "Playing" : audioTag.getAttribute("t-duration");
  });
}

// Dark mode toggle
modeToggle.addEventListener("click", () => {
    const isDarkMode = wrapper.classList.toggle("dark-mode");
    document.getElementById("fontawesome-icons").classList.toggle("Dark");
  
    // Change background color based on the mode
    if (isDarkMode) {
      // Dark mode is active
      document.body.style.backgroundColor = "white"; // Change to dark background
      listcolourblack()
    } else {
      // Dark mode is inactive
      document.body.style.backgroundColor = "black";
      listcolourwhite() // Change to white background
    }
});
  

// Mute button
let isMuted = false; // Track mute state

muteButton.addEventListener("click", () => {
  const video = document.getElementById("video");
  const isAudioPlaying = !isMusicPaused; // Check if the audio is currently playing

  if (video) {
    if (isAudioPlaying && !isMuted) {
      // If music is playing and the video is not muted, disable the button
      muteButton.disabled = true; // Disable the mute button
      return; // Exit the function early
    }

    video.muted = !video.muted; // Mute or unmute video
    isMuted = video.muted; // Update mute state

    // Toggle button classes instead of changing inner text
    if (isMuted) {
      muteButton.classList.add("muted"); // Add a class for muted state
      muteButton.classList.remove("unmuted"); // Remove the unmuted class
    } else {
      muteButton.classList.remove("muted"); // Remove the muted class
      muteButton.classList.add("unmuted"); // Add the unmuted class
    }
  }
});

// Enable the mute button when music is paused
mainAudio.addEventListener("pause", () => {
  muteButton.disabled = false; // Enable the mute button when music is paused
  pauseMusic();
});

mainAudio.addEventListener("play", () => {
  muteButton.disabled = true; // Enable the mute button when music is paused
  playMusic();
});

// Enable the button when the video ends
video.addEventListener("ended", () => {
  muteButton.disabled = false; // Enable the button when the video ends
});

function listcolourblack() {
  const ul = document.querySelector('ul');
  const listItems = ul.querySelectorAll('li');
  listItems.forEach(item => {
    item.style.color = 'white';
    item.style.borderBottom = '3px solid white';
  });
  musicList.style.backgroundColor = "black";
  closeMoreMusicBtn.style.color = "white"
  header.style.color = "white"
}

function listcolourwhite() {
  const ul = document.querySelector('ul');
  const listItems = ul.querySelectorAll('li');
  listItems.forEach(item => {
    item.style.color = 'black';
    item.style.borderBottom = '3px solid black';
  });
  musicList.style.backgroundColor = "white";
  closeMoreMusicBtn.style.color = "black"
  header.style.color = "black"
}