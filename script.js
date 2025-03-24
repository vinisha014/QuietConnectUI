// Meditation Timer
let timer;
let isTimerRunning = false;
let minutes = 5;
let seconds = 0;

const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimer");
const resetTimerBtn = document.getElementById("resetTimer");

function startTimer() {
    if (isTimerRunning) return;

    isTimerRunning = true;
    startTimerBtn.textContent = "Pause Timer";

    timer = setInterval(() => {
        if (seconds === 0 && minutes === 0) {
            clearInterval(timer);
            alert("Meditation time is up. Well done!");
            isTimerRunning = false;
            startTimerBtn.textContent = "Start Timer";
        } else {
            if (seconds === 0) {
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }

            updateTimerDisplay();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    isTimerRunning = false;
    minutes = 5;
    seconds = 0;
    updateTimerDisplay();
    startTimerBtn.textContent = "Start Timer";
}

function updateTimerDisplay() {
    timerDisplay.textContent = `${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

startTimerBtn.addEventListener("click", startTimer);
resetTimerBtn.addEventListener("click", resetTimer);

// Audio control
const audio = document.getElementById("audio");
const playAudioBtn = document.getElementById("playAudio");

function toggleAudio() {
    if (audio.paused) {
        audio.play();
        playAudioBtn.textContent = "Pause Calm Music";
    } else {
        audio.pause();
        playAudioBtn.textContent = "Play Calm Music";
    }
}

playAudioBtn.addEventListener("click", toggleAudio);

// Start meditation session
const startSessionBtn = document.getElementById("startSession");

startSessionBtn.addEventListener("click", () => {
    alert("Enjoy your guided meditation!");
});
