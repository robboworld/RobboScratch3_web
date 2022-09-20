/* @flow */
import DeviceControlAPI from './DeviceControlAPI';//modified_by_kpk
//import ArduinoSensorsData from './ArduinoSensorsData';
import {InterfaceDevice,searchDevices,getConnectedDevices,pushConnectedDevices,DEVICES,DEVICE_STATES} from './chrome';
const DEVICE_HANDLE_TIMEOUT:number = 1 * 60 * 1000;
type ArduinoSensorsData = {

                      a0 :  number,
                      a1 : number,
                      a2 : number,
                      a3 : number,
                      a4 : number,
                      a5 : number,
                      a6 : number,
                      a7 : number,
                      a8 : number,
                      a9 : number,
                      a10 : number,
                      a11 : number,
                      a12 : number,
                      a13 : number,
                      a14 : number,
                      a15 : number,
                      a16 : number,
                      a17 : number,
                      a18 : number,
                      a19 : number
};
export default class ArduinoControlAPI extends DeviceControlAPI {



    ArduinoSensorsDataRecievingState:SensorsDataRecievingState;
    SensorsData:ArduinoSensorsData;

    ConnectedDevices: Array<InterfaceDevice>;
    ConnectedArduinos: Array<InterfaceDevice>;
    ConnectedArduinosSerials:Array<string>;

    handleConnectedDevicesInterval:IntervalID;
    DataRecievingLoopInterval:IntervalID;
    automaticDeviceHandleProcessStopTimeout:any;
    sensors_array:Array<number>;
  constructor(){
     super();
     this.init_all();
     this.searching_in_progress = false;
     this.flag_for_pin=false;
     this.sensors_array = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
     this.stopSearchProcess();
     this.stopDataRecievingProcess();

     this.arduino_status_change_callback = () => {};

  }
  init_all(){
      //this.RobotSensorsDataRecievingState = SensorsDataRecievingStates.STOPED;
      this.ConnectedDevices = [];
      this.ConnectedArduinos = [];
      this.ConnectedArduinosSerials = [];
      this.dataRecieveTime = 0;
      this.previousArduinoState = DEVICE_STATES["INITED"];
      this.currentArduinoState =  DEVICE_STATES["INITED"];
//      this.a_can_send = true;
  }

searchArduinoDevices(){
        this.init_all();
        this.stopDataRecievingProcess();
        this.searching_in_progress = true;

        if (this.arduino_status_change_callback !== null){
              this.arduino_status_change_callback(this.currentArduinoState,this.searching_in_progress);
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
               if (self.arduino_status_change_callback !== null){
                  self.arduino_status_change_callback(self.currentArduinoState,self.searching_in_progress);
               }
           }  ,DEVICE_HANDLE_TIMEOUT,this);
           var handleConnectedDevices = function (Devices,self:ArduinoControlAPI){
             //     console.log("Handle connected devices.")
             if ((typeof(Devices)!== 'undefined'))  {
               if ((Devices.length != 0) ){
                 Devices.forEach(
                     function (device:InterfaceDevice){
                       if ((device!=null)&&([6].indexOf(device.getDeviceID())!=-1 ) && (device.getState() == DEVICE_STATES["DEVICE_IS_READY"])){
                         if (self.ConnectedArduinosSerials.indexOf(device.getSerialNumber()) == -1 ){
                           console.warn("We have new ready ARDUINO!!!");
                            self.searching_in_progress = false;
                             if (self.arduino_status_change_callback !== null){
                                self.arduino_status_change_callback(self.currentArduinoState,self.searching_in_progress);
                             }
                        //   self.searching_in_progress = false;
                           console.warn("Arduino serial: " + device.getSerialNumber());
                           self.startDataRecievingLoop(device);
                           self.ConnectedArduinos.push(device);
                           self.ConnectedArduinosSerials.push(device.getSerialNumber());
                      //     device.command(DEVICES[device.getDeviceID()].commands.sensors, self.sensors_array, function(response){});
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

stopDataRecievingProcess(){

        console.log("stopDataRecievingProcess");

        if ( typeof (this.DataRecievingLoopInterval) !== 'undefined' ){

            clearInterval(this.DataRecievingLoopInterval);

          }

        this.can_autoreconnect = false;
         console.log("this.can_autoreconnect = false;                                                                                   stopDatarecieving lol");
      }

discon(onDisconnectedCb){
           if(typeof(this.ConnectedArduinos[0])!='undefined'){
               this.ConnectedArduinos[0].disco(onDisconnectedCb);
           }
        //     else{
        //         let devices = getConnectedDevices();
        //         devices.forEach((device,device_index) => {
        //             console.log(`Close device: ${device.getPortName()}`);
        //             device.disco(onDisconnectedCb);
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
        case 6: //proximity
              return (this.SensorsData[`a${sensor_index}`][2] * 256 + this.SensorsData[`a${sensor_index}`][3] );
        //break;
        default:
            return  -1;
      }
}

proxy_func_ArduinoStatusChange(){
    if (typeof(this.ConnectedArduinos[0]) != 'undefined'){
      this.currentArduinoState = this.ConnectedArduinos[0].getState();
      if ((this.currentArduinoState != this.previousArduinoState)){
        this.arduino_status_change_callback(this.currentArduinoState,this.searching_in_progress);
         this.previousArduinoState =   this.currentArduinoState;
      }
    }
}

runArduinoStatusChangeLoop(){
    this.ArduinoStatusChangeLoopInterval = setInterval(this.proxy_func_ArduinoStatusChange.bind(this),300);
}

registerArduinoStatusChangeCallback(arduino_status_change_cb:any){
        this.arduino_status_change_callback = arduino_status_change_cb;
        this.runArduinoStatusChangeLoop();
}

runDataRecieveCommand(device:InterfaceDevice){
  if ((typeof(this.ConnectedArduinos[0])!='undefined') &&this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    if (this.ConnectedArduinos[0].isReadyToAcceptCommand()){
       this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.check, [], (response) => {
           this.SensorsData = response;
             this.dataRecieveTime = Date.now();
               this.flag_for_pin_a=true;
                 this.flag_for_pin_d=true;
        });
    }
  }
}
startDataRecievingLoop(arduino:InterfaceDevice){
        console.log("startDataRecievingLoop");
              // if (this.ArduinoSensorsDataRecievingState == SensorsDataRecievingStates.STOPED ){
              //     this.ArduinoSensorsDataRecievingState == SensorsDataRecievingStates.STARTED;
                  this.DataRecievingLoopInterval = setInterval(this.runDataRecieveCommand.bind(this,arduino),0);
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

checkArduinoByPort(port,callback){

    var result = {};
    result.device = {};

    result.code = -1;
    result.device.id = -1;
    result.device.firmware_version = -1;
    result.device.serial_number = -1;

    for (var i = 0; i < this.ConnectedArduinos.length; i++) {

          if ((this.ConnectedArduinos[i].getPortName() == port) && (this.ConnectedArduinos[i].getState() == DEVICE_STATES["DEVICE_IS_READY"]) ){

            result.code = 0;
            result.device.id = this.ConnectedArduinos[i].getDeviceID();
            result.device.firmware_version = this.ConnectedArduinos[i].getFirmwareVersion();
            result.device.serial_number = this.ConnectedArduinos[i].getShorterSerialNumber();

            callback(result);

            return;

          }

    }

        callback(result);

}

 get_anal(pin_num)
 {
   if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
   this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.de,[128+Number(pin_num)], (response) => {
     this.SensorsData = response;
     this.dataRecieveTime = Date.now();
      this.flag_for_pin_a=true;
              });

  /*    if(pin_num<14)
      return this.SensorsData['a'+pin_num];
      else  return( this.SensorsData['a'+pin_num]+this.SensorsData['a'+pin_num+'_1']*256);
  */}
}
  get_dick(pin_num)
  {
    if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.de,[Number(pin_num)], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
       this.flag_for_pin_d=true;
               });
  //      return( this.SensorsData['a'+pin_num]);
             }
   }

  get_pin(pin_num)
  {
    if( (typeof(this.ConnectedArduinos[0])!='undefined') && (typeof(this.SensorsData)!='undefined') && ([6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1) && (this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]) )
      {
  //      console.warn(this.SensorsData);
        if(pin_num<14)
        return this.SensorsData['a'+pin_num];
        else  return( this.SensorsData['a'+pin_num]+this.SensorsData['a'+pin_num+'_1']*256);
        }
      return(-1);
    
  }
  servo(pin,angle)
  {
  //  console.warn("SERVO_TEST: "+pin+" ang" + Math.abs(angle));
    let newangle = Math.abs(angle);
    if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
      this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.se,[pin,newangle], (response) => {
        this.SensorsData = response;
        this.dataRecieveTime = Date.now();
             });
           }
         }
  set_dick(pin,value)
  {let me = Number(pin)+128*Number(value);
           if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
             this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.be,[me], (response) => {
               this.SensorsData = response;
               this.dataRecieveTime = Date.now();
                    });
                  }
 }
 set_anal(pin,value)
 {
          if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
            this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.ce,[pin,value], (response) => {
              this.SensorsData = response;
              this.dataRecieveTime = Date.now();
                   });
                 }
}
set_sonic(echo,trig)
{
         if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
           this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.ue,[echo,trig], (response) => {
             this.SensorsData = response;
             this.dataRecieveTime = Date.now();
                  });
                }
}
pult(pin)
{
  if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.ie,[pin], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
           });
         }
}
hum(pin1,pin2)
{
  if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.te,[pin1,pin2], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
           });
         }
}
init_lcd()
{
  if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.ye,[], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
           });
         }
}
curse(str,stlb)
{
  let a = str+128*stlb;
  if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.ze,[a], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
           });
         }
}

play_sound(note,dur,pin){

   if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.he,[Number(note)%256, Number(Math.floor(Number(note)/256)*16)+Number(dur), Number(pin)], (response) => {
      
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
           
    });
         
  }

}

set_text(str)
{
  let a=0;
  var res=[];
for(a=0;a<16;a++)
{
  if(a<str.length){
    if(str.charCodeAt(a)>1039)
      res[a]=str.charCodeAt(a)-911;
    else {
      res[a]=str.charCodeAt(a);
    }
}
else {
    res[a]=127;
  }
  console.warn(res[a]);
}
  if((typeof(this.ConnectedArduinos[0])!='undefined') &&[6].indexOf(this.ConnectedArduinos[0].getDeviceID()) != -1 && this.ConnectedArduinos[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
    this.ConnectedArduinos[0].command(DEVICES[this.ConnectedArduinos[0].getDeviceID()].commands.ge,[res[0],res[1],res[2],res[3],res[4],res[5],res[6],res[7],res[8],res[9],res[10],res[11],res[12],res[13],res[14],res[15]], (response) => {
      this.SensorsData = response;
      this.dataRecieveTime = Date.now();
           });
}
}
}
