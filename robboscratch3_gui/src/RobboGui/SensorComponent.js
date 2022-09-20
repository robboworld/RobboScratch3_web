import React, { Component } from 'react';
import { connect } from 'react-redux';
import NewVersionSensorComponent from './NewVersionSensorComponent';
import OldVersionSensorComponent from './OldVersionSensorComponent';
import styles from  './SensorComponent.css'



class SensorComponent extends Component {




  render() {

  //  let sensorPictureUrl = `/assets/16/sensor_${this.props.sensors[this.props.sensorId].sensor_name}.png`;

    return (
            <div  className={styles.sensor} id={`${this.props.deviceName}_sensor-${this.props.sensorId}_type-${this.props.sensorType}`} >

          {





            (() => {

                switch (this.props.deviceName) {

                  case "robot":

                      return (this.props.isSensorVersionNew)
                                ?<NewVersionSensorComponent sensorId={this.props.sensorId} sensorPictureUrl={this.props.sensorPictureUrl}  fieldText={this.props.sensorFieldText}
                                sensorName={this.props.sensorName} sensorData={this.props.sensorData}      />

                                :<OldVersionSensorComponent   sensorId={this.props.sensorId} fieldText={this.props.sensorFieldText}
                                sensorName={this.props.sensorName} sensorData={this.props.sensorData}/>



                  break;



                  case "lab":

                          if  (this.props.isSensorVersionNew)
                            return    <NewVersionSensorComponent sensorId={this.props.sensorId} sensorPictureUrl={this.props.sensorPictureUrl}  fieldText={this.props.sensorFieldText}
                                            sensorName={this.props.sensorName} sensorData={this.props.sensorData}      />



                  break;

                  default:

                  break;
                }
              })()




            }


              </div>

            );





    };




  }





  // const mapStateToProps =  state => ({
  //
  //       sensors:state.scratchGui.sensors,
  //
  //   });
  //
  // const mapDispatchToProps = dispatch => ({
  //
  //
  // });

  export default SensorComponent;
