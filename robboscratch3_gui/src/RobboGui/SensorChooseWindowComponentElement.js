import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import styles from './SensorChooseWindowComponentElement.css';
import {ActionTriggerSensorName} from './actions/sensor_actions'




class SensorChooseWindowComponentElement extends Component {


  ChooseSensorType(){

      console.log('ChooseSensorName()2');
      let str = ReactDOM.findDOMNode(this).id;
      let id = str[str.indexOf("rId-")+4];
      let sens = str.slice(18,str.indexOf("_"));
      this.props.Vm.runtime.sens_list[+id]=sens;
      this.props.onSensorNameChoosen(ReactDOM.findDOMNode(this).id);

      ;

  }

  render() {



    return (

              <div className={styles.sensor_choose_window_component_element} id={`${this.props.deviceName}-sensor-name-${this.props.sensorName}_CallerSensorId-${this.props.CallerSensorId}`} onClick = {this.ChooseSensorType.bind(this)} >


                  <img src = {`${this.props.sensorPictureUrl}`} />

              </div>

            );





    };




  }





  const mapStateToProps =  state => ({

        // sensors:state.scratchGui.sensors,
        // sensors_choose_window:state.scratchGui.sensors_choose_window
    });

  const mapDispatchToProps = dispatch => ({

    onSensorNameChoosen: (payload) => {

        dispatch(ActionTriggerSensorName(payload));
      }


  });

  export default connect(
    mapStateToProps,
    mapDispatchToProps
  )(SensorChooseWindowComponentElement);
