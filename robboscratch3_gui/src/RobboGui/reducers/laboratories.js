function init_state(){

  let laboratories = [];
  let laboratories_count = 1;
  let i = 0;

  for (i=0;i<laboratories_count;i++){

      laboratories[i]= {

            laboratory_number:i,
            laboratory_status: "DISCONNECTED",
            laboratory_connected: false,
            laboratory_is_searching:false


      }

  }


    return laboratories;

}


const initialState = init_state();

const  reducer = function (state, action) {

    let laboratories = [];

  if (typeof state === 'undefined') state = initialState;


switch (action.type) {

  case 'LABORATORY_CONNECTION_STATUS_CHECK':




            laboratories = [...state];



            laboratories[0].laboratory_connected =   action.payload.LCA.isLaboratoryConnected(0);
            laboratories[0].laboratory_is_searching   =   action.payload.LCA.isLaboratorySearching();


            return laboratories;


    break;






  default:

      return state;

}




  return state;


}





export {
    reducer as default,
    initialState as laboratories_InitialState

};
