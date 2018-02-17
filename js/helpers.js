
    function stopAllSoundFiles(arr = this.state.audioRecordings,prop = 'song'){ // @Stop all sound recordings from playing
        forEach((val)=>{
           val[prop].stop()
        })
    }
