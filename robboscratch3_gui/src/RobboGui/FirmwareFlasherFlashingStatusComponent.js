import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './FirmwareFlasherFlashingStatusComponent.css';

import {ActionTriggerDraggableWindow} from './actions/sensor_actions';




import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';




  const messages = defineMessages({

    close_window: {
        id: 'gui.FirmwareFlasherFlashingStatusComponent.close_window',
        description: ' ',
        defaultMessage: 'Close window'
    },
    flashing_status: {
        id: 'gui.FirmwareFlasherFlashingStatusComponent.flashing_status',
        description: ' ',
        defaultMessage: 'Лог процесса прошивки '
    }

  });

class FirmwareFlasherFlashingStatusComponent extends Component {



  componentDidMount () {

    this.DCA =  this.props.DCA;
    // this.RCA =  this.props.RCA;
    // this.LCA =  this.props.LCA;
    // this.QCA =  this.props.QCA;


  }

  closeWindow(){

      this.props.onWindowClose(this.props.draggableWindowId);

  }

  flashDevice(){



  }




  render() {



  return (

          <div id={`firmware-flasher-flashing-status-component-${this.props.componentId}`} className={styles.firmware_flasher_flashing_status_component}>

          <div id={`firmware-flasher-flashing-status-component-${this.props.componentId}-tittle`} className={styles.firmware_flasher_flashing_status_component_tittle}>

              {this.props.intl.formatMessage(messages.flashing_status) + " " + this.props.componentId }

              <div className={styles.close_icon} onClick={this.closeWindow.bind(this)}>


              </div>

          </div>



          <div id={`firmware-flasher-flashing-status-component-${this.props.componentId}-log-status`} className={styles.firmware_flasher_flashing_status_component_log_status}>



          </div>


          <div id={`firmware-flasher-flashing-status-component-${this.props.componentId}-log-content`} className={styles.firmware_flasher_flashing_status_component_log_content}>



          </div>


          </div>



  );
}

}

const mapStateToProps =  state => ({

    

  });

const mapDispatchToProps = dispatch => ({

  onWindowClose: (draggable_window_id) => {

      dispatch(ActionTriggerDraggableWindow(draggable_window_id));
    }



});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(FirmwareFlasherFlashingStatusComponent));
