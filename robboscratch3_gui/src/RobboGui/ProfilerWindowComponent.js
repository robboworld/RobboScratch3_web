import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';

import styles from  './ProfilerWindowComponent.css';
import {ActionTriggerNewDraggableWindow} from './actions/sensor_actions';


const messages = defineMessages({

    profiler_window: {
        id: 'gui.RobboGui.profiler_window',
        description: ' ',
        defaultMessage: 'Profiler'
    }

  });

class ProfilerWindowComponent extends Component {

  // constructor(){
  //
  //     super();
  //
  // }


  onThisWindowClose(){

    console.log("ProfilerWindow close");
    this.props.onProfilerWindowClose("profiler-window");

  }

  componentDidMount(){

  

  }

  render() {



  return (

    <div id="profiler-window" className={styles.profiler_window}>


          <div id="settings-window-tittle" className={styles.profiler_window_tittle}>

            {this.props.intl.formatMessage(messages.profiler_window)}

            <div className={styles.close_icon} onClick={this.onThisWindowClose.bind(this)}>


            </div>

          </div>

           <div id="profiler-window-content" className={styles.profiler_window_content}>

                <div id="profiler-window-content-hat" className={styles.profiler_window_content_hat}>

                    <div id="profiler-window-content-hat-element-1" className={styles.profiler_window_content_hat_element}>{"Id"} </div> 

                    <div id="profiler-window-content-hat-element-2" className={styles.profiler_window_content_hat_element}>{"Total time"} </div> 

                    <div id="profiler-window-content-hat-element-3" className={styles.profiler_window_content_hat_element}>{"Self time"} </div> 

                </div> 

                <div id="profiler-window-average-time" className={styles.profiler_window_average_time}>



                </div> 

                <div id="profiler-window-content-body" className={styles.profiler_window_content_body}>



                </div> 
            

           </div>


      </div>


  )

};


}

const mapStateToProps =  state => ({





  });

const mapDispatchToProps = dispatch => ({

  onProfilerWindowClose: (window_id) => {

      dispatch(ActionTriggerNewDraggableWindow(window_id));
    }


});





export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfilerWindowComponent));
