WebMidi.enable(function (err) {
    var status = document.querySelector('#status');

    if (err) {
        console.log("WebMidi could not be enabled.", err);
    } else {
        console.log("WebMidi enabled!");
    }

    output = WebMidi.getOutputByName("Circuit MIDI 1");
    var input = WebMidi.getInputByName("Circuit MIDI 1");

    if (output) {
        status.innerHTML = LABEL_CONNECTED;
        status.classList.add('text-success');
    } else {
        status.innerHTML = LABEL_NOT_CONNECTED;
        status.classList.add('text-warning');
    }

    output.playNote("C3");
    output.stopNote("C3");

	// In case of requesting patch data
    input.addListener('sysex', "all", function (event) {
		console.log("sysex", event);

		parseCircuitPatch(event.data);
    });


}, sysex=true);

function parseCircuitPatch(circuitData) {
	// Patch name
	var patchNameArr = circuitData.slice(9, 25);
	var patchName= "";

	for (var i=0; i < patchNameArr.length; i++) {
		patchName += String.fromCharCode(patchNameArr[i]);
	}

	document.querySelector('input[name="name"]').value = patchName.trim();

	// Synth values
	var synthValuesArr = circuitData.slice(41, 349);
	console.log("synthValuesArr", synthValuesArr);

	for (var i=0; i < synthValuesArr.length; i++) {
		var order = i + 1;

		var item = document.querySelector('[order="' + order + '"]');

		if (order == 60) {
			// LFO 1 exceptions
			setLFO(synthValuesArr[i], 1);
		}
		if (order == 69) {
			// LFO 2 exceptions
			setLFO(synthValuesArr[i], 2);
		}

		if (item) {
			item.value = synthValuesArr[i];
		}
	}
}

function setLFO(data, lfo) {
	// Fade mode
	var fadeOut = 16;
	var gateIn = 32;
	var gateOut = 48;

	if (data - gateOut >= 0) {
		console.log("fillLFO gateOut", data);
		document.querySelector('#lfo_' + lfo + '_fade_mode').value = LFO_MAP_FROM_CIRCUIT[lfo]["FADE_MODE"][gateOut];
		data -= gateOut;
	} else if (data - gateIn >= 0) {
		console.log("fillLFO gateIn", data);
		document.querySelector('#lfo_' + lfo + '_fade_mode').value = LFO_MAP_FROM_CIRCUIT[lfo]["FADE_MODE"][gateIn];
		data -= gateIn;
	} else if (data - fadeOut >= 0) {
		console.log("fillLFO fadeOut", data);
		document.querySelector('#lfo_' + lfo + '_fade_mode').value = LFO_MAP_FROM_CIRCUIT[lfo]["FADE_MODE"][fadeOut];
		data -= fadeOut;
	} else {
		document.querySelector('#lfo_' + lfo + '_fade_mode').value = LFO_MAP_FROM_CIRCUIT[lfo]["FADE_MODE"][0];
	}

	// Delay trigger
	var delayTrigger = 8;

	if (data - delayTrigger >= 0) {
		console.log("fillLFO delayTrigger", data);
		document.querySelector('#lfo_' + lfo + '_delay_trigger').value = LFO_MAP_FROM_CIRCUIT[lfo]["DELAY_TRIGGER"][delayTrigger];
		data -= delayTrigger;
	} else {
		document.querySelector('#lfo_' + lfo + '_delay_trigger').value = LFO_MAP_FROM_CIRCUIT[lfo]["DELAY_TRIGGER"][0];
	}

	// Common sync
	var commonSync = 4;

	if (data - commonSync >= 0) {
		console.log("fillLFO commonSync", data);
		document.querySelector('#lfo_' + lfo + '_common_sync').value = LFO_MAP_FROM_CIRCUIT[lfo]["COMMON_SYNC"][commonSync];
		data -= commonSync;
	} else {
		document.querySelector('#lfo_' + lfo + '_common_sync').value = LFO_MAP_FROM_CIRCUIT[lfo]["COMMON_SYNC"][0];
	}

	// Key sync
	var keySync = 2;

	if (data - keySync >= 0) {
		console.log("fillLFO keySync", data);
		document.querySelector('#lfo_' + lfo + '_key_sync').value = LFO_MAP_FROM_CIRCUIT[lfo]["KEY_SYNC"][keySync];
		data -= keySync;
	} else {
		document.querySelector('#lfo_' + lfo + '_key_sync').value = LFO_MAP_FROM_CIRCUIT[lfo]["KEY_SYNC"][0];
	}

	// One shot
	var oneShot = 1;

	if (data - oneShot >= 0) {
		console.log("fillLFO oneShot", data);
		document.querySelector('#lfo_' + lfo + '_one_shot').value = LFO_MAP_FROM_CIRCUIT[lfo]["ONE_SHOT"][oneShot];
		data -= oneShot;
	} else {
		document.querySelector('#lfo_' + lfo + '_one_shot').value = LFO_MAP_FROM_CIRCUIT[lfo]["ONE_SHOT"][0];
	}


	// Check result
	if (data < 0) {
		console.error('Bad LFO values');
	}
}

function getLFO(lfo) {
	var data = 0;

	var lfoFadeModeChoice = document.querySelector('#lfo_' + lfo + '_fade_mode').value;
	var lfoDelayTriggerChoice = document.querySelector('#lfo_' + lfo + '_delay_trigger').value;
	var lfoCommonSyncChoice = document.querySelector('#lfo_' + lfo + '_common_sync').value;
	var lfoKeySyncChoice = document.querySelector('#lfo_' + lfo + '_key_sync').value;
	var lfoOneShotChoice = document.querySelector('#lfo_' + lfo + '_one_shot').value;

	console.log(lfoFadeModeChoice, lfoDelayTriggerChoice, lfoCommonSyncChoice, lfoKeySyncChoice, lfoOneShotChoice);

	data += parseInt(LFO_MAP_TO_CIRCUIT[lfo][lfoFadeModeChoice]);
	data += parseInt(LFO_MAP_TO_CIRCUIT[lfo][lfoDelayTriggerChoice]);
	data += parseInt(LFO_MAP_TO_CIRCUIT[lfo][lfoCommonSyncChoice]);
	data += parseInt(LFO_MAP_TO_CIRCUIT[lfo][lfoKeySyncChoice]);
	data += parseInt(LFO_MAP_TO_CIRCUIT[lfo][lfoOneShotChoice]);

	console.log('getLFO', lfo, data);
	return data;
}

var getPatchBtn = document.querySelector('#getPatch');
getPatchBtn.addEventListener('click', function(event) {
	console.log('Get Current Selected Patch');
	output.sendSysex([0, 32, 41], [1, 96, 64, 0, 0]);
});

function sendMessage(control, value) {
    let synth = parseInt(document.querySelector('#synth').value);

    console.log("sendMessage", control, value, synth);

    if (control.indexOf(':') > -1) {
        // NRPN
        control = control.split(':');

        output.setNonRegisteredParameter([parseInt(control[0]), parseInt(control[1])], parseInt(value), synth);
    } else {
        // CC
        output.sendControlChange(parseInt(control), parseInt(value), synth);
    }
}

var allInputs = document.querySelectorAll('fieldset input');
var allSelects = document.querySelectorAll('fieldset select');

for (let input of allInputs) {
    input.addEventListener('input', function(event) {
        let item = event.target;

        sendMessage(item.name, item.value);
    });
}

for (let select of allSelects) {
    select.addEventListener('change', function(event) {
        let item = event.target;

        sendMessage(item.name, item.value);
    });
}

var exportBtn = document.querySelector('#export');

exportBtn.addEventListener('click', function(event) {

    let allItems = [].slice.call(document.querySelectorAll('fieldset input[order], fieldset select[order]'));

	// Sort
    allItems.sort(function(a, b) {
        var orderA = parseInt(a.getAttribute('order'));
        var orderB = parseInt(b.getAttribute('order'));

    	return (orderA < orderB) ? -1 : (orderA > orderB) ? 1 : 0;
	});

	console.log('allItems length', allItems.length);

    // Synth values
    let synthData = extractSynthValuesFromDOM(allItems);

	let data = mergeDataWithSysexMetadata(synthData);

    writeSysexFile(data);

});

function extractSynthValuesFromDOM(items) {
	let synthData = [];

    for (var i = 0; i < items.length; i++) {
		synthData.push(parseInt(items[i].value));
    }

    // Set LFO exceptions values
    synthData.splice(59, 1, getLFO(1));
    synthData.splice(68, 1, getLFO(2));

    return synthData;
}

function mergeDataWithSysexMetadata(data) {
	if (data.length !== 308) {
		throw "Synth data incoherent. Must be 308: " + data.length;
	}

	// 1 BOF
    let metadata = [240]

    // 3 Manufacturer Novation
    metadata = metadata.concat([0, 32, 41]);

    // 2 Type patch ?
    metadata = metadata.concat([1, 96]);

    // 3 Empty
    metadata = metadata.concat([0, 0, 0]);

    // 16 Patch name
    var patchName = document.querySelector('input[name="name"]').value;
    var patchNameCode = [];

    // Encode patch name
    for (var i = 0 ; i < patchName.length; i++) {
        var code = patchName.charCodeAt(i);
        patchNameCode.push(code);
    }

    // Fill empty char with spaces
    for (var i = patchNameCode.length ; i < 16; i++) {
        var code = " ".charCodeAt(0);
        patchNameCode.push(code);
    }
    metadata = metadata.concat(patchNameCode);

    // 2 Patch genre & category
    metadata = metadata.concat([0, 0]);

    // 14 Empty
    metadata = metadata.concat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

    // 308 Synth data
    data = metadata.concat(data);

    // 1 EOF
    data = data.concat([247]);
	return data
}

function writeSysexFile(data) {
    var ab = new ArrayBuffer(data.length); //bytes is the array with the integer
    var ia = new Uint8Array(ab);

    for (var i = 0; i < data.length; i++) {
      ia[i] = data[i];
    }

    var blob = new Blob([ia], {type: "application/octet-stream"});
    saveAs(blob, "export.syx");
}

function resetValues() {
    let allItems = [].slice.call(document.querySelectorAll('fieldset input, fieldset select'));

    for (var i = 0; i < allItems.length; i++) {
        allItems[i].value = allItems[i].getAttribute('default');
    }
}
resetValues();

function injectNonSupportedInput() {
	var unsupportedValuesContainer = document.querySelector('#unsupportedValuesContainer');

	var unsupportedInput = "";

	// ModMatrix
    for (var i = 93; i < 173; i++) {
		var order = i;
		unsupportedInput += "<input order='" + order + "' value='0' disabled hidden/>";
    }

    // Macros
    var steps = [
		{
			"from": 178,
			"to": 190
		},
		{
			"from": 195,
			"to": 207
		},
		{
			"from": 212,
			"to": 224
		},
		{
			"from": 229,
			"to": 241
		},
		{
			"from": 246,
			"to": 258
		},
		{
			"from": 263,
			"to": 275
		},
		{
			"from": 280,
			"to": 292
		},
		{
			"from": 297,
			"to": 309
		},
	]
    for (var i = 0; i < steps.length; i++) {
        var from = steps[i].from;
        var to = steps[i].to;

        for (var j = from; j < to; j++) {
			var order = j;
			unsupportedInput += "<input order='" + order + "' value='0' disabled hidden/>";
		}
    }

    // Inject in DOM
    unsupportedValuesContainer.innerHTML += unsupportedInput;
}
injectNonSupportedInput();
