const DEVICE_SERIAL_NUMBER_PROBE_INTERVAL = 100;
const DEVICE_SERIAL_NUMBER_LENGTH = 52;

const NULL_COMMAND_TIMEOUT = 1 * 5 * 1000;
const CHECK_SERIAL_NUMBER_FLUSH_TIMEOUT = 500;

const DEVICE_HANDLE_TIMEOUT_MAX = 100000;
const NO_RESPONSE_TIME_MAX = 100000;
const NO_START_TIMEOUT_MAX = 100000;

const DEVICE_HANDLE_TIMEOUT_DEFAULT = 10000;
const NO_RESPONSE_TIME_DEFAULT = 3000;
const NO_START_TIMEOUT_DEFAULT = 3000;
const UNO_TIMEOUT_DEFAULT = 3000;


var DEVICE_HANDLE_TIMEOUT = DEVICE_HANDLE_TIMEOUT_DEFAULT;
var NO_RESPONSE_TIME = NO_RESPONSE_TIME_DEFAULT;
var NO_START_TIMEOUT = NO_START_TIMEOUT_DEFAULT;
var UNO_TIMEOUT = UNO_TIMEOUT_DEFAULT;

const log = console.log;
var can_log = true;
console.log = function(string){
  if(can_log){
        log(string);
  }
}
console.log("Robboscratch3_DeviceControlAPI-module-version-1.0.8");

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

               // DEVICE_HANDLE_TIMEOUT = Math.floor(Number(json.device_handle_timeout)) || 4000;

                console.warn(`NO_RESPONSE_TIME: ${NO_RESPONSE_TIME}  NO_START_TIMEOUT: ${NO_START_TIMEOUT} UNO_TIMEOUT: ${UNO_TIMEOUT}  DEVICE_HANDLE_TIMEOUT: ${DEVICE_HANDLE_TIMEOUT}`);
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
                  "params":["ubyte","ubyte","ubyte"],
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

const commands_list_esp= {
  "check":{
    "code": "a",
    "params": [],
    "response": {
                 "status" : "ubyte"
                }
  },
  "wifi":{
    "code": "s",
    "params": ["ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte"],
    "response": {
                 "status" : "ubyte"
                }
  },
  "mqtt":{
    "code": "u",
    "params": ["ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte","ubyte"],
    "response": {
                 "status" : "ubyte"
                }
  }
}

const last_firmwares =[10,5,2,3,1,2,3,7];

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
     "firmware":3,
     "commands":commands_list_arduino
   },
   //esp
   7:
  {
    "firmware":1,
    "commands":commands_list_esp
  }
});

var arrDevices = [];

function InterfaceDevice(port,paired_devices,port_path){

  {// PEREMENNIE
    console.log("new InterfaceDevice");

    var pairedDevices = paired_devices;
    //var serialPort;
    var serialPortReader;

   this.port = port;

   this.port_path = port_path;

   var NO_RESPONSE;
   var NO_START;
   var UNOTIME;

   
   var LOG = "[" + port_path + " random_object_identifier: " +  (Math.floor( Math.random() * 100) ) +  "] ";
   console.log(LOG + "Trying to register a new device...");
   var state = DEVICE_STATES["INITED"];
   var previous_state = state;
   var bufIncomingData = new Uint8Array();
   var iDeviceID = -1;
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
   var    time1 = Date.now();
   var    time_delta = 0;
   var    time2 = Date.now();
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
   var uport;
   var old_command = '';
   var firmwareVersionDiffers = false;
   var isBluetoothDevice = false;

   var DEVICE_STATE_CHECK_INTERVAL;

   const performance = typeof window === 'object' && window.performance;

 //callbacks
  var onErrorCb = () => {};
  var onFirmwareVersionDiffersCb =   () => {};
  var onDeviceStatusChangeCb = () => {};

  }


/////////////////////////////////////////////
  {
    
        // init();

        openSerial(
        this.port,  
        function(){ console.log("open");  onConnect()},
        function(data){console.log(data);onReceiveCallback(data)},
        function(){console.log("close"); closeSerial();},
        115200 //115200 //38400
        );

    //   UNOTIME = setTimeout(()=>{
    //     console.log(state);
    //     if(state != DEVICE_STATES["DEVICE_IS_READY"])
    //   {
    //     console.log("Its UNO time!");
    //     closeSerial(() => {
    //       // TODO: handle the error
    //    if(error!=null)
    //    console.error("disconnect error: "+error);
    //    openSerial(
    //    function(){ console.log("open");  onConnect()},
    //    function(data){console.log(data);onReceiveCallback(data)},
    //    function(){console.log("close"); closeSerial();},
    //    38400
    //  );
    //     });
    //   }
    // },UNO_TIMEOUT);



  }
 /////////////////////////////////////////



function getSerialDeviceInfo(device) {
  console.warn(device);
  var idx = pairedDevices.indexOf(device);
  var deviceInfo = { path : "webserial:"+(idx>=0?idx:""), type : "usb", description : "Previously connected device"};
    if (device.getInfo) {
        var info = device.getInfo();
    if (info.usbVendorId && info.usbProductId) {
      deviceInfo.path = "webserial:"+(63356+info.usbVendorId).toString(16).substr(-4)+":"+(63356+info.usbProductId).toString(16).substr(-4);
    }
  }
  return deviceInfo;
}

function openSerial(serialPort, openCallback, onReceiveCallback, disconnectCallback,br) {
  
  serialPort.open({ baudRate: br,  dataBits: 8, parity: 'none',stopBits: 1, flowControl: "none", })
  .then(function () {
    function readLoop() {
      serialPortReader = serialPort.readable.getReader();
      serialPortReader.read().then(function ({ value, done }) {
        serialPortReader.releaseLock();
        if (value) {
          onReceiveCallback(value);
        }
        if (done) {
          disconnectCallback();
        } else {
          readLoop();
        }
      }).catch(err => {
         console.error(`Code: ${err.code} Err msg: ${err}`);

         if (err.code !== 19){//NetworkError: The device has been lost
            readLoop();
         }

        //  if (err.code == 19){

        //    state = DEVICE_STATES["TIMEOUT"];

        //    if (typeof(onDeviceStatusChangeCb) == 'function'){
  
        //           let error  = {};
  
        //           error.code = 1;
        //           error.msg = "";
  
        //           let result = {
  
        //               state:state,
        //               deviceId: iDeviceID,
        //               error: error
        //           }
  
        //          onDeviceStatusChangeCb(result);
  
        //     }
        //  }
         
      
        });
    }

  
    console.warn("Serial connected. Receiving data...");
    if (!pairedDevices.includes(serialPort))
      pairedDevices.push(serialPort);

     openCallback();
    // setTimeout(readLoop, 300);
     readLoop();

    //   serialPort.setSignals({ break: false }).then(()=>{

     
    //   console.warn("Serial connected. Receiving data...");
    //   if (!pairedDevices.includes(serialPort))
    //     pairedDevices.push(serialPort);
  
    //   openCallback();
    //   setTimeout(readLoop, 300);
    //   //readLoop();


    // }).catch(err => console.error(err));


    // readLoop();
    // console.warn("Serial connected. Receiving data...");
    // if (!pairedDevices.includes(serialPort))
    //   pairedDevices.push(serialPort);

    // openCallback();
  }).catch(function(err_msg) {
          console.error('Serial> ERROR: ' + (err_msg));

          state = DEVICE_STATES["DEVICE_ERROR"];

           if (onErrorCb){

             var error  = {};

                error.code = 2;
                error.msg = LOG + err_msg;

               onErrorCb(error);

           }

           if (typeof(onDeviceStatusChangeCb) == 'function'){

                let error  = {};

                error.code = 2;
                error.msg = err_msg;

                let result = {

                    state:state,
                    deviceId: iDeviceID,
                    error: error
                }

               onDeviceStatusChangeCb(result);

             }

             disconnectCallback();
  });
}

function closeSerial() {
  console.log("closing serial(");
  if (serialPort) {
    serialPortReader.cancel().then(function() {
      serialPort.close();
    //  serialPort = undefined;
      serialPortReader = undefined;
    });
  }
  /*if (connectionDisconnectCallback) {
    connectionDisconnectCallback();
    connectionDisconnectCallback = undefined;
  }*/
}

function writeSerial(data, callback) {
  var writer = serialPort.writable.getWriter();
  console.log("trying_to_write:");
  console.log(data);
  writer.write(data).then(function() {
    callback();
  }).catch(function(error) {
    console.log('Serial> SEND ERROR: ' + error);
    closeSerial();
  });
  writer.releaseLock();
}


   var onReceiveCallback = function(data){//TODO TODO  TODO TODOOOOOOO TODODODO


      if(data)
      {

        //console.log("onRecieveCallback");

        //console.log(LOG + "CALLBACK!!! data <- " + data);

           clearTimeout(NO_RESPONSE);
         var buf = new Uint8Array(data);
      //   console.log(LOG + "CALLBACK!!! bytes recieved length <- " + buf.length);
         // console.warn(LOG + "CALLBACK!!! bytes buf <- " + buf);
          var bufIncomingDataNew = null;
           bufIncomingDataNew = new Uint8Array(bufIncomingData.length + buf.length);
           bufIncomingDataNew.set(bufIncomingData);
           bufIncomingDataNew.set(buf, bufIncomingData.length);
           bufIncomingData = bufIncomingDataNew;

        //   console.log(LOG + "bufIncomingData: " + bufIncomingData);


   if (state == DEVICE_STATES["DEVICE_IS_READY"]){

     NO_RESPONSE = setTimeout(()=>{
        console.error(LOG+"Ouuu...NO RESPONSE!");

        // if (onErrorCb){
        //
        //   var error  = {};
        //
        //      error.code = 1;
        //      error.msg = LOG+"Ouuu...NO RESPONSE!";
        //
        //     onErrorCb(error);
        //
        // }

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

        
     },NO_RESPONSE_TIME);


     //  DEVICE_STATE_CHECK_INTERVAL =  setInterval(()=>{
     //
     //   if (state == DEVICE_STATES["DEVICE_IS_READY"]){
     //
     //
     //     if(!qport.isOpen){
     //
     //       console.error(LOG+"Ouuu...NO RESPONSE!");
     //
     //         if (onErrorCb){
     //
     //           var error  = {};
     //
     //              error.code = 1;
     //            //  error.msg = LOG+"Ouuu...NO RESPONSE!";
     //             error.msg = LOG;
     //
     //             onErrorCb(error);
     //
     //         }
     //
     //          state = DEVICE_STATES["TIMEOUT"];
     //
     //      }
     //
     //
     //   }
     //
     // },1000);

   } //if  DEVICE_STATES["DEVICE_IS_READY"]



         if(commandToRun == null){ return};
         clearTimeout(NO_START);
        clearTimeout(UNOTIME);                                                //#
         if ( (bufIncomingData.length >= iWaiting) /*&& ( bufIncomingData.indexOf(35) != -1 )*/ ){
          //  console.log(LOG + "command '" + commandToRun.code + "' complete.");
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
           // recieve_time1 = Date.now();
            recieve_time1 = performance.now();
            recieve_time_delta = recieve_time1 - recieve_time2;
         //   console.log("time delta recieve: " + recieve_time_delta);

            // NO_RESPONSE = setTimeout(()=>{
            //    console.error(LOG+"Ouuu...NO RESPONSE!");
            //     state = DEVICE_STATES["TIMEOUT"];
            // },NO_RESPONSE_TIME);

             //recieve_time2 = Date.now();
              recieve_time2 = performance.now();
         }
       }
       else {
          console.log(LOG + "CALLBACK!!! without data");
       }
   }

   var purgePort = function(){
      console.log(LOG + "purge()");
      state = DEVICE_STATES["PURGE"];
      if(bufIncomingData.length > 0){
      //chrome.serial.flush(iConnectionId, onFlush);
         console.log("FLUSH && PURGE");
         bufIncomingData = new Uint8Array();
         setTimeout(purgePort, 10);
      }
      else{
          if ( (typeof(iDeviceID) != 'undefined') && (typeof(iFirmwareVersion) != 'undefined') && (typeof(sSerialNumber) != 'undefined') ){
                if ( (!isNaN(iDeviceID)) && (!isNaN(iFirmwareVersion)) && ( ( (sSerialNumber).startsWith("R") ) || ((sSerialNumber).startsWith("L")) ||((sSerialNumber).startsWith("O")) ||((sSerialNumber).startsWith("A")) ||((sSerialNumber).startsWith("E")) ) ) {
                        console.warn(LOG + "device is ready.");
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


                       // NO_START = setTimeout(()=>{qport.close(()=>{console.error(LOG+"OOPS, NO_START!");searchDevices()})},NO_START_TIMEOUT); //500
                       NO_START = setTimeout(()=>{

                        console.error(LOG+"OOPS, NO_START!");
                        onConnect();

                        
                        },NO_START_TIMEOUT);

                        return;
                }
                else
                {console.log("bad result");}
          }
          else
          {
            console.log("UNDEFINED data");
          }
          console.log("FLUSH && PURGE passed");
          setTimeout(checkSerialNumber, 100);
      }
   }

   function writeSerial(data, callback) {
    var writer = port.writable.getWriter();
    console.log("trying_to_write:");
    console.log(data);
    writer.write(data).then(function() {
      callback();
    }).catch(function(error) {
      console.log('Serial> SEND ERROR: ' + error);
      closeSerial();
    });
    writer.releaseLock();
  }

   var getSerial = function(){
    console.log(LOG + "-> getSerial()");
    var bum= new Uint8Array([32]);
    writeSerial(bum,()=>{ console.log("write callback",bum);});
   }

   function isN(n) {
      return (!isNaN(parseFloat(n)) && isFinite(n));
      // Метод isNaN пытается преобразовать переданный параметр в число.
      // Если параметр не может быть преобразован, возвращает true, иначе возвращает false.
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

   var checkSerialNumber = function(){
      console.log(LOG + "let's check the serial");
      var sIncomingData = new TextDecoder("utf-8").decode(bufIncomingData);
      console.log(LOG + "Now we have: " + sIncomingData);
      iSerialNumberOffset = sIncomingData.indexOf("ROBBO");
      console.log(bufIncomingData.length + " doljna bit > chem " + (DEVICE_SERIAL_NUMBER_PROBE_INTERVAL+iSerialNumberOffset));
      if(bufIncomingData.length > (DEVICE_SERIAL_NUMBER_PROBE_INTERVAL+iSerialNumberOffset)){
           if((iSerialNumberOffset < 0)||(!(check_correct_serial(sIncomingData)))){
            console.log(LOG + "Rubbish instead of serial number");
            state = DEVICE_STATES["DEVICE_IS_RUBBISH"];
            bufIncomingData = new Uint8Array();
            setTimeout(checkSerialNumber, 100);
           }
           else{
            iDeviceID        = parseInt(sIncomingData.substring(iSerialNumberOffset + 6, iSerialNumberOffset + 11));
            iFirmwareVersion = parseInt(sIncomingData.substring(iSerialNumberOffset + 12, iSerialNumberOffset + 17));
            sSerialNumber    = sIncomingData.substring(iSerialNumberOffset + 18, iSerialNumberOffset + DEVICE_SERIAL_NUMBER_LENGTH);
            console.warn(LOG + "Device=" + iDeviceID + " Firmware=" + iFirmwareVersion + " Serial='" + sSerialNumber + "'");

            if(last_firmwares[iDeviceID]!=iFirmwareVersion){

              console.error("BAD FLASH MF!!!");
              console.warn(last_firmwares[iDeviceID]+ "ot "+ iDeviceID + " = " + iFirmwareVersion + " lol");

              firmwareVersionDiffers = true;

             // clearTimeout(NO_START);

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
           let checkSerialNumberTimeout =   setTimeout(checkSerialNumber, 200); //100 //50
         }
         else{
                  console.log(LOG + "Out of checkSerialNumber timeout. " + "State: " + state);
         }
      }
   }

   var onConnect = function(err) {
       
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
       /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //qport.on("data",onReceiveCallback);


    // qport.on('readable', () => {
    //     let chunk;
    //     while (null !== (chunk = qport.read())) {
    //       console.warn(`Received ${chunk.length} bytes of data.`);
    //     }
    //   });

      //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      state = DEVICE_STATES["DEVICE_CHECKING"];

      if (typeof(onDeviceStatusChangeCb) == 'function'){

                let result = {

                    state:state,
                    deviceId: iDeviceID
                }

               onDeviceStatusChangeCb(result);

        }

      checkSerialNumber();  
      //setTimeout(checkSerialNumber, 300);

     ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
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

   this.stopCheckingSerialNumber = function(cb){
     clearTimeout(NO_RESPONSE);
     clearInterval(DEVICE_STATE_CHECK_INTERVAL);
     state= DEVICE_STATES["CLOSING"];
     console.warn(LOG+" Device stopped");
     // if (!isStopCheckingSerialNumber){
     //   isStopCheckingSerialNumber = true;
       qport.close((error) => {
      // TODO: handle the error
        if(error!=null)
        console.error("disconnect error: "+error);
         clearTimeout(automaticStopCheckingSerialNumberTimeout);
            if (cb){
              cb();
            }
          });

          

   }

  //  if( (typeof(port.vendorId) == 'undefined')  && (node_process.platform === "win32") ){

  //     isBluetoothDevice = true;
  //  }


  //    if(!qport.isOpen)
  //    {
  //       options.baudRate=115200;
  //       qport.open(onConnect);//38400
  //       qport.on('error', function(err) {
  //       console.error('Error: '+err.message);

  //       if (onErrorCb){

  //         var error  = {};

  //            error.code = 2;
  //            error.msg = err.message;

  //           onErrorCb(error);

  //       }

  //       });
  //     }
  //     else {
  //       onConnect();
  //     }
  //     UNOTIME = setTimeout(()=>{
  //       console.log(state);
  //       if(state != DEVICE_STATES["DEVICE_IS_READY"])
  //     {
  //       console.log("Its UNO time!");
  //       qport.close((error) => {
  //         // TODO: handle the error
  //      if(error!=null)
  //      console.error("disconnect error: "+error);
  //      options.baudRate=38400;
  //     qport = new _serialport(port.comName, options);
  //      qport.open(onConnect);//38400
  //      qport.on('error', function(err) {
  //       console.error('Error: '+err.message);

  //       if (onErrorCb){

  //         var error  = {};

  //            error.code = 2;
  //            error.msg = err.message;

  //           onErrorCb(error);

  //       }

  //       });
  //       });
  //     }
  //   },UNO_TIMEOUT);



 /*
   this.try_to_reconnect = function(){


     // state = DEVICE_STATES["INITED"];


     sSerialNumber = undefined;

      iWaiting = 0;
      response = {};
      commandToRun = null;
      callback = null;


      isStopCheckingSerialNumber = false;

      commands_stack = [];

         time1 = Date.now();
         time_delta = 0;
         time2 = Date.now();

      command_try_send_time1 = Date.now();
      command_try_send_time2 =  Date.now();

      check_serial_number_time1 = Date.now();
      check_serial_number_time2 = Date.now();

      can_check_serial_after_flush = true;

      wait_for_sync = false;

     if (state == DEVICE_STATES["DEVICE_ERROR"]){




       chrome.serial.connect(this.port.path, {bitrate: bitrate}, onConnect);

     }else{


    //   chrome.serial.disconnect(iConnectionId, function(result){



        //      console.error("Connection closed: " + result);


              chrome.serial.connect(this.port.path, {bitrate: bitrate}, onConnect);
    //   });


     }



   }
 */

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

 this.isBluetoothDevice = function(){

    return isBluetoothDevice;
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
     //console.warn("OU FUCK");
    //  console.warn(this.port.comName);
    //   return this.port.comName;

      console.warn(this.port_path);
      return this.port_path;
   }

   this.getSerialNumber = function(){

        return sSerialNumber;

   }

   this.getShorterSerialNumber = function(){

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

   this.read_sync = function(){

     return qport.read();
   }

   this.commandToRunSetNull = function(){

      commandToRun = null;

   }

   this.isFirmwareVersionDiffers = function(){

      return firmwareVersionDiffers;
   } 

   this.isReadyToAcceptCommand = function (){

      return (commandToRun == null);

   }

   this.command = function(command, params, fCallback){
    
  //Оптимизация. Пропускаем одну a команду, если она влезла в очередь между двумя c.
  //Актуально для последовательных блоков движения робота. 

   if ((command.code == "a") && (old_command == "c")){ 

     // console.warn("skip redundant a command");
      old_command = "a";
      return;
   }


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
     
      const buf = Buffer.allocUnsafe(command_local.code.length + params_local.length + 1);
      
     var bufCommand = new TextEncoder("utf-8").encode(command_local.code);
     
      buf.writeUInt8(bufCommand, 0);
      
      var iParamOffset = 0;
       params_local.forEach(function(param){
         buf.writeUInt8(param, bufCommand.length + iParamOffset);
        
         iParamOffset++;
      });
      buf.writeUInt8(0x24, bufCommand.length + iParamOffset);
    
      writeSerial(buf,()=>{ console.log("write calback");});
     


    old_command = command_local.code;


      //for #
      var iWaitingNew = 1;

      //all params
      Object.keys(command_local.response).forEach(function (sField){
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





   this.disco = function(onClosedCb,device_port){

    if (qport.isOpen){

      qport.close(()=>{
        console.log(LOG+"port closed");
 
        if (typeof(device_port) !== 'undefined'){
 
         if (this.port.comName == device_port){
 
           onClosedCb();
          }
 
        }else{


 
         onClosedCb();
        }
        
        
       
       });

    }else{

     if (this.port.comName == device_port){
 
           onClosedCb();
           
          }

    }

     
   }

   //   init;
}

const searchDevices = function(onDevicesFoundCb){

 // import_settings();

 //  arrDevices = [];

  console.warn("NO_RESPONSE_TIME = " + NO_RESPONSE_TIME);
  console.warn("NO_START_TIMEOUT = " + NO_START_TIMEOUT);
  console.warn("UNO_TIMEOUT = " + UNO_TIMEOUT);
  console.warn("DEVICE_HANDLE_TIMEOUT = " + DEVICE_HANDLE_TIMEOUT);


 var disconected_devices=0;

 var paired_devices = [];

 function getStatus(ignoreSettings) {
  console.warn("TRY TO GET STRAUS!");
  if (typeof navigator == "undefined") {
    console.error("Not running in a browser");
    return false;
  }
    console.warn("SERIAL CHECK!");
  if (!navigator.serial) {/*
    if (Espruino.Core.Utils.isChrome())
      return {error:`Chrome currently requires <code>chrome://flags/#enable-experimental-web-platform-features</code> to be enabled.`};
    else if (Espruino.Core.Utils.isFirefox())
      return {error:`Firefox doesn't support Web Serial - try using Chrome`};
    else*/
      console.error("No navigator.serial. Do you have a supported browser?");
      return false;
  }

    console.warn("РАСКОМЕНТИТЬ ПРИ РАБОТЕ НА СЕРВЕРЕ!");
/*  if (window && window.location && window.location.protocol=="http:" &&
      window.location.hostname!="localhost") {
    return {error:"Serving off HTTP (not HTTPS)"};
  }*//*
  if (!ignoreSettings && !Espruino.Config.WEB_SERIAL)
    return {warning:`"Web Serial" disabled in settings`};*/
    console.warn("STATUS TRUE!");
  return true;
}

function init() {
  console.warn("INITING!");
  // If we're ok and have the getDevices extension, use it to remember previously paired devices
  //console.warn(navigator.serial.getPorts);
  if (getStatus(true)===true && navigator.serial.getPorts) {
    console.log("Serial> serial.getPorts exists - grab known devices");
    navigator.serial.getPorts().then(devices=>{
      paired_devices
    });
  }
}

     init();
     
     var promise;
     const filters = [
       { usbVendorId: 0x0403, usbProductId: 0x6001 },
       { usbVendorId: 0x2341, usbProductId: 0x0043 },
       { usbVendorId: 0x10c4, usbProductId: 0xea60 },
     ];
       console.warn("Serial> Starting device chooser");
       promise = navigator.serial.requestPort({filters});

       promise.then(function(port) {

        
       
         const { usbProductId, usbVendorId } = port.getInfo();
         const info = port.getInfo();
         const port_path  = "webserial:"+(63356+usbVendorId).toString(16).substr(-4)+":"+(63356+usbProductId).toString(16).substr(-4);
 

         console.warn(`port: ${usbProductId} ${usbVendorId}`);
         console.warn(`port path: ${port_path}`);

         var device = new InterfaceDevice(port,paired_devices,port_path);

         arrDevices.push(device);
   
         if (typeof(onDevicesFoundCb) == 'function' ){
      
           onDevicesFoundCb(arrDevices);
      
         }
       
      })


    

    // var onGetDevices = function(err,ports) {//NEW DEVICE SEARHING
    //   for (var i=0; i<ports.length; i++) {

    //     //if(typeof(ports[i].vendorId) !== 'undefined'){

    //     //console.warn(`ports[i].comName: ${ports[i].comName}`);

    //     if( ( (typeof(ports[i].manufacturer) !== 'undefined') || (ports[i].comName.indexOf("rfcom") != -1) || (ports[i].comName.indexOf("/dev/tty.") != -1) ) && (ports[i].comName.toLowerCase() !== 'com1') ){
    //     console.warn(" NEW device name is "+ ports[i].comName);
    //     var device = new InterfaceDevice(ports[i]);
    //      arrDevices.push(device);
    //   }
    //  }

    //  if (typeof(onDevicesFoundCb) == 'function' ){

    //     onDevicesFoundCb(arrDevices);

    //  }

    // }

    // var device = new InterfaceDevice();
    //arrDevices.push(device);

  //   if (typeof(onDevicesFoundCb) == 'function' ){

  //     onDevicesFoundCb(arrDevices);

  //  }

   ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // if (arrDevices.length > 0){
    //   console.log(">>>>0"+arrDevices.length);
    //     for (let index = 0; index < arrDevices.length; index++){
    //       console.log("STOPPPP CHECKING");
    //           arrDevices[index].stopCheckingSerialNumber(() => {
    //                 arrDevices[index] = null;
    //                   disconected_devices++;
    //                   console.log("DISK"+disconected_devices);
    //                 if (disconected_devices == (arrDevices.length)){
    //                          arrDevices = [];
    //                          console.log(arrDevices.length);
    //                          _serialport.list(onGetDevices);
    //                 }
    //           });
    //     }
    // }
    // else{
    //   console.log("ZEEEERRO");
    //      _serialport.list(onGetDevices);

    // }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////
};

const pushConnectedDevices = function(device){

  arrDevices.push(device);

}

const getConnectedDevices = function(){

    return arrDevices;

}

const trigger_logging = function(){


        can_log = !can_log;

}



const set_all_intervals = function(obj){
  let no_response_timeout = Math.round(Number(obj.device_response_timeout));
  let no_start_timeout = Math.round(Number(obj.device_no_start_timeout));
  let uno_timeout = Math.round(Number(obj.device_uno_start_search_timeout));
  let device_handle_timeout = Math.round(Number(obj.device_handle_timeout));
  if(typeof(no_response_timeout)==='number' && no_response_timeout<NO_RESPONSE_TIME_MAX && no_response_timeout>0){
    NO_RESPONSE_TIME=no_response_timeout;
    //console.log("NO_RESPONSE_TIME = " + NO_RESPONSE_TIME);
  } else {
    NO_RESPONSE_TIME = NO_RESPONSE_TIME_DEFAULT;
  }
  if(typeof(no_start_timeout)==='number' && no_start_timeout<NO_START_TIMEOUT_MAX && no_start_timeout>0){
    NO_START_TIMEOUT=no_start_timeout;
  //  console.log("NO_START_TIMEOUT = " + NO_START_TIMEOUT);
  } else {
    NO_START_TIMEOUT = NO_START_TIMEOUT_DEFAULT;
  }
  if(typeof(device_handle_timeout)==='number' && device_handle_timeout<DEVICE_HANDLE_TIMEOUT_MAX && device_handle_timeout>0){
    DEVICE_HANDLE_TIMEOUT=device_handle_timeout;
   // console.log("DEVICE_HANDLE_TIMEOUT = " + DEVICE_HANDLE_TIMEOUT);
  } else {
    DEVICE_HANDLE_TIMEOUT = DEVICE_HANDLE_TIMEOUT_DEFAULT;
  }
  if(typeof(uno_timeout)==='number' && uno_timeout<DEVICE_HANDLE_TIMEOUT && uno_timeout>0){
    UNO_TIMEOUT=uno_timeout;
  } else {
    UNO_TIMEOUT = Math.round(DEVICE_HANDLE_TIMEOUT/2);
  }

  console.warn("NO_RESPONSE_TIME = " + NO_RESPONSE_TIME);
  console.warn("NO_START_TIMEOUT = " + NO_START_TIMEOUT);
  console.warn("UNO_TIMEOUT = " + UNO_TIMEOUT);
  console.warn("DEVICE_HANDLE_TIMEOUT = " + DEVICE_HANDLE_TIMEOUT);

} 


export  {

  InterfaceDevice,
  searchDevices,
  getConnectedDevices,
  pushConnectedDevices,
  DEVICES,
  DEVICE_STATES,
  trigger_logging,
  DEVICE_HANDLE_TIMEOUT,
  DEVICE_HANDLE_TIMEOUT_MAX,
  NO_RESPONSE_TIME,
  NO_RESPONSE_TIME_MAX, 
  NO_START_TIMEOUT_MAX,
  DEVICE_HANDLE_TIMEOUT_DEFAULT,
  NO_RESPONSE_TIME_DEFAULT,
  NO_START_TIMEOUT_DEFAULT,
  UNO_TIMEOUT_DEFAULT,
  set_all_intervals,


};
