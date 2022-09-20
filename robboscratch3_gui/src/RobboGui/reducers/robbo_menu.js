import {immutable_copy,color_filter} from '../lib/lib.js';


const initialState = {

  isShowing:false,


};

const  reducer = function (state, action) {



  if (typeof state === 'undefined') state = initialState;


  let robbo_menu_state = {};


switch (action.type) {

  case 'TRIGGER_ROBBO_MENU':



  robbo_menu_state = immutable_copy(state);

  robbo_menu_state.isShowing = !robbo_menu_state.isShowing;




  return robbo_menu_state;



    break;




  default:

      return state;

}




  return state;


}


export {
    reducer as default,
    initialState as robbo_menu_InitialState

};
