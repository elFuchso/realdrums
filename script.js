// Function to request permission
function requestAccelerometerPermission() {
    // Check if DeviceMotionEvent is available
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
        // Handle regular non-iOS 13+ devices
        setupAccelerometerEvents();
    }
}

// Function to setup accelerometer events
function setupAccelerometerEvents() {
    window.addEventListener('devicemotion', event => {
        let x = event.acceleration.x;
        let y = event.acceleration.y;
        let z = event.acceleration.z;
        let intensity = Math.sqrt(x*x + y*y + z*z); // Calculate the intensity

        document.querySelectorAll('.drum-pad').forEach(pad => {
            pad.addEventListener('click', () => playDrumSound(pad.id, intensity));
        });
    });
}

function playDrumSound(drumType, intensity) {
    // Map drumType to a specific sound file
    let soundFile = getSoundFile(drumType); 
    let audio = new Audio(soundFile);
    audio.volume = Math.min(intensity / 10, 1); // Adjust volume based on intensity
    audio.play();
}

function getSoundFile(drumType) {
    switch (drumType) {
        case 'bass-drum': return 'sounds/bass.wav';
        case 'snare-drum': return 'sounds/snare.wav';
        case 'hihat': return 'sounds/hihat.wav';
        // Add more cases for different drum types
    }
}

// Trigger the permission request
document.getElementById("request-permission").addEventListener('click', requestAccelerometerPermission);

