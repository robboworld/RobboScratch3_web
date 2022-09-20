import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './FirmwareFlasherDeviceComponent.css';

import {ActionCreateDraggableWindow }  from './actions/sensor_actions';
import {ActionTriggerDraggableWindow} from './actions/sensor_actions';

import {createDiv} from './lib/lib.js';

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';




  const messages = defineMessages({

    device_robot: {
        id: 'gui.FirmwareFlasherDeviceComponent.device_robot',
        description: ' ',
        defaultMessage: 'Robot'
    },
    device_lab: {
        id: 'gui.FirmwareFlasherDeviceComponent.device_lab',
        description: ' ',
        defaultMessage: 'Laboratory'
    },
    device_otto: {
        id: 'gui.FirmwareFlasherDeviceComponent.device_otto',
        description: ' ',
        defaultMessage: 'Otto'
    },
    device_unknown: {
        id: 'gui.FirmwareFlasherDeviceComponent.device_unknown',
        description: ' ',
        defaultMessage: 'Unknown device'
    },
    flash_device: {
        id: 'gui.FirmwareFlasherDeviceComponent.flash_device',
        description: ' ',
        defaultMessage: 'Flash device'
    }

  });

class FirmwareFlasherDeviceComponent extends Component {



  componentDidMount () {

    this.DCA =  this.props.DCA;
    this.RCA =  this.props.RCA;
    this.LCA =  this.props.LCA;
    // this.QCA =  this.props.QCA;
    this.OCA = this.props.OCA;

    this.props.onCreateDraggableWindow(this.props.draggableWindowId);


  }

  flashDevice(){

    var search_device_button =  document.getElementById(`robbo_search_devices`);

    search_device_button.setAttribute("disabled", "disabled");

    if (this.props.draggable_window[this.props.draggableWindowId].isShowing !== true){

    this.props.onShowFlashingStatusWindow(this.props.draggableWindowId);

  }

    var cId =  this.props.flashingStatusComponentId;

    var firmwareFlasherFlashingStatusComponent =  document.getElementById(`firmware-flasher-flashing-status-component-${cId}`);

  //  var flashingStatusComponent = document.getElementById(`firmware-flasher-flashing-status-component-${cId}`).children[2];

   var flashingStatusComponent = firmwareFlasherFlashingStatusComponent.children[1];

   var flashingLogComponent = firmwareFlasherFlashingStatusComponent.children[2];

    var block_ids_component = null;

    flashingStatusComponent.innerHTML = "";
    flashingLogComponent.innerHTML = "";

    var config = {};
    config.device   = {};

    config.device.device_id = this.props.deviceId;
    config.device.device_firmware_version = this.props.deviceFirmwareVersion;

    if ([0,3].indexOf(this.props.deviceId) != -1){

        this.RCA.stopDataRecievingProcess();
        this.RCA.discon();

    }else if ([1,2,4].indexOf(this.props.deviceId) != -1){

          this.LCA.stopDataRecievingProcess();
          this.LCA.discon();

    }else if ([5].indexOf(this.props.deviceId) != -1){

          this.OCA.stopDataRecievingProcess();
          this.OCA.discon();

    }else{

              this.RCA.stopDataRecievingProcess();
              this.RCA.discon();

              this.LCA.stopDataRecievingProcess();
              this.OCA.stopDataRecievingProcess();
            //  this.LCA.discon();
    }

    var styles = {

          margin: '20px 10px',
          fontWeight:'bold',
          fontSize:"16px"

    }

    //  block_ids_component = createDiv(flashingLogComponent,null,null,null,null,styles,"",{id:"uploading-component"});

    var dots_counter = 1;

    this.DCA.flashFirmware(this.props.devicePort,config,(status) => {

           styles = {

                margin: '10px'

          }

          if ( (status.indexOf("Block") == -1) &&  (status.indexOf("Error") == -1)  && (status.indexOf("Uploading") == -1) && (status.indexOf("Port closed") == -1) ){

              createDiv(flashingLogComponent,null,null,null,null,styles,status,null);
            //    block_ids_component.innerHTML = "";

                var dots = "";

                for (var i = 0; i < dots_counter; i++) {

                    dots += ".";
                }

                flashingStatusComponent.innerHTML = "Waiting.." + dots;

                if (dots_counter == 1 ){

                    dots_counter = 2;

                }else{

                    dots_counter = 1;

                }

          }else{

              // if (block_ids_component == null){
              //
              // //      block_ids_component = createDiv(flashingStatusComponent,null,null,null,null,styles,"",{id:"block-ids-component"});
              //
              //
              // }else{

                    //  block_ids_component.innerHTML = status;

                      flashingStatusComponent.innerHTML = status;

            //  }


          }

          flashingLogComponent.scrollTop = flashingLogComponent.scrollHeight;

        //  console.log(`flashingStatusComponent.scrollTop: ${flashingLogComponent.scrollTop} `);

          if ( (status.indexOf("Port closed") !== -1)){

                flashingStatusComponent.style.backgroundColor = "green";

                search_device_button.removeAttribute("disabled");

          }else if ((status.indexOf("Error") !== -1)){

                flashingStatusComponent.style.backgroundColor = "red";
                search_device_button.removeAttribute("disabled");

          }else{

              flashingStatusComponent.style.backgroundColor = "#FFFF99"; //Light yellow2

          }



    });

  }




  render() {

    var device_name = "";

    switch (this.props.deviceId) {

      case -1:

          device_name = this.props.intl.formatMessage(messages.device_unknown);

        break;

      case 0:

          device_name = this.props.intl.formatMessage(messages.device_robot);

        break;

      case 1:

            device_name = this.props.intl.formatMessage(messages.device_lab);

          break;

      case 2:

            device_name = this.props.intl.formatMessage(messages.device_lab);

          break;

      case 3:

          device_name = this.props.intl.formatMessage(messages.device_robot);

        break;

      case 4:

            device_name = this.props.intl.formatMessage(messages.device_lab);

          break;

      case 5:

                device_name = this.props.intl.formatMessage(messages.device_otto);

          break;


      default:

    }

  return (

          <div id="firmware-flasher-device-component" className={styles.firmware_flasher_device_component}>


          <div id="firmware-flasher-device-name" className={styles.firmware_flasher_device_element}>

              {device_name}

          </div>

          <div id="firmware-flasher-device-port" className={styles.firmware_flasher_device_element}>

                {this.props.devicePort}

          </div>

          <div id="firmware-flasher-device-serial" className={styles.firmware_flasher_device_element}>

                {this.props.deviceSerial}

          </div>

          <div id="firmware-flasher-device-firmware" className={styles.firmware_flasher_device_element}>

                {this.props.deviceFirmwareVersion}

          </div>

          <div id="firmware-flasher-device-flash-button" className={styles.firmware_flasher_device_element}>

              <button className={styles.device_flash_button} onClick={this.flashDevice.bind(this)}>{this.props.intl.formatMessage(messages.flash_device)} </button>

          </div>


          </div>



  );
}

}

const mapStateToProps =  state => ({

      draggable_window:state.scratchGui.draggable_window

  });

const mapDispatchToProps = dispatch => ({


  onCreateDraggableWindow: (draggable_window_id) => {

      dispatch(ActionCreateDraggableWindow(draggable_window_id));
    },

    onShowFlashingStatusWindow: (draggable_window_id) => {

        dispatch(ActionTriggerDraggableWindow(draggable_window_id));
      }

});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(FirmwareFlasherDeviceComponent));
