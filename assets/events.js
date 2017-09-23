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
