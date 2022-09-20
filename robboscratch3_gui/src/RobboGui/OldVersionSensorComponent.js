import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styles from  './SensorComponent.css'
import CommonFieldsSensorComponent from './CommonFieldsSensorComponent';
import {ActionTriggerOldAnalogSensorState} from './actions/sensor_actions';


class OldVersionSensorComponent extends Component {

  triggerOldAnalogSensorState(){

    console.log("triggerOldAnalogSensorState");
    this.props.triggerOldAnalogSensorState(ReactDOM.findDOMNode(this).parentElement.id);

  }


  render() {

      return  (




        <div>

            <CommonFieldsSensorComponent NameFieldText={`${this.props.fieldText}`} sensorId={this.props.sensorId}
              sensorName={this.props.sensorName} sensorData={this.props.sensorData} />

            <div className={styles.sensor_block_field}>

                <input type="checkbox" onChange={this.triggerOldAnalogSensorState.bind(this)} />

            </div>


        </div>








              );
}

}

const mapStateToProps =  state => ({


  sensorsChooseWindow:state.scratchGui.sensors_choose_window,
  sensorsPalette:state.scratchGui.sensors_palette


  });

const mapDispatchToProps = dispatch => ({

  triggerOldAnalogSensorState: (payload) => {

      dispatch(ActionTriggerOldAnalogSensorState(payload));
    }







});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OldVersionSensorComponent);

//export default OldVersionSensorComponent;
