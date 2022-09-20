
import {immutable_copy,color_filter} from '../lib/lib.js';


const initialState = {

  isShowing:false,
  sensor_caller_id:0,
  position_top: 200,
  position_left: 200,
  tables: []

};

const  reducer = function (state, action) {



  if (typeof state === 'undefined') state = initialState;


  let color_corrector_table_state = {};


switch (action.type) {

  case 'TRIGGER_COLOR_CORRECTOR_TABLE':




  color_corrector_table_state = immutable_copy(state);

  color_corrector_table_state.isShowing = !color_corrector_table_state.isShowing;
  color_corrector_table_state.sensor_caller_id = action.payload.sensor_caller_id;



  return color_corrector_table_state;


    break;

  case 'COLOR_CORRECTOR_TABLE_DROP':




    color_corrector_table_state = immutable_copy(state);


    color_corrector_table_state.position_top = action.payload.position_top;
    color_corrector_table_state.position_left = action.payload.position_left;


    return color_corrector_table_state;


      break;


  default:

      return state;

}




  return state;


}


export {
    reducer as default,
    initialState as color_corrector_table_InitialState

};
