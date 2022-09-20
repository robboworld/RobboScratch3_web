function init_state(){

  let robots = [];
  let robots_count = 1;
  let i = 0;

  for (i=0;i<robots_count;i++){

      robots[i]= {

            robot_number:i,
            robot_status: "DISCONNECTED",
            robot_connected: false,
            robot_is_searching:false


      }

  }


    return robots;

}


const initialState = init_state();

const  reducer = function (state, action) {

    let robots = [];

  if (typeof state === 'undefined') state = initialState;


switch (action.type) {

  case 'ROBOT_CONNECTION_STATUS_CHECK':




            robots = [...state];



            robots[0].robot_connected     =   action.payload.RCA.isRobotConnected(0);
            robots[0].robot_is_searching  =   action.payload.RCA.isRobotSearching();


            return robots;


    break;

    case 'ROBOT_SEARCH_DEVICES':




              robots = [...state];


              action.payload.RCA.searchRobotDevices();


              return robots;


      break;

      case 'ROBOT_STOP_SEARCH_PROCESS':




                robots = [...state];


                action.payload.RCA.stopSearchProcess();


                return robots;


        break;



        case 'ROBOT_STOP_DATA_RECIEVING_PROCESS':




                  robots = [...state];


                  action.payload.RCA.stopDataRecievingProcess();


                  return robots;


          break;




  default:

      return state;

}




  return state;


}





export {
    reducer as default,
    initialState as robots_InitialState
};
