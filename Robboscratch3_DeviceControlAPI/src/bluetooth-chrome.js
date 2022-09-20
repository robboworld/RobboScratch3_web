//Notes: BT LOCATION, BT TODO

//const bluetooth = require('node-bluetooth');
//create bluetooth device instance
//const device = new chrome.bluetooth.Device("test"); //bluetooth = qport ??


const DEVICE_SERIAL_NUMBER_PROBE_INTERVAL = 100;
const DEVICE_SERIAL_NUMBER_LENGTH = 52;

const NULL_COMMAND_TIMEOUT = 1 * 5 * 1000;
const CHECK_SERIAL_NUMBER_FLUSH_TIMEOUT = 500;

const DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH = 1 * 10 * 1000;
const NO_RESPONSE_TIME_DEFAULT_BLUETOOTH      = 10000;
const NO_START_TIMEOUT_DEFAULT_BLUETOOTH      = 3000;
const UNO_TIMEOUT_DEFAULT_BLUETOOTH           = 3000;

const DEVICE_HANDLE_TIMEOUT_MAX_BLUETOOTH = 100000;
const NO_RESPONSE_TIME_MAX_BLUETOOTH      = 100000;
const NO_START_TIMEOUT_MAX_BLUETOOTH      = 100000;


var DEVICE_HANDLE_TIMEOUT = DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH;
var NO_RESPONSE_TIME = NO_RESPONSE_TIME_DEFAULT_BLUETOOTH; 
var NO_START_TIMEOUT = NO_START_TIMEOUT_DEFAULT_BLUETOOTH;
var UNO_TIMEOUT = UNO_TIMEOUT_DEFAULT_BLUETOOTH;

var uuid = '1101'; //'1101', '0x1101', '1105' 

 var discovery_started = false;

const log = console.log;
var can_log = true;
console.log = function(string) {
    if(can_log) {
        log(string);
    }
}

console.log("Version A - BT-C.js");
console.log("Robboscratch3_DeviceControlAPI-module-version-1.0.5");

var import_settings = function(){

    try {

	const data = node_fs.readFileSync('settings.json')
	console.log(data.toString());

	try {

            let json = JSON.parse(data);

            if (typeof(json) !== 'undefined'){

                NO_RESPONSE_TIME = Math.floor(Number(json.device_response_timeout))||3000;
                NO_START_TIMEOUT = Math.floor(Number(json.device_no_start_timeout))||1000;
                UNO_TIMEOUT      = Math.floor(Number(json.device_uno_start_search_timeout))||3000;

                console.warn(`NO_RESPONSE_TIME: ${NO_RESPONSE_TIME}  NO_START_TIMEOUT: ${NO_START_TIMEOUT} UNO_TIMEOUT: ${UNO_TIMEOUT}`);
            }



	} catch (e) {

            console.error(e)
	}



    } catch (err) {

	console.error(err)

    }

}

//import_settings();

const DEVICE_STATES = Object.freeze({
    "INITED": 0,
    "CLOSING": 1,
    "CONNECTED":2,
    "DEVICE_CHECKING": 3,
    "DEVICE_IS_RUBBISH": 4,
    "DEVICE_PURGING": 5,
    "DEVICE_IS_READY": 6,
    "DEVICE_ERROR":7,
    "TIMEOUT":8
});

const commands_list_otto= {
    "check":{
	"code": "a",
	"params": [],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },
    "be":{
	"code": "b",
	"params": ["ubyte","ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },
    "ce":{
	"code": "c",
	"params": ["ubyte","ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },

    "de":{//note
	"code": "d",
	"params": ["ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },
    "ee":{//note
	"code": "e",
	"params": ["ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },
    "ge":{//note
	"code": "g",
	"params": ["ubyte","ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },

    "he":{//note
	"code": "h",
	"params": ["ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },
    "se":{
	"code": "s",
	"params": ["ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },
    "ye":{
	"code": "y",
	"params": ["ubyte","ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    },
    "ze":{
	"code": "z",
	"params": ["ubyte","ubyte","ubyte","ubyte","ubyte"],
	"response": {
            "distance" : "ubyte",
            "hearing": "ubyte"
        }
    }
}

const commands_list_robot = {
    "check":{
	"code": "a",
	"params": [],
	"response": {
            "encoder0" : "uint2",
            "encoder1" : "uint2",
            "path0"    : "uint2",
            "path1"    : "uint2",
            "a0"       : "ubyte[4]",
            "a1"       : "ubyte[4]",
            "a2"       : "ubyte[4]",
            "a3"       : "ubyte[4]",
            "a4"       : "ubyte[4]",
            "button"   : "ubyte"
        }
    },
    "power":{
	"code": "c",
	"params": ["ubyte", "ubyte"],
	"response": {
            "encoder0" : "uint2",
            "encoder1" : "uint2",
            "path0"    : "uint2",
            "path1"    : "uint2",
            "a0"       : "ubyte[4]",
            "a1"       : "ubyte[4]",
            "a2"       : "ubyte[4]",
            "a3"       : "ubyte[4]",
            "a4"       : "ubyte[4]",
            "button"   : "ubyte"
        }
    },
    "rob_encoder":{
	"code": "e",
	"params": ["ubyte"],
	"response": {
            "encoder0" : "uint2",
            "encoder1" : "uint2",
            "path0"    : "uint2",
            "path1"    : "uint2",
            "a0"       : "ubyte[4]",
            "a1"       : "ubyte[4]",
            "a2"       : "ubyte[4]",
            "a3"       : "ubyte[4]",
            "a4"       : "ubyte[4]",
            "button"   : "ubyte"
        }
    },
    "rob_lamps":{
	"code": "h",
	"params": ["ubyte"],
	"response": {
            "encoder0" : "uint2",
            "encoder1" : "uint2",
            "path0"    : "uint2",
            "path1"    : "uint2",
            "a0"       : "ubyte[4]",
            "a1"       : "ubyte[4]",
            "a2"       : "ubyte[4]",
            "a3"       : "ubyte[4]",
            "a4"       : "ubyte[4]",
            "button"   : "ubyte"
        }
    },
    "rob_pow_encoder":{
	"code": "g",
	"params": ["ubyte", "ubyte","ubyte","ubyte"],
	"response": {
            "encoder0" : "uint2",
            "encoder1" : "uint2",
            "path0"    : "uint2",
            "path1"    : "uint2",
            "a0"       : "ubyte[4]",
            "a1"       : "ubyte[4]",
            "a2"       : "ubyte[4]",
            "a3"       : "ubyte[4]",
            "a4"       : "ubyte[4]",
            "button"   : "ubyte"
        }
    },
    "rob_claw":{
	"code": "j",
	"params": ["ubyte"],
	"response": {
            "encoder0" : "uint2",
            "encoder1" : "uint2",
            "path0"    : "uint2",
            "path1"    : "uint2",
            "a0"       : "ubyte[4]",
            "a1"       : "ubyte[4]",
            "a2"       : "ubyte[4]",
            "a3"       : "ubyte[4]",
            "a4"       : "ubyte[4]",
            "button"   : "ubyte"
        }
    },
    "sensors":{
	"code": "i",
	"params": ["ubyte", "ubyte", "ubyte", "ubyte", "ubyte"],
	"response": {
            "encoder0" : "uint2",
            "encoder1" : "uint2",
            "path0"    : "uint2",
            "path1"    : "uint2",
            "a0"       : "ubyte[4]",
            "a1"       : "ubyte[4]",
            "a2"       : "ubyte[4]",
            "a3"       : "ubyte[4]",
            "a4"       : "ubyte[4]",
            "button"   : "ubyte"
        }
    }
};

const commands_list_laboratory = {
    "check":{
	"code": "a",
	"params": [],
	"response": {
            "d8_13" : "ubyte",
            "a0"       : "ubyte",
            "a1"       : "ubyte",
            "a2"       : "ubyte",
            "a3"       : "ubyte",
            "a4"       : "ubyte",
            "a5"       : "ubyte",
            "a6"       : "ubyte",
            "a7"       : "ubyte",
            "a8"       : "ubyte",
            "a9"       : "ubyte",
            "a10"       : "ubyte",
            "a11"       : "ubyte",
            "a12"       : "ubyte",
            "a13"       : "ubyte",
            "a14"       : "ubyte",
            "a15"       : "ubyte"

        }
    },
    "lab_lamps":{
	"code": "b",
	"params": ["ubyte"],
	"response": {
            "d8_13" : "ubyte",
            "a0"       : "ubyte",
            "a1"       : "ubyte",
            "a2"       : "ubyte",
            "a3"       : "ubyte",
            "a4"       : "ubyte",
            "a5"       : "ubyte",
            "a6"       : "ubyte",
            "a7"       : "ubyte",
            "a8"       : "ubyte",
            "a9"       : "ubyte",
            "a10"       : "ubyte",
            "a11"       : "ubyte",
            "a12"       : "ubyte",
            "a13"       : "ubyte",
            "a14"       : "ubyte",
            "a15"       : "ubyte"

        }
    },

    "lab_color_lamps":{
	"code": "c",
	"params": ["ubyte"],
	"response": {
            "d8_13" : "ubyte",
            "a0"       : "ubyte",
            "a1"       : "ubyte",
            "a2"       : "ubyte",
            "a3"       : "ubyte",
            "a4"       : "ubyte",
            "a5"       : "ubyte",
            "a6"       : "ubyte",
            "a7"       : "ubyte",
            "a8"       : "ubyte",
            "a9"       : "ubyte",
            "a10"       : "ubyte",
            "a11"       : "ubyte",
            "a12"       : "ubyte",
            "a13"       : "ubyte",
            "a14"       : "ubyte",
            "a15"       : "ubyte"

        }
    },

    "lab_dig_on":{
	"code": "e",
	"params": ["ubyte"],
	"response": {
            "d8_13" : "ubyte",
            "a0"       : "ubyte",
            "a1"       : "ubyte",
            "a2"       : "ubyte",
            "a3"       : "ubyte",
            "a4"       : "ubyte",
            "a5"       : "ubyte",
            "a6"       : "ubyte",
            "a7"       : "ubyte",
            "a8"       : "ubyte",
            "a9"       : "ubyte",
            "a10"       : "ubyte",
            "a11"       : "ubyte",
            "a12"       : "ubyte",
            "a13"       : "ubyte",
            "a14"       : "ubyte",
            "a15"       : "ubyte"

        }
    },


    "lab_dig_off":{
	"code": "f",
	"params": ["ubyte"],
	"response": {
            "d8_13" : "ubyte",
            "a0"       : "ubyte",
            "a1"       : "ubyte",
            "a2"       : "ubyte",
            "a3"       : "ubyte",
            "a4"       : "ubyte",
            "a5"       : "ubyte",
            "a6"       : "ubyte",
            "a7"       : "ubyte",
            "a8"       : "ubyte",
            "a9"       : "ubyte",
            "a10"       : "ubyte",
            "a11"       : "ubyte",
            "a12"       : "ubyte",
            "a13"       : "ubyte",
            "a14"       : "ubyte",
            "a15"       : "ubyte"

        }
    },

    "lab_dig_pwm":{
	"code": "g",
	"params": ["ubyte","ubyte"],
	"response": {
            "d8_13" : "ubyte",
            "a0"       : "ubyte",
            "a1"       : "ubyte",
            "a2"       : "ubyte",
            "a3"       : "ubyte",
            "a4"       : "ubyte",
            "a5"       : "ubyte",
            "a6"       : "ubyte",
            "a7"       : "ubyte",
            "a8"       : "ubyte",
            "a9"       : "ubyte",
            "a10"       : "ubyte",
            "a11"       : "ubyte",
            "a12"       : "ubyte",
            "a13"       : "ubyte",
            "a14"       : "ubyte",
            "a15"       : "ubyte"
        }
    },

    "lab_sound":{
	"code": "d",
	"params": ["ubyte"],
	"response": {
            "d8_13" : "ubyte",
            "a0"       : "ubyte",
            "a1"       : "ubyte",
            "a2"       : "ubyte",
            "a3"       : "ubyte",
            "a4"       : "ubyte",
            "a5"       : "ubyte",
            "a6"       : "ubyte",
            "a7"       : "ubyte",
            "a8"       : "ubyte",
            "a9"       : "ubyte",
            "a10"       : "ubyte",
            "a11"       : "ubyte",
            "a12"       : "ubyte",
            "a13"       : "ubyte",
            "a14"       : "ubyte",
            "a15"       : "ubyte"

        }
    }

};

const commands_list_arduino= {//modified_by_kpk
    "check":{
	"code":"a",
	"params":[],
	"response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"

        }
    },

    "be":{
	"code":"b",
	"params":["ubyte"],
	"response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"

        }
    },
    "ce":{
        "code":"c",
        "params":["ubyte","ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "de":{
        "code":"d",
        "params":["ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "he":{
        "code":"h",
        "params":[],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "se":{
        "code":"s",
        "params":["ubyte","ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "ue":{
        "code":"u",
        "params":["ubyte","ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "ie":{
        "code":"i",
        "params":["ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "te":{
        "code":"t",
        "params":["ubyte","ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "ge":{
        "code":"g",
        "params":["ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "ye":{
        "code":"y",
        "params":[],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    },
    "ze":{
        "code":"z",
        "params":["ubyte"],
        "response":{
            "a0":"ubyte",
            "a1":"ubyte",
            "a2":"ubyte",
            "a3":"ubyte",
            "a4":"ubyte",
            "a5":"ubyte",
            "a6":"ubyte",
            "a7":"ubyte",
            "a8":"ubyte",
            "a9":"ubyte",
            "a10":"ubyte",
            "a11":"ubyte",
            "a12":"ubyte",
            "a13":"ubyte",
            "a14":"ubyte",
            "a14_1":"ubyte",
            "a15":"ubyte",
            "a15_1":"ubyte",
            "a16":"ubyte",
            "a16_1":"ubyte",
            "a17":"ubyte",
            "a17_1":"ubyte",
            "a18":"ubyte",
            "a18_1":"ubyte",
            "a19":"ubyte",
            "a19_1":"ubyte",
            "a20":"ubyte",
            "a20_1":"ubyte",
            "a21":"ubyte",
            "a21_1":"ubyte"
        }
    }
}

const last_firmwares =[10,5,2,3,1,2,0,7];

const DEVICES = Object.freeze({
    //Basic Robot
    0:{
	"firmware":10,
	"commands":commands_list_robot
    },
    //Old Robot
    3:{
	"firmware":3,
	"commands":commands_list_robot
    },

    //New lab
    1:{

	"firmware":5,
	"commands": commands_list_laboratory
    },

    //New lab
    2:{

	"firmware":2,
	"commands": commands_list_laboratory

    },
    //Old lab
    4:{

	"firmware":1,
	"commands": commands_list_laboratory

    },
    //Otto
    5:{
	"firmware":2,
	"commands": commands_list_otto
    },
    //arduino
    6:
    {
	"firmware":0,
	"commands":commands_list_arduino
    }
});

var arrDevices = [];

const performance = typeof window === 'object' && window.performance;

function InterfaceDevice(device) {
    { //PEREMENNIE
	console.log("new BluetoothInterfaceDevice");
	//this.port = port;
	var options={
	    baudRate: 115200, 
	    dataBits: 8,
	    parity: 'none',
	    stopBits: 1,
	    flowControl: false,
	    autoOpen: false};
	console.log("options added");
	var NO_RESPONSE;
	var NO_START;
	var UNOTIME;
	//var LOG = "[" + port.comName + " random_object_identifier: " +  (Math.floor( Math.random() * 100) ) +  "] ";
	var LOG = `[bluetooth_${device.name} random_object_identifier: ` +  (Math.floor( Math.random() * 100) ) +  "] ";
	console.log(LOG + "Trying to register a new bluetooth device...");
	var state = DEVICE_STATES["INITED"];
	var previous_state = state;
	var bufIncomingData = new Uint8Array();
	var iDeviceID;
	var iFirmwareVersion;
	var sSerialNumber;
	var iSerialNumberOffset;
	var iWaiting = 0;
	var response = {};
	var commandToRun = null;
	var callback = null;
	var automaticStopCheckingSerialNumberTimeout
	var isStopCheckingSerialNumber = false;
	var commands_stack = [];
	var time1 = Date.now();
	var time_delta = 0;
	var time2 = Date.now();
	var recieve_time1 =  Date.now();
	var recieve_time_delta = 0;
	var recieve_time2 =  Date.now();
	var command_try_send_time1 = Date.now();
	var command_try_send_time2 = null;
	var check_serial_number_time1 = Date.now();
	var check_serial_number_time2 = Date.now();
	var can_check_serial_after_flush = true;
	var wait_for_sync = false;
	var recieveListener;
	var bitrate = 115200;
	var old_command = '';
	var old_params = [];
	var socketId = null;
    var isBluetoothDevice = true;
    var firmwareVersionDiffers = false;

	var DEVICE_STATE_CHECK_INTERVAL;

	//callbacks
    var onErrorCb = () => {};
    var onFirmwareVersionDiffersCb =   () => {};
    var onDeviceStatusChangeCb = () => {};
    }

    var onReceiveCallback = function(receiveInfo){//TODO TODO  TODO TODOOOOOOO TODODODO
	if (receiveInfo.data && (receiveInfo.socketId == socketId))
	{	    
            clearTimeout(NO_RESPONSE);
            var buf = new Uint8Array(receiveInfo.data);
	   // console.log(LOG + "CALLBACK!!! bytes recieved length <- " + buf.length);
         //   console.log(LOG + "CALLBACK!!! bytes buf <- " + buf);
            var bufIncomingDataNew = null;
            bufIncomingDataNew = new Uint8Array(bufIncomingData.length + buf.length);
            bufIncomingDataNew.set(bufIncomingData);
            bufIncomingDataNew.set(buf, bufIncomingData.length);
            bufIncomingData = bufIncomingDataNew;
            //   console.log(LOG + "bufIncomingData: " + bufIncomingData);

	    if (state == DEVICE_STATES["DEVICE_IS_READY"]){

		NO_RESPONSE = setTimeout(()=>{
		    console.error(LOG+"Ouuu...NO RESPONSE!");

            state = DEVICE_STATES["TIMEOUT"];
            
            if (typeof(onDeviceStatusChangeCb) == 'function'){

                let error  = {};

                error.code = 1;
                error.msg = "";

                let result = {

                    state:state,
                    deviceId: iDeviceID,
                    error: error
                }

               onDeviceStatusChangeCb(result);

             }

            // onConnect();

		},NO_RESPONSE_TIME);

	    } //if  DEVICE_STATES["DEVICE_IS_READY"]

            if(commandToRun == null){ return};
            clearTimeout(NO_START);
            clearTimeout(UNOTIME);                                                //#
            if ( (bufIncomingData.length >= iWaiting) /*&& ( bufIncomingData.indexOf(35) != -1 )*/ ) {
	//	console.log(LOG + "command '" + commandToRun.code + "' complete.");
		var iResponsePointer = /*(bufIncomingData.indexOf(35) + 1);*/ 1;
		Object.keys(commandToRun.response).forEach(function (sField){
		    switch(commandToRun.response[sField]){
                    case "uint2":{
			response[sField] = bufIncomingData[iResponsePointer] * 256 + bufIncomingData[iResponsePointer + 1];
			iResponsePointer += 2;
			break;
                    }
                    case "ubyte[4]":{
			response[sField] = [];
			response[sField].push(bufIncomingData[iResponsePointer]);
			response[sField].push(bufIncomingData[iResponsePointer + 1]);
			response[sField].push(bufIncomingData[iResponsePointer + 2]);
			response[sField].push(bufIncomingData[iResponsePointer + 3]);
			iResponsePointer += 4; //modified +=2
			break;
                    }
                    case "ubyte":{
			response[sField] = bufIncomingData[iResponsePointer];
			iResponsePointer += 1;
			break;
                    }
		    }
		});

		commandToRun = null;
		iWaiting = 0;
		callback(response);
		recieve_time1 = performance.now();
		recieve_time_delta = recieve_time1 - recieve_time2;
		//console.warn("time delta recieve: " + recieve_time_delta);

		recieve_time2 = performance.now();
            }
	}
	else {
         //   console.log(LOG + "CALLBACK!!! without data");
	}
    }

    var purgePort = function() {
	console.log(LOG + "purge()");
	state = DEVICE_STATES["PURGE"];
	if(bufIncomingData.length > 0){
	    //chrome.serial.flush(iConnectionId, onFlush);
            console.log("FLUSH && PURGE");
            bufIncomingData = new Uint8Array();
            setTimeout(purgePort, 10);
	}
	else{
            if ( (typeof(iDeviceID) != 'undefined') && (typeof(iFirmwareVersion) != 'undefined') && (typeof(sSerialNumber) != 'undefined') ) {
                if ( (!isNaN(iDeviceID)) && (!isNaN(iFirmwareVersion)) && ( ( (sSerialNumber).startsWith("R") ) || ((sSerialNumber).startsWith("L")) ||((sSerialNumber).startsWith("O")) ||((sSerialNumber).startsWith("A"))  ) ) {
                    console.info(LOG + "device is ready.");
                    state = DEVICE_STATES["DEVICE_IS_READY"];

                    if (typeof(onDeviceStatusChangeCb) == 'function'){

                        let result = {

                            state:state,
                            deviceId: iDeviceID
                        }

                      onDeviceStatusChangeCb(result);

                }

                     if(last_firmwares[iDeviceID]!=iFirmwareVersion){//We don't need NO_START in this case. Conflicts with flashing. 

                          return;

                     }

                   NO_START = setTimeout(()=>{

			    // chrome.bluetoothSocket.disconnect(
			    // socketId, () =>{console.error(LOG+"FUCK, NO_START!");
                //         //searchBluetoothDevices()
                //        });	

                console.error(LOG+"FUCK, NO_START!");
                onConnect();

		    },NO_START_TIMEOUT);
		    
                    return;
                }
                else
                { console.log("jui gavno"); }
            }
            else
            {console.log("UNDERFINED CHETO");}
            console.log("kyky epta");
            setTimeout(checkSerialNumber, 100);
	}
    }

    var getIsDeviceBluetooth = function() {
	return isDeviceBluetooth;
    }

    var getSerial = function() {
	console.log(LOG + "-> getSerial()");
	var bum=" ";
	//BT LOCATION
	chrome.bluetoothSocket.send(socketId, new Buffer(' ', 'utf-8'), function(bytes_sent) {
	    if (chrome.runtime.lastError) {
		console.log("Send failed: " + chrome.runtime.lastError.message);
	    } else {
		console.log("Sent " + bytes_sent + " bytes");
	    }
	});

	// ***Replace***
//	console.log(bum);
	//
	// var  dv  = new DataView(packet);
	// dv.setUint8(0,0x63,true);
	// dv.setUint8(1,0x20,true);
	// dv.setUint8(2,0x20,true);
	// dv.setUint8(3,0x24,true);
    }

    function isN(n) {
	return (!isNaN(parseFloat(n)) && isFinite(n));
	// ���֧��� isNaN �����ѧ֧��� ���֧�ҧ�ѧ٧�ӧѧ�� ��֧�֧էѧߧߧ��� ��ѧ�ѧާ֧�� �� ��ڧ�ݧ�.
	// ����ݧ� ��ѧ�ѧާ֧�� �ߧ� �ާ�ا֧� �ҧ���� ���֧�ҧ�ѧ٧�ӧѧ�, �ӧ�٧ӧ�ѧ�ѧ֧� true, �ڧߧѧ�� �ӧ�٧ӧ�ѧ�ѧ֧� false.
	// isNaN("12") // false
    }

    var check_correct_serial = function(bufIncomingData){
	console.log("MAGII NET!");
	if(bufIncomingData[iSerialNumberOffset+5]  == '-' &&
	   bufIncomingData[iSerialNumberOffset+11] == '-'  &&
	   bufIncomingData[iSerialNumberOffset+17] == '-'  &&
	   bufIncomingData[iSerialNumberOffset+19] == '-'  &&
	   bufIncomingData[iSerialNumberOffset+25] == '-'  &&
	   bufIncomingData[iSerialNumberOffset+31] == '-'  &&
	   isN(bufIncomingData[iSerialNumberOffset+51]) == 1 &&
	   isN(bufIncomingData[iSerialNumberOffset+20]) == 1 &&
	   isN(bufIncomingData[iSerialNumberOffset+26]) == 1 &&
	   isN(bufIncomingData[iSerialNumberOffset+32]) == 1 &&
	   isN(bufIncomingData[iSerialNumberOffset+37]) == 1 &&
	   isN(bufIncomingData[iSerialNumberOffset+42]) == 1 &&
	   isN(bufIncomingData[iSerialNumberOffset+47]) == 1 )
	{
            console.log("data is" + bufIncomingData[iSerialNumberOffset+5] +
			bufIncomingData[iSerialNumberOffset+11] +
			bufIncomingData[iSerialNumberOffset+17] +
			bufIncomingData[iSerialNumberOffset+19] +
			bufIncomingData[iSerialNumberOffset+25] +
			bufIncomingData[iSerialNumberOffset+31] + " " +
			isN(bufIncomingData[iSerialNumberOffset+51]) + " " +
			isN(bufIncomingData[iSerialNumberOffset+20]) + " " +
			isN(bufIncomingData[iSerialNumberOffset+26]) + " " +
			isN(bufIncomingData[iSerialNumberOffset+32]) + " " +
			isN(bufIncomingData[iSerialNumberOffset+37]) + " " +
			isN(bufIncomingData[iSerialNumberOffset+42]) + " " +
			isN(bufIncomingData[iSerialNumberOffset+47] ));
            console.log(
		"data is:"+ bufIncomingData[iSerialNumberOffset+51] + " " +
                    bufIncomingData[iSerialNumberOffset+20] + " " +
                    bufIncomingData[iSerialNumberOffset+26] + " " +
                    bufIncomingData[iSerialNumberOffset+32] + " " +
                    bufIncomingData[iSerialNumberOffset+37] + " " +
                    bufIncomingData[iSerialNumberOffset+42] + " " +
		    bufIncomingData[iSerialNumberOffset+47] )
            console.log("PROVERENO_MAXOM!");
            return 1;
	}
	console.log("data is" + bufIncomingData[iSerialNumberOffset+5] +
		    bufIncomingData[iSerialNumberOffset+11] +
		    bufIncomingData[iSerialNumberOffset+17] +
		    bufIncomingData[iSerialNumberOffset+19] +
		    bufIncomingData[iSerialNumberOffset+25] +
		    bufIncomingData[iSerialNumberOffset+31] + " " +
		    isN(bufIncomingData[iSerialNumberOffset+51]) + " " +
		    isN(bufIncomingData[iSerialNumberOffset+20]) + " " +
		    isN(bufIncomingData[iSerialNumberOffset+26]) + " " +
		    isN(bufIncomingData[iSerialNumberOffset+32]) + " " +
		    isN(bufIncomingData[iSerialNumberOffset+37]) + " " +
		    isN(bufIncomingData[iSerialNumberOffset+42]) + " " +
		    isN(bufIncomingData[iSerialNumberOffset+47]) );
	console.log("MAXY_NE_PONRAVILOS'!");
        return 0;
    }

    var checkSerialNumber = function() {
	var sIncomingData = new TextDecoder("utf-8").decode(bufIncomingData);
	console.log(LOG + "Now we have: " + sIncomingData);
	iSerialNumberOffset = sIncomingData.indexOf("ROBBO");
	console.log(bufIncomingData.length + " doljna bit > chem " + (DEVICE_SERIAL_NUMBER_PROBE_INTERVAL+iSerialNumberOffset));
	if (bufIncomingData.length > (DEVICE_SERIAL_NUMBER_PROBE_INTERVAL+iSerialNumberOffset)){
            if ((iSerialNumberOffset < 0)||(!(check_correct_serial(sIncomingData)))){
		console.log(LOG + "Rubbish instead of serial number");
		state = DEVICE_STATES["DEVICE_IS_RUBBISH"];
		bufIncomingData = new Uint8Array();
		setTimeout(checkSerialNumber, 100);
            }
            else {
		iDeviceID        = parseInt(sIncomingData.substring(iSerialNumberOffset + 6, iSerialNumberOffset + 11));
		iFirmwareVersion = parseInt(sIncomingData.substring(iSerialNumberOffset + 12, iSerialNumberOffset + 17));
		sSerialNumber    = sIncomingData.substring(iSerialNumberOffset + 18, iSerialNumberOffset + DEVICE_SERIAL_NUMBER_LENGTH);
		console.warn(LOG + "Device=" + iDeviceID + " Firmware=" + iFirmwareVersion + " Serial='" + sSerialNumber + "'");

		if(last_firmwares[iDeviceID]!=iFirmwareVersion){
		    console.error("BAD FLASH MF!!!");
		    console.warn(last_firmwares[iDeviceID]+ "ot "+ iDeviceID + " = " + iFirmwareVersion + " lol");

            firmwareVersionDiffers = true;

		    if (onFirmwareVersionDiffersCb){
			var result = {};
			result.need_firmware = last_firmwares[iDeviceID];
			result.current_device_firmware = iFirmwareVersion;

			onFirmwareVersionDiffersCb(result);
		    }
		}
		purgePort();
            }
	}
	else{
            if(/*(can_check_serial_after_flush) &&*/  (state == DEVICE_STATES["DEVICE_CHECKING"])  &&   (!isStopCheckingSerialNumber)) {
		getSerial();
		let checkSerialNumberTimeout =   setTimeout(checkSerialNumber, 50); //100
            }
            else{
                console.log(LOG + "Out of checkSerialNumber timeout. " + "State: " + state);
            }
	}
    }

    var onConnect = function() { //err, connection
        if (chrome.runtime.lastError) {
            state = DEVICE_STATES["DEVICE_ERROR"];

            if (typeof(onDeviceStatusChangeCb) == 'function'){

                let error  = {};

                error.code = 2;
                error.msg =  chrome.runtime.lastError.message;

                let result = {

                    state:state,
                    deviceId: iDeviceID,
                    error: error
                }

               onDeviceStatusChangeCb(result);

             }
            
            return  console.error(LOG + " Connection failed: " + chrome.runtime.lastError.message);
        }
	else {
            console.log(LOG + "connected.");
            state = DEVICE_STATES["CONNECTED"];

            if (typeof(onDeviceStatusChangeCb) == 'function'){

                let result = {

                    state:state,
                    deviceId: iDeviceID
                }

               onDeviceStatusChangeCb(result);

           }

            bufIncomingData = new Uint8Array();
            iWaiting = 0;
            commandToRun = null;
            can_check_serial_after_flush = false;
	    ////////////////////////////////////////////////////////////////////////////////////////////////
	    //BT LOCATION
	    //TODO: Check
	    //connection.on("data", onReceiveCallback);
	    chrome.bluetoothSocket.onReceive.addListener(onReceiveCallback);
	    ////////////////////////////////////////////////////////////////////////////////////////////////
        state = DEVICE_STATES["DEVICE_CHECKING"];
        
        if (typeof(onDeviceStatusChangeCb) == 'function'){

            let result = {

                state:state,
                deviceId: iDeviceID
            }

           onDeviceStatusChangeCb(result);

    }

	    setTimeout(checkSerialNumber, 300);
	    
	    ////////////////////////////////////////////////////////////////////////////////////////////////
            clearTimeout(automaticStopCheckingSerialNumberTimeout);
            automaticStopCheckingSerialNumberTimeout =  setTimeout(() => {
		console.warn("Stop checking serial number.");
        isStopCheckingSerialNumber = true;

        if ((state != DEVICE_STATES["DEVICE_IS_READY"] ) && (state != DEVICE_STATES["DEVICE_ERROR"]) ){

          state = DEVICE_STATES["TIMEOUT"];

          if (typeof(onDeviceStatusChangeCb) == 'function'){

            let error = {};
            error.code = -1;
            error.msg = "";

              let result = {

                  state:state,
                  deviceId: iDeviceID,
                  error:error
              }

             onDeviceStatusChangeCb(result);

           }


        }
            }  ,DEVICE_HANDLE_TIMEOUT);
	}
    }
    
    this.stopCheckingSerialNumber = function(cb) {
	clearTimeout(NO_RESPONSE);
	clearInterval(DEVICE_STATE_CHECK_INTERVAL);
	state= DEVICE_STATES["CLOSING"];
	
	// if (!isStopCheckingSerialNumber) {
	//   isStopCheckingSerialNumber = true;

	chrome.bluetoothSocket.disconnect(
	    //TODO: handle the error
	    socketId, (error) => {
		if (error != null) {
		    console.error("disconnect error: " + error);
        }
        console.warn(LOG+" Device stopped");
		clearTimeout(automaticStopCheckingSerialNumberTimeout);
		if (cb) {
		    cb();
		}
	    });
	
	/*qport.close((error) => {
	    // TODO: handle the error
            if(error!=null)
		console.error("disconnect error: "+error);
            clearTimeout(automaticStopCheckingSerialNumberTimeout);
            if (cb){
		cb();
            }
        });*/

        //   if ( /*(state != DEVICE_STATES["DEVICE_ERROR"]) &&*/ (  iConnectionId != null) ) {

        /*
          chrome.serial.disconnect(iConnectionId, (result)=>{

          console.log("Connection closed: " + result);

          iConnectionId = null;

          if (cb){

          cb();

          }

          });*/

        //  }



        //   }
	//else console.warn("WAITING isStopCheckingSerialNumber");

    }

    console.log('Trying to find RFCOMM channel');

    //BT LOCATION
    chrome.bluetoothSocket.create( (createInfo) => {
	console.warn("warning chrome bluetooth socket");
	console.warn(chrome.bluetoothSocket);
	chrome.bluetoothSocket.onReceive.addListener(onReceiveCallback);

	chrome.bluetoothSocket.onReceiveError.addListener(function(errorInfo) {
	    // Cause is in errorInfo.error.
	    console.error(LOG + errorInfo.errorMessage);
	});
	
	socketId = createInfo.socketId;
	
	chrome.bluetoothSocket.connect(createInfo.socketId,
				       device.address, uuid,
				       onConnect.bind(this));
    });
    
    this.registerFirmwareVersionDiffersCallback = function(cb){
	if (typeof(cb) == 'function'){
            onFirmwareVersionDiffersCb = cb;
	}
    }

    this.registerErrorCallback = function(cb){
	if (typeof(cb) == 'function'){
            onErrorCb = cb;
	}
    }

    this.registerDeviceStatusChangeCallback = function(cb){

        if (typeof(cb) == 'function'){
     
             onDeviceStatusChangeCb = cb;
     
        }
     
     
      }

      this.getRecieveTimeDelta = function(){

        return recieve_time_delta;
      }
    
    this.getState = function(){
	return state;
    }

    this.getDeviceID = function(){
	return iDeviceID;
    }

    this.getPortName = function(){
	console.warn("Bluetooth port");
	console.warn(`bluetooth_${device.name}`);
	return `bluetooth_${device.name}`;
    }

    this.getSerialNumber = function(){

        return sSerialNumber;

    }

    this.getShorterSerialNumber = function() {

	function countAllSubstrings(string,substring){

	    var pos = -1;
	    var entries_count = 0;
	    while ((pos = string.indexOf(substring, pos + 1)) != -1) {

		entries_count++;

	    }

	    return entries_count;

	}


	var buf = "";
	var buf2 = "";
	var shorterSerialNumber = "";
	var index = 0;
	var defis_devider_count = 0;

	shorterSerialNumber = sSerialNumber.substring(0,1);
	buf = sSerialNumber.replace(shorterSerialNumber+"-","");
	defis_devider_count = countAllSubstrings(buf,"-");

	for (var i=0; i<=defis_devider_count; i++){
	    while (buf.indexOf("-") == 0){
		buf = buf.replace("-","");
	    }

	    index = (i==defis_devider_count)?buf.length:buf.indexOf("-");
	    buf2 =  buf.substring(0,index);
	    buf =  buf.replace(buf2,"");
	    while ((buf2.indexOf("0") == 0) && (buf2.length != 1)){
		buf2 = buf2.replace("0","");
	    }



	    shorterSerialNumber = shorterSerialNumber + "-" +  buf2;

	}


	return shorterSerialNumber;


    }
    
    this.getFirmwareVersion = function(){


	return iFirmwareVersion;
    }

    this.isDeviceReady = function (){

	return (state ==  DEVICE_STATES["DEVICE_IS_READY"]);

    }

    this.isBluetoothDevice = function(){

        return isBluetoothDevice;
     }

    this.isFirmwareVersionDiffers = function(){

        return firmwareVersionDiffers;
     } 

    this.isReadyToAcceptCommand = function (){

	return (commandToRun == null);

    }
    
    this.command = function(command, params, fCallback) {

	 var fCallback = fCallback;

    var command_local = command;
    var params_local  = params;

    var should_kill_command = false;

    command_try_send_time2 = Date.now();


    if ((command != DEVICES[iDeviceID].commands.check) ){//Не буфферизуем команду a, так как она сыпется в канал в интервале 

          

         

           commands_stack.push({command:command,params:params,fCallback:fCallback,self:this});

         
           


        

        }//конец command != DEVICES[iDeviceID].commands.check

      
    

     
      if(commandToRun != null){// Завершаемся, если канал ещё занят

         return;

      }


        //commandToRun == null
       //can send new command

      if (commands_stack.length > 0){//берём из очереди команд, если она не пуста





          let command_object          =  commands_stack.shift();

          commandToRun                = command_object.command;
          command_local               = command_object.command; 
          params_local                = command_object.params; 
          fCallback                   = command_object.fCallback;

           if (commands_stack.length > 500){

                commands_stack = [];

          }

         


      }else{

          commandToRun  = command;
          command_local = command;
          params_local  = params;

       }

      // commandToRun  = command;
      // command_local = command;
      // params_local  = params;

	

	 
	command_try_send_time1 = Date.now();

	bufIncomingData = new Uint8Array();
	

	var buf=new ArrayBuffer(command_local.code.length + params_local.length + 1);
	var bufView=new Uint8Array(buf);
	var bufCommand = new TextEncoder("utf-8").encode(command_local.code);
	bufView.set(bufCommand);
	var iParamOffset = 0;
	params_local.forEach(function(param){
            bufView[bufCommand.length + iParamOffset] = param;
            iParamOffset++;
	});

	bufView[bufCommand.length + iParamOffset] = 36;
	


	//BT LOCATION
	chrome.bluetoothSocket.send(socketId, buf, function(bytes_sent) {
	    if (chrome.runtime.lastError) {
	//	console.log("Send failed: " + chrome.runtime.lastError.message);
	    } else {
	//	console.log("Sent " + bytes_sent + " bytes");
	    }
	});
	
	//      console.log("OTRAVLENO!");

	//  chrome.serial.send(iConnectionId, buf, onSend);
	//const _serialport = require('serialport');
	old_command = command_local.code;

	// time2 = Date.now();
	
	//if (command_local.code == "c"){

          //  console.warn(`sending command: ${command_local.code} ${params_local[0]} ${params_local[1]}`);
	    //         console.warn(`time delta: ${time2 - time1}`);

	//}
	
	//    time1 = Date.now();

	//for #
	var iWaitingNew = 1;

	//all params
	Object.keys(command_local.response).forEach(function (sField) {
            switch(command_local.response[sField]){
            case "uint2":{
		iWaitingNew += 2;
		break;
            }
            case "ubyte[4]":{
		iWaitingNew += 4;
		break;
            }
            case "ubyte":{
		iWaitingNew += 1;
		break;
            }
            }
	});

	callback = fCallback;

	//  console.log(LOG + "we wating for " + iWaitingNew + " bytes");
	iWaiting = iWaitingNew;
    }
    
    this.disco = function(){
	chrome.bluetoothSocket.disconnect(
	    socketId, () => {console.log(LOG + "port closed");});
    }
    //init;
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

const searchBluetoothDevices = function (onDevicesNotFoundCb,onDevicesFoundCb ) {
    //import_settings();
    console.warn("Searching bluetooth devices...");

  console.warn("NO_RESPONSE_TIME BT = " + NO_RESPONSE_TIME);
  console.warn("NO_START_TIMEOUT BT = " + NO_START_TIMEOUT);
  console.warn("UNO_TIMEOUT BT = " + UNO_TIMEOUT);
  console.warn("DEVICE_HANDLE_TIMEOUT BT = " + DEVICE_HANDLE_TIMEOUT);

    var device_names = [];
    var disconected_devices=0;
   

    var onConnectedCallback = function(socketId) {
	if (chrome.runtime.lastError) {
	    console.log("Connection failed: " + chrome.runtime.lastError.message);
	} else {

	    console.log("successful connection!");
	    
	    chrome.bluetoothSocket.send(socketId, new Buffer(' ', 'utf-8'), function(bytes_sent) {
		if (chrome.runtime.lastError) {
		    console.log("Send failed: " + chrome.runtime.lastError.message);
		} else {
		    console.log("Sent " + bytes_sent + " bytes");
		}
	    });
	}
    };
    
    var updateDeviceName = function(device) {

        console.warn(`Bluetooth device name: ${device.name}`);

        if ( (device_names.indexOf(device.name) == -1) /*&& ( (device.name.indexOf("ROB") != -1) || (device.name.indexOf("RNBT") != -1) )*/ ){

        device_names.push(device.name);   
        let bluetoothDevice = new InterfaceDevice(device);
        arrDevices.push(bluetoothDevice);
        
        if (typeof(onDevicesFoundCb) == 'function'){

            onDevicesFoundCb(bluetoothDevice);
        }

        }

        
    
    };
    var removeDeviceName = function(device) {
	delete device_names[device.address];
    }

    // Add listeners to receive newly found devices and updates
    // to the previously known devices.
    chrome.bluetooth.onDeviceAdded.addListener(updateDeviceName);
   // chrome.bluetooth.onDeviceChanged.addListener(updateDeviceName);
   // chrome.bluetooth.onDeviceRemoved.addListener(removeDeviceName);

    // With the listeners in place, get the list of devices found in
    // previous discovery sessions, or any currently active ones,
    // along with paired devices.

    // chrome.bluetooth.getDevices(function(devices) {
	// for (var i = 0; i < devices.length; i++) {
	//     updateDeviceName(devices[i]);
	// }
    // });


    var init_discovery = function(){


    chrome.bluetooth.startDiscovery( () => {
                        console.log("start discovery");
                        discovery_started = true;
                        // Stop discovery after 30 seconds.
                        setTimeout(() => {
                            chrome.bluetooth.stopDiscovery(() => {

                                discovery_started = false;

                                    if (typeof(onDevicesNotFoundCb) == 'function'){

                                        if (arrDevices.length == 0){

                                            onDevicesNotFoundCb();
                                        }
                                    }
                            });
                        }, 30000);
                        });

    }


    if (arrDevices.length > 0){
        console.log(arrDevices.length + ">>>>0");
          for (let index = 0; index < arrDevices.length; index++){
            console.log("STOPPPP CHECKING BLUE");
                arrDevices[index].stopCheckingSerialNumber(() => {
                      arrDevices[index] = null;
                        disconected_devices++;
                        console.log("Blue device was sucessfully disconnected. Count:  "+disconected_devices);
                      if (disconected_devices == (arrDevices.length)){
                               arrDevices = [];
                               console.log(arrDevices.length);

                               if (discovery_started) return;

                             chrome.bluetooth.getDevices((devices) => {


                                if (devices.length == 0){

                                  //  init_discovery();

                                  onDevicesNotFoundCb();

                                }else
                                  for (var i = 0; i < devices.length; i++) {
                                     updateDeviceName(devices[i]);
                                  }
                                 });


                            //    chrome.bluetooth.startDiscovery( () => {
                            //     console.log("start discovery");
                            //     discovery_started = true;
                            //     // Stop discovery after 30 seconds.
                            //     setTimeout(() => {
                            //         chrome.bluetooth.stopDiscovery(() => {

                            //             discovery_started = false;

                            //                 if (typeof(onDevicesNotFoundCb) == 'function'){

                            //                     if (arrDevices.length == 0){

                            //                         onDevicesNotFoundCb();
                            //                     }
                            //                 }
                            //         });
                            //     }, 30000);
                            //     });
                              
                      }
                });
          }
      }
      else{
        console.log("No coonected bluetooth devices");
        
        if (discovery_started) return;

        
        chrome.bluetooth.getDevices((devices) => {


        if (devices.length == 0){

       //     init_discovery();

       onDevicesNotFoundCb();

        }else
            for (var i = 0; i < devices.length; i++) {
                updateDeviceName(devices[i]);
            }
            });
        

        // chrome.bluetooth.startDiscovery(() => {
        //     console.log("start discovery");
        //     // Stop discovery after 30 seconds.
        //     discovery_started = true;
        //     setTimeout(() =>{
        //         chrome.bluetooth.stopDiscovery(() => {
        //             discovery_started = false;

        //             if (typeof(onDevicesNotFoundCb) == 'function'){

        //                 if (arrDevices.length == 0){

        //                     onDevicesNotFoundCb();
        //                 }
        //             }
        //         });
        //     }, /*3000*/30000);
        //     });
  
      }

    // Now begin the discovery process.
    // chrome.bluetooth.startDiscovery(function() {
	// console.log("start discovery");
	// // Stop discovery after 30 seconds.
	// setTimeout(function() {
	//     chrome.bluetooth.stopDiscovery(function() {});
	// }, 30000);
    // });

}

const pushConnectedDevices = function(device){
    arrDevices.push(device);
}

const getConnectedBluetoothDevices = function(){
    return arrDevices;
}

const trigger_logging = function(){


    can_log = !can_log;

}


const set_all_intervals_bluetooth = function(obj){
    let no_response_timeout_bluetooth = Math.round(Number(obj.device_response_timeout_bluetooth));
    let no_start_timeout_bluetooth = Math.round(Number(obj.device_no_start_timeout_bluetooth));
    let uno_timeout_bluetooth = Math.round(Number(obj.device_uno_start_search_timeout_bluetooth));
    let device_handle_timeout_bluetooth = Math.round(Number(obj.device_handle_timeout_bluetooth));
    if(typeof(no_response_timeout_bluetooth)==='number' && no_response_timeout_bluetooth<NO_RESPONSE_TIME_MAX_BLUETOOTH && no_response_timeout_bluetooth>0){
      NO_RESPONSE_TIME=no_response_timeout_bluetooth;
     // console.log("NO_RESPONSE_TIME_BLUETOOTH = " + NO_RESPONSE_TIME);
    } else {
      NO_RESPONSE_TIME = NO_RESPONSE_TIME_DEFAULT_BLUETOOTH;
    }
    if(typeof(no_start_timeout_bluetooth)==='number' && no_start_timeout_bluetooth<NO_START_TIMEOUT_MAX_BLUETOOTH && no_start_timeout_bluetooth>0){
      NO_START_TIMEOUT=no_start_timeout_bluetooth;
     // console.log("NO_START_TIMEOUT_BLUETOOTH = " + NO_START_TIMEOUT);
    } else {
      NO_START_TIMEOUT = NO_START_TIMEOUT_DEFAULT_BLUETOOTH;
    }
    if(typeof(device_handle_timeout_bluetooth)==='number' && device_handle_timeout_bluetooth<DEVICE_HANDLE_TIMEOUT_MAX_BLUETOOTH && device_handle_timeout_bluetooth>0){
      DEVICE_HANDLE_TIMEOUT=device_handle_timeout_bluetooth;
   //   console.log("DEVICE_HANDLE_TIMEOUT_BLUETOOTH = " + DEVICE_HANDLE_TIMEOUT);
    } else {
      DEVICE_HANDLE_TIMEOUT = DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH;
    }
    if(typeof(uno_timeout_bluetooth)==='number' && uno_timeout_bluetooth<DEVICE_HANDLE_TIMEOUT && uno_timeout_bluetooth>0){
      UNO_TIMEOUT=uno_timeout_bluetooth;
    } else {
      UNO_TIMEOUT = Math.round(UNO_TIMEOUT_DEFAULT_BLUETOOTH/2);
    }

     console.warn("NO_RESPONSE_TIME BT = " + NO_RESPONSE_TIME);
     console.warn("NO_START_TIMEOUT BT = " + NO_START_TIMEOUT);
     console.warn("UNO_TIMEOUT BT = " + UNO_TIMEOUT);
     console.warn("DEVICE_HANDLE_TIMEOUT BT = " + DEVICE_HANDLE_TIMEOUT);


  } 

export {
    InterfaceDevice,
    searchBluetoothDevices,
    getConnectedBluetoothDevices,
    pushConnectedDevices,
    DEVICES,
    DEVICE_STATES,
    DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH,
    NO_RESPONSE_TIME_DEFAULT_BLUETOOTH,
    NO_START_TIMEOUT_DEFAULT_BLUETOOTH,
    UNO_TIMEOUT_DEFAULT_BLUETOOTH,
    DEVICE_HANDLE_TIMEOUT_MAX_BLUETOOTH,
    NO_RESPONSE_TIME_MAX_BLUETOOTH,
    NO_START_TIMEOUT_MAX_BLUETOOTH,
    set_all_intervals_bluetooth,
}
