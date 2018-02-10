class AudioRecorder {

    constructor() {
        this.mediaRecorder;
        this.chunks = [];
        this.blob;
        this.recordedAudioBuffers = [];
    }

    record() {

        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream)=> {
            this.mediaRecorder = new MediaRecorder(stream);
            this.mediaRecorder.start();
            console.log( this.mediaRecorder.state);
            this.mediaRecorder.ondataavailable = (e)=> {
                this.chunks.push(e.data);
            }

        })

    }

    stop() {

        this.mediaRecorder.stop();
         console.log( this.mediaRecorder.state);
        this.mediaRecorder.onstop = (e)=> {
            this.blob = new Blob(this.chunks, { 'type': 'audio/mp3' });
            this.blobToBuffer(this.blob)
        }

    }

    blobToBuffer(blob){
    	   var fileReader = new FileReader();

           fileReader.onload = (e)=> {
                     this.recordedAudioBuffers.push(fileReader.result);
                     console.log(this.recordedAudioBuffers);
            }

        fileReader.readAsArrayBuffer(blob);    
    }

}




let audioRecorder = new AudioRecorder();
// audioRecorder.record();
// audioRecorder.stop();
// audioRecorder.blobToBuffer();

