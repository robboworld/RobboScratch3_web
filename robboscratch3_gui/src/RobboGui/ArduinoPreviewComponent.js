import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './ArduinoPreviewComponent.css'
import {ActionTriggerDraggableWindow} from './actions/sensor_actions'

class ArduinoPreviewComponent extends Component {


  onArduinoStatusChange(arduino_state,arduino_is_searching){

    var Arduino_searching_icon;
    var Arduino_connection_status;

    arduino_is_searching = false;

    Arduino_searching_icon = document.getElementById(`arduino-preview-${this.props.arduinoIndex}`);

    if (typeof( Arduino_searching_icon) != 'undefined'){


      if (arduino_is_searching){





            Arduino_searching_icon.style.backgroundImage = " url(/build/static/robbo_assets/searching.gif)";
            Arduino_searching_icon.style.backgroundRepeat = "no-repeat";
            Arduino_searching_icon.style.backgroundPosition = "center";



      }else{



         Arduino_searching_icon.style.backgroundImage = "";


      }


      Arduino_connection_status = document.getElementById(`arduino-preview-${this.props.arduinoIndex}`);

      if (arduino_state == 6){




         Arduino_connection_status.classList.remove(styles.arduino_status_connected);
         Arduino_connection_status.classList.remove(styles.arduino_status_disconnected);
         Arduino_connection_status.classList.add(styles.arduino_status_connected);

      }else{
        Arduino_connection_status.classList.remove(styles.arduino_status_disconnected);
        Arduino_connection_status.classList.remove(styles.arduino_status_connected);
        Arduino_connection_status.classList.add(styles.arduino_status_disconnected);
      }
    }
  }

  componentDidMount () {

      this.isArduinoConnected = false;
      this.arduino_is_searching = false;

    //  this.startArduinoConnectionStatusCheck();

      this.props.ACA.registerArduinoStatusChangeCallback(this.onArduinoStatusChange.bind(this));

  }




  render() {



    return (

          <div id={`arduino-preview-${this.props.arduinoIndex}`} 
          
                      className={classNames(

                              {[styles.arduinoPreview]: true},
                              {[styles.arduino_status_connected]: this.isArduinoConnected},
                              {[styles.arduino_status_disconnected]: !this.isArduinoConnected}


                              )} 
                          
                         onClick={this.props.onTriggerArduinoPallete}>


                <div id={`arduino-${this.props.arduinoIndex}-preview-pic`}  className={styles.arduinoPreviewPic} >

                  

                </div>

                <div id={`arduino-${this.props.arduinoIndex}-searching-icon`} className={classNames(

                              {[styles.arduino_loading_icon]: true},
                              {[styles.arduino_loading_icon_hidden]: (/*(this.props.robots[0].robot_connected) || */(!this.arduino_is_searching))},
                              {[styles.arduino_loading_icon_showing]: ((this.arduino_is_searching) /*&& (!this.props.robots[0].robot_connected)*/)}
                                )}>


                </div>


                <div id={`arduino-${this.props.arduinoIndex}-connection-status`}  className={classNames(

                              {[styles.arduino_connection_status]: true},
                              {[styles.arduino_status_connected]: this.isArduinoConnected},
                              {[styles.arduino_status_disconnected]: !this.isArduinoConnected}


                              )} >



                </div>


          </div>



    );


  }


}


const mapStateToProps =  state => ({


  });

const mapDispatchToProps = dispatch => ({

  onTriggerArduinoPallete: () => {

      dispatch(ActionTriggerDraggableWindow(6));
    }


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArduinoPreviewComponent);
