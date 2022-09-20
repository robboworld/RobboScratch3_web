/* @flow */


import DeviceControlAPI from './DeviceControlAPI';
//import RobotSensorsData from './RobotSensorsData';
import {InterfaceDevice,searchDevices,getConnectedDevices,pushConnectedDevices,DEVICES,DEVICE_STATES} from './chrome';



const DEVICE_HANDLE_TIMEOUT:number = 1 * 60 * 1000;

type LaboratorySensorsData = {

                       d8_13 :    number,
                       a0       : number,
                       a1       : number,
                       a2       : number,
                       a3       : number,
                       a4       : number,
                       a5       : number,
                       a6       : number,
                       a7       : number,
                       a8       : number,
                       a9       : number,
                       a10      : number,
                       a11      : number,
                       a12      : number,
                       a13      : number,
                       a14      : number,
                       a15      : number



};

const SensorsDataRecievingStates = {

    STARTED:"STARTED",
    STOPED: "STOPED"

};

type SensorsDataRecievingState = $Keys<typeof SensorsDataRecievingStates>;



export default class LaboratoryConrolAPI extends DeviceControlAPI {

  LaboratorySensorsDataRecievingState:SensorsDataRecievingState;

  SensorsData:LaboratorySensorsData;

  ConnectedDevices: Array<InterfaceDevice>;
  ConnectedLaboratories: Array<InterfaceDevice>;
  ConnectedLaboratoriesSerials:Array<string>;

  handleConnectedDevicesInterval:IntervalID;
  DataRecievingLoopInterval:IntervalID;
  automaticDeviceHandleProcessStopTimeout:any;

  led_states:Array<string>;
  led_bit_mask:number;

  led_color_states:Array<string>;
  led_color_bit_mask:number;

  digital_pins_states:Array<string>;
  digital_pins_bit_mask:number;

  //lab_sensor_types:Array<string>;

  constructor(){



    super();

    this.searching_in_progress = false;
    this.previousState = null;

    this.init_all();

    this.lab_sensor_types = [];

   this.lab_status_change_callback = () => {};

    this.stopSearchProcess();
    this.stopDataRecievingProcess();



}

    init_all(){

      this.LaboratorySensorsDataRecievingState = SensorsDataRecievingStates.STOPED;
      this.ConnectedDevices = [];
      this.ConnectedLaboratories = [];
      this.ConnectedLaboratoriesSerials = [];

      this.led_states = ['off','off','off','off','off','off','off','off'];
      this.led_bit_mask = 0;

      this.led_color_states = ['off','off','off'];
      this.led_color_bit_mask = 0;

      this.digital_pins_states = ['off','off','off','off','off','off'];
      this.digital_pins_bit_mask = 0;

      //this.lab_sensor_types = [];

      this.dataRecieveTime = 0;

      this.previousLabState = DEVICE_STATES["INITED"];
      this.currentLabState =  DEVICE_STATES["INITED"];

      this.a_command_queue_restore_timeout = null;


    }


    //Автопереподключение при потере связи с устройсвом
     auto_reconnect(){

       console.log(`auto reconnect`);

         //  this.autoReconnectInterval = setInterval(function(){

             let devices = [];
             let connectedDevices = [];
             var local_self = this;


             var onGetDevices = function(ports) {

               var self = local_self;

               for (var i=0; i<ports.length; i++) {
           //      console.log(ports[i].path);
                  devices.push(ports[i]);
               }

                 connectedDevices = getConnectedDevices();

                 devices.forEach(function(device,device_index){
                   console.log("device_index state: " + (device_index <= (connectedDevices.length - 1) ) )
                   if (device_index <= (connectedDevices.length - 1) ){


                     /*
                         При переподключении пробуем найти  свой старый порт и подключиться к нему.

                     */


                       //Проверяем, что имена уже сохранённого порта и просматриваемого порта совпадают  //Проверяем, что имеем дело с лабораторией.
                      // console.log("proverka eblivaya: " + (device.path == connectedDevices[device_index].getPortName()) + " " +(connectedDevices[device_index].getDeviceID() == 2))
                        console.log("hochu: device.path"+device.path + "poluchau: " +connectedDevices[device_index].getPortName());
                     if ( (device.path == connectedDevices[device_index].getPortName()) &&  (connectedDevices[device_index].getDeviceID() == 2) ){


                           console.log(`Trying to reconnect to the already known port: ${device.path}`);
                         //  let d =  new InterfaceDevice(device);
                           connectedDevices[device_index].try_to_reconnect();
                           self.searchLaboratoryDevices();
                           self.searching_in_progress = true;

                     } else self.searching_in_progress = false;

                   }



                 });

                 /*
                         Если устройство перехало на новый порт, то пробуем подключиться к новому порту.
                         Определяем, что устройство переехало пуём сравнения длины массива уже подключённых устройств и вновь полученного массива устройств.

                 */
                   devices.forEach(function(device,device_index)
                   {
                     console.log("D " + device.path);
                   });
                   connectedDevices.forEach(function(device,device_index)
                   {
                     console.log("C "+device.path);
                   });
                   console.log(devices.length+ ">"+ connectedDevices.length);
                 if (devices.length > connectedDevices.length){

                         console.log(`Device maybe moved to the new port: ${devices[connectedDevices.length].path} Trying to reconnect.`);
                       let d = new InterfaceDevice(devices[connectedDevices.length]); // TODO: Не совсем корректно : connectedDevices.length. Нужно по-другому
                       pushConnectedDevices(d);
                       this.searchLaboratoryDevices();
                       this.searching_in_progress = true;

                 } else this.searching_in_progress = false;


             }

           chrome.serial.getDevices(onGetDevices);



         //  },300);

     }

searchLaboratoryDevices(){

  this.init_all();

  this.stopDataRecievingProcess();

  this.can_autoreconnect = true;

  this.searching_in_progress = true;

  if (this.lab_status_change_callback !== null){

        this.lab_status_change_callback(this.currentLabState,this.searching_in_progress);

  }

//  searchDevices();

 this.handleConnectedDevicesInterval  =  setInterval(


     function (self){

    //   console.log("Let's get devices from device finder");
        let devices:Array<InterfaceDevice> = getConnectedDevices();

        // if (self.ConnectedDevices.length != devices.length ){
        //
                   self.ConnectedDevices = devices;


                handleConnectedDevices(self.ConnectedDevices,self);


       //  }
     }


     ,100,this);

   this.automaticDeviceHandleProcessStopTimeout =  setTimeout(function(self){


         console.log("Stop devices handle process.");
         clearInterval(self.handleConnectedDevicesInterval);
         self.searching_in_progress = false;

         if (self.lab_status_change_callback !== null){

               self.lab_status_change_callback(self.currentLabState,self.searching_in_progress);

         }

     }  ,DEVICE_HANDLE_TIMEOUT,this);





     var handleConnectedDevices = function (Devices,self:LaboratoryConrolAPI){


  //     console.log("Handle connected devices.")

     if ((typeof(Devices)!== 'undefined'))  {

       if ((Devices.length != 0) ){

           Devices.forEach(

               function (device:InterfaceDevice){


                 if((device!=null)&&[1,2,4].indexOf(device.getDeviceID())!=-1 && device.getState() == DEVICE_STATES["DEVICE_IS_READY"]){


                   if (self.ConnectedLaboratoriesSerials.indexOf(device.getSerialNumber()) == -1 ){

                     console.warn("We have new ready laboratory!!!");


                      self.searching_in_progress = false;
                      self.lab_status_change_callback(self.currentLabState,self.searching_in_progress);

                     console.warn("Laboratory serial: " + device.getSerialNumber());

                     self.startDataRecievingLoop(device);
                     self.ConnectedLaboratories.push(device);
                     self.ConnectedLaboratoriesSerials.push(device.getSerialNumber());

                     // device.command(DEVICES[device.getDeviceID()].commands.sensors, self.sensors_array, function(response){
                     //
                     //            });

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


stopDataRecievingProcess(){

  console.log("stopDataRecievingProcess");

  if ( typeof (this.DataRecievingLoopInterval) !== 'undefined' ){

      clearInterval(this.DataRecievingLoopInterval);

  }

  this.can_autoreconnect = false;

}

discon(onDisconnectedCb)
{  if(typeof(this.ConnectedLaboratories[0])!='undefined')
    this.ConnectedLaboratories[0].disco(onDisconnectedCb);
}

checkLabByPort(port,callback){

    var result = {};
    result.device = {};

    result.code = -1;
    result.device.id = -1;
    result.device.firmware_version = -1;
    result.device.serial_number = -1;

    for (var i = 0; i < this.ConnectedLaboratories.length; i++) {

          if ( (this.ConnectedLaboratories[i].getPortName() == port)  && (this.ConnectedLaboratories[i].getState() == DEVICE_STATES["DEVICE_IS_READY"]) ) {

            result.code = 0;
            result.device.id = this.ConnectedLaboratories[i].getDeviceID();
            result.device.firmware_version = this.ConnectedLaboratories[i].getFirmwareVersion();
            result.device.serial_number = this.ConnectedLaboratories[i].getShorterSerialNumber();

            callback(result);

            return;

          }

    }

        callback(result);

}


isLaboratoryConnected(robot_number:number):boolean{

    let is_connected = false;

    if ((Date.now() - this.dataRecieveTime) > (1000 * 5)){

       this.SensorsData = undefined;
    }

    //  return ((this.ConnectedRobots.length-1)>=robot_number)?true:false;

    if ((this.ConnectedLaboratories.length-1)>=robot_number){


        is_connected =   ( (this.ConnectedLaboratories[robot_number].getState() == DEVICE_STATES["DEVICE_IS_READY"]) && ( typeof(this.SensorsData) != 'undefined' ) && (this.SensorsData != null) )

    }else{

          is_connected =  false;

    }
  //  console.log((this.previousState == true) + " " + (this.previousState != is_connected) + " " + (!this.searching_in_progress) + " " + (this.can_autoreconnect));
    if (false && (this.previousState == true) && (this.previousState != is_connected) && (!this.searching_in_progress) && (this.can_autoreconnect)){
          this.auto_reconnect();
    }else{

          this.previousState  = is_connected;

    }



    return is_connected;

}

isLaboratorySearching():boolean{

      return   this.searching_in_progress;
}



getStateNameByID(id:number):string{

    const DEVICE_STATE_NANES: [string,string,string,string,string,string,string,string,string] = ["INITED","OPENED","CONNECTED","TEST_DATA_SENT","RUBBISH","SERIAL_FOUND","PURGING","DEVICE_IS_READY","DEVICE_ERROR"];


    if (id < DEVICE_STATE_NANES.length ){

        return DEVICE_STATE_NANES[id];

    }else{

          return "";
    }


}

  labPlayNote(laboratory_number:number, lab_note:number){


    if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


      if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

        //    console.warn(`labPlayNote note ${lab_note}`);


            this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_sound, [lab_note], (response) => {


              this.SensorsData = response;

              this.dataRecieveTime = Date.now();

                       });

        }


      }

  }

islaboratoryButtonPressed(laboratory_number:number, button_number:number):boolean{

  if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


    if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

        //  console.log(`islaboratoryButtonPressed button_number: ${button_number}`);

          if ( typeof(this.SensorsData) != 'undefined' ){

        return   (this.SensorsData.d8_13 & (1 << (button_number-1)))?true:false;

      }else return false;

    } else return false;


  }else return false;




}

labDigitalPinState(laboratory_number:number, digital_pin:string):boolean{


  if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


    if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

        //  console.log(`labDigitalPinState digital_pin: ${digital_pin}`);

          var pin  = Number(digital_pin.replace("D","")) - 8;


        if ( typeof(this.SensorsData) != 'undefined' ){

          return   (this.SensorsData.d8_13 & (1 << (pin)))?true:false;

        }else return false;

    } else return false;


  }else return false;





}

turnLedOn(led_position:number,laboratory_number:number){

  if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


    if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

  //    console.log(`Lab turnLedOn led_position: ${led_position}`);


   if (this.led_states[led_position] == 'off') {



         this.led_bit_mask = this.led_bit_mask | (1 << led_position);

      //   console.log(`led_bit_mask: ${this.led_bit_mask}`);

         this.led_states[led_position] = 'on';

         this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_lamps, [this.led_bit_mask], function(response){



                    });

   }



     }

  }


}


turnLedOff(led_position:number,laboratory_number:number){

 if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


   if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

  //   console.log(`Lab turnLedOff led_position: ${led_position}`);

   if (this.led_states[led_position] == 'on') {

     this.led_bit_mask = this.led_bit_mask & ~(1 << led_position);

     //console.log(`led_bit_mask: ${this.led_bit_mask}`);

     this.led_states[led_position] = 'off';

     this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_lamps, [this.led_bit_mask], function(response){



                });

   }



   }

 }


}

turnColorLedOn(led_color:string,laboratory_number:number){


if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


    if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

    //  console.log(`Lab turnColorLedOn led_color: ${led_color}`);

  if(led_color== 'red' && this.led_color_states[0] == "off"){
   this.led_color_bit_mask = this.led_color_bit_mask | 4;

   this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_color_lamps, [this.led_color_bit_mask], function(response){



              });

   this.led_color_states[0] = 'on';
}

if(led_color== 'yellow' && this.led_color_states[1] == "off"){
 this.led_color_bit_mask = this.led_color_bit_mask | 2;

 this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_color_lamps, [this.led_color_bit_mask], function(response){



            });

 this.led_color_states[1] = 'on';
}

if(led_color== 'green' && this.led_color_states[2] == "off"){
 this.led_color_bit_mask = this.led_color_bit_mask | 1;

 this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_color_lamps, [this.led_color_bit_mask], function(response){



            });

 this.led_color_states[2] = 'on';
}

}

}

}


turnColorLedOff(led_color:string,laboratory_number:number){


  if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


      if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

      //  console.log(`Lab turnColorLedOff led_color: ${led_color}`);

    if(led_color== 'red' && this.led_color_states[0] == "on"){
     this.led_color_bit_mask = this.led_color_bit_mask & ~ 4;

     this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_color_lamps, [this.led_color_bit_mask], function(response){



                });

     this.led_color_states[0] = 'off';
  }

  if(led_color== 'yellow' && this.led_color_states[1] == "on"){
   this.led_color_bit_mask = this.led_color_bit_mask & ~ 2;

   this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_color_lamps, [this.led_color_bit_mask], function(response){



              });

   this.led_color_states[1] = 'off';
  }

  if(led_color== 'green' && this.led_color_states[2] == "on"){
   this.led_color_bit_mask = this.led_color_bit_mask & ~ 1;

   this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_color_lamps, [this.led_color_bit_mask], function(response){



              });

   this.led_color_states[2] = 'off';
  }

  }

  }

}

setDigitalOnOff(digital_pin:string,digital_pin_state:string,laboratory_number:number){

  if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


      if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

        //  console.log(`Lab setDigitalOnOff digital_pin: ${digital_pin} digital_pin_state: ${digital_pin_state} `);

            var pin = Number(digital_pin.replace("D",""));

            var digitalOutMask:number = 1 << (pin - 2);

            if(digital_pin_state == "on"){
               if(this.digital_pins_states[pin] == "off"){

                 this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_dig_on, [digitalOutMask], function(response){



                            });

                  this.digital_pins_states[pin] = "on";
               }
            }
            else{
               if(this.digital_pins_states[pin] == "on"){

                 this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_dig_off, [digitalOutMask], function(response){



                            });

                this.digital_pins_states[pin] = "off";
               }
            }

      }


    }

}

setDigitalPWM(digital_pin:string,pwm_value:number,laboratory_number:number){

  if ((this.ConnectedLaboratories.length - 1) >= laboratory_number ){


      if([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1 && this.ConnectedLaboratories[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

      //    console.log(`Lab setDigitalPWM digital_pin: ${digital_pin} pwm_value: ${pwm_value} `);


            var pin = Number(digital_pin.replace("D",""));

            if(pin == 3){

              this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_dig_pwm, [1,pwm_value], function(response){



                         });

              }
              if(pin == 5){

                this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_dig_pwm, [2,pwm_value], function(response){



                           });

              }
              if(pin == 6){

                this.ConnectedLaboratories[0].command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.lab_dig_pwm, [4,pwm_value], function(response){



                           });
              }

                }

      }


}

getSensorsData(): LaboratorySensorsData{


    return this.SensorsData;

}

// getSensorData(pin:number){
//
//     return this.SensorsData[`a${pin}`];
//
// }

setSensorType(sensor_name:string, sensor_type:string){


  this.lab_sensor_types[sensor_name] = sensor_type;

}

      //Data bytes               PINs
      //a0 -  a1              A0
      //a2  - a3              A1
      //a4  - a5              A2
      //a6  - a7              A3
      //a8  - a9              A4
      //a10 - a11             A5
      //a12 - a13             A6
      //a14 - a15             A7


getSensorData(sensor_name:string):number{

  if ( typeof(this.SensorsData) != 'undefined' ){

      if (sensor_name.startsWith("A")){

            var pin = Number(sensor_name.replace("A", ""));

            if ( typeof(this.SensorsData) != 'undefined' ){

              if ( (this.lab_sensor_types[sensor_name] != 'nosensor') || ( typeof(this.lab_sensor_types[sensor_name]) != 'undefined') ){

                    switch (this.lab_sensor_types[sensor_name]) {

                      case "temperature":

                        if ([1,2,4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1){

                              return Math.round((this.SensorsData[`a${pin*2}`] * 256 + this.SensorsData[`a${pin*2 + 1}`]) *  0.244379276637341153);

                        }
                        // else if([4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1){
                        //
                        //       return Math.round((this.SensorsData[`a${2}`] * 256 + this.SensorsData[`a${3}`]) *  0.244379276637341153);
                        //
                        // }
                        else{

                                return this.SensorsData[`a${pin*2}`] * 256 + this.SensorsData[`a${pin*2 + 1}`];

                        }

                    //  break;

                      case "clamps":

                      if ([1,2].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1){

                              return   Math.round((this.SensorsData[`a${pin*2}`] * 256 + this.SensorsData[`a${pin*2 + 1}`]) / 1023 * 100);

                      }else if([4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1){

                              return   Math.round((this.SensorsData[`a${2}`] * 256 + this.SensorsData[`a${3}`]) / 1023 * 100);

                      }else{

                              return this.SensorsData[`a${pin*2}`] * 256 + this.SensorsData[`a${pin*2 + 1}`];

                      }





                    //  break;

                      default:

                    }

                    return this.SensorsData[`a${pin*2}`] * 256 + this.SensorsData[`a${pin*2 + 1}`];

              }else {

                      return  this.SensorsData[`a${pin*2}`] * 256 + this.SensorsData[`a${pin*2 + 1}`];

              }



            } else return -1;



      }else{

            switch (sensor_name) {

              case "light":

                var light_value;

                if (this.ConnectedLaboratories[0].getDeviceID() == 4){

                  light_value = Math.abs(Math.round((this.SensorsData.a8*256 + this.SensorsData.a9 ) / 1023 * 100));

                  }else{

                  if((this.SensorsData.a8*256 + this.SensorsData.a9)>62)
                  light_value = Math.round(Math.log(this.SensorsData.a8*256 + this.SensorsData.a9)*15);
                  else light_value=this.SensorsData.a8*256 + this.SensorsData.a9;
                  }

                  if(light_value > 100){

                  light_value = 100;

                  }

                  return light_value;



              case "sound":

                    var sound_value;

                    sound_value =   Math.round((this.SensorsData.a6 * 256 + this.SensorsData.a7) / 1023 * 100);

                    return sound_value;



              case "slider":

              var slider_value = 0;

              if ([4].indexOf(this.ConnectedLaboratories[0].getDeviceID()) != -1){

                     slider_value = Math.abs(100 - Math.round((this.SensorsData.a4*256 + this.SensorsData.a5 ) / 1023 * 100));



              }else

              if(this.ConnectedLaboratories[0].getDeviceID() == 1){

                   slider_value = 1.34 * Math.abs(75 - Math.round((this.SensorsData.a4*256 + this.SensorsData.a5 ) / 1023 * 100));

                }
                else if(this.ConnectedLaboratories[0].getDeviceID() == 2){

                  slider_value = Math.abs(100 - Math.round((this.SensorsData.a14*256 + this.SensorsData.a15) / 1023 * 100));

                }



                  return  ( slider_value > 100) ? 100 : slider_value;



                    default: return -1;

            }
      }

  }else return -1;

}

registerLabStatusChangeCallback(lab_status_change_cb:any){


      this.lab_status_change_callback = lab_status_change_cb;

      this.runLabStatusChangeLoop();

}

proxy_func_LabStatusChange(){

  if (typeof(this.ConnectedLaboratories[0]) != 'undefined'){

    this.currentLabState = this.ConnectedLaboratories[0].getState();

    if ((this.currentLabState != this.previousLabState)){


        // if (this.currentRobotState == DEVICES["DEVICE_IS_READY"]){
        //
        //
        //
        // }else{
        //
        //
        //
        // }



        this.lab_status_change_callback(this.currentLabState,this.searching_in_progress);

       this.previousLabState =   this.currentLabState;
    }


  }




}


runLabStatusChangeLoop(){


  this.LabStatusChangeLoopInterval = setInterval(this.proxy_func_LabStatusChange.bind(this),300);

}


block_A_CommandQueue(){

    this.a_command_queue_blocked = true;

    clearTimeout(this.a_command_queue_restore_timeout);

    this.a_command_queue_restore_timeout = setTimeout(() => {

         this.a_command_queue_blocked = false;

    },1000);

  }

  unblock_A_CommandQueue(){

    this.a_command_queue_blocked = false;

  }

  isLabReadyToAcceptCommand(){

    if (typeof(this.ConnectedLaboratories[0]) !== 'undefined'){

         return this.ConnectedLaboratories[0].isReadyToAcceptCommand();

    }else{

        return true;

    }

     

  }

runDataRecieveCommand(device:InterfaceDevice){




  if (device.getState() == DEVICE_STATES["DEVICE_IS_READY"]){

      if (this.ConnectedLaboratories[0].isReadyToAcceptCommand() && (!this.a_command_queue_blocked)  ){


      //  console.log("runDataRecieveCommand laboratory");
        //setTimeout(()=>{this.can_autoreconnect = true;},1000);
      //this.can_autoreconnect = false;
          device.command(DEVICES[this.ConnectedLaboratories[0].getDeviceID()].commands.check, [], (response) => {


                  this.SensorsData = response;

                  this.dataRecieveTime = Date.now();

                  this.searching_in_progress = false;
      //this.can_autoreconnect = false;
                //  console.log("laboratory_response: " + this.SensorsData);


               });


      }




  }
//else{this.can_autoreconnect = true;}



}


startDataRecievingLoop(laboratory:InterfaceDevice):void{




      console.log("startDataRecievingLoop");




            if (this.LaboratorySensorsDataRecievingState == SensorsDataRecievingStates.STOPED ){

                this.LaboratorySensorsDataRecievingState == SensorsDataRecievingStates.STARTED;

              this.DataRecievingLoopInterval = setInterval(this.runDataRecieveCommand.bind(this,laboratory),0);

              }





}



}
