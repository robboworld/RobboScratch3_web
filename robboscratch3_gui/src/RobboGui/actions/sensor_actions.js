var RCA_local;
var LCA_local;

var robot_get_data_order = true;

var mqtt = require('../../../../robboscratch3_vm/node_modules/mqtt');


const ActionTriggerSim = function () {
  return {
    type: 'TRIGGER_SIM_EN',
    payload: {
      //        VM:vm,
      RCA: RCA_local
    }
  };
}

const ActionTriggerExtensionPack = function () {


  return {
    type: 'TRIGGER_EXTENSION_PACK',
    payload: {


      RCA: RCA_local
    }
  };


}

const ActionTriggerLabExtSensors = function () {


  return {

    type: 'TRIGGER_LAB_EXT_SENSORS',

    payload: {


      LCA: LCA_local
    }
  };


}

const ActionTriggerSensorChooseWindow = function (payload) {


  let data = payload.split("_");

  let device_name = data[0];
  let caller_sensor_id = Number.parseInt(data[1].replace("sensor-", ""));
  let device_type = data[2].replace("type-", "");


  return {
    type: 'TRIGGER_SENSOR_CHOOSE_WINDOW',

    payload: {

      caller_sensor_id: caller_sensor_id,
      sensor_caller_device_name: device_name,
      sensor_caller_type: device_type

    }
  };


}

const ActionDropSensorChooseWindow = function (top, left) {


  return {
    type: 'DROP_SENSOR_CHOOSE_WINDOW',
    payload: {

      top: top,
      left: left

    }
  };


}

const ActionTriggerSensorsPalette = function () {


  return {
    type: "TRIGGER_SENSORS_PALETTE",
    payload: {



    }
  };


}

const ActionTriggerSensorName = function (payload) {




  return (dispatch) => {


    dispatch(TriggerSensorName(payload));
    dispatch(HideSensorChooseWindow(payload));

  };



}

const HideSensorChooseWindow = function () {

  return {
    type: 'HIDE_SENSOR_CHOOSE_WINDOW',
    payload: {

    }
  };

}

const TriggerSensorName = function (payload) {

  let data;

  console.log('ActionTriggerSensorName: ' + payload);

  if (payload.startsWith("robot-")) {

    data = payload.replace("robot-", "");

    return {
      type: 'TRIGGER_ROBOT_SENSOR_NAME',
      payload: {
        sensor_name_data: data,
        RCA: RCA_local
      }
    };

  } else if (payload.startsWith("lab-")) {

    data = payload.replace("lab-", "");

    return {
      type: 'TRIGGER_LAB_SENSOR_NAME',
      payload: {
        sensor_name_data: data,
        LCA: LCA_local
      }
    };

  }

  console.log('ERROR_UNKNOWN_DEVICE_SENSOR');
  return {
    type: 'ERROR_UNKNOWN_DEVICE_SENSOR',


  }

}

var LaboratoriesConnectionStatusCheckInterval;

const ActionLaboratoriesConnectionStatusCheck = function (laboratory_number, LCA) {

  return {

    type: 'LABORATORY_CONNECTION_STATUS_CHECK',
    payload: {

      laboratory_number: laboratory_number,
      LCA: LCA
    }
  }

}

const ActionLaboratoriesConnectionStatusCheckStart = function (laboratory_number, LCA) {

  LCA_local = LCA


  return (dispatch) => {
    LaboratoriesConnectionStatusCheckInterval = setInterval(() => {

      dispatch(ActionLaboratoriesConnectionStatusCheck(laboratory_number, LCA));
    }, 100);
  };



}


var RobotsConnectionStatusCheckInterval;

const ActionRobotsConnectionStatusCheck = function (robot_number, RCA) {

  return {

    type: 'ROBOT_CONNECTION_STATUS_CHECK',
    payload: {

      robot_number: robot_number,
      RCA: RCA
    }
  }

}

const ActionRobotsConnectionStatusCheckStart = function (robot_number, RCA) {

  RCA_local = RCA


  return (dispatch) => {
    RobotsConnectionStatusCheckInterval = setInterval(() => {

      dispatch(ActionRobotsConnectionStatusCheck(robot_number, RCA));
    }, 100);
  };



}

var RobotGetDataInterval;

const ActionRobotGetData = function (robot_number, RCA) {

  return {

    type: 'ROBOT_GET_SENSORS_DATA',
    payload: {

      robot_number: robot_number,
      RCA: RCA
    }
  }

}

const ActionRobotGetDataStart = function (robot_number, RCA) {

  RCA_local = RCA;


  return (dispatch) => {
    RobotGetDataInterval = setInterval(() => {

      if (robot_get_data_order) {


        dispatch(ActionRobotGetData(robot_number, RCA));

      }
      // else{
      //
      //       robot_get_data_order = !robot_get_data_order;
      //
      // }


    }, 150); //25
  };



}


var LaboratoryGetDataInterval;

const ActionLaboratoryGetData = function (laboratory_number, LCA) {

  return {

    type: 'LABORATORY_GET_SENSORS_DATA',
    payload: {

      laboratory_number: laboratory_number,
      LCA: LCA
    }
  }

}

const ActionLaboratoryGetDataStart = function (laboratory_number, LCA) {

  LCA_local = LCA;


  return (dispatch) => {
    LaboratoryGetDataInterval = setInterval(() => {

      if (!robot_get_data_order) {


        robot_get_data_order = !robot_get_data_order;
        dispatch(ActionLaboratoryGetData(laboratory_number, LCA_local));

      }
      else {

        robot_get_data_order = !robot_get_data_order;

      }

    }, 170);
  };



}

const ActionSearchRobotDevices = function (RCA) {


  return {


    type: 'ROBOT_SEARCH_DEVICES',
    payload: {


      RCA: RCA
    }


  }

}

const ActionSearchLaboratoryDevices = function (LCA) {


  LCA_local = LCA;

  return {


    type: 'LABORATORY_SEARCH_DEVICES',
    payload: {


      LCA: LCA
    }


  }

}

const ActionRobotStopSearchProcess = function (RCA) {


  return {


    type: 'ROBOT_STOP_SEARCH_PROCESS',
    payload: {


      RCA: RCA
    }


  }

}

const ActionRobotStopDataRecievingProcess = function (RCA) {


  return {


    type: 'ROBOT_STOP_DATA_RECIEVING_PROCESS',
    payload: {


      RCA: RCA
    }


  }

}

const ActionTriggerOldAnalogSensorState = function (payload) {



  let data = payload.split("_");

  let device_name = data[0];
  let caller_sensor_id = Number.parseInt(data[1].replace("sensor-", ""));



  return {
    type: 'TRIGGER_OLD_ANALOG_SENSOR_STATE',

    payload: {

      caller_sensor_id: caller_sensor_id,
      RCA: RCA_local

    }
  }

}

const ActionTriggerColorCorrectorTable = function (sensor_caller_id) {


  return {
    type: 'TRIGGER_COLOR_CORRECTOR_TABLE',

    payload: {

      sensor_caller_id: sensor_caller_id,


    }
  }

}

const ActionDropColorCorrectorWindow = function (top, left) {


  return {
    type: 'COLOR_CORRECTOR_TABLE_DROP',
    payload: {

      position_top: top,
      position_left: left

    }
  };


}

const ActionDropNewDraggableWindow = function (top, left, draggable_window_id) {


  return {
    type: 'NEW_DRAGGABLE_WINDOW_DROP',
    payload: {

      position_top: top,
      position_left: left,
      draggable_window_id: draggable_window_id

    }
  };


}

const ActionTriggerNewDraggableWindow = function (draggable_window_id) {


  return {
    type: 'NEW_DRAGGABLE_WINDOW_TRIGGER',
    payload: {


      draggable_window_id: draggable_window_id

    }
  };


}

const ActionCreateNewDraggableWindow = function (top, left, draggable_window_id) {


  return {
    type: 'NEW_DRAGGABLE_WINDOW_CREATE',
    payload: {

      position_top: top,
      position_left: left,
      draggable_window_id: draggable_window_id

    }
  };


}

const ActionDropDraggableWindow = function (top, left, draggable_window_id) {


  return {
    type: 'DRAGGABLE_WINDOW_DROP',
    payload: {

      position_top: top,
      position_left: left,
      draggable_window_id: draggable_window_id

    }
  };


}

const ActionTriggerDraggableWindow = function (draggable_window_id) {


  return {
    type: 'DRAGGABLE_WINDOW_TRIGGER',
    payload: {


      draggable_window_id: draggable_window_id

    }
  };


}

const ActionCreateDraggableWindow = function (draggable_window_id) {


  return {
    type: 'DRAGGABLE_WINDOW_CREATE',
    payload: {


      draggable_window_id: draggable_window_id

    }
  };


}

const ActionTriggerRobboMenu = function () {

  return {

    type: 'TRIGGER_ROBBO_MENU',
    payload: {



    }
  };

}

const ActionSetRCALocal = function (RCA) {

  RCA_local = RCA;

  return {

    type: 'SET_RCA_LOCAL',
    payload: {



    }

  };

}

const ActionSetLCALocal = function (LCA) {

  LCA_local = LCA;

  return {

    type: 'SET_LCA_LOCAL',
    payload: {



    }

  };

}

const ActionHideNoneScratchduinoBlocks = function () {


  return {

    type: 'HIDE_NONE_SCRATCHDUINO_BLOCKS',

    payload: {



    }

  };

}

const ActionShowRobboBlocks = function () {


  return {

    type: 'SHOW_ROBBO_BLOCKS',

    payload: {



    }

  };

}

// const ActionTriggerNeedLanguageReload = function(){
//
//   return {
//
//     type: 'TRIGGER_NEED_LABGUAGE_RELOAD',
//     payload:{
//
//
//
//     }
//   };
//
// }

const ActionFirmwareFlasherDevicesListNull = function () {

  return {

    type: 'FIRMWARE_FLASHER_DEVICES_LIST_NULL',
    payload: {


    }
  }

}


const ActionFirmwareFlasherPushDevice = function (device) {

  return {

    type: 'FIRMWARE_FLASHER_PUSH_DEVICE',
    payload: {

      device: device
    }
  }

}

const ActionFirmwareFlasherGetDevicesInfo = function (DCA, RCA, LCA, QCA, OCA) {

  var device = {};


  return (dispatch) => {
    //  LaboratoryGetDataInterval =   setInterval(() => {


    dispatch(ActionFirmwareFlasherDevicesListNull());

    DCA.searchPorts((port) => {

      var port_path = port.comName;

      device.port = port_path;

      RCA.checkRobotByPort(device.port, (result) => {

        if (result.code === 0) {

          device.id = result.device.id;
          device.firmware_version = result.device.firmware_version;
          device.serial_number = result.device.serial_number;


          dispatch(ActionFirmwareFlasherPushDevice(device));

          device = {};

        } else {

          LCA.checkLabByPort(device.port, (result) => {

            if (result.code === 0) {

              device.id = result.device.id;
              device.firmware_version = result.device.firmware_version;
              device.serial_number = result.device.serial_number;

              dispatch(ActionFirmwareFlasherPushDevice(device));

              device = {};

            } else {

              OCA.checkOttoByPort(device.port, (result) => {

                if (result.code === 0) {

                  device.id = result.device.id;
                  device.firmware_version = result.device.firmware_version;
                  device.serial_number = result.device.serial_number;

                  dispatch(ActionFirmwareFlasherPushDevice(device));

                  device = {};

                } else {

                  device.id = -1;
                  device.firmware_version = -1;
                  device.serial_number = -1;

                  dispatch(ActionFirmwareFlasherPushDevice(device));

                  device = {};
                }

              });
            }

          });

        }


      });

    });



    //  }, 300);
  };



}

const ActionUpdateIotBlockLogin = function (login) {
  return {
    type: 'UPDATE_IOT_BLOCK_LOGIN',
    login: login
  }
};

const ActionUpdateIotBlockPass = function (pass) {
  return {
    type: 'UPDATE_IOT_BLOCK_PASS',
    pass: pass
  }
};

const ActionUpdateIotBlockProtocol = function (protocol) {
  return {
    type: 'UPDATE_IOT_BLOCK_PROTOCOL',
    broker_protocol: protocol
  }
};

const ActionUpdateIotBlockAdress = function (adress) {
  return {
    type: 'UPDATE_IOT_BLOCK_ADRESS',
    broker_adress: adress
  }
};

const ActionUpdateIotBlockPort = function (port) {
  return {
    type: 'UPDATE_IOT_BLOCK_PORT',
    broker_port: port
  }
};

const ActionUpdateIotBlockConnection = function (connection) {
  return {
    type: 'UPDATE_IOT_BLOCK_CONNECTION',
    connection_status: connection
  }
};

const ActionUpdateIotBlockLog = function (log) {
  return {
    type: 'UPDATE_IOT_BLOCK_LOG',
    connection_log: log
  }
};

const ActionMqttConnect = function (options, IOT) {
  console.warn(`options: `);
  console.warn(options);
  return (dispatch) => {
    let client = mqtt.connect(options);
    client.on('connect', () => {
      IOT.connectionLog = "Client is connected!";
      dispatch(ActionUpdateIotBlockLog("Client is connected!"));
      IOT.connectionStatus = client.connected;
      dispatch(ActionUpdateIotBlockConnection(client.connected));
    });
    if (client !== 'undefined') {
      client.on("error", (error) => {
        IOT.connectionLog = error.toString();
        dispatch(ActionUpdateIotBlockLog(error.toString()));
        IOT.connectionStatus = client.connected;
        dispatch(ActionUpdateIotBlockConnection(client.connected));
      })
    } else {
      IOT.connectionLog = "Client is undefined!";
      dispatch(ActionUpdateIotBlockLog("Client is undefined!"));
    }
    IOT.client = client;
  };
};

const ActionGreenFlag = function (vm) {
  vm.runtime.greenFlag();
}

const ActionGenerateIotBlocks = function (generate) {
  return {
    type: 'GENERATE_IOT_BLOCK',
    generate: generate
  };
}

export {

  ActionTriggerExtensionPack,
  ActionTriggerSensorChooseWindow,
  ActionDropSensorChooseWindow,
  ActionTriggerSensorName,
  ActionTriggerSensorsPalette,
  ActionRobotsConnectionStatusCheckStart,
  ActionLaboratoriesConnectionStatusCheckStart,
  ActionSearchRobotDevices,
  ActionRobotStopSearchProcess,
  ActionRobotStopDataRecievingProcess,
  ActionRobotGetDataStart,
  ActionLaboratoryGetDataStart,
  ActionTriggerOldAnalogSensorState,
  ActionTriggerColorCorrectorTable,
  ActionDropColorCorrectorWindow,
  ActionDropDraggableWindow,
  ActionDropNewDraggableWindow, //new drag window
  ActionTriggerNewDraggableWindow, //new drag window 
  ActionCreateNewDraggableWindow, //new drag window 
  ActionTriggerDraggableWindow,
  ActionCreateDraggableWindow,
  ActionSearchLaboratoryDevices,
  ActionTriggerRobboMenu,
  ActionTriggerLabExtSensors,
  ActionFirmwareFlasherGetDevicesInfo,
  ActionSetRCALocal,
  ActionSetLCALocal,
  ActionHideNoneScratchduinoBlocks,
  ActionShowRobboBlocks,
  ActionUpdateIotBlockLogin,
  ActionUpdateIotBlockPass,
  ActionUpdateIotBlockProtocol,
  ActionUpdateIotBlockAdress,
  ActionUpdateIotBlockPort,
  ActionUpdateIotBlockConnection,
  ActionUpdateIotBlockLog,
  ActionMqttConnect,
  ActionGreenFlag,
  ActionGenerateIotBlocks,
  ActionTriggerSim,
  //  ActionTriggerNeedLanguageReload

};
