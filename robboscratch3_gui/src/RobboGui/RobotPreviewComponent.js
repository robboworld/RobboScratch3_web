import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './RobotPreviewComponent.css'
import {ActionTriggerDraggableWindow} from './actions/sensor_actions'



class RobotPreviewComponent extends Component {



  onRobotStatusChange(robot_state,is_robot_searching){

    var robot_searching_icon;
    var robot_connection_status;

    is_robot_searching = false;

    //robot_searching_icon = document.getElementById(`robot-${this.props.robotIndex}-searching-icon`);
    robot_searching_icon = document.getElementById(`robot-preview-${this.props.robotIndex}`);


    if (typeof(robot_searching_icon) != 'undefined'){

      if (is_robot_searching){




        //  robot_searching_icon.classList.remove(styles.robot_loading_icon_hidden);
        //  robot_searching_icon.classList.remove(styles.robot_loading_icon_showing);
        //  robot_searching_icon.classList.add(styles.robot_loading_icon_showing);

            robot_searching_icon.style.backgroundImage = " url(/build/static/robbo_assets/searching.gif)";
            robot_searching_icon.style.backgroundRepeat = "no-repeat";
            robot_searching_icon.style.backgroundPosition = "center";



      }else{


        // robot_searching_icon.classList.remove(styles.robot_loading_icon_hidden);
        // robot_searching_icon.classList.remove(styles.robot_loading_icon_showing);
        // robot_searching_icon.classList.add(styles.robot_loading_icon_hidden);

         robot_searching_icon.style.backgroundImage = "";


      }

     // robot_connection_status = document.getElementById(`robot-${this.props.robotIndex}-connection-status`);
       robot_connection_status = document.getElementById(`robot-preview-${this.props.robotIndex}`);

    

      if (robot_state == 6){




         robot_connection_status.classList.remove(styles.robot_status_connected);
         robot_connection_status.classList.remove(styles.robot_status_disconnected);
         robot_connection_status.classList.add(styles.robot_status_connected);

      }else{


        robot_connection_status.classList.remove(styles.robot_status_disconnected);
        robot_connection_status.classList.remove(styles.robot_status_connected);
        robot_connection_status.classList.add(styles.robot_status_disconnected);


      }


    }


  }

  componentDidMount () {

      this.isRobotConnected = false;
      this.robot_is_searching = false;

    //  this.startRobotConnectionStatusCheck();

    this.props.RCA.registerRobotStatusChangeCallback(this.onRobotStatusChange.bind(this));



  }




  render() {



    return (

          <div id={`robot-preview-${this.props.robotIndex}`} 
          
          className={classNames(

                              {[styles.robotPreview]: true},
                              {[styles.robot_status_connected]: this.isrobotConnected},
                              {[styles.robot_status_disconnected]: !this.isrobotConnected}
                                )} 
          
          
            onClick={this.props.onTriggerRobotPallete}>


                <div id={`robot-${this.props.robotIndex}-preview-pic`}  className={styles.robotPreviewPic} >

                    

                </div>

                <div id={`robot-${this.props.robotIndex}-searching-icon`} className={classNames(

                              {[styles.robot_loading_icon]: true},
                              {[styles.robot_loading_icon_hidden]: (/*(this.props.robots[0].robot_connected) || */(!this.robot_is_searching))},
                              {[styles.robot_loading_icon_showing]: ((this.robot_is_searching) /*&& (!this.props.robots[0].robot_connected)*/)}
                                )}>


                </div>


                <div id={`robot-${this.props.robotIndex}-connection-status`}  className={classNames(

                              {[styles.robot_connection_status]: true},
                              {[styles.robot_status_connected]: this.isrobotConnected},
                              {[styles.robot_status_disconnected]: !this.isrobotConnected}


                              )} >



                </div>


          </div>



    );


  }


}


const mapStateToProps =  state => ({


  });

const mapDispatchToProps = dispatch => ({

  onTriggerRobotPallete: () => {

      dispatch(ActionTriggerDraggableWindow(1));
    }


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RobotPreviewComponent);
