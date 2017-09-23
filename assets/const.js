var LABEL_CONNECTED = "Connected";
var LABEL_NOT_CONNECTED = "No Circuit found. Plug it in and reload the page.";

// Webmidi output object to Circuit
var output;

// LFO computed values
var LFO_MAP_FROM_CIRCUIT = {
	1: {
		"FADE_MODE": {
			48: 3,
			32: 2,
			16: 1,
			0: 0,
		},
		"ONE_SHOT": {
			0: 12,
			1: 13
		},
		"KEY_SYNC": {
			0: 14,
			2: 15
		},
		"COMMON_SYNC": {
			0: 16,
			4: 17,
		},
		"DELAY_TRIGGER": {
			0: 18,
			8: 19
		}
	},
	2: {
		"FADE_MODE": {
			48: 7,
			32: 6,
			16: 5,
			0: 4,
		},
		"ONE_SHOT": {
			0: 22,
			1: 23
		},
		"KEY_SYNC": {
			0: 24,
			2: 25
		},
		"COMMON_SYNC": {
			0: 26,
			4: 27,
		},
		"DELAY_TRIGGER": {
			0: 28,
			8: 29
		}
	}
 };

var LFO_MAP_TO_CIRCUIT = {
	1: {
		// Fade mode
		0: 0,
		1: 16,
		2: 32,
		3: 48,

		// One shot
		12: 0,
		13: 1,

		// Key sync
		14: 0,
		15: 2,

		// Common sync
		16: 0,
		17: 4,

		// Delay trigger
		18: 0,
		19: 8,
	},
	2: {
		// Fade mode
		4: 0,
		5: 16,
		6: 32,
		7: 48,

		// One shot
		22: 0,
		23: 1,

		// Key sync
		24: 0,
		25: 2,

		// Common sync
		26: 0,
		27: 4,

		// Delay trigger
		28: 0,
		29: 8,
	}
}
