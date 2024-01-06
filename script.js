// Function to request accelerometer permission
function requestAccelerometerPermission() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    setupAccelerometerEvents();
                } else {
                    alert("Permission to access accelerometer was denied.");
                }
            })
            .catch(console.error);
    } else {
        setupAccelerometerEvents();
    }
}

document.querySelectorAll('.drum-pad').forEach(pad => {
    pad.addEventListener('touchstart', (event) => {
        event.preventDefault();
        pad.classList.add('pressed');

        // Read accelerometer data directly in the touchstart event
        window.addEventListener('devicemotion', (dmEvent) => {
            let intensity = getIntensityFromEvent(dmEvent);
            playDrumSound(pad.id, intensity);
        }, { once: true }); // Use the 'once' option to only trigger this once

        setTimeout(() => {
            pad.classList.remove('pressed');
        }, 100);
    });
});

let audioFiles = {
    'bass-drum': new Audio('sounds/bass.wav'),
    'snare-drum': new Audio('sounds/snare.wav'),
    'hihat': new Audio('sounds/hihat.wav')
    // Add more as needed
};

function getIntensityFromEvent(event) {
    let x = event.accelerationIncludingGravity.x;
    let y = event.accelerationIncludingGravity.y;
    let z = event.accelerationIncludingGravity.z;
    return Math.sqrt(x * x + y * y + z * z);
}

function playDrumSound(drumType, intensity) {
    let audio = audioFiles[drumType];
    if (audio) {
        audio.currentTime = 0; // Rewind to the start
        audio.volume = Math.min(intensity / 20, 1); // Adjust volume based on intensity
        audio.play();
    }
}

document.getElementById("request-permission").addEventListener('click', requestAccelerometerPermission);
