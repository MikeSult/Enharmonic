//
// EnharmonicPicker.js
//
// Enharmonic module
//

var Enharmonic = (function() {

var major = [0,2,4,5,7,9,11];
var nat_minor = [0,2,3,5,7,8,10];
var harm_minor = [0,2,3,5,7,8,11];
var mel_minor = [0,2,3,5,7,9,11];

function updateModelScale() {
    var names = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
    var structure = getScaleStructure();

	var newChromNames1 = setArray('C');
	var newChromNames2 = setArray('B#');
	
	var div0 = document.getElementById('row0');
	div0.innerHTML = createRow('0', names, structure);
	
	var div1 = document.getElementById('row1');
	div1.innerHTML = createRow('1', newChromNames1, structure);
	
	var div2 = document.getElementById('row2');
	div2.innerHTML = createRow('2', newChromNames2, structure);

	var divBW2 = document.getElementById('BW_row2');
	divBW2.innerHTML = createBWRow(0);

    document.getElementsByClassName('newRootLetter')[0].innerHTML = 'C';
    document.getElementsByClassName('newRootLetter')[1].innerHTML = 'C';

}


function getScaleStructure() {
    var structure;
    var scaleTypeMenu = document.getElementById('scaleType');
    var scaleTypeMenuChoice = scaleTypeMenu.options[scaleTypeMenu.selectedIndex].value;
    console.log("scaleTypeMenuChoice="+scaleTypeMenuChoice);
    if(scaleTypeMenuChoice == '0,2,4,5,7,9,11') { // major
        structure = major;
    } else if(scaleTypeMenuChoice == '0,2,3,5,7,8,10') {
        structure = nat_minor;
    } else if(scaleTypeMenuChoice == '0,2,3,5,7,8,11') {
        structure = harm_minor;
    } else if(scaleTypeMenuChoice == '0,2,3,5,7,9,11') {
        structure = mel_minor;
    }
    return structure;
}


var majorMenu = "Modulate to the key of " +
"<select id='transposeLetter'>" +
"<option value='C'>C</option>" +
"<option value='Cb'>Cb</option>" +
"<option value='C#'>C#</option>" +
"<option value='Db'>Db</option>" +
"<option value='D'>D</option>" +
"<option value='Eb'>Eb</option>" +
"<option value='E'>E</option>" +
"<option value='F'>F</option>" +
"<option value='F#'>F#</option>" +
"<option value='Gb'>Gb</option>" +
"<option value='G'>G</option>" +
"<option value='Ab'>Ab</option>" +
"<option value='A'>A</option>" +
"<option value='Bb'>Bb</option>" +
"<option value='B'>B</option>" +
"</select>";

var minorMenu = "Modulate to the key of " +
"<select id='transposeLetter'>" +
"<option value='A'>A</option>" +
"<option value='Ab'>Ab</option>" +
"<option value='A#'>A#</option>" +
"<option value='Bb'>Bb</option>" +
"<option value='B'>B</option>" +
"<option value='C' SELECTED>C</option>" +
"<option value='C#'>C#</option>" +
"<option value='D'>D</option>" +
"<option value='D#'>D#</option>" +
"<option value='Eb'>Eb</option>" +
"<option value='E'>E</option>" +
"<option value='F'>F</option>" +
"<option value='F#'>F#</option>" +
"<option value='G'>G</option>" +
"<option value='G#'>G#</option>" +
"</select>";


function updateTransposeMenu() {
    var keyMenuPara = document.getElementById("keyChoices");
    var scaleTypeMenu = document.getElementById('scaleType');
    var scaleTypeMenuChoice = scaleTypeMenu.options[scaleTypeMenu.selectedIndex].value;
    console.log("scaleTypeMenuChoice="+scaleTypeMenuChoice);
    if(scaleTypeMenuChoice == '0,2,4,5,7,9,11') { // major
        keyMenuPara.innerHTML = majorMenu;
    } else {
        keyMenuPara.innerHTML = minorMenu;
    }
    updateTransposeArrays();
    rootMenu = document.getElementById('transposeLetter');
    rootMenu.onchange = updateTransposeArrays;

}

var offsetFromC = {
    'C': 0, 'Cb': 11, 'C#': 1,
    'Db': 1, 'D': 2, 'D#': 3,
    'Eb': 3, 'E': 4, 'E#': 5,
    'Fb': 4, 'F': 5, 'F#': 6,
    'Gb': 6, 'G': 7, 'G#': 8,
    'Ab': 8, 'A': 9, 'A#': 10,
    'Bb': 10, 'B': 11, 'B#': 0    
}


function updateTransposeArrays() {
    // clear the old display
    var evalDiv;
	evalDiv = document.getElementById('evalDiv');
	evalDiv.innerHTML = '';

    var names = ['C','Db','D','Eb','E','F','Gb','G','Ab','A','Bb','B'];
    var structure = getScaleStructure();

    var newRootMenu = document.getElementById('transposeLetter');
    var newRoot = newRootMenu.options[newRootMenu.selectedIndex].value;
    var newRootEnharmonic = enharmonics[newRoot];
    
    document.getElementsByClassName('newRootLetter')[0].innerHTML = newRoot;
    document.getElementsByClassName('newRootLetter')[1].innerHTML = newRoot;
    
    var chrom1 = setArray(newRoot);
    var chrom2 = setArray(newRootEnharmonic);
    
    var div0 = document.getElementById('row0');
    div0.innerHTML = createRow('0', names, structure);
    var div1 = document.getElementById('row1');
    div1.innerHTML = createRow('1', chrom1, structure);
    var div2 = document.getElementById('row2');
    div2.innerHTML = createRow('2', chrom2, structure);

    var divBW2 = document.getElementById('BW_row2');
    var offset = offsetFromC[newRoot];
    divBW2.innerHTML = createBWRow(offset);
}

function mDown(obj) {
    // determine the pitch number, noteName
    var halfStepsFromRootStr = obj.id.slice(2);
    var halfStepsFromRoot = Number(halfStepsFromRootStr);
    var newRootMenu = document.getElementById('transposeLetter');
    var newRoot = newRootMenu.options[newRootMenu.selectedIndex].value;
    var midiNote = 60 + offsetFromC[newRoot] + halfStepsFromRoot;
    if(obj.id.charAt(0) == '0') {
        midiNote = 60 + halfStepsFromRoot;
    }
    var noteName = MIDI_SHARP_NAMES[midiNote];
    
    // manage color change on mouseDown
    var colors = ['lightblue', 'lightgreen'];
//    console.log('obj.id='+obj.id);
    var otherID;
    if(obj.id.charAt(0) == '1')
        otherID = '2'+obj.id.slice(1);
    else
        otherID = '1'+obj.id.slice(1);    
    var otherName = document.getElementById(otherID);
    if(obj.style.backgroundColor == 'lightgreen') {
        obj.style.backgroundColor = colors[0];
    } else {
        obj.style.backgroundColor = colors[1];
        otherName.style.backgroundColor = colors[0];
//        stopIt();
        playIt(noteName);    
    }
}

function getStudentChoices() {
    var id1;
    var id2;
    var obj1;
    var obj2;
    var evalDiv;
    var studentChoices = [];
    var scaleStructure = getScaleStructure();
    for(let i=0; i<7; i++) {
        id1 = '1_'+scaleStructure[i];
        id2 = '2_'+scaleStructure[i];
        console.log('id1='+id1);
        obj1 = document.getElementById(id1);
        obj2 = document.getElementById(id2);
        if(obj1.style.backgroundColor == 'lightgreen') {
		    studentChoices.push(obj1.innerHTML);
        } else if(obj2.style.backgroundColor == 'lightgreen') {
		    studentChoices.push(obj2.innerHTML);
        }
    }
    // octave note
	obj1 = document.getElementById('1_12');
	obj2 = document.getElementById('2_12');
	if(obj1.style.backgroundColor == 'lightgreen') {
		studentChoices.push(obj1.innerHTML);
	} else if(obj2.style.backgroundColor == 'lightgreen') {
		studentChoices.push(obj2.innerHTML);
	}
	console.log('studentChoices='+studentChoices);
	return studentChoices;
}

function getCorrectScale() {
    // get correct scale spelling
    var structure = getScaleStructure();
    var newRootMenu = document.getElementById('transposeLetter');
    var newRoot = newRootMenu.options[newRootMenu.selectedIndex].value;
    var newRootEnharmonic = enharmonics[newRoot];    
    var chrom1 = setArray(newRoot);
    var chrom2 = setArray(newRootEnharmonic);
    var alphaArray = setAlphaArray(newRoot);
    console.log('newRoot='+newRoot+'\nalphaArray='+alphaArray);
    var structureIndex = 0;
    var correctScale = [];
    console.log('chrom1='+chrom1+' chrom2='+chrom2);
    for(let i=0; i<12; i++) {
        // check to see if this is a note in the scale
        if(structure[structureIndex] == i) {
//            console.log('i='+i+' alphaArray['+structureIndex+']='+alphaArray[structureIndex]);
//            console.log('chrom1['+i+']='+chrom1[i]+' chrom2['+i+']='+chrom2[i]);
            if(chrom1[i].includes(alphaArray[structureIndex]) ) {
                correctScale.push(chrom1[i]);            
//                console.log('FOUND IT: chrom1['+i+']='+chrom1[i]);
            } else if(chrom2[i].includes(alphaArray[structureIndex]) ) {
                correctScale.push(chrom2[i]);
//                console.log('FOUND IT: chrom2['+i+']='+chrom2[i]);
            }
            structureIndex++;
        }
    }
    correctScale.push(newRoot);
    return correctScale;
}

function getScaleName(structure) {
    var name;
    if(structure === major) {
        name = 'major';
    } else if(structure === nat_minor) {
        name = 'natural minor';
    } else if(structure === harm_minor) {
        name = 'harmonic minor';
    } else if(structure === mel_minor) {
        name = 'melodic minor';  
    }
    return name;
}


function evaluateAnswer() {
    var studentChoices = getStudentChoices();
    var correctScale = getCorrectScale();
    var structure = getScaleStructure();
    var scaleName = getScaleName(structure);
    var newRootMenu = document.getElementById('transposeLetter');
    var newRoot = newRootMenu.options[newRootMenu.selectedIndex].value;
    var responseString = 'Your choices = '+ studentChoices;
    var isAllCorrect = true;
    // look at each of the studentChoices
	if(studentChoices.length !== correctScale.length) {
		responseString += '<br />You have not selected all of the choices.'
        isAllCorrect = false;
	}
    for(var i=0; i<studentChoices.length; i++) {
        if(studentChoices[i] !== correctScale[i]) {
            responseString += '<br />your choice of <b class="redColorBold">'+studentChoices[i]+'</b> for note '+(i+1)+' is <b class="redColorBold">incorrect</b>, the <b class="greenColorBold">correct</b> name is <b class="greenColorBold">'+correctScale[i]+'</b>';
            isAllCorrect = false;
        }
    }
    if(isAllCorrect) {
        responseString += '<br />Yes, that is the <b class="greenColorBold">correct spelling</b> for the <b class="greenColorBold">'+newRoot+' '+scaleName+'</b> scale.';
    }
	var evalDiv = document.getElementById('evalDiv');
//	evalDiv.innerHTML = 'Your choices = '+ studentChoices +'<br />correct spelling = '+ correctScale;
	evalDiv.innerHTML = responseString;
}

function createRow(rowNum, noteNames, intervalStructure) {
    var usesChromaticScale = false;
    if(noteNames.length === 12)
        usesChromaticScale = true;
    var html = '';

//    var oneBoxOpen = '<div class="pitchBox col-1" onclick="mDown(this)" id="'; 
    // using Module pattern, we need the Module namespace with inline onclick handler 'mDown'
    var oneBoxOpen = '<div class="pitchBox col-1" onclick="Enharmonic.mDown(this)" id="'; 
    var oneMask = '<div class="pitchBoxMask col-1">';
    var endBox  = '</div>';
    var isBox = false;
    var nameIndex = 0;
    var structureIndex = 0;
    for(let i=0; i<12; i++) {
        // check to see if this is a box or mask
        if(intervalStructure[structureIndex] == i) {
          isBox = true;
          structureIndex++;
        }
        if(isBox) {
            html += oneBoxOpen
            html += ''+rowNum+'_'+i+'">'
            html += noteNames[nameIndex];
            html += endBox;
            nameIndex++;
        } else {
            html += oneMask;
            if(usesChromaticScale) {
                html += noteNames[nameIndex];
                nameIndex++;
            } else {
                html += '.';
            }
            html += endBox;            
        }
        isBox = false;
    }
    html += oneBoxOpen
    html += ''+rowNum+'_12">'
    html += noteNames[0];
    html += endBox;
    return html;
}

function createBWRow(offset) {
    var html = '';
    var whiteBoxOpen = '<div class="whiteBox col-1">'; 
    var blackBoxOpen = '<div class="blackBox col-1">';
    var endBox  = '</div>';
    console.log('offset='+offset);
    for(let i=offset; i<(12+offset); i++) {
        if(i%12==1 || i%12==3 || i%12==6 || i%12==8 || i%12==10 ) {
            html += blackBoxOpen
//            html += '.';
            html += endBox;
        } else {
            html += whiteBoxOpen
//            html += '.';
            html += endBox;
        }
    }
    if(offset==1 || offset==3 || offset==6 || offset==8 || offset==10 ) {
	    html += blackBoxOpen
	} else {
	    html += whiteBoxOpen
    }
//	html += '.';
	html += endBox;
    return html;
}



function setArray(startLetter) {

  var letters1 = ['C','C#','Cx','Eb','E','F','Gb','G','Ab','A','Bb','B'];
  var letters2 = ['B#','Db','D','D#','Fb','E#','F#','Fx','G#','Gx','A#','Cb'];
  var alphaLetters = ['C','D','E','F','G','A','B'];
  var newArray = [];
  for(let i=0; i<12; i++) {
      if(startLetter == letters1[i]) {
          for(let j=i; j<12+i; j++) {
//              console.log("letters1", letters1[ j % letters1.length ]);
              newArray.push(letters1[ j % letters1.length ]);
          }
          break;
      } else if(startLetter == letters2[i]) {
          for(let j=i; j<12+i; j++) {
//              console.log("letters2", letters1[ j % letters1.length ]);
              newArray.push(letters2[ j % letters1.length ]);
          }      
          break;
      }
  }
  return newArray;
}

function setAlphaArray(startLetter) {
    var alphaLetters = ['C','D','E','F','G','A','B'];
    var newArray = [];
    for(let i=0; i<8; i++) {
        if(startLetter.includes(alphaLetters[i]) ) {
            for(let j=i; j<8+i; j++) {
                newArray.push(alphaLetters[ j % alphaLetters.length ]);
            }
            break;
        }
    }
    return newArray;
}

var enharmonics = {
    'Cb': 'B',
    'B': 'Cb',
    'B#': 'C',
    'C': 'B#',
    'C#': 'Db',
    'Db': 'C#',
    'D': 'Cx',
    'Cx': 'D',
    'Eb': 'D#',
    'D#': 'Eb',
    'E': 'Fb',
    'Fb': 'E',
    'F': 'E#',
    'E#': 'F',
    'F#': 'Gb',
    'Gb': 'F#',
    'G': 'Fx',
    'Fx': 'G',
    'G#': 'Ab',
    'Ab': 'G#',
    'A': 'Gx',
    'Gx': 'A',
    'A#': 'Bb',
    'Bb': 'A#'
}


//-----------------------------------------------------
// Tone.js play code
//-----------------------------------------------------

function playAudio() {
    var player = new Tone.Player({	"url" : "./path/to/sample.mp3", "autostart" : false, }).toMaster();
	// any setup?
	
	// play the file
	player.start()
}

var synth = null;
function playIt(note){
    if(!synth) {
        synth = new Tone.Synth().toMaster();
    }
    synth.volume.value = Number(document.getElementById('volume').value);
//    console.log('synth.volume.value='+synth.volume.value);
//   Tone.Transport.bpm.value = 60;   
    var duration = 1.0;
    synth.triggerAttackRelease(note, duration);
}

function stopIt(){
    Tone.Transport.stop();
    Tone.Transport.cancel(0);
    if(synth) {
        synth.dispose();
        synth = null;
    }
}

function updateTempo()  {
//	var tempo = document.myForm.tempo.value;
//	Tone.Transport.bpm.value = tempo   
}

function updateVolume()  {
//	var volune = document.getElementById('volume').value;
//	Tone.Transport.bpm.value = tempo   
}


var MIDI_SHARP_NAMES = ['B#_0',  'C#_1', 'Cx_1', 'D#_1',   'E_1',  'E#_1',  'F#_1', 'Fx_1',  'G#_1', 'Gx_1', 'A#_1', 'B_1',
                    'B#_1', 'C#0', 'Cx0', 'D#0', 'E0', 'E#0', 'F#0', 'Fx0', 'G#0', 'Gx0', 'A#0', 'B0',
                    'B#0', 'C#1', 'Cx1', 'D#1', 'E1', 'E#1', 'F#1', 'Fx1', 'G#1', 'Gx1', 'A#1', 'B1',
                    'B#1', 'C#2', 'Cx2', 'D#2', 'E2', 'E#2', 'F#2', 'Fx2', 'G#2', 'Gx2', 'A#2', 'B2',
                    'B#2', 'C#3', 'Cx3', 'D#3', 'E3', 'E#3', 'F#3', 'Fx3', 'G#3', 'Gx3', 'A#3', 'B3',
                    'B#3', 'C#4', 'Cx4', 'D#4', 'E4', 'E#4', 'F#4', 'Fx4', 'G#4', 'Gx4', 'A#4', 'B4',
                    'B#4', 'C#5', 'Cx5', 'D#5', 'E5', 'E#5', 'F#5', 'Fx5', 'G#5', 'Gx5', 'A#5', 'B5',
                    'B#5', 'C#6', 'Cx6', 'D#6', 'E6', 'E#6', 'F#6', 'Fx6', 'G#6', 'Gx6', 'A#6', 'B6',
                    'B#6', 'C#7', 'Cx7', 'D#7', 'E7', 'E#7', 'F#7', 'Fx7', 'G#7', 'Gx7', 'A#7', 'B7',
                    'B#7', 'C#8', 'Cx8', 'D#8', 'E8', 'E#8', 'F#8', 'Fx8', 'G#8', 'Gx8', 'A#8', 'B8',
                    'B#8', 'C#9', 'Cx9', 'D#9', 'E9', 'E#9', 'F#9', 'Fx9'];



//-----------------------------

return {
    createBWRow: createBWRow,
    createRow: createRow,
    setArray: setArray,
    evaluateAnswer: evaluateAnswer,
    updateModelScale: updateModelScale,
    updateTransposeArrays: updateTransposeArrays,
    updateTransposeMenu: updateTransposeMenu,
    mDown: mDown
};

})();


//---------------------------/