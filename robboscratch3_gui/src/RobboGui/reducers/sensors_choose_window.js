

const initialState = {
  sensors_choose_window_showing:false,
  sensors_choose_window_drag_top:400,
  sensors_choose_window_drag_left:400,
  sensors_choose_window_sensor_caller:0,
  sensors_choose_window_sensor_caller_type:"ANALOG",
  sensors_choose_window_sensor_caller_device_name:"robot"

};

const  reducer = function (state, action) {



  if (typeof state === 'undefined') state = initialState;


  let sensors_choose_window_state = {};


switch (action.type) {

  case 'TRIGGER_SENSOR_CHOOSE_WINDOW':




  sensors_choose_window_state = Object.assign({}, state);;

  sensors_choose_window_state.sensors_choose_window_showing = !sensors_choose_window_state.sensors_choose_window_showing;
  sensors_choose_window_state.sensors_choose_window_sensor_caller = action.payload.caller_sensor_id;
  sensors_choose_window_state.sensors_choose_window_sensor_caller_device_name = action.payload.sensor_caller_device_name;
  sensors_choose_window_state.sensors_choose_window_sensor_caller_type= action.payload.sensor_caller_type;



  return sensors_choose_window_state;


    break;


    case 'HIDE_SENSOR_CHOOSE_WINDOW':




    sensors_choose_window_state = Object.assign({}, state);;

    sensors_choose_window_state.sensors_choose_window_showing = false;




    return sensors_choose_window_state;


      break;

    case 'DROP_SENSOR_CHOOSE_WINDOW':



    console.log('reducer: DROP_SENSOR_CHOOSE_WINDOW');
    sensors_choose_window_state = Object.assign({}, state);

    sensors_choose_window_state.sensors_choose_window_drag_top = action.payload.top;
    sensors_choose_window_state.sensors_choose_window_drag_left = action.payload.left;



    return sensors_choose_window_state;


      break;

  default:

      return state;

}




  return state;


}


export {
    reducer as default,
    initialState as sensors_choose_window_InitialState

};
