import SensorsAPI from '../sensors_api';
import {immutable_copy} from '../lib/lib.js';

function init_state(){

  let sensors = [];
  let sensors_count = 5;
  let i = 0;

  for (i=0;i<sensors_count;i++){

      sensors[i]= {

            sensor_id:`lab-button-${i}`,
            sensor_name:`lab-button`,
            sensor_type: `lab-button`,
            is_sensor_version_new: true,
            sensor_active: true,
            sensor_data:[],
            sensor_device_name:"lab",
            sensor_field_text:`Кнопка ${i + 1} :`

      }

  }


  sensors[5]= {

        sensor_id:`lab-light`,
        sensor_name:`lab-light`,
        sensor_type:`lab-light`,
        is_sensor_version_new: true,
        sensor_active: true,
        sensor_data:[],
        sensor_device_name:"lab",
        sensor_field_text:`Свет :`

  }

  sensors[6]= {

        sensor_id:`lab-sound`,
        sensor_name:`lab-sound`,
        sensor_type:`lab-sound`,
        is_sensor_version_new: true,
        sensor_active: true,
        sensor_data:[],
        sensor_device_name:"lab",
        sensor_field_text:`Звук :`

  }

  sensors[7]= {

        sensor_id:`lab-slider`,
        sensor_name:`lab-slider`,
        sensor_type:`lab-slider`,
        is_sensor_version_new: true,
        sensor_active: true,
        sensor_data:[],
        sensor_device_name:"lab",
        sensor_field_text:`Ползунок:`

  }

    return sensors;

}


const initialState = init_state();

const  reducer = function (state, action) {

    let sensors = [];

  if (typeof state === 'undefined') state = initialState;


switch (action.type) {

  case 'LABORATORY_GET_SENSORS_DATA':


  sensors = immutable_copy(state);

  sensors = handler_laboratory_get_sensors_data(sensors,action.payload);



return sensors;


  default:

      return state;

}




  return state;


}


const handler_laboratory_get_sensors_data = function (initial_sensors_state,payload){


    let sensors_state = initial_sensors_state;

    let i = 0;

    for (i=0;i<5;i++){

      if (sensors_state[i].sensor_active){

            sensors_state[i].sensor_data = (payload.LCA.islaboratoryButtonPressed(0,i + 1) == true)?"true":"false";
      }

    }

        //light
        sensors_state[5].sensor_data = payload.LCA.getSensorData("light");


        //sound
        sensors_state[6].sensor_data = payload.LCA.getSensorData("sound");


        //slider
        sensors_state[7].sensor_data = payload.LCA.getSensorData("slider");





    return sensors_state;

}


export {
    reducer as default,
    initialState as lab_special_sensors_InitialState

};
