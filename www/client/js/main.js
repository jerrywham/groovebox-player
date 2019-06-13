


$(document).ready(function()
{





    /*  icecast metadata - service worker

    //  initialise
    navigator.serviceWorker.register('js/libs/metadata-worker-alt.js');


    navigator.serviceWorker.addEventListener('message', event => {
        console.log(event);
        if (event.origin != 'https://merritt.es') {
            //return;
        }
        var meta = event.data.msg;
        meta = meta.substring(meta.indexOf("'") + 1,meta.lastIndexOf("'"));
        console.log(meta);
    });

    */




    /*  metadata  */







    /*  audio  */


    //  log action
    console.log("[Audio] Attempting to start audio");


    //  create an audio stream container
    var audioContext = new window.AudioContext();


    //  setup audio element
    //  set volume to 50%
    var audio = new Audio("../api/?stream&mount=60s"); // https://merritt.es/radio/stream/60s
        audio.volume = 0.5;
        audio.setAttribute("type", "audio/mpeg");
        audio.setAttribute("preload", "none");
        audio.setAttribute("crossorigin", "anonymous");
        audio.setAttribute("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture");


    // attempt to play the audio
    var playPromise = audio.play();

    //  catch error if the audio fails to start
    if (playPromise !== undefined)
    {
        playPromise.then(_ => {
          // Automatic playback started!
          // Show playing UI.
          setControlsIcon("pause");
          console.log("[Audio] Auto-play started successfully!");
        })
        .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
            toggleControls("play");
            console.error("[Audio] Auto-play was prevented ("+ error +")");
        });
    }





    /*  audio state (play/pause)  */


    //  stop/start music playback
    function togglePlayback()
    {

        //  check if audio is playing
        if (!audio.paused)
        {
            audio.pause();
            setControlsIcon("play");
        } else
        {
            audio.play();
            setControlsIcon("pause");
        }

    }


    //  set audio controls icon
    function setControlsIcon(icon)
    {

        //  check for which icon
        if (icon == "play")
        {
            $(".audio-controls svg").addClass("hidden");
            $(".audio-controls svg.icon-play").removeClass("hidden");
        } else if (icon == "pause")
        {
            $(".audio-controls svg").addClass("hidden");
            $(".audio-controls svg.icon-pause").removeClass("hidden");
        }

    }


    //  toggle audio controls within the album cover
    function toggleControls(icon)
    {

        //  check if audio controls is already hidden
        if ($(".audio-controls").hasClass("hidden"))
        {

            //  change icon within audi controls
            setControlsIcon(icon);

            //  show audio controls
            $(".audio-controls").removeClass("hidden");

        } else {

            //  hide audio controls
            $(".audio-controls").addClass("hidden");

        }

    }


    $(document).on("click", ".audio-controls", function()
    {

        togglePlayback();

    });





    /*  oscilloscope  */


    //  create source from html5 audio element
    var source = audioContext.createMediaElementSource(audio);


    //  attach oscilloscope
    var scope = new Oscilloscope(source);

    //  start default animation loop
    scope.animate(canvas.getContext("2d"));


    //  reconnect audio output to speakers
    source.connect(audioContext.destination);





    /*  volume  */


    //  return the current volume
    function getVolume()
    {
        return audio.volume;
    }


    //  update volume percentage bar
    function updateVolumeBar()
    {

        //  get volume percentage as a whole number
        var volumePercentage = (getVolume() * 100).toFixed(0);

        //  apply percentage to the width of volume bar
        //  update text below bar to match percentage
        $(".volume .volume-bar-percentage").css({"width": volumePercentage + "%"});
        $(".volume .volume-text strong").text(volumePercentage+ " %");

        //  set bar color
        if (getVolume() > 0.75)
        {
            $(".volume").removeClass("green yellow red").addClass("green");
        } else if (getVolume() > 0.25) {
            $(".volume").removeClass("green yellow red").addClass("yellow");
        } else {
            $(".volume").removeClass("green yellow red").addClass("red");
        }

    }

    //  update volume bar on page-load
    updateVolumeBar();


    //  change the volume
    //  up or down
    //  half a point (0.5)
    function changeVolume(action)
    {

        //  get current volume
        var currentVolume = getVolume(),
            newVolume;

        //  turn volume up
        if (action == "up")
        {

            //  do nothing if already max volume
            if (currentVolume < 1)
            {
                newVolume = audio.volume += 0.05;
                audio.volume = newVolume.toFixed(2);
            }

        //  turn volume down
        } else
        {

            //  do nothing if muted
            if (currentVolume !== 0)
            {
                newVolume = audio.volume -= 0.05;
                audio.volume = newVolume.toFixed(2);
            }

        }


        updateVolumeBar();


        //  log action
        //console.log("[Volume] "+ action + ": "+ getVolume());

    }




    /*  key press  */


    //  detect user keypress
    $('body').keydown(function(e)
    {

        switch (e.which)
        {

            //  space key
            case 32:
                e.preventDefault();
                togglePlayback();
                break;

            //  plus,
            //  up-arrow,
            //  right-arrow key
            case 187:
            case 38:
            case 39:
                e.preventDefault();
                changeVolume("up");
                break;

            //  minus,
            //  down-arrow,
            //  left-arrow key
            case 189:
            case 40:
            case 37:
                e.preventDefault();
                changeVolume("down");
                break;

        }

        //console.log(e.which);

    });





});