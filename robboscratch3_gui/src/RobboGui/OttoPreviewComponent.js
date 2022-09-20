import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './OttoPreviewComponent.css'
import {ActionTriggerDraggableWindow} from './actions/sensor_actions'

class OttoPreviewComponent extends Component {


  onOttoStatusChange(otto_state,otto_is_searching){

    var Otto_searching_icon;
    var Otto_connection_status;

    otto_is_searching = false;

    Otto_searching_icon = document.getElementById(`otto-preview-${this.props.ottoIndex}`);

    if (typeof( Otto_searching_icon) != 'undefined'){


      if (false){



            Otto_searching_icon.style.backgroundImage = " url(/build/static/robbo_assets/searching.gif)";
            Otto_searching_icon.style.backgroundRepeat = "no-repeat";
            Otto_searching_icon.style.backgroundPosition = "center";



      }else{


          Otto_searching_icon.style.backgroundImage = "";


      }

      Otto_connection_status = document.getElementById(`otto-preview-${this.props.ottoIndex}`);

      if (otto_state == 6){




         Otto_connection_status.classList.remove(styles.otto_status_connected);
         Otto_connection_status.classList.remove(styles.otto_status_disconnected);
         Otto_connection_status.classList.add(styles.otto_status_connected);

      }else{
        Otto_connection_status.classList.remove(styles.otto_status_disconnected);
        Otto_connection_status.classList.remove(styles.otto_status_connected);
        Otto_connection_status.classList.add(styles.otto_status_disconnected);
      }
    }
  }

  componentDidMount () {

      this.isOttoConnected = false;
      this.otto_is_searching = false;

    //  this.startOttoConnectionStatusCheck();

      this.props.OCA.registerOttoStatusChangeCallback(this.onOttoStatusChange.bind(this));

  }




  render() {



    return (

          <div id={`otto-preview-${this.props.ottoIndex}`} 
          
                      className={classNames(

                              {[styles.ottoPreview]: true},
                              {[styles.otto_status_connected]: this.isOttoConnected},
                              {[styles.otto_status_disconnected]: !this.isOttoConnected}


                              )} 
                              
                        onClick={this.props.onTriggerOttoPallete}>


                <div id={`otto-${this.props.ottoIndex}-preview-pic`}  className={styles.ottoPreviewPic} >

                  

                </div>

                <div id={`otto-${this.props.ottoIndex}-searching-icon`} className={classNames(

                              {[styles.otto_loading_icon]: true},
                              {[styles.otto_loading_icon_hidden]: (/*(this.props.robots[0].robot_connected) || */(!this.otto_is_searching))},
                              {[styles.otto_loading_icon_showing]: ((this.otto_is_searching) /*&& (!this.props.robots[0].robot_connected)*/)}
                                )}>


                </div>


                <div id={`otto-${this.props.ottoIndex}-connection-status`}  className={classNames(

                              {[styles.otto_connection_status]: true},
                              {[styles.otto_status_connected]: this.isOttoConnected},
                              {[styles.otto_status_disconnected]: !this.isOttoConnected}


                              )} >



                </div>


          </div>



    );


  }


}


const mapStateToProps =  state => ({


  });

const mapDispatchToProps = dispatch => ({

  onTriggerOttoPallete: () => {

      dispatch(ActionTriggerDraggableWindow(5));
    }


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OttoPreviewComponent);
