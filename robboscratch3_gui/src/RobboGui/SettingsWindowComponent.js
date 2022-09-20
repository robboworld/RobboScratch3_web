import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withAlert } from 'react-alert';

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';

import styles from  './SettingsWindowComponent.css';
import {ActionTriggerDraggableWindow} from './actions/sensor_actions';

const node_process = {platform:""};


const messages = defineMessages({
  settings_window: {
    id: 'gui.RobboGui.settings_window',
    description: ' ',
    defaultMessage: 'Настройки'
  },
  intervals_for_blocks_chain:{
    id: 'gui.RobboGui.intervals_for_blocks_chain',
    description: ' ',
    defaultMessage: 'Intervals for blocks chain' 

  },
  uno_search_timeout: {
    id: 'gui.RobboGui.uno_search_timeout',
    description: ' ',
    defaultMessage: 'Robbo search timeout'
  },
  fullscreen_interval: {
    id: 'gui.RobboGui.fullscreen_interval',
    description: ' ',
    defaultMessage: 'Интервал выполнения цепочки блоков в полноэкранном режиме (1-500) (в мс): '
  },
  normal_mode_interval: {
    id: 'gui.RobboGui.normal_mode_interval',
    description: ' ',
    defaultMessage: 'Интервал выполнения цепочки блоков в обычном режиме (1-500) (в мс): '
  }, 
  save_settings: {
    id: 'gui.RobboGui.save_settings',
    description: ' ',
    defaultMessage: 'Сохранить настройки '
  },
});

const messages_for_DCA_intervals = defineMessages({
   for_usb: {
    id: 'gui.dca.for_usb',
    description: ' ',
    defaultMessage: 'Intervals for usb'
  },
  no_response_time: {
    id: 'gui.dca.no_response_time',
    description: ' ',
    defaultMessage: 'NO RESPONSE TIME'
  },
  no_start_timeout: {
    id: 'gui.dca.no_start_timeout',
    description: ' ',
    defaultMessage: 'NO START TIMEOUT'
  },
  device_handle_timeout: {
    id: 'gui.dca.device_handle_timeout',
    description: ' ',
    defaultMessage: 'DEVICE HANDLE TIMEOUT'
  },
  uno_timeout: {
    id: 'gui.dca.uno_timeout',
    description: ' ',
    defaultMessage: 'UNO TIMEOUT'
  },

  no_response_time_bluetooth: {
    id: 'gui.dca.no_response_time_bluetooth',
    description: ' ',
    defaultMessage: 'NO RESPONSE TIME'
  },
  no_start_timeout_bluetooth: {
    id: 'gui.dca.no_start_timeout_bluetooth',
    description: ' ',
    defaultMessage: 'NO START TIMEOUT'
  },
  device_handle_timeout_bluetooth: {
    id: 'gui.dca.device_handle_timeout_bluetooth',
    description: ' ',
    defaultMessage: 'DEVICE HANDLE TIMEOUT'
  },
  uno_timeout_bluetooth: {
    id: 'gui.dca.uno_timeout_bluetooth',
    description: ' ',
    defaultMessage: 'UNO TIMEOUT'
  },

  for_bluetooth: {
    id: 'gui.dca.for_bluetooth',
    description: ' ',
    defaultMessage: 'Intervals for bluetooth'
  },
});

class SettingsWindowComponent extends Component {
  onThisWindowClose(){

    console.log("SettingsWindow close");
    this.props.onSettingsWindowClose(4);

  }

  readSettings(){
      console.warn(`readSettings`);
      return new Promise((resolve,reject)=>{
        function errorHandler(e){
          console.error("File error during settings reading: " + e);
          
          let res = {};

          res.file_exists = false;
          res.file = null;
          res.err = e;

          resolve(res);
        };

        function onInitFs(fs) {
          console.log('Opened file system: ' + fs.name);
          fs.root.getFile("settings" + "." + "json", {create: false}, function(fileEntry) {
            fileEntry.file(function(file) {
                var reader = new FileReader();
                reader.onloadend = function(e) {
                  if ((typeof (this) !== 'undefined') && (typeof(this.result) !== 'undefined')  && (this.result !== null)){
                    console.warn("Read completed for " + "settings" + "." + "json" + " data: " + this.result);

                    let res = {};
                    res.file_exists = true;
                    res.file = this.result;
                    res.err = null;

                    resolve(res);
                  }else{

                    let res = {};

                    res.file_exists = false;
                    res.file = null;
                    res.err = e;

                    resolve(res);
                  }
                };
                reader.readAsText(file);
              });
          }, function(e){
            let res = {};

            res.file_exists = false;
            res.file = null;
            res.err = e;

            resolve(res);

          });
        };

        navigator.webkitPersistentStorage.requestQuota(500*1024*1024,
          function(grantedBytes){
            console.log("readSettings byte granted=" + grantedBytes);
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
          }, errorHandler);
      });
  }

  saveDCASettings(){
    let DCA_settings_data = {
      device_response_timeout: this.DCA_defaults.NO_RESPONSE_TIME_DEFAULT,
      device_no_start_timeout: this.DCA_defaults.NO_START_TIMEOUT_DEFAULT,
      device_handle_timeout: this.DCA_defaults.DEVICE_HANDLE_TIMEOUT_DEFAULT,
      device_uno_start_search_timeout: this.DCA_defaults.UNO_TIMEOUT_DEFAULT,
    };

    var DCA_no_response_time = document.getElementById("raw-3-settings-window-content-column-2").children[0];
    let no_response_time = Math.round(Number(DCA_no_response_time.value));
    if(typeof(no_response_time) === 'number' && no_response_time>0 && no_response_time<=this.DCA_maxes.NO_RESPONSE_TIME_MAX){
      DCA_settings_data.device_response_timeout = no_response_time;
    } else {
      DCA_settings_data.device_response_timeout = this.DCA_defaults.NO_RESPONSE_TIME_DEFAULT;
    }

    var DCA_no_start_timeout = document.getElementById("raw-4-settings-window-content-column-2").children[0];
    let no_start_timeout = Math.round(Number(DCA_no_start_timeout.value));
    if(typeof(no_start_timeout) === 'number' && no_start_timeout>0 && no_start_timeout<=this.DCA_maxes.NO_START_TIMEOUT_MAX){
      DCA_settings_data.device_no_start_timeout = no_start_timeout;
    } else {
      DCA_settings_data.device_no_start_timeout = this.DCA_defaults.NO_START_TIMEOUT_DEFAULT;
    }
    
    var DCA_device_handle_timeout = document.getElementById("raw-5-settings-window-content-column-2").children[0];
    let device_handle_timeout = Math.round(Number(DCA_device_handle_timeout.value));
    if(typeof(device_handle_timeout) === 'number' && device_handle_timeout>0 && device_handle_timeout<=this.DCA_maxes.DEVICE_HANDLE_TIMEOUT_MAX){
      DCA_settings_data.device_handle_timeout = device_handle_timeout;
    } else {
      DCA_settings_data.device_handle_timeout = this.DCA_defaults.DEVICE_HANDLE_TIMEOUT_DEFAULT;
    }

    var DCA_uno_search_timeout = document.getElementById("raw-6-settings-window-content-column-2").children[0];
    let uno_search_timeout = Math.round(Number(DCA_uno_search_timeout.value));
    if(typeof(uno_search_timeout) === 'number' && uno_search_timeout>0 && uno_search_timeout<=device_handle_timeout){
      DCA_settings_data.device_uno_start_search_timeout = uno_search_timeout;
    } else {
      DCA_settings_data.device_uno_start_search_timeout = Math.round(device_handle_timeout/2);
      var uno_timeout_component =  document.getElementById("raw-6-settings-window-content-column-2").children[0];
      uno_timeout_component.value = DCA_settings_data.device_uno_start_search_timeout;
    }

    return DCA_settings_data;
  }

  saveDCASettingsBluetooth(){
    let DCA_settings_data = {
      device_response_timeout_bluetooth: this.DCA_defaults_bluetooth.NO_RESPONSE_TIME_DEFAULT_BLUETOOTH   ,
      device_no_start_timeout_bluetooth: this.DCA_defaults_bluetooth.NO_START_TIMEOUT_DEFAULT_BLUETOOTH   ,
      device_handle_timeout_bluetooth: this.DCA_defaults_bluetooth.DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH,
      device_uno_start_search_timeout_bluetooth: this.DCA_defaults_bluetooth.UNO_TIMEOUT_DEFAULT_BLUETOOTH,
    };

    var DCA_no_response_time = document.getElementById("raw-7-settings-window-content-column-2").children[0];
    let no_response_time = Math.round(Number(DCA_no_response_time.value));
    if(typeof(no_response_time) === 'number' && no_response_time>0 && no_response_time<=this.DCA_maxes_bluetooth.NO_RESPONSE_TIME_MAX_BLUETOOTH){
      DCA_settings_data.device_response_timeout_bluetooth = no_response_time;
    } else {
      DCA_settings_data.device_response_timeout_bluetooth = this.DCA_defaults_bluetooth.NO_RESPONSE_TIME_DEFAULT_BLUETOOTH;
    }

    var DCA_no_start_timeout = document.getElementById("raw-8-settings-window-content-column-2").children[0];
    let no_start_timeout = Math.round(Number(DCA_no_start_timeout.value));
    if(typeof(no_start_timeout) === 'number' && no_start_timeout>0 && no_start_timeout<=this.DCA_maxes_bluetooth.NO_START_TIMEOUT_MAX_BLUETOOTH){
      DCA_settings_data.device_no_start_timeout = no_start_timeout;
    } else {
      DCA_settings_data.device_no_start_timeout_bluetooth = this.DCA_defaults_bluetooth.NO_START_TIMEOUT_DEFAULT_BLUETOOTH;
    }
    
    var DCA_device_handle_timeout = document.getElementById("raw-9-settings-window-content-column-2").children[0];
    let device_handle_timeout = Math.round(Number(DCA_device_handle_timeout.value));
    if(typeof(device_handle_timeout) === 'number' && device_handle_timeout>0 && device_handle_timeout<=this.DCA_maxes.DEVICE_HANDLE_TIMEOUT_MAX){
      DCA_settings_data.device_handle_timeout_bluetooth = device_handle_timeout;
    } else {
      DCA_settings_data.device_handle_timeout_bluetooth = this.DCA_defaults_bluetooth.DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH;
    }

    var DCA_uno_search_timeout = document.getElementById("raw-10-settings-window-content-column-2").children[0];
    let uno_search_timeout = Math.round(Number(DCA_uno_search_timeout.value));
    if(typeof(uno_search_timeout) === 'number' && uno_search_timeout>0 && uno_search_timeout<=device_handle_timeout){
      DCA_settings_data.device_uno_start_search_timeout_bluetooth = uno_search_timeout;
    } else {
      DCA_settings_data.device_uno_start_search_timeout_bluetooth = Math.round(device_handle_timeout/2);
      var uno_timeout_component_bluetooth =  document.getElementById("raw-10-settings-window-content-column-2").children[0];
      uno_timeout_component_bluetooth.value=DCA_settings_data.device_uno_start_search_timeout_bluetooth;
    }

    return DCA_settings_data;
  }

  saveSettings(){
    let settings_data = {};


    //This settings are DCA settings
    let DCA_settings_data = this.saveDCASettings();
    Object.keys(DCA_settings_data).map((key) => {
      settings_data[key]=DCA_settings_data[key];
    });
    //End of saving DCA settings

    //Saving DCA for bluetooth
    if(node_process.platform === "win32"){ //CHANGE TO "win32"
      DCA_settings_data = this.saveDCASettingsBluetooth();
      Object.keys(DCA_settings_data).map((key) => {
        settings_data[key]=DCA_settings_data[key];
      });
    }
    //End of saving DCA settings
    
    var fullscreen_interval_component =  document.getElementById("raw-1-settings-window-content-column-2").children[0];
    let fullscreen_interval =  Math.round(Number(fullscreen_interval_component.value));
    if(typeof(fullscreen_interval) === 'number' && fullscreen_interval>0 && typeof(settings_data.device_handle_timeout)!=='undefined'){
      settings_data.fullscreen_interval = fullscreen_interval;
    } else {
      settings_data.fullscreen_interval = this.VM.runtime.getFullscreenInterval();
    }

    var normal_mode_interval_component =  document.getElementById("raw-2-settings-window-content-column-2").children[0];
    let normal_mode_interval =  Math.round(Number(normal_mode_interval_component.value));
    if(typeof(normal_mode_interval) === 'number' && normal_mode_interval>0 && typeof(settings_data.device_handle_timeout)!=='undefined'){
      settings_data.normal_mode_interval =  normal_mode_interval;
    } else {
      settings_data.normal_mode_interval = this.VM.runtime.getNormalInterval();
    }

    let settings_data_serialized = JSON.stringify(settings_data);

    console.log(settings_data_serialized);

    //if ( (isNaN(fullscreen_interval)) || (typeof(fullscreen_interval) === 'undefined')) return

    this.VM.runtime.clearAvTimeInterval();  
    this.VM.runtime.setSettingsSaved();

    this.VM.runtime.setFullscreenInterval(fullscreen_interval);

    //  if ( (isNaN(normal_mode_interval)) || (typeof(normal_mode_interval) === 'undefined')) return;

    this.VM.runtime.setNormalInterval(normal_mode_interval);


     this.VM.DCA.set_all_intervals_in_dca(settings_data);
     this.VM.DCA.set_all_intervals_in_bluetooth(settings_data);


    this.deleteSettingsFile(() => {
      this.saveSettingsData(settings_data_serialized);
    });
  }

  saveSettingsData(settings_data){
    console.warn("saveSettings" + " data: " + settings_data);

    function errorHandler(e){        
      console.error("Error during saving settings: " + e);
    };

    function onInitFs(fs) {
      console.log('Opened file system: ' + fs.name);
      fs.root.getFile("settings" + "." + "json", {create: true}, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
              console.log('Settings write completed.');
            }
            fileWriter.onerror = function(e) {
              console.log('Settings writing failed: ' + e.toString());
            };
          var bb = new Blob([settings_data]); 
          fileWriter.write(bb);
        });
      }, errorHandler);
    };

    navigator.webkitPersistentStorage.requestQuota(500*1024*1024, //500Мб
          function(grantedBytes){
            console.log("byte granted=" + grantedBytes);
            window.webkitRequestFileSystem(PERSISTENT, grantedBytes, onInitFs, errorHandler);
          }, errorHandler
      );
  }

  deleteSettingsFile(callback){
    var  errorHandler = function(e){
      if((''+e).localeCompare("NotFoundError: A requested file or directory could not be found at the time an operation was processed.")!=0)
        console.error("File error during removing bad settings file: " + e);
      else
        if(typeof(callback) === 'function') callback();
    };

    var _onInitFs = function(fs){
          fs.root.getFile("settings.json", {create: false}, function(fileEntry) {
            fileEntry.remove(() => {
                console.log('File settings.json was removed.');
                if(typeof(callback) === 'function') callback();
              }, errorHandler);
      }, errorHandler);
    }

    navigator.webkitPersistentStorage.requestQuota(500*1024*1024,
      function(grantedBytes){
    //      console.log("byte granted=" + grantedBytes);
          window.webkitRequestFileSystem(PERSISTENT, grantedBytes, _onInitFs, errorHandler);
      }, errorHandler);
  }

  setDefaultsDCAValues(){

      var no_response_time_component =  document.getElementById("raw-3-settings-window-content-column-2").children[0];
      var no_start_timeout_component =  document.getElementById("raw-4-settings-window-content-column-2").children[0];
      var device_handle_timeout_component =  document.getElementById("raw-5-settings-window-content-column-2").children[0];
      var uno_timeout_component =  document.getElementById("raw-6-settings-window-content-column-2").children[0];

      no_response_time_component.value =  this.DCA_defaults.NO_RESPONSE_TIME_DEFAULT;
      no_start_timeout_component.value =  this.DCA_defaults.NO_START_TIMEOUT_DEFAULT;
      device_handle_timeout_component.value =  this.DCA_defaults.DEVICE_HANDLE_TIMEOUT_DEFAULT;
      uno_timeout_component.value =  this.DCA_defaults.UNO_TIMEOUT_DEFAULT;

      if(node_process.platform === "win32"){ //CHANGE TO "win32"

        var no_response_time_component_bluetooth =  document.getElementById("raw-7-settings-window-content-column-2").children[0];
        var no_start_timeout_component_bluetooth =  document.getElementById("raw-8-settings-window-content-column-2").children[0];
        var device_handle_timeout_component_bluetooth =  document.getElementById("raw-9-settings-window-content-column-2").children[0];
        var uno_timeout_component_bluetooth =  document.getElementById("raw-10-settings-window-content-column-2").children[0];

        no_response_time_component_bluetooth.value = this.DCA_defaults_bluetooth.NO_RESPONSE_TIME_DEFAULT_BLUETOOTH;
        no_start_timeout_component_bluetooth.value =  this.DCA_defaults_bluetooth.NO_START_TIMEOUT_DEFAULT_BLUETOOTH;
        device_handle_timeout_component_bluetooth.value =  this.DCA_defaults_bluetooth.DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH;
        uno_timeout_component_bluetooth.value =  this.DCA_defaults_bluetooth.UNO_TIMEOUT_DEFAULT_BLUETOOTH;
      }

     


  }


  componentDidMount(){

    this.VM = this.props.VM;

    this.DCA_defaults = this.VM.DCA.getDefaultValuesOfIntervals();
    this.DCA_maxes = this.VM.DCA.getMaxValuesOfIntervals();
    this.DCA_defaults_bluetooth = this.VM.DCA.getDefaultValuesOfIntervalsBluetooth();
    this.DCA_maxes_bluetooth = this.VM.DCA.getMaxValuesOfIntervalsBluetooth();

    this.readSettings().then((result) => {
      var fullscreen_interval_component =  document.getElementById("raw-1-settings-window-content-column-2").children[0];
      var normal_mode_interval_component =  document.getElementById("raw-2-settings-window-content-column-2").children[0];
      var no_response_time_component =  document.getElementById("raw-3-settings-window-content-column-2").children[0];
      var no_start_timeout_component =  document.getElementById("raw-4-settings-window-content-column-2").children[0];
      var device_handle_timeout_component =  document.getElementById("raw-5-settings-window-content-column-2").children[0];
      var uno_timeout_component =  document.getElementById("raw-6-settings-window-content-column-2").children[0];

      if(node_process.platform === "win32"){ //CHANGE TO "win32"
        var no_response_time_component_bluetooth =  document.getElementById("raw-7-settings-window-content-column-2").children[0];
        var no_start_timeout_component_bluetooth =  document.getElementById("raw-8-settings-window-content-column-2").children[0];
        var device_handle_timeout_component_bluetooth =  document.getElementById("raw-9-settings-window-content-column-2").children[0];
        var uno_timeout_component_bluetooth =  document.getElementById("raw-10-settings-window-content-column-2").children[0];
      }

      if (result.file_exists){
        try {
          let settings_data =  JSON.parse(result.file);

          let fullscreen_interval = settings_data.fullscreen_interval || this.VM.runtime.getFullscreenInterval();
          let normal_mode_interval = settings_data.normal_mode_interval || this.VM.runtime.getNormalInterval();
          fullscreen_interval_component.value = fullscreen_interval;
          normal_mode_interval_component.value = normal_mode_interval;

          let no_response_timeout = Math.round(Number(settings_data.device_response_timeout));
          let no_start_timeout = Math.round(Number(settings_data.device_no_start_timeout));
          let uno_timeout = Math.round(Number(settings_data.device_uno_start_search_timeout));
          let device_handle_timeout = Math.round(Number(settings_data.device_handle_timeout));
          no_response_time_component.value=no_response_timeout;
          no_start_timeout_component.value=no_start_timeout;
          device_handle_timeout_component.value=device_handle_timeout;
          uno_timeout_component.value=uno_timeout;

          if(node_process.platform === "win32"){ //CHANGE TO "win32"
            let no_response_timeout_bluetooth = Math.round(Number(settings_data.device_response_timeout_bluetooth));
            let no_start_timeout_bluetooth = Math.round(Number(settings_data.device_no_start_timeout_bluetooth));
            let uno_timeout_bluetooth = Math.round(Number(settings_data.device_uno_start_search_timeout_bluetooth));
            let device_handle_timeout_bluetooth = Math.round(Number(settings_data.device_handle_timeout_bluetooth));
            no_response_time_component_bluetooth.value=no_response_timeout_bluetooth;
            no_start_timeout_component_bluetooth.value=no_start_timeout_bluetooth;
            device_handle_timeout_component_bluetooth.value=device_handle_timeout_bluetooth;
            uno_timeout_component_bluetooth.value=uno_timeout_bluetooth;
          }

          this.VM.runtime.setFullscreenInterval(fullscreen_interval);
          this.VM.runtime.setNormalInterval(normal_mode_interval);

          this.VM.DCA.set_all_intervals_in_dca(settings_data);
          this.VM.DCA.set_all_intervals_in_bluetooth(settings_data);
        } catch (error) {
          console.error(error);

          this.deleteSettingsFile();

          let fullscreen_interval =  this.VM.runtime.getFullscreenInterval();
          fullscreen_interval_component.value = fullscreen_interval;

          let normal_mode_interval =  this.VM.runtime.getNormalInterval();
          normal_mode_interval_component.value = normal_mode_interval; 

          this.setDefaultsDCAValues();

        }
      }else{
          let fullscreen_interval =  this.VM.runtime.getFullscreenInterval();
          fullscreen_interval_component.value = fullscreen_interval;

          let normal_mode_interval =  this.VM.runtime.getNormalInterval();
          normal_mode_interval_component.value = normal_mode_interval;

          this.setDefaultsDCAValues();
      }
    });
  }

  render() {
    return (
      <div id="settings-window" className={styles.settings_window}>

        <div id="settings-window-tittle" className={styles.settings_window_tittle}>

          {this.props.intl.formatMessage(messages.settings_window)}
          <div className={styles.close_icon} onClick={this.onThisWindowClose.bind(this)}></div>

        </div>

        <div id="settings-window-content" className={styles.settings_window_content}>

          <div id="settings-window-content-raw-intervals-title" className={styles.settings_window_content_raw}>

            <div id="raw-intervals-title-settings-window-content-column-1" className={styles.settings_window_content_column}>

                   <b>{this.props.intl.formatMessage(messages.intervals_for_blocks_chain)}</b>

            </div>

          
          </div>


          <div id="settings-window-content-raw-1" className={styles.settings_window_content_raw}>

            <div id="raw-1-settings-window-content-column-1" className={styles.settings_window_content_column}>
              {this.props.intl.formatMessage(messages.fullscreen_interval)}
            </div>

            <div id="raw-1-settings-window-content-column-2" className={styles.settings_window_content_column}>
              <input type="number" />
            </div>
          
          </div>

          <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw}>
            <div id="raw-2-settings-window-content-column-1" className={styles.settings_window_content_column}>
              {this.props.intl.formatMessage(messages.normal_mode_interval)}
            </div>

            <div id="raw-2-settings-window-content-column-2" className={styles.settings_window_content_column}>
                <input type="number" />
            </div>
          </div>

            <div id="settings-window-content-raw-intervals-for-usb" className={styles.settings_window_content_raw}>

            <div id="raw-intervals-for-usb-settings-window-content-column-1" className={styles.settings_window_content_column}>

                   <b>{this.props.intl.formatMessage(messages_for_DCA_intervals.for_usb)}</b>

            </div>

          
          </div>
        
          <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw}>
            <div id="raw-3-settings-window-content-column-1" className={styles.settings_window_content_column}>
              {this.props.intl.formatMessage(messages_for_DCA_intervals.no_response_time)}
            </div>

            <div id="raw-3-settings-window-content-column-2" className={styles.settings_window_content_column}>
                <input type="number" />
            </div>
          </div>
        

          <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw}>
            <div id="raw-4-settings-window-content-column-1" className={styles.settings_window_content_column}>
              {this.props.intl.formatMessage(messages_for_DCA_intervals.no_start_timeout)}
            </div>

            <div id="raw-4-settings-window-content-column-2" className={styles.settings_window_content_column}>
                <input type="number" />
            </div>
          </div>
        

          <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw} >
            <div id="raw-5-settings-window-content-column-1" className={styles.settings_window_content_column}>
              {this.props.intl.formatMessage(messages_for_DCA_intervals.device_handle_timeout)}
            </div>

            <div id="raw-5-settings-window-content-column-2" className={styles.settings_window_content_column}>
                <input type="number" />
            </div>
          </div>

          <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw} >
            <div id="raw-6-settings-window-content-column-1" className={styles.settings_window_content_column}>
              {this.props.intl.formatMessage(messages_for_DCA_intervals.uno_timeout)}
            </div>

            <div id="raw-6-settings-window-content-column-2" className={styles.settings_window_content_column}>
                <input type="number" />
            </div>  
          </div>

          {(node_process.platform === "win32")? //CHANGE TO "win32"
            <div>

              <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw}>
                <div id="raw-1337-settings-window-content-column-1" className={styles.settings_window_content_column}>
                  <b>{this.props.intl.formatMessage(messages_for_DCA_intervals.for_bluetooth)}</b>
                </div>
              </div>
            
            
              <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw}>
                <div id="raw-7-settings-window-content-column-1" className={styles.settings_window_content_column}>
                  {this.props.intl.formatMessage(messages_for_DCA_intervals.no_response_time_bluetooth)}
                </div>

                <div id="raw-7-settings-window-content-column-2" className={styles.settings_window_content_column}>
                    <input type="number" />
                </div>
              </div>
            

              <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw}>
                <div id="raw-8-settings-window-content-column-1" className={styles.settings_window_content_column}>
                  {this.props.intl.formatMessage(messages_for_DCA_intervals.no_start_timeout_bluetooth)}
                </div>

                <div id="raw-8-settings-window-content-column-2" className={styles.settings_window_content_column}>
                    <input type="number" />
                </div>
              </div>
            

              <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw} >
                <div id="raw-9-settings-window-content-column-1" className={styles.settings_window_content_column}>
                  {this.props.intl.formatMessage(messages_for_DCA_intervals.device_handle_timeout_bluetooth)}
                </div>

                <div id="raw-9-settings-window-content-column-2" className={styles.settings_window_content_column}>
                    <input type="number" />
                </div>
              </div>

              <div id="settings-window-content-raw-2" className={styles.settings_window_content_raw} >
                <div id="raw-10-settings-window-content-column-1" className={styles.settings_window_content_column}>
                  {this.props.intl.formatMessage(messages_for_DCA_intervals.uno_timeout_bluetooth)}
                </div>

                <div id="raw-10-settings-window-content-column-2" className={styles.settings_window_content_column}>
                    <input type="number" />
                </div>  
              </div>
            </div>:""
          }          

          <div id="settings-window-content-raw-3" className={styles.settings_window_content_raw}>

            <div id="raw-11-settings-window-content-column-1" className={styles.settings_window_content_column}>
              <button onClick={this.saveSettings.bind(this)}> {this.props.intl.formatMessage(messages.save_settings)} </button>
            </div>
            <div id="raw-11-settings-window-content-column-2" className={styles.settings_window_content_column}></div>

          </div>
        </div>
      </div>
    )
  };
}

const mapStateToProps =  state => ({});

const mapDispatchToProps = dispatch => ({
  onSettingsWindowClose: () => {
      dispatch(ActionTriggerDraggableWindow(4));
    }
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsWindowComponent));
