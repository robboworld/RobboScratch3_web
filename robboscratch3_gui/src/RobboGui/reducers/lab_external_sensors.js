import SensorsAPI from '../sensors_api';
import {immutable_copy} from '../lib/lib.js';

function init_state(){

  let sensors = [];
  let sensors_count = 2;
  let i = 0;

  for (i=0;i<sensors_count;i++){

      sensors[i]= {

            sensor_id:i,
            sensor_name: SensorsAPI.getSensorInitName(),
            sensor_type:  SensorsAPI.getSensorInitType(),
            is_sensor_version_new: true,
            sensor_active: false,
            sensor_data:[],
            sensor_device_name:"lab",
            sensor_field_text:`Аналог ${i} :`

      }

      sensors[2] = {

        sensor_id:2,
        sensor_name: SensorsAPI.getSensorInitName(),
        sensor_type:  "DIGITAL",
        is_sensor_version_new: true,
        sensor_active: false,
        sensor_data:[],
        sensor_device_name:"lab",
        sensor_field_text:`Цифровой :`

      }

  }


    return sensors;

}


const initialState = init_state();

const  reducer = function (state, action) {

    let sensors = [];

  if (typeof state === 'undefined') state = initialState;


switch (action.type) {

  case 'TRIGGER_LAB_SENSOR_NAME':




              sensors = immutable_copy(state);

            sensors = handler_trigger_sensor_name(sensors,action.payload);



            return sensors;


    break;

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

    for (i=0;i<2;i++){

      if (sensors_state[i].sensor_active){

            sensors_state[i].sensor_data = payload.LCA.getSensorData("A"+i,sensors_state[i].sensor_name);
      }

    }


    if (sensors_state[i].sensor_active){

        sensors_state[2].sensor_data = (payload.LCA.labDigitalPinState(0,"D13") == true)?"true":"false";
    }


return sensors_state;

}


const handler_trigger_sensor_name = function (initial_sensors_state,payload){

    let sensors_state = initial_sensors_state;

    let data = payload.sensor_name_data.split("_");

    let sensor_name = data[0].replace("sensor-name-","");
    let sensor_id =   data[1].replace("CallerSensorId-","");

    sensors_state[sensor_id].sensor_name = sensor_name;

    payload.LCA.setSensorType("A" + sensor_id,sensor_name)


    if (sensor_name != "nosensor"){

          sensors_state[sensor_id].sensor_active = true;

    }else{

      sensors_state[sensor_id].sensor_active = false;
    }





  return sensors_state;
}


export {
    reducer as default,
    initialState as lab_external_sensors_InitialState

};
