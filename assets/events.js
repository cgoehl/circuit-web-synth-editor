var allInputs = document.querySelectorAll('fieldset input');
var allSelects = document.querySelectorAll('fieldset select');

synthHistoryInit();

for (let input of allInputs) {
    input.addEventListener('input', function(event) {
        let item = event.target;

        setBadgeValue(item, item.value);

        synthHistoryAdd(item.id, item.value);

        sendMessage(item.name, item.value);
    });

    // Initialize badges
    if (input.type = "range") {
        setBadgeValue(input, input.getAttribute('default'));
    }
}

for (let select of allSelects) {
    select.addEventListener('change', function(event) {
        let item = event.target;

        synthHistoryAdd(item.id, item.value);

        sendMessage(item.name, item.value);
    });
}


var exportBtn = document.querySelector('#export');
var getPatchBtn = document.querySelector('#getPatch');
var resetBtn = document.querySelector('#reset');

exportBtn.addEventListener('click', function(event) {
    writeSysexFile(getData());
});

getPatchBtn.addEventListener('click', function(event) {
    console.log('Get Current Selected Patch');
    getCurrentSelectedPatch();
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

var synthTabs = document.querySelectorAll('.synth-tabs a');

for (let synthTab of synthTabs) {
    synthTab.addEventListener('click', function(event) {
        var tab = event.target;
        var containers = document.querySelectorAll('*[tabId="' + tab.getAttribute('tab') + '"]')

        tab.classList.toggle('active');

        for (let container of containers) {
            if (tab.classList.contains('active')) {
                container.hidden = false;
            } else {
                container.hidden = true;
            }

        }
    });
}

var undoBtn = document.querySelector('#undo');

undoBtn.addEventListener('click', function(event) {
    synthHistoryUndo();
});
