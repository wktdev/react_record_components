"use strict";


var audioContext = new AudioContext();

function audioFileLoader(fileDirectory) {
    
    var soundObj = {};
    var playSound = undefined;
    var getSound = new XMLHttpRequest();
    soundObj.fileDirectory = fileDirectory;
    getSound.open("GET", soundObj.fileDirectory, true);
    getSound.responseType = "arraybuffer";
    getSound.onload = function() {
        var ele = document.getElementById("loader");
        ele.textContent="LOADING......"
        audioContext.decodeAudioData(getSound.response, function(buffer) {
            console.log(buffer);
            soundObj.soundToPlay = buffer;
            ele.textContent="READY!"

        });
    };

    getSound.send();

    soundObj.play = function(time, setStart, setDuration) {
        playSound = audioContext.createBufferSource();
        playSound.buffer = soundObj.soundToPlay;
        playSound.connect(audioContext.destination);
        playSound.start(audioContext.currentTime + time || audioContext.currentTime, setStart || 0, setDuration || soundObj.soundToPlay.duration);
    };

    soundObj.stop = function(time) {
        playSound.stop(audioContext.currentTime + time || audioContext.currentTime);
    };
    return soundObj;
}


function audioBatchLoader(obj) {

    for (var prop in obj) {
        obj[prop] = audioFileLoader(obj[prop]);

    }

    return obj;

}