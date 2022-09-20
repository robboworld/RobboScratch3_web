

const initialState = {

  sensors_pallete_collapsed:false,


};

const  reducer = function (state, action) {



  if (typeof state === 'undefined') state = initialState;


  let sensors_pallete_state = {};


switch (action.type) {

  case 'TRIGGER_SENSORS_PALETTE':


  sensors_pallete_state = Object.assign({}, state);

 sensors_pallete_state.sensors_pallete_collapsed = !sensors_pallete_state.sensors_pallete_collapsed;



  return sensors_pallete_state;


    break;



  default:

      return state;

}




  return state;


}


export {
    reducer as default,
    initialState as sensors_palette_InitialState

};
