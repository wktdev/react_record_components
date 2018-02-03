class Loader extends React.Component {
    render(){
      return(
        <div>
          <div id="loader"></div>
        </div>
      )
    }
}


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
        if(prevProps.isPlaying !== this.props.isPlaying) {
            this.startCounter();
        }
    }

     startCounter() {

        if (this.props.isPlaying) {
               console.log(this.props.isPlaying);
              this.startTime = Date.now();
              console.log(this.startTime);
              this.timer = setInterval(()=>{this.update()}, 10);


        }else{
           console.log(this.props.isPlaying);
           clearInterval(this.timer);
           this.setState({timeElapsed:0});
        }
    }

    update() {
      const delta = Date.now() - this.startTime;
      this.setState({timeElapsed: this.state.timeElapsed + delta});
      this.startTime = Date.now();
    }


   


    render() {


        return (
            <div>   
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
        return (<button onClick={this.props.onClick}>{this.props.buttonText}</button>)
    }
}




class App extends React.Component {

    constructor(props) {
        super(props)
        this.song = audioFileLoader("audio/song.mp3");
        this.toggleSongPlaying = this.toggleSongPlaying.bind(this);
        this.toggleRecording = this.toggleRecording.bind(this);
        this.stopRecording = this.stopRecording.bind(this);

        this.state = {
            isPlaying: false,
            isRecording: false,
            recordButtonText: "Start Recording",
            playButtonText: "Play Song",
        }

    }



    toggleSongPlaying() {
        var isPlaying = this.state.isPlaying;

        if (!isPlaying) {

            this.setState({
                isPlaying: true,
                playButtonText: "Stop Song",
            })

            this.song.play()

        } else {

            this.setState({
                isPlaying: false,
                playButtonText: "Play Song"
            })

            this.stopRecording()

            this.song.stop()

        }

    }


    toggleRecording() {

        var isRecording = this.state.isRecording;
        if (!isRecording) {

            this.setState({
                isRecording: true,
                recordButtonText: "Stop Recording",
            })


        } else {

            this.setState({
                isRecording: false,
                recordButtonText: "Start Recording"
            })

        }

    }

    stopRecording() {
        this.setState({
            isRecording: false,
            recordButtonText: "Start Recording"
        })
    }

    render() {

        const goldPanel = {
            backgroundColor: "#ebc922",
            height: "100px",
            position: "relative",
            top: "40%",
            width: "700px"
        }

        const mainContainer = {
            width: "700px",
            margin: "0 auto",
            height: "300px",
            outlineStyle: "solid"
        }

        return (
            <main style = {mainContainer}>  
            <Loader/>
              <section style={goldPanel}>
              <TimeDisplay isPlaying = {this.state.isPlaying}/>
              <div className="buttonContainer">
                 <Button buttonText = {this.state.recordButtonText} onClick={this.toggleRecording}/> 
                 <Button buttonText = {this.state.playButtonText} onClick={this.toggleSongPlaying} />
              </div>

             </section>
          </main>

        )
    }
}



ReactDOM.render(
    <div>
        <App/>
    </div>,
    document.getElementById("root"))