// Check browser and device
window.onload = function() {

    if (!isChrome() || !isMobile()) {
        document.getElementById('browser-warning-popup').style.display = 'flex';
    }
    if (isSafariBrowser()) {
        document.getElementById('request-permission').style.display = 'block';
    } else {
        document.getElementById('request-permission').style.display = 'none';
    }
};

function isChrome() {
    return /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
}

function isMobile() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

function isSafariBrowser() {
    return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
}

function requestAccelerometerPermission() {
    //check if permission is required to be requested
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permissionState => {
                if (permissionState === 'granted') {
                    document.getElementById('request-permission').style.display = 'none';
                    setupAccelerometerEvents();
                } else {
                    alert("Permission to access accelerometer was denied.");
                }
            })
            .catch(console.error);
    } else {
        // For browsers that don't require permission
        setupAccelerometerEvents();
    }
}

// Add touch listener to drum pads
document.querySelectorAll('.drum-pad').forEach(pad => {
    pad.addEventListener('touchstart', (event) => {
        event.preventDefault();
        pad.classList.add('pressed');
        // add motion listener to touch listener
        window.addEventListener('devicemotion', (dmEvent) => {
            let intensity = getIntensityFromEvent(dmEvent);
            playDrumSound(pad.id, intensity);
        }, { once: true });

        setTimeout(() => {
            pad.classList.remove('pressed');
        }, 100);
    });
});

// load audio files
let audioFiles = {
    'bass-drum': new Audio('sounds/bass.wav'),
    'snare-drum': new Audio('sounds/snare.wav'),
    'hihat': new Audio('sounds/hihat.wav'),
    'tim': new Audio('sounds/tim.wav'),
    'tam': new Audio('sounds/tam.wav'),
    'tom': new Audio('sounds/tom.wav'),
    'click': new Audio('sounds/click.wav'),
    'cowbell': new Audio('sounds/cowbell.wav'),
    'hihat-foot': new Audio('sounds/hihatfoot.wav'),
    'bingo': new Audio('sounds/bingo.wav'),
    'bongo': new Audio('sounds/bongo.wav')
};


// preload audio files
for (let key in audioFiles) {
    audioFiles[key].preload = 'auto';
    audioFiles[key].load();
}

function getIntensityFromEvent(event) {
    let x = event.acceleration.x;
    let y = event.acceleration.y;
    let z = event.acceleration.z;
    return Math.sqrt(x * x + y * y + z * z); // calculate tap intensity from acceleration vector
}

function playDrumSound(drumType, intensity) {
    let audio = audioFiles[drumType];
    if (audio) {
        audio.currentTime = 0; //rewind to start
        audio.volume = Math.min(Math.max(intensity-0.2,0)/3, 1); // scale audio volume
        audio.play();
    }
}

// add listener to info button
document.getElementById('info-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'flex';
});
// add listener to close button
document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
});
// add listener to permissions button 
document.getElementById("request-permission").addEventListener('click', requestAccelerometerPermission);
