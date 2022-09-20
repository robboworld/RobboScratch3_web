
import {immutable_copy} from '../lib/lib.js';

function init_state(){

  let devices = [];
  // let devices_count = 1;
  // let i = 0;
  //
  // for (i=0;i<devices_count;i++){
  //
  //     robots[i]= {
  //
  //           robot_number:i,
  //           robot_status: "DISCONNECTED",
  //           robot_connected: false,
  //           robot_is_searching:false
  //
  //
  //     }
  //
  // }


    return devices;

}


const initialState = init_state();

const  reducer = function (state, action) {

    let devices = [];

  if (typeof state === 'undefined') state = initialState;


switch (action.type) {

  case 'FIRMWARE_FLASHER_PUSH_DEVICE':


      devices =  immutable_copy(state);


    //  devices = [];


      var device_changed = false;

      for (var i = 0; i< devices.length; i++){

          if ((devices[i].port == action.payload.device.port)){

                devices[i].id =  action.payload.device.id;
                devices[i].firmware_version = action.payload.device.firmware_version;

                device_changed = true;

          }

      }


      if ( (!device_changed) && (typeof(action.payload.device) != 'undefined') ) {

          devices.push(action.payload.device);

      }




            return devices;


    break;

    case 'FIRMWARE_FLASHER_DEVICES_LIST_NULL':


        devices =  immutable_copy(state);


        devices = [];







              return devices;


      break;




  default:

      return state;

}




  return state;


}





export {
    reducer as default,
    initialState as devices_firmware_flasher_InitialState

};
