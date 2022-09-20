
import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';

import {ActionTriggerDraggableWindow} from './actions/sensor_actions';
import {ActionCreateDraggableWindow }  from './actions/sensor_actions';


import styles from './SearchPanelDeviceComponent.css';

import {createDiv} from './lib/lib.js';



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
        defaultMessage: 'Отто'
    },
     device_arduino: {
        id: 'gui.FirmwareFlasherDeviceComponent.device_arduino',
        description: ' ',
        defaultMessage: 'Ардуино'
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
    },
    flashing_device: {
        id: 'gui.FirmwareFlasherDeviceComponent.flashing_device',
        description: ' ',
        defaultMessage: 'Прошиваем...'
    },

    update_firm_msg: {

        id: 'gui.RobboGui.update_firm_msg',
        description: ' ',
        defaultMessage: 'Please update  firmware.'
    },
    cr_firm_msg: {

        id: 'gui.RobboGui.cr_firm_msg',
        description: ' ',
        defaultMessage: '(current: {current_firmware} required: {required_firmware})'
    },
    differ_firm_msg: {

        id: 'gui.RobboGui.differ_firm_msg',
        description: ' ',
        defaultMessage: 'The current firmware version of the device differs from the required one.'
    },
    differ_firm_msg_device_maybe_incorrect: {

        id: 'gui.RobboGui.differ_firm_msg_device_maybe_incorrect',
        description: ' ',
        defaultMessage: 'Возможна некорректная работа устройства.'
    },
    error:{

        id: 'gui.SearchPanel.error',
        description: ' ',
        defaultMessage: 'Ошибка!'
    },
    device_connected:{

        id: 'gui.SearchPanel.device_connected',
        description: ' ',
        defaultMessage: 'Устройство подключёно'
    },
    device_checking_serial:{

        id: 'gui.SearchPanel.device_checking_serial',
        description: ' ',
        defaultMessage: 'Проверяем серийный номер...'
    },
    device_no_response:{

        id: 'gui.SearchPanel.device_no_response',
        description: ' ',
        defaultMessage: 'Обнаружено неизвестное устройство'
    },
    device_no_response_details:{

        id: 'gui.SearchPanel.device_no_response_details',
        description: ' ',
        defaultMessage: 'Необходимо обновить прошивку.'
    },
    device_no_response_alert_details:{

        id: 'gui.SearchPanel.device_no_response_alert_details',
        description: ' ',
        defaultMessage: `К порту {device_port} подключено устройство, которое не распознаётся в Robbo Scratch.
Вероятно в устройстве отсутствует прошивка,  либо загружена нестандартная прошивка. 
                         
Загрузить стандартную прошивку Robbo Scratch 3?`
    },
    device_connection_lost:{

        id: 'gui.SearchPanel.device_connection_lost',
        description: ' ',
        defaultMessage: 'Потеряна связь с устройством.'
    },
    device_port_error:{

        id: 'gui.SearchPanel.device_port_error',
        description: ' ',
        defaultMessage: 'Ошибка порта!'
    },
    milliseconds:{

        id: 'gui.SearchPanel.milliseconds',
        description: ' ',
        defaultMessage: ' мс'
    },
    bluetooth_linux_hint:{

        id: 'gui.SearchPanel.bluetooth_linux_hint',
        description: ' ',
        defaultMessage: 'В силу особенностей устройства Линукс Robbo Scratch нужно запустить с правами пользователя root.'
    }, 
    flashing_in_progress:{

        id: 'gui.SearchPanel.flashing_in_progress',
        description: ' ',
        defaultMessage: 'Внимание!'
    }, 
    flashing_in_progress_details:{

        id: 'gui.SearchPanel.flashing_in_progress_details',
        description: ' ',
        defaultMessage: 'Идёт прошивка.'
    },
    device_try_to_reconnect:{


        id: 'gui.SearchPanel.device_try_to_reconnect',
        description: ' ',
        defaultMessage: 'Попробуйте переподключить устройство. Или использовать другой usb разъём.'

    },
    device_cannot_open_old_bluetooth_com:{


        id: 'gui.SearchPanel.device_cannot_open_old_bluetooth_com',
        description: ' ',
        defaultMessage: `Не удаётся открыть блютуз порт. 
Вероятно этот порт остался после предыдущего подключения по блютуз. 
Пожалуйста, удалите старые устройства из списка блютуз устройств.`

    },
    try_connect_to_port:{


        id: 'gui.SearchPanel.try_connect_to_port',
        description: ' ',
        defaultMessage: 'Пробуем подключиться к порту...'

    },
    port_opened:{


        id: 'gui.SearchPanel.port_opened',
        description: ' ',
        defaultMessage: 'Порт открыт'

    }
    

  });


class SearchPanelDeviceComponent extends Component {


    constructor(){  
        super();  

        this.state = {  
           devices: []
        };  

        this.deviceId = -1;

        this.firmware_version_differs = false;

        this.firmware_version_differs_cb_result = {};

        this.isFlashing = false;

        this.isRasberry = false;
        
   }

   componentDidUpdate(){

     this.props.DCA.registerDeviceStatusChangeCallback(this.props.devicePort,this.onStatusChange.bind(this));

     this.props.DCA.registerFirmwareVersionDiffersCallback(this.props.devicePort, (result) => {


         this.firmware_version_differs = true;     
         this.firmware_version_differs_cb_result = result;  


        let info_field = document.getElementById(`search-panel-device-info-${this.props.Id}`);

         info_field.style.display = "inline-block";


        info_field.innerHTML = this.props.intl.formatMessage(messages.differ_firm_msg) + "<br/><br/>" + this.props.intl.formatMessage(messages.cr_firm_msg,{current_firmware:result.current_device_firmware,required_firmware:result.need_firmware}) +  "<br/><br/>" + this.props.intl.formatMessage(messages.differ_firm_msg_device_maybe_incorrect) + "<br/><br/>" + this.props.intl.formatMessage(messages.update_firm_msg);


        var flashing_button =  document.getElementById(`search-panel-device-flash-button-${this.props.Id}`);
        flashing_button.style.backgroundColor = "";  


       

             });

   }

    componentDidMount(){


    this.DCA =  this.props.DCA;
    this.RCA =  this.props.RCA;
    this.LCA =  this.props.LCA;
    this.QCA =  this.props.QCA;
    this.OCA =  this.props.OCA;
    this.ACA =  this.props.ACA;

    this.dots_counter = 1;

   

        this.props.onCreateDraggableWindow(this.props.draggableWindowId);


       



        //    this.props.DCA.registerFirmwareVersionDiffersCallback(this.props.devicePort, (result) => {


        //  this.firmware_version_differs = true;     
        //  this.firmware_version_differs_cb_result = result;  


        // let info_field = document.getElementById(`search-panel-device-info-${this.props.Id}`);

        //  info_field.style.display = "inline-block";


        // info_field.innerHTML = this.props.intl.formatMessage(messages.differ_firm_msg) + "<br/><br/>" + this.props.intl.formatMessage(messages.cr_firm_msg,{current_firmware:result.current_device_firmware,required_firmware:result.need_firmware}) +  "<br/><br/>" + this.props.intl.formatMessage(messages.differ_firm_msg_device_maybe_incorrect) + "<br/><br/>" + this.props.intl.formatMessage(messages.update_firm_msg);


        // var flashing_button =  document.getElementById(`search-panel-device-flash-button-${this.props.Id}`);
        // flashing_button.style.backgroundColor = "";  


       

        //      });
    }


  onStatusChange(result_obj){

        let state = result_obj.state;
            //let deviceId =  result_obj.deviceId;
            this.deviceId =  result_obj.deviceId;



            let status_field = document.getElementById(`search-panel-device-status-${this.props.Id}`);

            let info_field = document.getElementById(`search-panel-device-info-${this.props.Id}`);

           let flashing_button =  document.getElementById(`search-panel-device-flash-button-${this.props.Id}`);

           let flashing_show_details_icon = document.getElementById(`search-panel-flashing-show-details-${this.props.Id}`);

           let device_status_icon = document.getElementById(`search-panel-device-status-icon-${this.props.Id}`);
       



           let  device_name = "";

    switch (this.deviceId) {

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

      case 6:

                device_name = this.props.intl.formatMessage(messages.device_arduino);

         break;    


      default:

    }
                if (state == 0){

                    //init here

                    this.firmware_version_differs = false; 
                    this.isFlashing = false;
 
                   
                    status_field.innerHTML = this.props.intl.formatMessage(messages.try_connect_to_port);

                    device_status_icon.innerHTML = `<img src = "/static/robbo_assets/yellow.png" />`;
 
                    info_field.innerHTML = "";
 
                    info_field.style.display = "none";
 
                    flashing_button.style.backgroundColor = "";  
                    flashing_button.style.backgroundImage = "-webkit-linear-gradient(top,#00af41,#008a00)";
                    flashing_button.innerText = this.props.intl.formatMessage(messages.flash_device);  
 
                    flashing_show_details_icon.style.display = "none";
                    flashing_button.style.display = "none";
 
                    this.flashingHideDetails();


                }else if (state == 2){

                  

                   this.firmware_version_differs = false; 
                   this.isFlashing = false;

                  // status_field.innerHTML = "Connected";
                     status_field.innerHTML = this.props.intl.formatMessage(messages.port_opened);;

                   info_field.innerHTML = "";

                   info_field.style.display = "none";

                   flashing_button.style.backgroundColor = "";  
                   flashing_button.style.backgroundImage = "-webkit-linear-gradient(top,#00af41,#008a00)";
                   flashing_button.innerText = this.props.intl.formatMessage(messages.flash_device);  

                   flashing_show_details_icon.style.display = "none";
                   flashing_button.style.display = "none";

                   this.flashingHideDetails();


                }else if (state == 3){

                    status_field.innerHTML = this.props.intl.formatMessage(messages.device_checking_serial);

                    device_status_icon.innerHTML = `<img src = "/static/robbo_assets/yellow.png" />`;


                }else if (state == 6){

                    let result =  this.firmware_version_differs_cb_result;

                    status_field.innerHTML = device_name + " " + this.props.intl.formatMessage(messages.device_connected);

                    device_status_icon.innerHTML = `<img src = "/static/robbo_assets/green.png" />`;

                    if (!this.firmware_version_differs){

                         info_field.innerHTML = "";
                    }

                    

                     let firm_differs_msg = this.props.intl.formatMessage(messages.differ_firm_msg) + this.props.intl.formatMessage(messages.cr_firm_msg,{current_firmware:result.current_device_firmware,required_firmware:result.need_firmware})  
                     +  this.props.intl.formatMessage(messages.flash_device) + "?";
                    
                    //let firm_differs_msg = "Flash?";

                    let need_flash_device = false; 

                    if ((this.firmware_version_differs) && (this.props.devicePort.indexOf("rfcomm") == -1) && (this.props.devicePort.indexOf("/dev/tty.") == -1) && (!this.props.isBluetooth) && (!this.isRasberry) ){

                   // if (true){

                        flashing_show_details_icon.style.display = "inline-block";
                        flashing_button.style.display = "inline-block";

                         need_flash_device = confirm(firm_differs_msg);

                    }

                   

                    if (need_flash_device){
                        

                        this.flashDevice();

                    }else if (!this.firmware_version_differs){ //We don't need to close panel if firmware versions differ.

                            let all_devices = this.props.DCA.getDevices();

                            let all_devices_found = false;

                            for (let device_index = 0; device_index < all_devices.length;device_index++){

                                all_devices_found = ((all_devices[device_index].getState() == 6) && (!all_devices[device_index].isFirmwareVersionDiffers()));

                                if (!all_devices_found) break;
                            }

                            if (all_devices_found){

                                let search_panel = document.getElementById(`SearchPanelComponent`);

                                 search_panel.style.display = "none";
                            }

                    }


                } else if (state == 8){ //Port doesn't respond (state - TIMEOUT)

                     let info_field = document.getElementById(`search-panel-device-info-${this.props.Id}`);

                    info_field.style.display = "inline-block";

                    if ((result_obj.error.code == 1) && (!this.isFlashing)){ //Device was good but connection lost.


                        let NO_RESPONSE_TIMEOUT =  this.DCA.getTimeoutVars().NO_RESPONSE_TIMEOUT;   

                        // info_field.innerHTML = this.props.intl.formatMessage(messages.device_no_response_details) + " " + NO_RESPONSE_TIMEOUT 
                        //         + " " + this.props.intl.formatMessage(messages.milliseconds);

                        status_field.innerHTML = this.props.intl.formatMessage(messages.device_connection_lost);
                        info_field.innerHTML = "";

                        alert(this.props.devicePort + " " + this.props.intl.formatMessage(messages.device_connection_lost));


                        let search_panel = document.getElementById(`SearchPanelComponent`);
                        search_panel.style.display = "block";

                        device_status_icon.innerHTML = `<img src = "/static/robbo_assets/red.png" />`;

                        //flashing_show_details_icon.style.display = "none";
                        //flashing_button.style.display = "none";


                    }else if (result_obj.error.code == -1){ //We cann't get any usefull info from the device


                       
                       
                        let DEVICE_HANDLE_TIMEOUT =  this.DCA.getTimeoutVars().DEVICE_HANDLE_TIMEOUT;   

                        //  info_field.innerHTML = this.props.intl.formatMessage(messages.device_no_response_details) + " " + DEVICE_HANDLE_TIMEOUT
                        //         + " " + this.props.intl.formatMessage(messages.milliseconds);

                        if (this.props.isBluetooth){

                            info_field.innerHTML = this.props.intl.formatMessage(messages.device_cannot_open_old_bluetooth_com);

                        }else{

                            info_field.innerHTML = this.props.intl.formatMessage(messages.device_no_response_details);

                        }

                         

                        status_field.innerHTML =  this.props.intl.formatMessage(messages.device_no_response); 

                        device_status_icon.innerHTML = `<img src = "/static/robbo_assets/red.png" />`;
                        
                       let need_to_flash_msg = this.props.intl.formatMessage(messages.device_no_response_alert_details,{device_port:this.props.devicePort});

                       let  need_flash_device = false;

                       // if (true){
                                                                                //macos
                         if ((this.props.devicePort.indexOf("rfcomm") == -1) && (this.props.devicePort.indexOf("/dev/tty.") == -1) && (!this.props.isBluetooth)  && (!this.isRasberry)){

                             flashing_show_details_icon.style.display = "inline-block";
                             flashing_button.style.display = "inline-block";

                             need_flash_device = confirm(need_to_flash_msg);

                         }

                   
                        if (need_flash_device){

                                this.flashDevice();

                         }

                    }      



                } else if (state == 7){


                    let info_field = document.getElementById(`search-panel-device-info-${this.props.Id}`);

                    info_field.style.display = "inline-block";

                    //  if (this.props.devicePort.indexOf("rfcom") != -1){

                    //         flashing_show_details_icon.style.display = "none";
                    //         flashing_button.style.display = "none";

                            

                    //     }

                     

                    flashing_show_details_icon.style.display = "none";
                    flashing_button.style.display = "none";


                    if ( (this.props.devicePort.indexOf("rfcom") != -1) && (result_obj.error.msg.indexOf("cannot open /dev/rfcom") != -1 ) ){

                         info_field.innerHTML = result_obj.error.msg + "<br/>" + this.props.intl.formatMessage(messages.bluetooth_linux_hint) ;

                    }else if ((this.props.isBluetooth) && (this.props.devicePort.indexOf("bluetooth_") !== -1)){

                        info_field.innerHTML = result_obj.error.msg + "<br/>" +  this.props.intl.formatMessage(messages.device_cannot_open_old_bluetooth_com);
                        
                    }
                    
                    else{

                        info_field.innerHTML = result_obj.error.msg + "<br/>" +  this.props.intl.formatMessage(messages.device_try_to_reconnect);

                    }

                    

                     status_field.innerHTML = this.props.intl.formatMessage(messages.device_port_error); 

                     device_status_icon.innerHTML = `<img src = "/static/robbo_assets/red.png" />`;

                      let search_panel = document.getElementById(`SearchPanelComponent`);
                      search_panel.style.display = "block";

                }

  }  


searchDevices(){


    console.warn("serachPanelDeviceComponent searchDevices");

    let search_panel = document.getElementById(`SearchPanelComponent`);

    search_panel.style.display = "block";


   this.DCA.searchAllDevices();

   this.RCA.searchRobotDevices();
   this.LCA.searchLaboratoryDevices();
   this.OCA.searchOttoDevices();
   this.ACA.searchArduinoDevices();

  //this.QCA.searchQuadcopterDevices();

  this.ECA.searchEspDevices();
}


flashingShowDetails(){

 //console.log("flashingShowDetails")   

if (this.props.draggable_window[this.props.draggableWindowId].isShowing !== true){

   // console.log(`onShowFlashingStatusWindow draggableWindowId: ${this.props.draggableWindowId}`);      
    this.props.onShowFlashingStatusWindow(this.props.draggableWindowId);

  }

}

flashingHideDetails(){

 if (this.props.draggable_window[this.props.draggableWindowId].isShowing == true){

    this.props.onHideFlashingStatusWindow(this.props.draggableWindowId);

  }

}

onFlashingStatusChanged(status){

    var cId =  this.props.flashingStatusComponentId;

    var firmwareFlasherFlashingStatusComponent =  document.getElementById(`firmware-flasher-flashing-status-component-${cId}`);


   var flashingStatusComponent = firmwareFlasherFlashingStatusComponent.children[1];

   var flashingLogComponent =  firmwareFlasherFlashingStatusComponent.children[2];

   var block_ids_component = null;

    //flashingStatusComponent.innerHTML = "";
    //flashingLogComponent.innerHTML = "";

    

    

    var styles = {

        margin: '10px'

  }

  if ( (status.indexOf("Block") == -1) &&  (status.indexOf("Error") == -1)  && (status.indexOf("Uploading") == -1) && (status.indexOf("Port closed") == -1) ){

      createDiv(flashingLogComponent,null,null,null,null,styles,status,null);
    //    block_ids_component.innerHTML = "";

        var dots = "";

        for (var i = 0; i < this.dots_counter; i++) {

            dots += ".";
        }

        flashingStatusComponent.innerHTML = "Waiting.." + dots;

        if (this.dots_counter == 1 ){

            this.dots_counter = 2;

        }else{

            this.dots_counter = 1;

        }

  }else{

     

              flashingStatusComponent.innerHTML = status;

   


  }

  flashingLogComponent.scrollTop = flashingLogComponent.scrollHeight;

  if ((status.indexOf("Port closed") !== -1)){

        flashingStatusComponent.style.backgroundColor = "green";

        search_device_button.removeAttribute("disabled");

        //flashing_short_status_field.style.backgroundImage = " url(/build/static/robbo_assets/status_ok.svg)";
       
        flashing_button.style.backgroundImage = "";


        flashing_button.removeAttribute("disabled");
        flashing_button.style.display = "inline-block";

        this.searchDevices(); //search devices

  }else if ((status.indexOf("Error") !== -1)){

        flashingStatusComponent.style.backgroundColor = "red";
        search_device_button.removeAttribute("disabled");

      //  flashing_short_status_field.style.backgroundImage = " url(/build/static/robbo_assets/status_error.svg)";


      //  flashing_button.style.backgroundImage = "";
        flashing_button.style.backgroundImage = "-webkit-linear-gradient(top,#ff0000,#ff0000)";
        flashing_button.style.backgroundColor = "#ff0000";
        flashing_button.style.textAlign = "center";
        flashing_button.innerText = this.props.intl.formatMessage(messages.error);

        flashing_button.removeAttribute("disabled");

        let device_status_icon = document.getElementById(`search-panel-device-status-icon-${this.props.Id}`);
        device_status_icon.innerHTML = `<img src = "/build/static/robbo_assets/red.png" />`;

        let search_panel = document.getElementById(`SearchPanelComponent`);
        search_panel.style.display = "block";

        // flashing_short_status_field.style.display = "none";

  }else{

      flashingStatusComponent.style.backgroundColor = "#FFFF99"; //Light yellow2

  }



}


flashDevice(){

    this.isFlashing = true;

    var search_device_button =  document.getElementById(`robbo_search_devices`);

    search_device_button.setAttribute("disabled", "disabled");




    var flashing_button =  document.getElementById(`search-panel-device-flash-button-${this.props.Id}`);

    flashing_button.setAttribute("disabled", "disabled");


    //flashing_button.style.display = "inline-block";
    flashing_button.style.backgroundImage = " url(/build/static/robbo_assets/searching.gif)";
    flashing_button.style.backgroundColor = "#FFFF99"; //Light yellow2
    flashing_button.style.backgroundRepeat = "no-repeat";
    flashing_button.style.backgroundPosition = "center";
    flashing_button.style.textAlign = "left";
    flashing_button.style.color = "black";
    flashing_button.innerText = this.props.intl.formatMessage(messages.flashing_device);


     let status_field = document.getElementById(`search-panel-device-status-${this.props.Id}`);
     let info_field = document.getElementById(`search-panel-device-info-${this.props.Id}`);

    status_field.innerHTML = this.props.intl.formatMessage(messages.flashing_in_progress); 
    info_field.innerHTML =   this.props.intl.formatMessage(messages.flashing_in_progress_details); 

     let device_status_icon = document.getElementById(`search-panel-device-status-icon-${this.props.Id}`);
     device_status_icon.innerHTML = `<img src = "/build/static/robbo_assets/yellow.png" />`;


    var cId =  this.props.flashingStatusComponentId;

    var firmwareFlasherFlashingStatusComponent =  document.getElementById(`firmware-flasher-flashing-status-component-${cId}`);


   var flashingStatusComponent = firmwareFlasherFlashingStatusComponent.children[1];

   var flashingLogComponent =  firmwareFlasherFlashingStatusComponent.children[2];

    flashingStatusComponent.innerHTML = "";
    flashingLogComponent.innerHTML = "";
   

    var config = {};
    config.device   = {};

    config.device.device_id = this.deviceId;
   // config.device.device_firmware_version = this.props.deviceFirmwareVersion;

   //var dots_counter = 1;

   this.dots_counter = 1;

   var styles = {

    margin: '10px'

    }


    // if ([0,3].indexOf(this.deviceId) != -1){

    //     this.RCA.stopDataRecievingProcess();
    //     this.RCA.discon(()=>{

    //         this.DCA.flashFirmware(this.props.devicePort,config,this.onFlashingStatusChanged.bind(this));
    //     });

    // }else if ([1,2,4].indexOf(this.deviceId) != -1){

    //       this.LCA.stopDataRecievingProcess();
    //       this.LCA.discon(()=>{

    //         this.DCA.flashFirmware(this.props.devicePort,config,this.onFlashingStatusChanged.bind(this));
    //     });

    // }else if ([5].indexOf(this.deviceId) != -1){

    //       this.OCA.stopDataRecievingProcess();
    //       this.OCA.discon(()=>{

    //         this.DCA.flashFirmware(this.props.devicePort,config,this.onFlashingStatusChanged.bind(this));
    //     });

    // }else if ([6].indexOf(this.deviceId) != -1){

    //       this.ACA.stopDataRecievingProcess();
    //       this.ACA.discon(()=>{

    //         this.DCA.flashFirmware(this.props.devicePort,config,this.onFlashingStatusChanged.bind(this));
    //     });

    // }else{

              this.RCA.stopDataRecievingProcess();
              this.LCA.stopDataRecievingProcess();
              this.OCA.stopDataRecievingProcess();
              this.ACA.stopDataRecievingProcess();

              this.DCA.discon(this.props.devicePort,() => {

                this.DCA.flashFirmware(this.props.devicePort,config,(status) => {

                    if ( (status.indexOf("Block") == -1) &&  (status.indexOf("Error") == -1)  && (status.indexOf("Uploading") == -1) && (status.indexOf("Port closed") == -1) ){

                        createDiv(flashingLogComponent,null,null,null,null,styles,status,null);
                      //    block_ids_component.innerHTML = "";
                  
                          var dots = "";
                  
                          for (var i = 0; i < this.dots_counter; i++) {
                  
                              dots += ".";
                          }
                  
                          flashingStatusComponent.innerHTML = "Waiting.." + dots;
                  
                          if (this.dots_counter == 1 ){
                  
                              this.dots_counter = 2;
                  
                          }else{
                  
                              this.dots_counter = 1;
                  
                          }
                  
                    }else{
                  
                       
                  
                                flashingStatusComponent.innerHTML = status;
                  
                     
                  
                  
                    }
                  
                    flashingLogComponent.scrollTop = flashingLogComponent.scrollHeight;
                  
                    if ((status.indexOf("Port closed") !== -1)){
                  
                          flashingStatusComponent.style.backgroundColor = "green";
                  
                          search_device_button.removeAttribute("disabled");
                  
                          //flashing_short_status_field.style.backgroundImage = " url(/build/static/robbo_assets/status_ok.svg)";
                         
                          flashing_button.style.backgroundImage = "";
                  
                  
                          flashing_button.removeAttribute("disabled");
                          flashing_button.style.display = "inline-block";
                  
                          this.searchDevices(); //search devices
                  
                    }else if ((status.indexOf("Error") !== -1)){
                  
                          flashingStatusComponent.style.backgroundColor = "red";
                          search_device_button.removeAttribute("disabled");
                  
                        //  flashing_short_status_field.style.backgroundImage = " url(/build/static/robbo_assets/status_error.svg)";
                  
                  
                        //  flashing_button.style.backgroundImage = "";
                          flashing_button.style.backgroundImage = "-webkit-linear-gradient(top,#ff0000,#ff0000)";
                          flashing_button.style.backgroundColor = "#ff0000";
                          flashing_button.style.textAlign = "center";
                          flashing_button.innerText = this.props.intl.formatMessage(messages.error);
                  
                          flashing_button.removeAttribute("disabled");
                  
                          let device_status_icon = document.getElementById(`search-panel-device-status-icon-${this.props.Id}`);
                          device_status_icon.innerHTML = `<img src = "/build/static/robbo_assets/red.png" />`;
                  
                          let search_panel = document.getElementById(`SearchPanelComponent`);
                          search_panel.style.display = "block";
                  
                          // flashing_short_status_field.style.display = "none";
                  
                    }else{
                  
                        flashingStatusComponent.style.backgroundColor = "#FFFF99"; //Light yellow2
                  
                    }

                });
              });

             
            //  this.LCA.discon();
    //}

    // var styles = {

    //       margin: '20px 10px',
    //       fontWeight:'bold',
    //       fontSize:"16px"

    // }



    // 

   // this.DCA.flashFirmware(this.props.devicePort,config,this.onFlashingStatusChanged.bind(this, dots_counter));

  }


 render() {

    


  return (

   

    <div id={`search-panel-device-component`} className={styles.firmware_flasher_device_component}>


          <div id="search-panel-device-port" className={styles.search_panel_device_element}>

                {this.props.devicePort}

          </div>

           <div id={`search-panel-device-status-icon-${this.props.Id}`} className={styles.search_panel_device_status_icon}>


          </div>

           <div id={`search-panel-device-status-${this.props.Id}`} className={styles.search_panel_device_element}>

               

          </div>

          <div id={`search-panel-device-info-${this.props.Id}`} className={styles.search_panel_device_element}>

               

          </div>

          <div id={`search-panel-device-flash-button-element-${this.props.Id}`} className={styles.search_panel_device_element}>

              <button id={`search-panel-device-flash-button-${this.props.Id}`} className={styles.device_flash_button} onClick={this.flashDevice.bind(this)}>{this.props.intl.formatMessage(messages.flash_device)} </button>

          </div>

           <div id={`search-panel-flashing-status-${this.props.Id}`} className={styles.search_panel_flashing_status}>

               

          </div>

          <div id={`search-panel-flashing-show-details-${this.props.Id}`} className={styles.search_panel_flashing_show_details} onClick={this.flashingShowDetails.bind(this)}>

               

          </div>


          </div>

  );

}

}


const mapStateToProps =  state => ({

    //   devices:state.scratchGui.devices_search_panel,
    //   draggable_window:state.scratchGui.new_draggable_window
        draggable_window:state.scratchGui.draggable_window

  });

const mapDispatchToProps = dispatch => ({

      onShowFlashingStatusWindow: (draggable_window_id) => {

         dispatch(ActionTriggerDraggableWindow(draggable_window_id));
      },

      onHideFlashingStatusWindow: (draggable_window_id) => {

         dispatch(ActionTriggerDraggableWindow(draggable_window_id));
      },

      onCreateDraggableWindow: (draggable_window_id) => {

        dispatch(ActionCreateDraggableWindow(draggable_window_id));
    }

    // onDeviceFound: (device) => {

    //       dispatch(ActionDeviceFound(device));
    // },


    // onSearchPanelWindowClose: (window_id) => {

    //     dispatch(ActionTriggerDraggableWindow(window_id));
    //   }


});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchPanelDeviceComponent));

//export default injectIntl(SearchPanelDeviceComponent);