import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './LaboratoryPreviewComponent.css'
import {ActionTriggerDraggableWindow} from './actions/sensor_actions'



class LaboratoryPreviewComponent extends Component {




  onLabStatusChange(lab_state,is_lab_searching){

    var lab_searching_icon;
    var lab_connection_status;

    is_lab_searching = false;


    lab_searching_icon = document.getElementById(`lab-preview-${this.props.labIndex}`);

     if (typeof( lab_searching_icon) != 'undefined'){


       if (is_lab_searching){

            lab_searching_icon.style.backgroundImage = " url(/build/static/robbo_assets/searching.gif)";
            lab_searching_icon.style.backgroundRepeat = "no-repeat";
            lab_searching_icon.style.backgroundPosition = "center";



         
          


       }else{


         lab_searching_icon.style.backgroundImage = "";


       }

       lab_connection_status = document.getElementById(`lab-preview-${this.props.labIndex}`);

       if (lab_state == 6){




          lab_connection_status.classList.remove(styles.lab_status_connected);
          lab_connection_status.classList.remove(styles.lab_status_disconnected);
          lab_connection_status.classList.add(styles.lab_status_connected);

       }else{


         lab_connection_status.classList.remove(styles.lab_status_disconnected);
         lab_connection_status.classList.remove(styles.lab_status_connected);
         lab_connection_status.classList.add(styles.lab_status_disconnected);


       }



     }



  }

  componentDidMount () {

      this.islabConnected = false;
      this.lab_is_searching = false;

  //    this.startlabConnectionStatusCheck();

    this.props.LCA.registerLabStatusChangeCallback(this.onLabStatusChange.bind(this));

  }




  render() {



    return (


      <div id={`lab-preview-${this.props.labIndex}`} 
      
                className={classNames(

                          {[styles.labPreview]: true},
                          {[styles.lab_status_connected]: this.isLabConnected},
                          {[styles.lab_status_disconnected]: !this.isLabConnected}
                            )} 
                            
                onClick={this.props.onTriggerLabPallete}>


            <div id={`lab-${this.props.labIndex}-preview-pic`}  className={styles.labPreviewPic} >

                

            </div>

            <div id={`lab-${this.props.labIndex}-searching-icon`} className={classNames(

                          {[styles.lab_loading_icon]: true},
                          {[styles.lab_loading_icon_hidden]: (/*(this.props.labs[0].lab_connected) || */(!this.lab_is_searching))},
                          {[styles.lab_loading_icon_showing]: ((this.lab_is_searching) /*&& (!this.props.labs[0].lab_connected)*/)}
                            )}>


            </div>


            <div id={`lab-${this.props.labIndex}-connection-status`}  className={classNames(

                          {[styles.lab_connection_status]: true},
                          {[styles.lab_status_connected]: this.isLabConnected},
                          {[styles.lab_status_disconnected]: !this.isLabConnected}


                          )} >



            </div>


      </div>

      );

}






}


const mapStateToProps =  state => ({


  });

const mapDispatchToProps = dispatch => ({

  onTriggerLabPallete: () => {

      dispatch(ActionTriggerDraggableWindow(2));
    }


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LaboratoryPreviewComponent);
