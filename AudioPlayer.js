const wrapper = document.querySelector(".wrapper");
const coverArea = wrapper.querySelector(".img-area");
const musicName = wrapper.querySelector(".song-details .name");
const musicArtist = wrapper.querySelector(".song-details .artist");
const playPauseBtn = wrapper.querySelector(".play-pause");
const prevBtn = wrapper.querySelector("#prev");
const nextBtn = wrapper.querySelector("#next");
const mainAudio = wrapper.querySelector("#main-audio");
const progressArea = wrapper.querySelector(".progress-area");
const progressBar = progressArea.querySelector(".progress-bar");
const musicList = wrapper.querySelector(".music-list");
const moreMusicBtn = wrapper.querySelector("#more-music");
const closeMoreMusicBtn = musicList.querySelector("#close");

let musicIndex = 1; // Start with the first song in the array
let isMusicPaused = true;
let isShuffleMode = false;

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
  updatePlayingSong();
});

function loadMusic(indexNumb) {
  const music = allMusic[indexNumb - 1];
  musicName.innerText = music.name;
  musicArtist.innerText = music.artist;

  const { coverType = 'Images', src, type = 'jpg' } = music;
  coverArea.innerHTML = ''; // Clear the cover area

  if (coverType === 'video') {
    const videoElement = document.createElement('video');
    videoElement.src = `Videos/${src}.${type}`;
    videoElement.controls = true;
    videoElement.autoplay = true;
    videoElement.loop = true;
    coverArea.appendChild(videoElement);
  } else {
    const imgElement = document.createElement('img');
    imgElement.src = `Images/${src}.${type}`;
    imgElement.alt = music.name;
    coverArea.appendChild(imgElement);
  }

  mainAudio.src = `Audio/${src}.mp3`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
  isMusicPaused = false;
  localStorage.setItem("isMusicPaused", false);
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
  isMusicPaused = true;
  localStorage.setItem("isMusicPaused", true);
}

function prevMusic() {
  musicIndex = (musicIndex > 1) ? musicIndex - 1 : allMusic.length;
  loadMusic(musicIndex);
  playMusic();
}

function nextMusic() {
  musicIndex = (musicIndex < allMusic.length) ? musicIndex + 1 : 1;
  loadMusic(musicIndex);
  playMusic();
}

playPauseBtn.addEventListener("click", () => {
  isMusicPaused ? playMusic() : pauseMusic();
});

prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

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
  }
});

progressArea.addEventListener("click", (e) => {
  const clickedOffsetX = e.offsetX;
  const songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressArea.clientWidth) * songDuration;
  playMusic();
});

const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
  const currentMode = repeatBtn.innerText;
  switch (currentMode) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      isShuffleMode = true;
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      isShuffleMode = false;
      break;
  }
});

mainAudio.addEventListener("ended", () => {
  switch (repeatBtn.innerText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      loadMusic(musicIndex);
      playMusic();
      break;
    case "shuffle":
      musicIndex = Math.floor(Math.random() * allMusic.length) + 1;
      loadMusic(musicIndex);
      playMusic();
      break;
  }
});

moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMoreMusicBtn.addEventListener("click", () => {
  musicList.classList.remove("show");
});

const ulTag = wrapper.querySelector("ul");

allMusic.forEach((music, i) => {
  const liTag = document.createElement("li");
  liTag.setAttribute("li-index", i + 1);

  liTag.innerHTML = `
    <div class="row">
      <span>${music.name}</span>
      <p>${music.artist}</p>
    </div>
    <span id="${music.src}" class="audio-duration">3:40</span>
    <audio class="${music.src}" src="songs/${music.src}.mp3"></audio>
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

function updatePlayingSong() {
  const allLiTags = ulTag.querySelectorAll("li");

  allLiTags.forEach(liTag => {
    const audioTag = liTag.querySelector(".audio-duration");
    liTag.classList.toggle("playing", liTag.getAttribute("li-index") == musicIndex);
    audioTag.innerText = liTag.classList.contains("playing") ? "Playing" : audioTag.getAttribute("t-duration");
  });
}

const modeToggle = document.getElementById("modeToggle");
modeToggle.addEventListener("click", () => {
  wrapper.classList.toggle("dark-mode");
  document.getElementById("fontawesome-icons").classList.toggle("Dark");
});
