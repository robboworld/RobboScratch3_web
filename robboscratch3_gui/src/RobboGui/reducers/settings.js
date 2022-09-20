const initialState = {

  is_lab_ext_enabled:false,
  robot_is_scratchduino:false



};

const  reducer = function (state, action) {



  if (typeof state === 'undefined') state = initialState;


  let   settings_state = {};


switch (action.type) {

  case 'TRIGGER_LAB_EXT_SENSORS':


  settings_state = Object.assign({}, state);

  settings_state.is_lab_ext_enabled = !settings_state.is_lab_ext_enabled;



  return   settings_state;


    break;

    case 'HIDE_NONE_SCRATCHDUINO_BLOCKS':


    settings_state = Object.assign({}, state);


    settings_state.robot_is_scratchduino = true;


    return   settings_state;

    case 'SHOW_ROBBO_BLOCKS':


    settings_state = Object.assign({}, state);


    settings_state.robot_is_scratchduino = false;


    return   settings_state;


      break;


    // case 'TRIGGER_NEED_LABGUAGE_RELOAD':
    //
    //
    // sensors_pallete_state = Object.assign({}, state);
    //
    // sensors_pallete_state.need_language_reload= !sensors_pallete_state.need_language_reload;
    //
    //
    //
    // return sensors_pallete_state;
    //
    //
    //   break;



  default:

      return state;

}




  return state;


}


export {
    reducer as default,
    initialState as settings_InitialState

};
