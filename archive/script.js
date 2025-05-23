

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
        snapY = Math.floor(y / 50);
        type = "from";
    } else if (x > width - cellWidth && x < width) {
        snapY = Math.floor(y / 50);
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


numVoices = 3;

numGroups = 4;

canvas = document.createElement("canvas");

document.getElementById("song").appendChild(canvas)

cctx = canvas.getContext("2d");



for(let i = 0; i<numGroups; i++) {

    cvs = document.createElement("canvas");
    cvs.width = 50;
    cvs.height = 50*numVoices;

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
    canvas.width = 50*numGroups+50*numGroups;
    cctx.fillStyle = "grey";
    cctx.fillRect(0,0,canvas.width,canvas.height);
    cctx.fillStyle = "lightgrey"
    cctx.fillRect(50+currentChord*(50+50), 0, (50), 5);
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
        ctx.fillStyle = "red";
        ctx.lineTo(2*ctx.canvas.width/3, (referenceTo + 0.5)*ctx.canvas.height/numNotes);
    
    
        
        ctx.lineWidth = 1;
        ctx.stroke();


    }
    drawPos()
    updateListeners()
}

drawReference();

loopLength = 4

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


    for(let i = 0; i<3; i++) {
        oscillator = oscillators[i];
        frequency = oscillator.frequency.value;
        userNum = parseFloat(groups[currentChord].notes[i].value, 10);



        frequency = baseFreq * userNum/userDenom;

        midiNote = frequencyToMidi(frequency);
        detune = getDetune(frequency);
        player.detune = 50;
        player.play(midiNote, 0, { duration: 0.5 });


        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
    }

    drawReference();

}





currentIteration = 0;

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

let player; // Soundfont player for your instrument

Soundfont.instrument(audioCtx, 'violin').then(function(instrument) {
    player = instrument;
})

oscillators = [];

baseFreq = 350;




function play() {
    audioCtx.resume().then(() => {
        for(let i = 0; i<3; i++) {
            const oscillator = audioCtx.createOscillator();
            oscillator.type = 'sine'; // 'sine', 'square', 'sawtooth', or 'triangle'
            oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // frequency in Hz
            const gainNode = audioCtx.createGain();
            gainNode.gain.value = 0.3; // set volume (0.0 to 1.0)
            oscillator.connect(gainNode).connect(audioCtx.destination);



            oscillators[i] = (oscillator);
            
        }
        currentChord = -1;
        currentIteration = 0;
        baseFreq = 350;
        nextFreq();
        for(let i = 0; i<3; i++ ) {
           // oscillators[i].start();
        }

    })
};

function stop() {
    audioCtx.resume().then(() => {
        for(let i = 0; i<3; i++) {
            oscillators[i].stop();
        }
    })
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