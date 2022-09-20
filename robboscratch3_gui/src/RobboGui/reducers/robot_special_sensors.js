import SensorsAPI from '../sensors_api'

function init_state(){

  let sensors = [];



      sensors[0]= {

            sensor_id:"encoder_left",
            sensor_name: "encoder_left",
            sensor_type: "encoder",
            is_sensor_version_new: true,
            sensor_active: false,
            sensor_data:undefined,
            sensor_device_name:"robot",
            sensor_field_text:`Левый путь :`

      }

      sensors[1]= {

            sensor_id:"encoder_right",
            sensor_name: "encoder_right",
            sensor_type: "encoder",
            is_sensor_version_new: true,
            sensor_active: false,
            sensor_data:undefined,
            sensor_device_name:"robot",
            sensor_field_text:`Правый путь :`

      }

      sensors[2]= {

            sensor_id:"button_start",
            sensor_name: "button_start",
            sensor_type: "button_start",
            is_sensor_version_new: true,
            sensor_active: false,
            sensor_data:undefined,
            sensor_device_name:"robot",
            sensor_field_text:`Кнопка нажата :`

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

  case 'ROBOT_GET_SENSORS_DATA':


      sensors = immutable_copy(state);

      sensors[0].sensor_data = action.payload.RCA.getLeftPath();
      sensors[1].sensor_data = action.payload.RCA.getRightPath();
      sensors[2].sensor_data = action.payload.RCA.getButtonStartPushed();


    return sensors;


   break;



  default:

      return state;

}




  return state;


}





export {
    reducer as default,
    initialState as robot_special_sensors_InitialState

};
