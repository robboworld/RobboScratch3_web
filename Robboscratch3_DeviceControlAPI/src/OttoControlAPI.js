/* @flow */
import DeviceControlAPI from './DeviceControlAPI';
//import OttoSensorsData from './OttoSensorsData';
import {InterfaceDevice,searchDevices,getConnectedDevices,pushConnectedDevices,DEVICES,DEVICE_STATES} from './chrome';
const DEVICE_HANDLE_TIMEOUT:number = 1 * 60 * 1000;
type OttoSensorsData = {

                      distance :  number,
                       hearing : number
};
export default class OttoControlAPI extends DeviceControlAPI {



    OttoSensorsDataRecievingState:SensorsDataRecievingState;
    SensorsData:OttoSensorsData;

    ConnectedDevices: Array<InterfaceDevice>;
    ConnectedOttos: Array<InterfaceDevice>;
    ConnectedOttosSerials:Array<string>;

    handleConnectedDevicesInterval:IntervalID;
    DataRecievingLoopInterval:IntervalID;
    automaticDeviceHandleProcessStopTimeout:any;
    sensors_array:Array<number>;
  constructor(){
     super();
     this.init_all();
     this.searching_in_progress = false;
     this.sensors_array = [0,0];
     this.stopSearchProcess();
     this.stopDataRecievingProcess();

     this.otto_status_change_cb = () => {};
  }
  init_all(){
      //this.RobotSensorsDataRecievingState = SensorsDataRecievingStates.STOPED;
      this.ConnectedDevices = [];
      this.ConnectedOttos = [];
      this.ConnectedOttosSerials = [];
      this.dataRecieveTime = 0;
      this.previousOttoState = DEVICE_STATES["INITED"];
      this.currentOttoState =  DEVICE_STATES["INITED"];
//      this.a_can_send = true;
  }

searchOttoDevices(){
        this.init_all();
        this.stopDataRecievingProcess();
        this.searching_in_progress = true;
        if (typeof(this.otto_status_change_cb) === 'function'){
              this.otto_status_change_cb(this.currentOttoState,this.searching_in_progress);
        }
       this.handleConnectedDevicesInterval  =  setInterval(
           function (self){
              let devices:Array<InterfaceDevice> = getConnectedDevices();
                         self.ConnectedDevices = devices;
                      handleConnectedDevices(self.ConnectedDevices,self);
           }
           ,100,this);
         this.automaticDeviceHandleProcessStopTimeout =  setTimeout(function(self){
               console.log("Stop devices handle process.");
               clearInterval(self.handleConnectedDevicesInterval);
               self.searching_in_progress = false;
               if (typeof(self.otto_status_change_cb) === 'function'){
                 self.otto_status_change_cb(self.currentOttoState,self.searching_in_progress);
              }
           }  ,DEVICE_HANDLE_TIMEOUT,this);
           var handleConnectedDevices = function (Devices,self:OttoControlAPI){
             //     console.log("Handle connected devices.")
             if ((typeof(Devices)!== 'undefined'))  {
               if ((Devices.length != 0) ){
                 Devices.forEach(
                     function (device:InterfaceDevice){
                       if ((device!=null)&&([5].indexOf(device.getDeviceID())!=-1 ) && (device.getState() == DEVICE_STATES["DEVICE_IS_READY"])){
                         if (self.ConnectedOttosSerials.indexOf(device.getSerialNumber()) == -1 ){
                           console.warn("We have new ready OTTTO!!!");
                            self.searching_in_progress = false;
                             if (typeof(self.otto_status_change_cb) === 'function'){
                                self.otto_status_change_cb(self.currentOttoState,self.searching_in_progress);
                             }
                        //   self.searching_in_progress = false;
                           console.warn("Otto serial: " + device.getSerialNumber());
                           self.startDataRecievingLoop(device);
                           self.ConnectedOttos.push(device);
                           self.ConnectedOttosSerials.push(device.getSerialNumber());
                          // device.command(DEVICES[device.getDeviceID()].commands.sensors, self.sensors_array, function(response){});
                         }
                       }else{
                          //   console.log("Device ID: " + device.getDeviceID()  + " " + "State:  " + device.getState() + " " + "State name: " + self.getStateNameByID(device.getState())
                            //                 + " " + "Device serial: " + device.getSerialNumber() );
                       }
                     }
                 );
            }else{
              //     console.log("Devices array is empty");
            }
           }
         }
      }

      checkOttoByPort(port,callback){

          var result = {};
          result.device = {};

          result.code = -1;
          result.device.id = -1;
          result.device.firmware_version = -1;
          result.device.serial_number = -1;

          for (var i = 0; i < this.ConnectedOttos.length; i++) {

                if ((this.ConnectedOttos[i].getPortName() == port) && (this.ConnectedOttos[i].getState() == DEVICE_STATES["DEVICE_IS_READY"]) ){

                  result.code = 0;
                  result.device.id = this.ConnectedOttos[i].getDeviceID();
                  result.device.firmware_version = this.ConnectedOttos[i].getFirmwareVersion();
                  result.device.serial_number = this.ConnectedOttos[i].getShorterSerialNumber();

                  callback(result);

                  return;

                }

          }

              callback(result);

      }

stopDataRecievingProcess(){

        console.log("stopDataRecievingProcess");

        if ( typeof (this.DataRecievingLoopInterval) !== 'undefined' ){

            clearInterval(this.DataRecievingLoopInterval);

          }

        this.can_autoreconnect = false;
         console.log("this.can_autoreconnect = false;                                                                                   stopDatarecieving lol");
      }

discon(onDisconnectedCb){
           if(typeof(this.ConnectedOttos[0])!='undefined'){
               this.ConnectedOttos[0].disco(onDisconnectedCb);
           }
        //     else{
        //         let devices = getConnectedDevices();
        //         devices.forEach((device,device_index) => {
        //             console.log(`Close device: ${device.getPortName()}`);
        //             device.disco();
        //         });
        //  }
}

getSensorData(sensor_index:number){
      switch (this.sensors_array[sensor_index]) {
        case 1: //line
        case 2: //led
        case 3: //light
        case 4://touch
        case 5://proximity
              return Math.round(this.SensorsData[`a${sensor_index}`][3] / 2.55);
        //  break;
        case 6: //proximity
              return (this.SensorsData[`a${sensor_index}`][2] * 256 + this.SensorsData[`a${sensor_index}`][3] );
        //break;
        default:
            return  -1;
      }
}

proxy_func_OttoStatusChange(){
    if (typeof(this.ConnectedOttos[0]) != 'undefined'){
      this.currentOttoState = this.ConnectedOttos[0].getState();
      if ((this.currentOttoState != this.previousOttoState)){
        this.otto_status_change_cb(this.currentOttoState,this.searching_in_progress);
         this.previousOttoState =   this.currentOttoState;
      }
    }
}

runOttoStatusChangeLoop(){
    this.OttoStatusChangeLoopInterval = setInterval(this.proxy_func_OttoStatusChange.bind(this),300);
}

registerOttoStatusChangeCallback(otto_status_change_cb:any){
        this.otto_status_change_cb = otto_status_change_cb;
        this.runOttoStatusChangeLoop();
}

runDataRecieveCommand(device:InterfaceDevice){
  if ((typeof(this.ConnectedOttos[0])!='undefined') &&this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    if (this.ConnectedOttos[0].isReadyToAcceptCommand()){
       this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.check, [], (response) => {
           this.SensorsData = response;
             this.dataRecieveTime = Date.now();
        });
    }
  }
}
startDataRecievingLoop(otto:InterfaceDevice){
        console.log("startDataRecievingLoop");
              // if (this.OttoSensorsDataRecievingState == SensorsDataRecievingStates.STOPED ){
              //     this.OttoSensorsDataRecievingState == SensorsDataRecievingStates.STARTED;
                  this.DataRecievingLoopInterval = setInterval(this.runDataRecieveCommand.bind(this,otto),0);
              //  }
}

stopSearchProcess(){
  console.log("stopSearchProcess");
    clearInterval(this.handleConnectedDevicesInterval);
    clearTimeout(this.automaticDeviceHandleProcessStopTimeout);
    this.searching_in_progress = false;
    if ( typeof (this.ConnectedDevices) != 'undefined'){
          this.ConnectedDevices.forEach(function(device:InterfaceDevice){
                device.stopCheckingSerialNumber();
          });
    }
}



  move_servo_foot(lf,rf,ll,rl,speed){
    rl=180-rl;
    rf=180-rf;
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.ze,[ll,rl,lf,rf,speed], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
               });
             }
  }
  move_servo_hand(left,right,speed){
    right=180-right;
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.ye,[left,right,speed], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
               });
  }}
  move_servo_one(serv_num,grad,speed){
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    let lol = serv_num+speed*8;
    if((serv_num==1)||(serv_num==3)||(serv_num==5))
    grad = 180 -grad;
    this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.se,[lol,grad], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
               });
  }}
  one_led(str,stl,bool){
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    let lol = bool*1+str*2+stl*16;
    console.warn(lol);
    this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.de,[lol], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
               });
  }}
  all_led(arr){
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.ee,[arr[0],arr[1],arr[2],arr[3],arr[4],arr[5],arr[6],arr[7]], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
               });
  }}
  nose(r,g,b){

      if((typeof(this.ConnectedOttos[0])!='undefined') && [5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){//  console.warn("NOSA!");
    this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.ge,[r,g,b], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
               });
  }}
  play_sound(note,dur){
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    //console.warn((note%256)+"sec: "+Number(Number(Math.floor(note/256)*16)+Number(dur)));
    //console.warn(dur);
    this.ConnectedOttos[0].command(DEVICES[this.ConnectedOttos[0].getDeviceID()].commands.he,[Number(note)%256,Number(Math.floor(Number(note)/256)*16)+Number(dur)], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
               });
  }}
  get_dist(){
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
      return this.SensorsData['distance'];}
      return(-1);
  }
  get_sound(){
    if((typeof(this.ConnectedOttos[0])!='undefined') &&[5].indexOf(this.ConnectedOttos[0].getDeviceID()) != -1 && this.ConnectedOttos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    return this.SensorsData['hearing'];}return(-1);
  }
}
