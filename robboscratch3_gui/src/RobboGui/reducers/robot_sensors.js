
import SensorsAPI from '../sensors_api'

function init_state(){

  let sensors = [];
  let sensors_count = 5;
  let i = 0;

  for (i=0;i<sensors_count;i++){

      sensors[i]= {

            sensor_id:i,
            sensor_name: SensorsAPI.getSensorInitName(),
            sensor_type:  SensorsAPI.getSensorInitType(),
            is_sensor_version_new: false,
            sensor_active: false,
            sensor_data:[],
            sensor_device_name:"robot",
            sensor_field_text:`Сенсор ${i + 1} :`

      }

  }


    return sensors;

}

const immutable_copy = function(data_structure_element){

  if (Array.isArray(data_structure_element)){

    let buf_arr = [];

        data_structure_element.forEach(function(item,index){

                buf_arr[index] = immutable_copy(item);

        });

      return buf_arr;


  }else if (typeof (data_structure_element) == 'object'){



        let buf_object = {};

        for (var property in data_structure_element) {
        if (data_structure_element.hasOwnProperty(property)) {

              //if ((typeof(property) != 'array') || (typeof(property) != 'object')){

                Object.defineProperty(buf_object, property, {
                    enumerable: true,
                    configurable: true,
                    writable: true,
                    value: immutable_copy(data_structure_element[property])
                    });


        }
    }

    return buf_object;

  }else{

      let buf;

      buf = data_structure_element;

      return buf;

  }


}


const initialState = init_state();

const  reducer = function (state, action) {

    let sensors = [];

  if (typeof state === 'undefined') state = initialState;


switch (action.type) {

  case 'TRIGGER_EXTENSION_PACK':




          //  sensors = [...state];

            sensors = immutable_copy(state);

            sensors = handler_trigger_extension_pack(sensors,action.payload);



            return sensors;


    break;

    case 'TRIGGER_ROBOT_SENSOR_NAME':




          //    sensors = [...state];

                sensors = immutable_copy(state);

              sensors = handler_trigger_sensor_name(sensors,action.payload);



              return sensors;


      break;

      case 'ROBOT_GET_SENSORS_DATA':


      sensors = immutable_copy(state);

    sensors = handler_robot_get_sensors_data(sensors,action.payload);



    return sensors;


       break;

       case 'TRIGGER_OLD_ANALOG_SENSOR_STATE':


       sensors = immutable_copy(state);

  //   sensors = handler_robot_get_sensors_data(sensors,action.payload);


      sensors[action.payload.caller_sensor_id].sensor_active = !sensors[action.payload.caller_sensor_id].sensor_active;

      if (  sensors[action.payload.caller_sensor_id].sensor_active){


            sensors[action.payload.caller_sensor_id].sensor_name = "line";

      }else{

            sensors[action.payload.caller_sensor_id].sensor_name = "nosensor";

      }


          action.payload.RCA.setRobotSensor(0,action.payload.caller_sensor_id,sensors[action.payload.caller_sensor_id].sensor_name);

     return sensors;


        break;

  default:

      return state;

}




  return state;


}


const handler_robot_get_sensors_data = function (initial_sensors_state,payload){


    let sensors_state = initial_sensors_state;

    sensors_state.forEach(function(sensor,sensor_index){


      if (sensor.sensor_active){

            if (sensor.sensor_name == "color"){


                  sensor.sensor_data = payload.RCA.colorFilter(sensor_index)

            }else{

                  sensor.sensor_data = payload.RCA.getSensorData(sensor_index);

            }


      }


    });


    return sensors_state;

}


const handler_trigger_sensor_name = function (initial_sensors_state,payload){

    let sensors_state = initial_sensors_state;

    let data = payload.sensor_name_data.split("_");

    let sensor_name = data[0].replace("sensor-name-","");
    let sensor_id =   data[1].replace("CallerSensorId-","");

    sensors_state[sensor_id].sensor_name = sensor_name;

    payload.RCA.setRobotSensor(0,sensor_id,sensor_name);

    if (sensor_name != "nosensor"){

          sensors_state[sensor_id].sensor_active = true;

    }else{

      sensors_state[sensor_id].sensor_active = false;
    }


    return sensors_state;
}

const handler_trigger_extension_pack = function (initial_sensors_state,payload){

    let sensors_state = initial_sensors_state;

    sensors_state.map((sensor, index) => {

        sensors_state[index].is_sensor_version_new = !sensors_state[index].is_sensor_version_new;
        sensors_state[index].sensor_active = false;
        sensors_state[index].sensor_name = 'nosensor';

        payload.RCA.setRobotSensor(0,index,'nosensor');


    });

  return sensors_state;
}


export {
    reducer as default,
    initialState as robot_sensors_InitialState
};
