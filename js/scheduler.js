  function scheduler() {
            // while there are notes that will need to play before the next interval, 
            // schedule them and advance the pointer.
            // while (nextNoteTime < audioContext.currentTime + 0.1) {
            //     scheduleNote(current16thNote, nextNoteTime);
            //     nextNote();
            // }

            console.log(audioContext.currentTime);
            timerID = window.setTimeout(scheduler, 50.0);
        }