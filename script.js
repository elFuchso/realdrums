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
        let intensity = Math.sqrt(x*x + y*y + z*z);

        document.querySelectorAll('.drum-pad').forEach(pad => {
            pad.addEventListener('touchstart', (event) => {
                event.preventDefault(); // Prevents additional mouse events
                pad.classList.add('pressed');
                playDrumSound(pad.id, intensity);
                
                setTimeout(() => {
                    pad.classList.remove('pressed');
                }, 100);
            });
        });

    });
}

function playDrumSound(drumType, intensity) {
    let soundFile = getSoundFile(drumType); 
    let audio = new Audio(soundFile);
    audio.volume = Math.min(intensity / 10, 1);
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

document.getElementById("request-permission").addEventListener('click', requestAccelerometerPermission);
