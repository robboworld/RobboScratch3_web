import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './RobotPalleteComponent.css';
import SensorDataBlockComponent  from './SensorDataBlockComponent';
import SensorComponent from './SensorComponent';

import {ActionRobotGetDataStart} from  './actions/sensor_actions';
import {ActionTriggerDraggableWindow} from './actions/sensor_actions';
import {ActionSetRCALocal}  from './actions/sensor_actions';
import {ActionHideNoneScratchduinoBlocks} from './actions/sensor_actions';
import {ActionShowRobboBlocks} from './actions/sensor_actions';

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';



const messages = defineMessages({

    sensor: {
        id: 'gui.RobboGui.RobotPalette.sensor',
        description: ' ',
        defaultMessage: 'Sensor '
    },

    path_left: {
        id: 'gui.RobboGui.RobotPalette.path_left',
        description: ' ',
        defaultMessage: 'Path left: '
    },

    path_right: {
        id: 'gui.RobboGui.RobotPalette.path_right',
        description: ' ',
        defaultMessage: 'Path right: '
    },

    start_button_pushed: {
        id: 'gui.RobboGui.RobotPalette.start_button_pushed',
        description: ' ',
        defaultMessage: 'Start button pushed: '
    },
    robot: {
        id: 'gui.RobboGui.RobotPalette.robot',
        description: ' ',
        defaultMessage: 'Robot'
    },
    true: {
        id: 'gui.RobboGui.true',
        description: ' ',
        defaultMessage: 'true'
    },
    false: {
        id: 'gui.RobboGui.false',
        description: ' ',
        defaultMessage: 'false'
    }

  });


class RobotPalleteComponent extends Component {

  constructor(){

     super();

     this.getDataInterval = null;
  }



  startGetDataLoop(){





  }

  shouldComponentUpdate (nextProps, nextState) {
      return (

        this.props.draggable_window[1].isShowing !== false


      );
  }

  componentDidMount(){


    console.log("startRobotGetData");
  //  this.props.startRobotGetData(0,this.props.RCA);

   

  this.props.setRCALocal(this.props.RCA);

  this.robotGetDataStart();

 this.props.RCA.registerRobotIsScratchduinoCallback(this.props.onRobotIsScratchduino);
 this.props.RCA.registerRobotIsRobboCallback(this.props.onRobotIsRobbo);

  }


componentDidUpdate(){

  this.sensors_values_field_list = [];
  var sensor;

  sensor = document.getElementById(`${this.props.robot_special_sensors[0].sensor_device_name}_sensor-data-block-${this.props.robot_special_sensors[0].sensor_id}_type-${this.props.robot_special_sensors[0].sensor_type}`);

  this.sensors_values_field_list[0] = sensor.children[0].children[1].children[0];


 sensor = document.getElementById(`${this.props.robot_special_sensors[1].sensor_device_name}_sensor-data-block-${this.props.robot_special_sensors[1].sensor_id}_type-${this.props.robot_special_sensors[1].sensor_type}`);

  this.sensors_values_field_list[1] = sensor.children[0].children[1].children[0];


  sensor = document.getElementById(`${this.props.robot_special_sensors[2].sensor_device_name}_sensor-data-block-${this.props.robot_special_sensors[2].sensor_id}_type-${this.props.robot_special_sensors[2].sensor_type}`);

  this.sensors_values_field_list[2] = sensor.children[0].children[1].children[0];


  for (let index = 0; index < this.props.robot_sensors.length; index++ ){

    sensor = document.getElementById(`${this.props.robot_sensors[index].sensor_device_name}_sensor-${this.props.robot_sensors[index].sensor_id}_type-${this.props.robot_sensors[index].sensor_type}`);

    this.sensors_values_field_list[3+ index] = sensor.children[0].children[0].children[1].children[0];

  }

}

  onThisWindowClose(){

    console.log("RobotPalette close");
    this.props.onRobotPaletteWindowClose(1);

  }

  robotGetData(){

    var sensors_values_field_list =   this.sensors_values_field_list;

    if (this.props.draggable_window[1].isShowing == true){

          sensors_values_field_list[0].innerHTML = this.props.RCA.getLeftPath();
          sensors_values_field_list[1].innerHTML = this.props.RCA.getRightPath();
          sensors_values_field_list[2].innerHTML = (this.props.RCA.getButtonStartPushed() == "true")?this.props.intl.formatMessage(messages.true):this.props.intl.formatMessage(messages.false);


          for (let index = 0; index < this.props.robot_sensors.length; index++ ){


              if (this.props.robot_sensors[index].sensor_active){

                let sensor_data;


                if (this.props.robot_sensors[index].sensor_name == "color"){


                      sensor_data = this.props.RCA.colorFilter(index);

                      if (sensor_data[0] == -1){

                        sensors_values_field_list[3+index].innerHTML = "---";
                        sensors_values_field_list[3+index].style.backgroundColor =  `rgb(255,255,255)`;
                        sensors_values_field_list[3+index].style.minWidth = `0px`;
                        sensors_values_field_list[3+index].style.minHeight = `0px`;
                        sensors_values_field_list[3+index].style.border = '0px';

                      }else{

                        sensors_values_field_list[3+index].style.backgroundColor =  `rgb(${sensor_data[0]},${sensor_data[1]},${sensor_data[2]})`;
                        sensors_values_field_list[3+index].style.minWidth = `15px`;
                        sensors_values_field_list[3+index].style.minHeight = `15px`;
                        sensors_values_field_list[3+index].style.border = '2px solid';
                        sensors_values_field_list[3+index].innerHTML = "";

                      }

                }else{

                      sensor_data = this.props.RCA.getSensorData(index);

                      sensors_values_field_list[3+index].innerHTML = sensor_data;

                }

              }


          }


    }




  }

  robotGetDataStart(){

    this.sensors_values_field_list = [];
    var sensor;

    sensor = document.getElementById(`${this.props.robot_special_sensors[0].sensor_device_name}_sensor-data-block-${this.props.robot_special_sensors[0].sensor_id}_type-${this.props.robot_special_sensors[0].sensor_type}`);

    this.sensors_values_field_list[0] = sensor.children[0].children[1].children[0];


  sensor = document.getElementById(`${this.props.robot_special_sensors[1].sensor_device_name}_sensor-data-block-${this.props.robot_special_sensors[1].sensor_id}_type-${this.props.robot_special_sensors[1].sensor_type}`);

    this.sensors_values_field_list[1] = sensor.children[0].children[1].children[0];


    sensor = document.getElementById(`${this.props.robot_special_sensors[2].sensor_device_name}_sensor-data-block-${this.props.robot_special_sensors[2].sensor_id}_type-${this.props.robot_special_sensors[2].sensor_type}`);

    this.sensors_values_field_list[2] = sensor.children[0].children[1].children[0];


    for (let index = 0; index < this.props.robot_sensors.length; index++ ){

      sensor = document.getElementById(`${this.props.robot_sensors[index].sensor_device_name}_sensor-${this.props.robot_sensors[index].sensor_id}_type-${this.props.robot_sensors[index].sensor_type}`);

      this.sensors_values_field_list[3+ index] = sensor.children[0].children[0].children[1].children[0];

    }

     this.getDataInterval =  setInterval(() => {

          this.robotGetData.call(this);

      },50);

  }

  render() {

  let sensor_data = "";

  if (this.props.robot_special_sensors[2].sensor_data == "false"){

    sensor_data = this.props.intl.formatMessage(messages.false);

  }else if (this.props.robot_special_sensors[2].sensor_data == "true"){

      sensor_data = this.props.intl.formatMessage(messages.true);

  }else{

    //  sensor_data =this.props.robot_special_sensors[2].sensor_data;

    sensor_data = this.props.intl.formatMessage(messages.false);

  }


    return (



      <div id="robot-1" className={styles.robot_palette}>


            <div id="robot-tittle" className={styles.robot_panel_tittle}>

              {this.props.intl.formatMessage(messages.robot)}

              <div className={styles.close_icon} onClick={this.onThisWindowClose.bind(this)}>


              </div>

            </div>

            <SensorDataBlockComponent key={this.props.robot_special_sensors[0].sensor_id} sensorId={this.props.robot_special_sensors[0].sensor_id}
                               deviceName={this.props.robot_special_sensors[0].sensor_device_name} sensorType={this.props.robot_special_sensors[0].sensor_type}
                               sensorFieldText={this.props.intl.formatMessage(messages.path_left)}
                               sensorName={this.props.robot_special_sensors[0].sensor_name}
                                sensorData={this.props.robot_special_sensors[0].sensor_data} />

            <SensorDataBlockComponent key={this.props.robot_special_sensors[1].sensor_id} sensorId={this.props.robot_special_sensors[1].sensor_id}
                                                  deviceName={this.props.robot_special_sensors[1].sensor_device_name} sensorType={this.props.robot_special_sensors[1].sensor_type}
                                                  sensorFieldText={this.props.intl.formatMessage(messages.path_right)}
                                                  sensorName={this.props.robot_special_sensors[1].sensor_name}
                                                  sensorData={this.props.robot_special_sensors[1].sensor_data} />

        {


              this.props.robot_sensors.map((sensor, index) =>

                 {

                   let sensorPictureUrl = `./static/robbo_assets/16/${sensor.sensor_device_name}_sensor_${sensor.sensor_name}.png`;

                    let field_text  = this.props.intl.formatMessage(messages.sensor) + " "  + (index + 1).toString() + ": ";

                   return   <SensorComponent key={index} index={index} sensorId={sensor.sensor_id} isSensorVersionNew={sensor.is_sensor_version_new}
                               sensorPictureUrl={sensorPictureUrl}
                               deviceName={sensor.sensor_device_name} sensorType={sensor.sensor_type}
                               sensorFieldText={field_text} sensorName={sensor.sensor_name}
                               sensorData={sensor.sensor_data} />



                 }

             )




        }


        <SensorDataBlockComponent key={this.props.robot_special_sensors[2].sensor_id} sensorId={this.props.robot_special_sensors[2].sensor_id}
                           deviceName={this.props.robot_special_sensors[2].sensor_device_name} sensorType={this.props.robot_special_sensors[2].sensor_type}
                           sensorFieldText={this.props.intl.formatMessage(messages.start_button_pushed)}
                           sensorName={this.props.robot_special_sensors[2].sensor_name}
                           sensorData={sensor_data} />

      </div>


    );


  }


}


const mapStateToProps =  state => ({


  robot_sensors:state.scratchGui.robot_sensors,
  robot_special_sensors:state.scratchGui.robot_special_sensors,
  draggable_window:state.scratchGui.draggable_window

  });

const mapDispatchToProps = dispatch => ({

  startRobotGetData: (robot_number,RCA) => {

      dispatch(ActionRobotGetDataStart(robot_number,RCA));

  },

  onRobotPaletteWindowClose: () => {

      dispatch(ActionTriggerDraggableWindow(1));
    },

    setRCALocal: (RCA) => {

          dispatch(ActionSetRCALocal(RCA));

    },

    onRobotIsScratchduino: () => {

      dispatch(ActionHideNoneScratchduinoBlocks());

    },

    onRobotIsRobbo: () => {

      dispatch(ActionShowRobboBlocks());

    }

});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(RobotPalleteComponent));
