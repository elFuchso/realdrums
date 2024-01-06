let lastIntensity = 0;

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

function setupAccelerometerEvents() {
    window.addEventListener('devicemotion', event => {
        let x = event.acceleration.x;
        let y = event.acceleration.y;
        let z = event.acceleration.z;
        lastIntensity = Math.sqrt(x*x + y*y + z*z);
    });
}

document.querySelectorAll('.drum-pad').forEach(pad => {
    pad.addEventListener('touchstart', (event) => {
        event.preventDefault();
        pad.classList.add('pressed');
        playDrumSound(pad.id);
        
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

function playDrumSound(drumType) {
    let audio = audioFiles[drumType];
    if (audio) {
        audio.currentTime = 0; // Rewind to the start
        audio.volume = Math.min(lastIntensity / 10, 1)
        audio.play();
    }
}

function getSoundFile(drumType) {
    switch (drumType) {
        case 'bass-drum': return 'sounds/bass.wav';
        case 'snare-drum': return 'sounds/snare.wav';
        case 'hihat': return 'sounds/hihat.wav';
        // Add more cases for different drum types
    }
}

document.getElementById("request-permission").addEventListener('click', requestAccelerometerPermission);
