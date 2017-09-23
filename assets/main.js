var output;

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

resetValues();
injectNonSupportedInput();
