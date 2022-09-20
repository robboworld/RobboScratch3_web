

import {
  InterfaceDevice,
  searchDevices,
  getConnectedDevices,
  DEVICES,
  DEVICE_STATES,
  trigger_logging,
  DEVICE_HANDLE_TIMEOUT,
  NO_RESPONSE_TIME,
  set_all_intervals,
  NO_RESPONSE_TIME_MAX, 
  NO_START_TIMEOUT_MAX,
  DEVICE_HANDLE_TIMEOUT_MAX,
  DEVICE_HANDLE_TIMEOUT_DEFAULT,
  NO_RESPONSE_TIME_DEFAULT,
  NO_START_TIMEOUT_DEFAULT,
  UNO_TIMEOUT_DEFAULT,
} from './chrome';

import {
  searchBluetoothDevices,
  DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH,
  NO_RESPONSE_TIME_DEFAULT_BLUETOOTH,
  NO_START_TIMEOUT_DEFAULT_BLUETOOTH,
  UNO_TIMEOUT_DEFAULT_BLUETOOTH,
  DEVICE_HANDLE_TIMEOUT_MAX_BLUETOOTH,
  NO_RESPONSE_TIME_MAX_BLUETOOTH,
  NO_START_TIMEOUT_MAX_BLUETOOTH,
  set_all_intervals_bluetooth,
} from './bluetooth-chrome';

import {flash_firmware,search_ports} from './firmware_flasher_new';

export default  class DeviceControlAPI {

    constructor(){


      this.onErrorCb = () => {};
      this.onFirmwareVersionDiffersCbMap = {};

      this.onDevicesNotFoundCb = () => {};

      this.onDeviceStatusChangeCbMap = {};

      this.onDeviceFoundCb = () => {};

      this.onDevicesStartSearchingCb = () => {};

      this.onBluetoothDevicesFoundCb = () => {};

      this.deviceList = [];
      this.bluetoothDevicesList = [];

    }

   set_all_intervals_in_dca(obj){
    set_all_intervals(obj);
  }

  set_all_intervals_in_bluetooth(obj){
    set_all_intervals_bluetooth(obj);
  }

      searchAllDevices(){

        //var devices = [];

        

            searchDevices((devices) => {

              this.onDevicesStartSearchingCb();

              this.deviceList = devices;

              if (devices.length == 0){

                this.onDevicesNotFoundCb();
              }

              for (let index = 0; index < devices.length; index++){

                  if (devices[index] == null) return;

                  devices[index].registerFirmwareVersionDiffersCallback( (result) => {


                    let cb =  this.onFirmwareVersionDiffersCbMap[devices[index].getPortName()];

                     if (typeof(cb) == 'function'){

                       cb(result);

                    }

                     

                  });

                  devices[index].registerErrorCallback(this.onErrorCb);
                
                  devices[index].registerDeviceStatusChangeCallback((state) => {

                    let cb =  this.onDeviceStatusChangeCbMap[devices[index].getPortName()];

                     if (typeof(cb) == 'function'){

                       cb(state);

                    }

                  

                  });


                  let device = {

                     // deviceSerial: devices[index].getShorterSerialNumber(),
                      devicePort: devices[index].getPortName(),
                       deviceId: devices[index].getDeviceID() 
                     // deviceFirmwareVersion: devices[index].getFirmwareVersion()
                  }

                    //  console.warn("onDeviceFound");

                     this.onDeviceFoundCb(device);

              }

            });

            return ; //for web serial test 

            if (node_process.platform !== "win32") return;
          
            this.bluetoothDevicesList = [];

            searchBluetoothDevices(this.onBluetoothDevicesNotFoundCb,(device) => {

               if (device == null) return;

              this.onBluetoothDevicesFoundCb();

              device.registerFirmwareVersionDiffersCallback( (result) => {


                let cb =  this.onFirmwareVersionDiffersCbMap[device.getPortName()];

                 if (typeof(cb) == 'function'){

                   cb(result);

                }

                 

              });

              //device.registerErrorCallback(this.onErrorCb);
            
              device.registerDeviceStatusChangeCallback((state) => {

                let cb =  this.onDeviceStatusChangeCbMap[device.getPortName()];

                 if (typeof(cb) == 'function'){

                   cb(state);

                }

              

              });

              this.bluetoothDevicesList.push(device);

              let bluetooth_device = {

                
                 devicePort: device.getPortName(),
                 deviceId: device.getDeviceID() 
                
             }

               //  console.warn("onDeviceFound");

                this.onDeviceFoundCb(bluetooth_device);


            });


              


      }

      registerFirmwareVersionDiffersCallback(port_name,cb){

        if (typeof(cb) == 'function'){

             this.onFirmwareVersionDiffersCbMap[port_name] = cb;

        }


      }

      registerErrorCallback(cb){

        if (typeof(cb) == 'function'){

             this.onErrorCb = cb;

        }


      }

      registerDevicesNotFoundCallback(cb){

         if (typeof(cb) == 'function'){

             this.onDevicesNotFoundCb = cb;

        }

      }

      registerDeviceFoundCallback(cb){

        if (typeof(cb) == 'function'){

             this.onDeviceFoundCb = cb;

        }

      }

      registerBluetoothDevicesNotFoundCallback(cb){

        if (typeof(cb) == 'function'){

          this.onBluetoothDevicesNotFoundCb = cb;

     }

      }

       registerDeviceStatusChangeCallback(port_name,cb){

         if (typeof(cb) == 'function'){

             this.onDeviceStatusChangeCbMap[port_name] = cb;

        }

      }

      registerDevicesStartSearchingCallback(cb){

        if (typeof(cb) == 'function'){

          this.onDevicesStartSearchingCb = cb;

     }

     
     

      }

      registerBluetoothDevicesFoundCallback(cb){

        if (typeof(cb) == 'function'){

          this.onBluetoothDevicesFoundCb = cb;

     }

      }

      discon(device_port,onDisconnectedCb)
      {
    
            let devices = this.deviceList;
   
             devices.forEach((device,device_index) => {
   
                 console.log(`Close device: ${device.getPortName()}`);
                 device.disco(onDisconnectedCb,device_port);
   
             });
   
      
   
   }

   getRecieveTimeDelta(){

     for (let index = 0; index <this.deviceList.length; index++){

       if (/*(this.deviceList.length > 0) && */(this.deviceList[index] != null)){

        return this.deviceList[0].getRecieveTimeDelta();

      }
      // else{

      //   return 0;
      // }

     }

     return 0;



     

   }

      triggerLogging(){


            trigger_logging();
      }

      flashFirmware(port_path,config,callback){

        // config.device.device_id = 2;
        // config.device.device_firmware_version = 2;

          flash_firmware(port_path,callback,config);

      }

      searchPorts(callback){

        console.log(`searchPorts`)

            search_ports(callback);

      }

      getDevices(){


          return this.deviceList.concat(this.bluetoothDevicesList);
      }

      getDeviceStates(){

          return DEVICE_STATES;
      }

      getTimeoutVars(){

        return {

          DEVICE_HANDLE_TIMEOUT: DEVICE_HANDLE_TIMEOUT,
          NO_RESPONSE_TIMEOUT: NO_RESPONSE_TIME

        }

      }

      getDefaultValuesOfIntervals(){
        return{
          DEVICE_HANDLE_TIMEOUT_DEFAULT: DEVICE_HANDLE_TIMEOUT_DEFAULT,
          NO_RESPONSE_TIME_DEFAULT: NO_RESPONSE_TIME_DEFAULT,
          NO_START_TIMEOUT_DEFAULT: NO_START_TIMEOUT_DEFAULT,
          UNO_TIMEOUT_DEFAULT: UNO_TIMEOUT_DEFAULT,
        }
      }

      getMaxValuesOfIntervals(){
        return{
          NO_RESPONSE_TIME_MAX: NO_RESPONSE_TIME_MAX, 
          NO_START_TIMEOUT_MAX: NO_START_TIMEOUT_MAX,
          DEVICE_HANDLE_TIMEOUT_MAX: DEVICE_HANDLE_TIMEOUT_MAX,
        }
      }

      getMaxValuesOfIntervalsBluetooth(){
        return{
          DEVICE_HANDLE_TIMEOUT_MAX_BLUETOOTH,
          NO_RESPONSE_TIME_MAX_BLUETOOTH,
          NO_START_TIMEOUT_MAX_BLUETOOTH,
        }
      }

      getDefaultValuesOfIntervalsBluetooth(){
        return{
          DEVICE_HANDLE_TIMEOUT_DEFAULT_BLUETOOTH,
          NO_RESPONSE_TIME_DEFAULT_BLUETOOTH,
          NO_START_TIMEOUT_DEFAULT_BLUETOOTH,
          UNO_TIMEOUT_DEFAULT_BLUETOOTH,
        }
      }



}
