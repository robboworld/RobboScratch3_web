function init_state(){

  let draggable_windows = [];
  let draggable_windows_count = 7;
  let i = 0;

  for (i=0;i<draggable_windows_count;i++){

      draggable_windows[i]= {

             position_top:200,
             position_left: 200,
             isShowing: false



      }

  }


    return draggable_windows;

}


const initialState = init_state();

const  reducer = function (state, action) {

    let draggable_windows = [];

  if (typeof state === 'undefined') state = initialState;


switch (action.type) {

  case 'DRAGGABLE_WINDOW_TRIGGER':




            draggable_windows = [...state];


            var draggable_window_id =  action.payload.draggable_window_id;


            draggable_windows[draggable_window_id].isShowing = !draggable_windows[draggable_window_id].isShowing;



            return draggable_windows;


    break;



    case 'DRAGGABLE_WINDOW_DROP':




      draggable_windows = [...state];

      var draggable_window_id =  action.payload.draggable_window_id;


      draggable_windows[ draggable_window_id].position_top = action.payload.position_top;
      draggable_windows[ draggable_window_id].position_left = action.payload.position_left;


      return draggable_windows;


        break;


        case 'DRAGGABLE_WINDOW_CREATE':




          draggable_windows = [...state];

            var draggable_window_id =  action.payload.draggable_window_id;


            if (typeof(draggable_windows[draggable_window_id]) === 'undefined'){

              draggable_windows[draggable_window_id]= {

                     position_top:400,
                     position_left: 400,
                     isShowing: false



              }

            }







          return draggable_windows;


            break;




  default:

      return state;

}




  return state;


}





export {
    reducer as default,
    initialState as draggable_window_InitialState

};
