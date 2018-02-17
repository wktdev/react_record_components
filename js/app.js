    let audioContext,
    song,
    mic,
    recorder,
    soundFile,
    audioRecordings = [];





    //__________________________BEGIN load sound via p5.js


    function preload() { // @preload is required by P5.js
        audioContext = getAudioContext();  
        soundFormats('mp3', 'ogg');
        song = loadSound('audio/song.mp3');
        console.log(song);
    }

    function setup() { // @setup is required by P5.js
        song.setVolume(0.1);

    }

   //___________________________END load sound via p5.js



    const leftPad = (width, n) => {

        if ((n + '').length > width) {
            return n;
        }
        const padding = new Array(width).join('0');
        return (padding + n).slice(-width);
    };


    class TimeElapsed extends React.Component {
        getUnits() {
            const seconds = this.props.timeElapsed / 1000;
            return {
                min: Math.floor(seconds / 60).toString(),
                sec: Math.floor(seconds % 60).toString(),
                msec: (seconds % 1).toFixed(3).substring(2)
            };
        }
        render() {
            const units = this.getUnits();
            return (
                <div>
        <span>{leftPad(2, units.min)}:</span>
        <span>{leftPad(2, units.sec)}.</span>
        <span>{units.msec}</span>
        </div>
            );
        }
    }





    //____________________________________BEGIN Timer
    class TimeDisplay extends React.Component {

        constructor(props) {
            super(props)
            this.timer = undefined;
            this.startTime = undefined;


            this.state = {
                isRunning: false,
                timeElapsed: 0
            };

        }

        componentDidMount() {
            this.startCounter();

        }

        componentDidUpdate(prevProps) {
            if (prevProps.isPlaying !== this.props.isPlaying) {
                this.startCounter();
            }
        }

        startCounter() {

            if (this.props.isPlaying) {
                console.log(this.props.isPlaying);
                this.startTime = Date.now();
                this.timer = setInterval(() => { this.update() }, 10);


            } else {
                console.log(this.props.isPlaying);
                clearInterval(this.timer);
                this.setState({ timeElapsed: 0 });
            }
        }

        update() {
            const delta = Date.now() - this.startTime;
            this.setState({ timeElapsed: this.state.timeElapsed + delta });
            this.startTime = Date.now();
        }





        render() {


            return (
            <div id="time-display">   
              <TimeElapsed  timeElapsed={this.state.timeElapsed} />
            </div>
            )
        }

    }






    //______________________________________END Timer


    class Button extends React.Component {
        constructor(props) {
            super(props)
        }

        render() {

            let recordingButton = {

            }

            let changeColor = {
                color: "red",

            }

            if (this.props.isRecording) {
                recordingButton = changeColor
            } else {
                recordingButton = {}
            }


            return (<button style={recordingButton} onClick={this.props.onClick}>{this.props.buttonText}</button>)
        }
    }




    class App extends React.Component {

        constructor(props) {
            super(props)
            this.song = undefined;
            this.playStartCurrentTime;
            this.recordStartCurrentTime;
            this.recordEndCurrentTime;

            this.toggleSongPlaying = this.toggleSongPlaying.bind(this);
            this.toggleRecording = this.toggleRecording.bind(this);
            this.checkedToPlay = this.checkedToPlay.bind(this);
            this.cueSelectedRecordingsToPlay = this.cueSelectedRecordingsToPlay.bind(this);
 

            this.state = {
                audioRecordings:[], // {timestamp: 0, sound: p5.SoundFile, checkedToPlay: false}
                isPlaying: false,
                isRecording: false,
                recordButtonText: "Start Recording",
                playButtonText: "Play Song",
            }

        }

        cueSelectedRecordingsToPlay(arr = this.state.audioRecordings){

            arr.forEach((val)=>{
                console.log("Time stamps: " + val.timestamp);
               if(val.checkedToPlay){
                   val.sound.play(val.timestamp)
               }
            })
        }

        componentDidMount() {


        }




        toggleSongPlaying() {
            var isPlaying = this.state.isPlaying;

            if (!isPlaying) {

                this.setState({
                    isPlaying: true,
                    playButtonText: "Stop Song",
                });
   
               this.playStartCurrentTime = audioContext.currentTime;
               console.log(this.playStartCurrentTime);
               this.cueSelectedRecordingsToPlay();
               song.play()

            } else {

                this.setState({
                    isPlaying: false,
                    playButtonText: "Play Song"
                })

                // this.stopRecording()

                song.stop()

            }

        }


        toggleRecording() {

            var isRecording = this.state.isRecording;
            if (!isRecording) {

                this.setState({
                    isRecording: true,
                    
                    recordButtonText: "Stop Recording",
                })

                // audioRecorder.record();
                mic = new p5.AudioIn();
                mic.start();
                recorder = new p5.SoundRecorder();
                recorder.setInput(mic);
                soundFile = new p5.SoundFile();
                this.recordStartCurrentTime = audioContext.currentTime
                recorder.record(soundFile);

                

            } else {

                this.setState({
                    isRecording: false,
                    recordButtonText: "Start Recording"
                });

                recorder.stop();

                console.log();
                let timeStamp =  Math.abs(this.recordStartCurrentTime - this.playStartCurrentTime);


                //_____________________________BEGIN update state

                let tempAudioRecordings = this.state.audioRecordings;
                tempAudioRecordings.push({timestamp:timeStamp,sound:soundFile,checkedToPlay:false});
                this.setState({
                    audioRecordings:tempAudioRecordings 
                });

               
                //_____________________________END update state

               
                // save(soundFile, 'mySound.wav');
            }


            var isPlaying = this.state.isPlaying;

            if (!isPlaying) {

                this.setState({
                    isPlaying: true,
                    playButtonText: "Stop Song",
                });


                this.playStartCurrentTime = audioContext.currentTime;
                console.log(this.playStartCurrentTime);
                song.play();
            }
        }

        checkedToPlay(index){
            let arrayTemp = this.state.audioRecordings;
            if(!arrayTemp[index].checkedToPlay){
                arrayTemp[index].checkedToPlay = true;
            }else{
                arrayTemp[index].checkedToPlay = false;
            }

            this.setState({
                audioRecordings:arrayTemp
            })

            console.log(this.state.audioRecordings[index].checkedToPlay);

        }

   

        render() {

            console.log(this.state.audioRecordings);
            const mainContainer = {
                width: "700px",
                margin: "0 auto",
                height: "300px",
                outlineStyle: "solid"
            }

           let listRecordings = this.state.audioRecordings.map((val,index)=>{
                   return <li key={index}>recording number: {index+1} timestamp: {val.timestamp} | PLAY <input type='checkbox' onChange={()=>this.checkedToPlay(index)}></input></li>
           })

            return (
            <main style = {mainContainer}> 
        
                 <section>
                    <div className="buttonContainer">
                      <TimeDisplay isPlaying = {this.state.isPlaying}/>
                      <Button buttonText = {this.state.recordButtonText} onClick={this.toggleRecording} isRecording={this.state.isRecording}/> 
                      <Button buttonText = {this.state.playButtonText} onClick={this.toggleSongPlaying} />
                    </div>
                 </section>

                 <ul>
                  {listRecordings}
                 </ul>

            </main>

            )
        }
    }



    ReactDOM.render(
        <div>
        <App/>
    </div>,
        document.getElementById("root"))