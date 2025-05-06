
cellsize = 25;

let isPromptOpen = false;
let lastPromptTime = 0;

function updateListeners() {
    document.addEventListener("mousedown", function(e) {
        // Discard clicks that occur too soon after a prompt
        if (Date.now() - lastPromptTime < 100) return;
        
        if (isPromptOpen || e.target.tagName.toLowerCase() !== "canvas") {
            return;
        }

        // Rest of your click handling logic...
        handleCanvasClick(e);
    });
}

async function handleCanvasClick(e) {
    console.log("Canvas clicked:", e.target);
    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const width = canvas.width;
    const cellWidth = width / 3;

    let type, snapY;
    
    if (x > 0 && x < cellWidth) {
        snapY = Math.floor(y / cellsize);
        type = "from";
    } else if (x > width - cellWidth && x < width) {
        snapY = Math.floor(y / cellsize);
        type = "to";
    } else {
        return;
    }

    groupNum = parseInt(canvas.id);

    await clickReference(snapY, type, groupNum);
}

async function clickReference(noteNum, type, groupNum) {
    isPromptOpen = true;
    lastPromptTime = Date.now();
    
    try {
        let userInput = prompt(`Enter a reference for ${type}`, "1");
        if (userInput === null) return;

        const referenceValue = parseInt(userInput);
        if (isNaN(referenceValue)) {
            alert("Please enter a valid number");
            return;
        }

        // Update your references...
        if (type === "from") {
            groups[groupNum].referenceFromVal = referenceValue;
            groups[groupNum].referenceFrom = noteNum;
        } else if (type === "to") {
            groups[groupNum].referenceToVal = referenceValue;
            groups[groupNum].referenceTo = noteNum;
        }

        drawReference();
    } finally {
        isPromptOpen = false;
        lastPromptTime = Date.now();
    }
}


cs = []

groups = []

refs = []


numVoices = 10;

numGroups = 32;

canvas = document.createElement("canvas");

document.getElementById("song").appendChild(canvas)



cctx = canvas.getContext("2d");



for(let i = 0; i<numGroups; i++) {

    cvs = document.createElement("canvas");
    cvs.width = cellsize;
    cvs.height = cellsize*numVoices;
    cvs.style.width = cvs.width + "px";
    cvs.style.height = cvs.height + "px";


    const ctx = cvs.getContext("2d");

    cvs.className = "refCanvas";


    cvs.id = i;


    
    document.getElementById("matrixholder").appendChild(cvs);

    col = document.createElement("div");
    col.className = "column";

    cols = []
    size = 0;

    for(let j = 0; j<numVoices; j++) {



        voiceSqr = document.createElement("input");
        voiceSqr.type = "number";
        voiceSqr.style.width = cellsize;
        voiceSqr.style.height = cellsize;
        
        col.appendChild(voiceSqr);

        col[j] = voiceSqr;

        size++;


    }


    groups[i] = {
        numNotes: numVoices,
        notes: col,
        referenceFrom: 0,
        referenceFromVal: 1,
        referenceTo: 1,
        referenceToVal: 1,
    }
    cs[i] = ctx;
    document.getElementById("matrixholder").appendChild(col);

}

currentChord = 0;

function drawPos() {
    canvas.height = 5;
    canvas.width = cellsize*numGroups+cellsize*numGroups;
    canvas.style.height = canvas.height + "px";
    canvas.style.width = canvas.width + "px";
    
    cctx.fillStyle = "grey";
    cctx.fillRect(0,0,canvas.width,canvas.height);
    cctx.fillStyle = "lightgrey"
    cctx.fillRect(cellsize+currentChord*(cellsize+cellsize), 0, (cellsize), 5);
}

function drawReference() {
    for(let i = 0; i<cs.length; i++) {
        ctx = cs[i];

        group = groups[i];

        numNotes = group.numNotes;


        referenceFrom = group.referenceFrom;

        referenceTo = group.referenceTo;

        ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height) 
        
        for(let j=0; j<numNotes; j++) {

            if(j == referenceFrom) {
                ctx.fillStyle = "lightgrey";
                ctx.fillRect(0,j*ctx.canvas.height/numNotes +1, ctx.canvas.width/3, ctx.canvas.height/numNotes - 2);

                ctx.font = "10px Arial";
                const fontSize = parseInt(ctx.font.match(/\d+/)[0]);
                ctx.fillStyle = "black";
                ctx.fillText(group.referenceFromVal, 0, j*ctx.canvas.height/numNotes - 2 + ctx.canvas.height/(numNotes*2) + fontSize/2);



            } else {
                ctx.fillStyle = "grey";
                ctx.fillRect(0,j*ctx.canvas.height/numNotes +1, ctx.canvas.width/3, ctx.canvas.height/numNotes - 2);
            }
            



            if(j == referenceTo) {
                ctx.fillStyle = "lightgrey";
                ctx.fillRect(2*ctx.canvas.width/3,j*ctx.canvas.height/numNotes +1, ctx.canvas.width/3, ctx.canvas.height/numNotes - 2);

                ctx.font = "10px Arial";
                const fontSize = parseInt(ctx.font.match(/\d+/)[0]);
                ctx.fillStyle = "black";
                ctx.fillText(group.referenceToVal, 2*ctx.canvas.width/3,j*ctx.canvas.height/numNotes - 2 + ctx.canvas.height/(numNotes*2) + fontSize/2);
            } else {
                ctx.fillStyle = "grey";
                ctx.fillRect(2*ctx.canvas.width/3,j*ctx.canvas.height/numNotes +1, ctx.canvas.width/3, ctx.canvas.height/numNotes - 2);
            }

        }

        ctx.beginPath();
        ctx.moveTo(ctx.canvas.width/3, (referenceFrom + 0.5)*ctx.canvas.height/numNotes);
        ctx.strokeStyle = "white";
        ctx.lineTo(2*ctx.canvas.width/3, (referenceTo + 0.5)*ctx.canvas.height/numNotes);
    
    
        
        ctx.lineWidth = 1;
        ctx.stroke();


    }
    drawPos()
    updateListeners()
}

drawReference();

loopLength = 4

nodes = [

]

function nextFreq() {


    if(currentChord >= loopLength - 1) {
        currentIteration++;
        currentChord = -1;
    }

    currentChord++;


    if(currentIteration != 0 || currentChord != 0) {

        let prevIndex;
        if(currentChord == 0) {
            prevIndex = loopLength - 1;
        } else {
            prevIndex = currentChord - 1;
        }

        currentRefNum = groups[currentChord].referenceToVal;
        currentRefDenom = groups[currentChord].referenceFromVal;

        currentRefFrom = groups[currentChord].referenceFrom

        prevRefTo = groups[prevIndex].referenceTo

        prevRefRef = groups[prevIndex].notes[prevRefTo].value;

        prevRefNote = groups[prevIndex].notes[currentRefFrom].value;

        refFromRatio = prevRefNote/prevRefRef

        refToFreq = refFromRatio * currentRefNum/currentRefDenom;
  

        baseFreq *= refToFreq

    } else {
        baseFreq = 350;
    }

    userDenom = parseFloat(groups[currentChord].notes[groups[currentChord].referenceTo].value, 10);


    for(let i = 0; i<numVoices; i++) {
        userNum = parseFloat(groups[currentChord].notes[i].value, 10);



        frequency = baseFreq * userNum/userDenom;
        if (!Number.isFinite(frequency)) {
            noteOff(i);
            continue;
        }
        midiNote = frequencyToMidi(frequency);
        //player.play(midiNote, 0, { duration: 0.5 });
        noteOn(i, midiNote);
    }
    drawReference();
}


currentIteration = 0;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();



oscillators = [];

baseFreq = 350;

function noteOn(node, midiNote) {
   // if (!nodes[node] || nodes[node].note) return;

    voice = nodes[node];

    if(midiNote == voice.lastfreq && voice.note != null) {
        return;
    }

    voice.lastfreq = midiNote;
    if(voice.note != null) voice.note.stop();
    voice.note = voice.instrument.play(midiNote, audioCtx.currentTime, { gain: 1});

}

function noteOff(node) {
    const voice = nodes[node];
    if (voice && voice.note) {
        voice.note.stop();
        voice.note = null;
    }
  }


function backToStart() {

        for(let i = 0; i<numVoices; i++) {
            noteOff(i);
            
        }
        currentChord = -1;
        currentIteration = 0;
        baseFreq = 350;


};

isPlaying = false;
let loopId;


function play() {

    const bpm = parseFloat(document.getElementById("bpm").value);
    loopLength = parseInt(document.getElementById("loopLength").value);
    backToStart(); 
    clearInterval(loopId);
    isPlaying = true;
    nextFreq();
    loopId = setInterval(() => {
        if(isPlaying) {
            nextFreq();
        }
    }, 60*1000.0/bpm)
}

function stop() {
    audioCtx.resume().then(() => {
        for(let i = 0; i<numVoices; i++) {
            noteOff(i);
        }
    })
    isPlaying = false;
    clearInterval(loopId);
}




function frequencyToMidi(frequency) {
    return (69 + 12 * Math.log2(frequency / parseFloat(440)));
}

function getDetune(frequency) {
    return (69 + 12 * Math.log2(frequency / 440))-frequencyToMidi(frequency);
}


function resetFreq() {
    baseFreq = 350;
}



const instruments = [
    'acoustic_grand_piano', 'bright_acoustic_piano', 'electric_grand_piano', 'honky_tonk_piano',
    'electric_piano_1', 'electric_piano_2', 'harpsichord', 'clavinet',
    'celesta', 'glockenspiel', 'music_box', 'vibraphone',
    'marimba', 'xylophone', 'tubular_bells', 'dulcimer',
    'drawbar_organ', 'percussive_organ', 'rock_organ', 'church_organ',
    'reed_organ', 'accordion', 'harmonica', 'tango_accordion',
    'acoustic_guitar_nylon', 'acoustic_guitar_steel', 'electric_guitar_jazz', 'electric_guitar_clean',
    'electric_guitar_muted', 'overdriven_guitar', 'distortion_guitar', 'guitar_harmonics',
    'acoustic_bass', 'electric_bass_finger', 'electric_bass_pick', 'fretless_bass',
    'slap_bass_1', 'slap_bass_2', 'synth_bass_1', 'synth_bass_2',
    'violin', 'viola', 'cello', 'contrabass',
    'tremolo_strings', 'pizzicato_strings', 'orchestral_harp', 'timpani',
    'string_ensemble_1', 'string_ensemble_2', 'synthstrings_1', 'synthstrings_2',
    'choir_aahs', 'voice_oohs', 'synth_choir', 'orchestra_hit',
    'trumpet', 'trombone', 'tuba', 'muted_trumpet',
    'french_horn', 'brass_section', 'synthbrass_1', 'synthbrass_2',
    'soprano_sax', 'alto_sax', 'tenor_sax', 'baritone_sax',
    'oboe', 'english_horn', 'bassoon', 'clarinet',
    'piccolo', 'flute', 'recorder', 'pan_flute',
    'blown_bottle', 'shakuhachi', 'whistle', 'ocarina',
    'lead_1_square', 'lead_2_sawtooth', 'lead_3_calliope', 'lead_4_chiff',
    'lead_5_charang', 'lead_6_voice', 'lead_7_fifths', 'lead_8_bass_and_lead',
    'pad_1_new_age', 'pad_2_warm', 'pad_3_polysynth', 'pad_4_choir',
    'pad_5_bowed', 'pad_6_metallic', 'pad_7_halo', 'pad_8_sweep',
    'fx_1_rain', 'fx_2_soundtrack', 'fx_3_crystal', 'fx_4_atmosphere',
    'fx_5_brightness', 'fx_6_goblins', 'fx_7_echoes', 'fx_8_sci_fi',
    'sitar', 'banjo', 'shamisen', 'koto',
    'kalimba', 'bagpipe', 'fiddle', 'shanai',
    'tinkle_bell', 'agogo', 'steel_drums', 'woodblock',
    'taiko_drum', 'melodic_tom', 'synth_drum', 'reverse_cymbal',
    'guitar_fret_noise', 'breath_noise', 'seashore', 'bird_tweet',
    'telephone_ring', 'helicopter', 'applause', 'gunshot'
  ];
  
  const select = document.getElementById("userInst")
  
  instruments.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name.replace(/_/g, ' ');
    select.appendChild(option);
  });
  
  function setInstrument(name) {
    for(let i = 0; i<numVoices; i++) {
        noteOff(i);
    } 
    Soundfont.instrument(audioCtx, name, {
        soundfont: 'MusyngKite' // or 'FluidR3_GM', etc.
      }).then(function(instrument) {
        nodes = []
        for(let i = 0; i < numVoices; i++) {

            nodes.push({
                instrument, 
                note:null,
                lastfreq: null
            });
        }
        player = instrument;
      })
    
  }
  
  
  select.addEventListener('change', function(e) {
    setInstrument(e.target.value);
  });
  
  setInstrument("violin");

  let player; // Soundfont player for your instrument

