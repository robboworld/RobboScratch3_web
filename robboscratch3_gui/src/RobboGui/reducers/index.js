import { combineReducers } from 'redux';

import robot_sensors from './robot_sensors';
import lab_external_sensors from './lab_external_sensors';
import robot_special_sensors  from './robot_special_sensors'
import lab_special_sensors  from './lab_special_sensors'
import trash_reducer from './trash_reducer';
import sensors_choose_window from './sensors_choose_window';


export default combineReducers({

  robot_sensors:robot_sensors,
  lab_external_sensors:lab_external_sensors,
  robot_special_sensors: robot_special_sensors,
  lab_special_sensors: lab_special_sensors,
  trash_reducer:trash_reducer,
  sensors_choose_window:sensors_choose_window

});
