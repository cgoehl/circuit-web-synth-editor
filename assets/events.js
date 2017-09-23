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

getPatchBtn.addEventListener('click', function(event) {
    console.log('Get Current Selected Patch');
    output.sendSysex([0, 32, 41], [1, 96, 64, 0, 0]);
});
