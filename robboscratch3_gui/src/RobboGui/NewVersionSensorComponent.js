import classNames from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styles from  './SensorComponent.css';
import CommonFieldsSensorComponent from './CommonFieldsSensorComponent';
import {ActionTriggerSensorChooseWindow} from './actions/sensor_actions';


class NewVersionSensorComponent extends Component {

  //Sensors from extension pack


  ChooseSensorName(){

    console.log('ChooseSensorName1()');

  //  let sensor_caller_id = Number.parseInt(ReactDOM.findDOMNode(this).parentElement.id.replace("sensor-",""));

    this.props.onSensorNameChoosen(ReactDOM.findDOMNode(this).parentElement.id);


  }


  render() {

      //const {sensorPictureUrl} = this.props;




      return  (

                    <div>

                        <CommonFieldsSensorComponent NameFieldText={`${this.props.fieldText}`} sensorId={this.props.sensorId}
                            sensorName={this.props.sensorName} sensorData={this.props.sensorData} />

                        <div  className={classNames(

                                        {[styles.sensor_block_field]: true},
                                        {[styles.sensor_choose_icon]: true}
                                        //{[styles.sensor_choose_window.window_show.window_drag]: isDragging}

                                        )}

                                  onClick = {this.ChooseSensorName.bind(this)}>

                            <img src={`${this.props.sensorPictureUrl}`} />

                        </div>


                    </div>

                );
}

}

const mapStateToProps =  state => ({


});

const mapDispatchToProps = dispatch => ({

  onSensorNameChoosen: (payload) => {

      dispatch(ActionTriggerSensorChooseWindow(payload));
    }

});

export default connect(

  mapStateToProps,
  mapDispatchToProps

)(NewVersionSensorComponent);
