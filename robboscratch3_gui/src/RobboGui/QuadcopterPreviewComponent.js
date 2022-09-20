import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './QuadcopterPreviewComponent.css'
import {ActionTriggerDraggableWindow} from './actions/sensor_actions'



class QuadcopterPreviewComponent extends Component {



  

  onQuadcopterStatusChange(quadcopter_state,quadcopter_is_searching){


    var copter_searching_icon;
    var copter_connection_status;

    copter_searching_icon = document.getElementById(`quadcopter-preview-${this.props.quadcopterIndex}`);

    if (typeof( copter_searching_icon) != 'undefined'){


      if (quadcopter_is_searching){




        

            copter_searching_icon.style.backgroundImage = " url(/build/static/robbo_assets/searching.gif)";
            copter_searching_icon.style.backgroundRepeat = "no-repeat";
            copter_searching_icon.style.backgroundPosition = "center";



      }else{


       
        copter_searching_icon.style.backgroundImage = "";


      }
      copter_connection_status = document.getElementById(`quadcopter-preview-${this.props.quadcopterIndex}`);

      if (quadcopter_state == "connected"){




         copter_connection_status.classList.remove(styles.quadcopter_status_connected);
         copter_connection_status.classList.remove(styles.quadcopter_status_disconnected);
         copter_connection_status.classList.add(styles.quadcopter_status_connected);

      }else{


        copter_connection_status.classList.remove(styles.quadcopter_status_disconnected);
        copter_connection_status.classList.remove(styles.quadcopter_status_connected);
        copter_connection_status.classList.add(styles.quadcopter_status_disconnected);


      }

    }


  }

  componentDidMount () {

      this.isQuadcopterConnected = false;
      this.quadcopter_is_searching = false;

    //  this.startQuadcopterConnectionStatusCheck();

      this.props.QCA.registerQuadcopterStatusChangeCallback(this.onQuadcopterStatusChange.bind(this));

  }




  render() {



    return (

          <div id={`quadcopter-preview-${this.props.quadcopterIndex}`} 
                        
                        className={classNames(

                              {[styles.quadcopterPreview]: true},
                              {[styles.quadcopter_status_connected]: this.isQuadcopterConnected},
                              {[styles.quadcopter_status_disconnected]: !this.isQuadcopterConnected}


                              )} 

                            onClick={this.props.onTriggerQuadcopterPallete}>


                <div id={`quadcopter-${this.props.quadcopterIndex}-preview-pic`}  className={styles.quadcopterPreviewPic} >

                  Q

                </div>

                <div id={`quadcopter-${this.props.quadcopterIndex}-searching-icon`} className={classNames(

                              {[styles.quadcopter_loading_icon]: true},
                              {[styles.quadcopter_loading_icon_hidden]: (/*(this.props.robots[0].robot_connected) || */(!this.quadcopter_is_searching))},
                              {[styles.quadcopter_loading_icon_showing]: ((this.quadcopter_is_searching) /*&& (!this.props.robots[0].robot_connected)*/)}
                                )}>


                </div>


                <div id={`quadcopter-${this.props.quadcopterIndex}-connection-status`}  className={classNames(

                              {[styles.quadcopter_connection_status]: true},
                              {[styles.quadcopter_status_connected]: this.isQuadcopterConnected},
                              {[styles.quadcopter_status_disconnected]: !this.isQuadcopterConnected}


                              )} >



                </div>


          </div>



    );


  }


}


const mapStateToProps =  state => ({


  });

const mapDispatchToProps = dispatch => ({

  onTriggerQuadcopterPallete: () => {

      dispatch(ActionTriggerDraggableWindow(0));
    }


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuadcopterPreviewComponent);
