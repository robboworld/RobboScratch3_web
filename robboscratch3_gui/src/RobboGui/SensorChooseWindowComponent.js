import classNames from 'classnames';
import React  from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import  SensorChooseWindowComponentElement from './SensorChooseWindowComponentElement'
import  styles from './SensorChooseWindowComponent.css';

import PropTypes from 'prop-types';
import { ItemTypes } from './drag_constants';
import { DragSource } from 'react-dnd';

const SensorChooseWindowSource = {
  beginDrag(props) {
    return {

          element_type: ItemTypes.SENSOR_CHOOSE_WINDOW
    };
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}




class SensorChooseWindowComponent extends Component {





  render() {

    const { connectDragSource, isDragging, isShowing,top,left,CallerSensorId,SensorCallerDeviceName,CallerSensorType } = this.props;

    //let showing_state = isShowing? styles.sensor_choose_window.window_show: styles.sensor_choose_window.window_hide;
  //  let final_state = isDragging? styles.sensor_choose_window.window_show.window_drag:showing_state;
    var i = 0;



             return connectDragSource(

                <div    className={classNames(

                              {[styles.sensor_choose_window]: true},
                              {[styles.window_show]: isShowing},
                              {[styles.window_hide]: !isShowing},
                              {[styles.window_drag]: isDragging}

                              )}

                        style={{

                              position: 'absolute',
                              top: `${top}px`,
                              left: `${left}px`,
                              }}>


                  <div className={styles.sensor_choose_window_tittle}>

                      Sensor type

                  </div>

                  <div className={styles.sensor_choose_window_components_block}>

                    {


                      (() => {

                        let elements = [];
                        let sensor_names = (SensorCallerDeviceName == "robot")? ["nosensor","line","led","light","touch","proximity","ultrasonic","color"]:["nosensor","clamps","temperature"];

                      //  console.log("SensorCallerDeviceName: " + SensorCallerDeviceName + " CallerSensorType: " + CallerSensorType)

                        if ((SensorCallerDeviceName !== "robot") && (CallerSensorType == "DIGITAL")) {

                              sensor_names = sensor_names.filter(

                                  (element,index) => {

                                    //  console.log("element: " + element);
                                        return  (element !== "temperature")
                                  }

                              );

                        }

                           sensor_names.map((sensor_name, index) =>

                                {

                                  elements.push(<SensorChooseWindowComponentElement deviceName={`${SensorCallerDeviceName}`} sensorName={`${sensor_name}`} key={`SensorChooseWindowComponentElement-${index}`} sensorPictureUrl={`./static/robbo_assets/32/${SensorCallerDeviceName}_sensor_${sensor_name}.png`}
                                    CallerSensorId={CallerSensorId}/>);


                                });










                        return elements;

                      })()




                    }




                  </div>



                </div>

            );







    };




  }


  SensorChooseWindowComponent.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    isShowing: PropTypes.bool.isRequired,
    top: PropTypes.number.isRequired,
    left: PropTypes.number.isRequired,
    CallerSensorId: PropTypes.number.isRequired,
    SensorCallerDeviceName: PropTypes.string.isRequired,
    CallerSensorType: PropTypes.string.isRequired

  };


export default DragSource(ItemTypes.SENSOR_CHOOSE_WINDOW, SensorChooseWindowSource, collect)(SensorChooseWindowComponent);
