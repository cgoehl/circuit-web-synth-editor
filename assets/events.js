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
var getPatchBtn = document.querySelector('#getPatch');
var storePatchBtn = document.querySelector('#storePatch');
var resetBtn = document.querySelector('#reset');

exportBtn.addEventListener('click', function(event) {
    writeSysexFile(getData());
});

getPatchBtn.addEventListener('click', function(event) {
    console.log('Get Current Selected Patch');
    getCurrentSelectedPatch();
});

storePatchBtn.addEventListener('click', function(event) {
    console.log('Store patch to Circuit');
    var slot = document.querySelector('#slot').value;
    slot--;

    storePatch(slot);
});

resetBtn.addEventListener('click', function(event) {
    console.log('Reset all values');

    resetPatch();
});

var synthSelect = document.querySelector("#synth");

synthSelect.addEventListener('change', function(event) {
    var containers;
    var newCssClass;
    var oldCssClass;

    if (event.target.value == "1") {
        oldCssClass = "synth2";
        newCssClass = "synth1";
    } else {
        oldCssClass = "synth1";
        newCssClass = "synth2";
    }
    containers = document.querySelectorAll('.' + oldCssClass);

    for (var i=0; i < containers.length ; i++) {
        var container = containers[i];
        container.classList.remove(oldCssClass);
        container.classList.add(newCssClass);
    }
});
