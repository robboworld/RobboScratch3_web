/* @flow */


import DeviceControlAPI from './DeviceControlAPI';
//import RobotSensorsData from './RobotSensorsData';
import {InterfaceDevice,searchDevices,getConnectedDevices,pushConnectedDevices,DEVICES,DEVICE_STATES} from './chrome';

import {getConnectedBluetoothDevices} from './bluetooth-chrome';


const DEVICE_HANDLE_TIMEOUT:number = 1 * 60 * 1000;
//const DEVICE_HANDLE_TIMEOUT:number = 1 * 4 * 1000;

type RobotSensorsData = {

                       encoder0 :  number,
                       encoder1 : number,
                       path0    : number,
                       path1    : number,
                       a0       : [number,number,number,number],
                       a1       : [number,number,number,number],
                       a2       : [number,number,number,number],
                       a3       : [number,number,number,number],
                       a4       : [number,number,number,number],
                       button   : number

};


 type ColorFilterTableRaw = {

     R:string,
     G:string,
     B:string,
     Bright:string

 }


const SensorsDataRecievingStates = {

    STARTED:"STARTED",
    STOPED: "STOPED"

};



type SensorsDataRecievingState = $Keys<typeof SensorsDataRecievingStates>;



export default class RobotControlAPI extends DeviceControlAPI {

  RobotSensorsDataRecievingState:SensorsDataRecievingState;

  SensorsData:RobotSensorsData;

  ConnectedDevices: Array<InterfaceDevice>;
 // ConnectedBluetoothDevices: Array<InterfaceDevice>;
  ConnectedRobots: Array<InterfaceDevice>;

  handleConnectedDevicesInterval:IntervalID;
  DataRecievingLoopInterval:IntervalID;
  automaticDeviceHandleProcessStopTimeout:any;

  ConnectedRobotsSerials:Array<string>;

  sensors_array:Array<number>;

  led_positions:Array<number>;

  led_states:Array<string>;

  led_bit_mask:number;



    constructor(){



      super();


      this.init_all();

      this.searching_in_progress = false;

      this.sensors_array = [0,0,0,0,0];

      this.robot_status_change_callback = null;

      this.robot_is_scratchduino_callbacks = [];

      this.robot_is_robbo_callbacks = [];

      this.colorFilterTable = [{},{},{},{},{}];

      let i = 0;

      for (i=0;i<5;i++){

          this.colorFilterTable[i] = {

               "red": {
                "R": "51.00-64.00",
                "G": "13.00-25.00",
                "B": "20.00-27.00",
                "Bright": "0-100"
               },
               "magenta": {
                "R": "35.00-58.00",
                "G": "13.00-25.00",
                "B": "26.00-32.00",
                "Bright": "0-100"
               },
               "yellow": {
                "R": "40.00-47.00",
                "G": "33.00-44.00",
                "B": "17.00-23.00",
                "Bright": "0-100"
               },
               "green": {
                "R": "23.00-32.00",
                "G": "38.00-49.00",
                "B": "25.00-33.00",
                "Bright": "0-100"
               },
               "blue": {
                "R": "15.00-27.00",
                "G": "24.00-34.00",
                "B": "41.00-58.00",
                "Bright": "0-100"
               },
               "cyan": {
                "R": "24.00-32.00",
                "G": "32.00-39.00",
                "B": "32.00-40.00",
                "Bright": "0-100"
               },
               "custom": {
                "R": "28.00-34.00",
                "G": "22.00-28.00",
                "B": "41.00-47.00",
                "Bright": "0-0"
               },
               "black": {
                "R": "30.00-40.00",
                "G": "30.00-40.00",
                "B": "30.00-40.00",
                "Bright": "0-20"
               },
               "gray": {
                "R": "30.00-40.00",
                "G": "30.00-40.00",
                "B": "30.00-40.00",
                "Bright": "20-80"
               },
               "white": {
                "R": "30.00-40.00",
                "G": "30.00-40.00",
                "B": "30.00-40.00",
                "Bright": "80-100"
               }
    };

      }

      let j = 0;

      this.colorKoefs = [];


      for (j=0;j<5;j++){

          this.colorKoefs[j] = {

                Kr:1,
                Kg:1,
                Kb:1

          }

      }

      //this.color_P_initial = 0;

      this.color_P_initial_list = [0,0,0,0,0];

      // this.leftPath     = 0;
      // this.leftPathNew  = 0;
      // this.leftPathCorrected = 0;
      // this.leftPathMultiplier = 0;
      // this.leftPathCorrection = 0;
      //
      // this.rightPath    = 0;
      // this.rightPathNew = 0;
      // this.rightPathCorrected = 0;
      // this.rightPathMultiplier = 0;
      // this.rightPathCorrection = 0;


      this.stopSearchProcess();
      this.stopDataRecievingProcess();



}

     //Автопереподключение при потере связи с устройсвом
      auto_reconnect(){

      //  console.log(`auto reconnect`);

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

                    if (device_index <= (connectedDevices.length - 1) ){


                      /*
                          При переподключении пробуем найти  свой старый порт и подключиться к нему.

                      */


                        //Проверяем, что имена уже сохранённого порта и просматриваемого порта совпадают  //Проверяем, что имеем дело с роботом.
                      if ( (device.path == connectedDevices[device_index].getPortName()) &&  (connectedDevices[device_index].getDeviceID() == 0) ){


                            console.log(`Trying to reconnect to the already known port: ${device.path}`);
                          //  let d =  new InterfaceDevice(device);
                            connectedDevices[device_index].try_to_reconnect();
                            self.searchRobotDevices();
                            self.searching_in_progress = true;

                      } else self.searching_in_progress = false;

                    }



                  });

                  /*
                          Если устройство перехало на новый порт, то пробуем подключиться к новому порту.
                          Определяем, что устройство переехало пуём сравнения длины массива уже подключённых устройств и вновь полученного массива устройств.

                  */

                  if (devices.length > connectedDevices.length){

                          console.log(`Device maybe moved to the new port: ${devices[connectedDevices.length].path} Trying to reconnect.`);
                        let d = new InterfaceDevice(devices[connectedDevices.length]); // TODO: Не совсем корректно : connectedDevices.length. Нужно по-другому
                        pushConnectedDevices(d);
                        this.searchRobotDevices();
                        this.searching_in_progress = true;

                  } else this.searching_in_progress = false;


              }

            chrome.serial.getDevices(onGetDevices);



          //  },300);

      }


  init_all(){


    this.RobotSensorsDataRecievingState = SensorsDataRecievingStates.STOPED;
    this.ConnectedDevices = [];
    //this.ConnectedBluetoothDevices = [];
    this.ConnectedRobots = [];
    this.ConnectedRobotsSerials = [];
  //  this.sensors_array = [0,0,0,0,0];
    this.led_positions = [1,2,4,8,16];
    this.led_states = ['off','off','off','off','off'];
    this.led_bit_mask = 0;

  //  this.colorFilterTable = [{},{},{},{},{}];

    this.dataRecieveTime = 0;

    this.previousRobotState = DEVICE_STATES["INITED"];
    this.currentRobotState =  DEVICE_STATES["INITED"];



  //  this.color_P_initial = 0;

    this.path_left_buffer = 0;
    this.path_right_buffer = 0;

    this.leftPath     = 0;
    this.leftPathNew  = 0;
    this.leftPathCorrected = 0;
    this.leftPathMultiplier = 0;
    this.leftPathCorrection = 0;

    this.rightPath    = 0;
    this.rightPathNew = 0;
    this.rightPathCorrected = 0;
    this.rightPathMultiplier = 0;
    this.rightPathCorrection = 0;



    this.a_can_send = true;

    this.a_command_queue_blocked = false;

    this.a_command_queue_restore_timeout = null;

    this.isPowerCommandBlocked = false;


  }

    searchRobotDevices(){


      this.init_all();

      this.stopDataRecievingProcess();

      this.searching_in_progress = true;
      //console.log("searching_in_progress = true i can autorecconect toje !!!!!!!!!!!!!!!!!JOAP!!!!!!!" + this.searching_in_progress);
      this.can_autoreconnect = true;

      if (this.robot_status_change_callback !== null){

            this.robot_status_change_callback(this.currentRobotState,this.searching_in_progress);

      }



  //    searchDevices();

     this.handleConnectedDevicesInterval  =  setInterval(


         function (self){

      //     console.log("let's get devices from device finder");
            let devices:Array<InterfaceDevice> = getConnectedDevices();
            let bluetooth_devices:Array<InterfaceDevice> = getConnectedBluetoothDevices();

            // if (self.ConnectedDevices.length != devices.length ){
            //
                    self.ConnectedDevices = devices.concat(bluetooth_devices);


                    handleConnectedDevices(self.ConnectedDevices,self);


           //  }
         }


         ,100,this);

       this.automaticDeviceHandleProcessStopTimeout =  setTimeout(function(self){


             console.log("Stop devices handle process.");
             clearInterval(self.handleConnectedDevicesInterval);
             self.searching_in_progress = false;

             if (self.robot_status_change_callback !== null){

                self.robot_status_change_callback(self.currentRobotState,self.searching_in_progress);

             }




         }  ,DEVICE_HANDLE_TIMEOUT,this);





         var handleConnectedDevices = function (Devices,self:RobotControlAPI){


      //     console.log("Handle connected devices.")

         if ((typeof(Devices)!== 'undefined'))  {

           if ((Devices.length != 0) ){

               Devices.forEach(

                   function (device:InterfaceDevice){


                     if ((device!=null)&&([0,3].indexOf(device.getDeviceID())!=-1 ) && (device.getState() == DEVICE_STATES["DEVICE_IS_READY"])){


                       if (self.ConnectedRobotsSerials.indexOf(device.getSerialNumber()) == -1 ){

                         console.warn("We have new ready robot!!!");

                          self.searching_in_progress = false;

                           if (self.robot_status_change_callback !== null){

                              self.robot_status_change_callback(self.currentRobotState,self.searching_in_progress);

                           }



                      //   self.searching_in_progress = false;

                         console.warn("Robot serial: " + device.getSerialNumber());

                         self.startDataRecievingLoop(device);
                         self.ConnectedRobots.push(device);
                         self.ConnectedRobotsSerials.push(device.getSerialNumber());

                         if (device.getDeviceID() == 3){

                           self.robot_is_scratchduino_callbacks.forEach((cb) => {

                              if (cb){

                                cb();
                              }

                           });

                           // if    (self.robot_is_scratchduino_callback !== null){
                           //
                           //       self.robot_is_scratchduino_callback();
                           //
                           // }



                         }else if (device.getDeviceID() == 0){

                           // if    (self.robot_is_robbo_callback !== null){
                           //
                           //       self.robot_is_robbo_callback();
                           //
                           // }

                           self.robot_is_robbo_callbacks.forEach((cb) => {

                              if (cb){

                                cb();
                              }

                           });

                         }


                         device.command(DEVICES[device.getDeviceID()].commands.sensors, self.sensors_array, function(response){

                                    });

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

    checkRobotByPort(port,callback){

        var result = {};
        result.device = {};

        result.code = -1;
        result.device.id = -1;
        result.device.firmware_version = -1;
        result.device.serial_number = -1;

        for (var i = 0; i < this.ConnectedRobots.length; i++) {

              if ((this.ConnectedRobots[i].getPortName() == port) && (this.ConnectedRobots[i].getState() == DEVICE_STATES["DEVICE_IS_READY"]) ){

                result.code = 0;
                result.device.id = this.ConnectedRobots[i].getDeviceID();
                result.device.firmware_version = this.ConnectedRobots[i].getFirmwareVersion();
                result.device.serial_number = this.ConnectedRobots[i].getShorterSerialNumber();

                callback(result);

                return;

              }

        }

            callback(result);

    }

    isRobotConnected(robot_number:number):boolean{

        let is_connected = false;

        if ((Date.now() - this.dataRecieveTime) > (1000 * 5)){

           this.SensorsData = undefined;
        }

        //  return ((this.ConnectedRobots.length-1)>=robot_number)?true:false;

        if ((this.ConnectedRobots.length-1)>=robot_number){


            is_connected =   ( (this.ConnectedRobots[robot_number].getState() == DEVICE_STATES["DEVICE_IS_READY"]) && ( typeof(this.SensorsData) != 'undefined' ) && (this.SensorsData != null) )

        }else{

              is_connected =  false;

        }
      //  console.log("searching_progress: " + this.searching_in_progress);
        if ( (false) && (this.previousState == true) && (this.previousState != is_connected) && (!this.searching_in_progress) && (this.can_autoreconnect)){

              this.auto_reconnect();

        }else{

              this.previousState  = is_connected;

        }



        return is_connected;

    }


    isRobotSearching():boolean{

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
       console.log("this.can_autoreconnect = false;                                                                                   stopDatarecieving lol");
    }


    discon(onDisconnectedCb)
   {
     if(typeof(this.ConnectedRobots[0])!='undefined'){

         this.ConnectedRobots[0].disco(onDisconnectedCb);

     }
  //     else{

  //         let devices = getConnectedDevices();

  //         devices.forEach((device,device_index) => {

  //             console.log(`Close device: ${device.getPortName()}`);
  //             device.disco(onDisconnectedCb);

  //         });

  //  }

}
    colorAutoCorection(sensor_id:number){

      if ( typeof(this.SensorsData) != 'undefined' ){

        //console.warn(`colorAutoCorection sensor_id: ${sensor_id}`);

  let rgb_array = this.SensorsData[`a${sensor_id}`];

  let red    = rgb_array[1];
  let green  = rgb_array[2];
  let blue   = rgb_array[3];

  let rgb_sum =  red + green + blue;



  let Kr = 0; //koef for red channel
  let Kg = 0; //koef for green channel
  let Kb = 0; //koef for blue channel


  // Kr = rgb_sum / (3 * red);
  // Kg = rgb_sum / (3 * green);
  // Kb = rgb_sum / (3 * blue);


      Kr = 0.666666666666666666 - red  / rgb_sum;
      Kg = 0.666666666666666666 - green  / rgb_sum;
      Kb = 0.666666666666666666 - blue  / rgb_sum;


  if(Kr < Kg && Kr < Kb){
     Kr += 0.01
  }
  if(Kg < Kr && Kg < Kb){
     Kg += 0.01
  }
  if(Kb < Kr && Kb < Kg){
     Kb += 0.01
  }


  var red_corrected   = red * Kr * 3;
  var green_corrected = green * Kg * 3;
  var blue_corrected  = blue * Kb * 3;


   if(red_corrected > green_corrected && red_corrected > blue_corrected){
     Kr -= 0.02
  }
  if(green_corrected > red_corrected && green_corrected > blue_corrected){
     Kg -= 0.02
  }
  if(blue_corrected > red_corrected && blue_corrected > green_corrected){
     Kb -= 0.02
  }

  /*
      При цвет = 255, коэф = 0.33. Домножаем на 3, чтобы сохранить оригинальное значение. 

  */

   red_corrected   = red * Kr * 3;
   green_corrected = green * Kg * 3;
   blue_corrected  = blue * Kb * 3;


var Kr_in_percent = Kr.toFixed(2) * 300;
var Kg_in_percent = Kg.toFixed(2) * 300;
var Kb_in_percent = Kb.toFixed(2) * 300;

var percent_sum = Kr_in_percent + Kg_in_percent + Kb_in_percent;








//   console.warn(`colorAutoCorection: sensor_id: ${sensor_id} red: ${red} green: ${green} blue: ${blue}`);
//   console.warn(`colorAutoCorection: sensor_id: ${sensor_id} Kr: ${Kr} Kg: ${Kg} Kb: ${Kb}`);
 
//   console.warn(`red_corrected: ${red_corrected} green_corrected: ${green_corrected} blue_corrected: ${blue_corrected}`);
 
//  console.warn(`Kr_in_percent: ${Kr_in_percent} Kg_in_percent: ${Kg_in_percent} Kb_in_percent: ${Kb_in_percent}`);
 
//  console.warn(`percent_sum: ${percent_sum} `);

  this.colorKoefs[sensor_id].Kr = Kr;
  this.colorKoefs[sensor_id].Kg = Kg;
  this.colorKoefs[sensor_id].Kb = Kb;

//  this.color_P_initial  = red * Kr * 3 + green * Kg * 3 + blue * Kb * 3;

    this.color_P_initial_list[sensor_id] = rgb_sum;

    //this.color_P_initial  = rgb_sum;

}



    }

    setColorKoefs(sensor_id:number,red_koef:number, green_koef:number, blue_koef:number){

      console.log(`setColorKoefs: sensor_id: ${sensor_id} red_koef: ${red_koef} green_koef: ${green_koef} blue_koef: ${blue_koef}`);

        this.colorKoefs[sensor_id].Kr   =  red_koef /  300; //100;
        this.colorKoefs[sensor_id].Kg   =  green_koef / 300; //100;
        this.colorKoefs[sensor_id].Kb    =  blue_koef / 300; //100;


    }

    getColorKoefs(sensor_id:number,koef_name:string){


      var Kr_in_percent = this.colorKoefs[sensor_id].Kr.toFixed(2) * 300; //100
      var Kg_in_percent =  this.colorKoefs[sensor_id].Kg.toFixed(2) * 300;
      var Kb_in_percent =  this.colorKoefs[sensor_id].Kb.toFixed(2) * 300;

      var percent_sum = Kr_in_percent + Kg_in_percent + Kb_in_percent;

      var delta = 0;

      if (percent_sum > 300){ //приводим сумму к 300. Если сумма  больше отнимаем от каналов по одному проценту в зависимости от дельты. Если 										меньше, прибавляем.

	//		console.warn(` getColorKoefs percent_sum > 300 `);

            delta = percent_sum - 300;

			  switch (delta) {

              case 1:

						Kr_in_percent   -= 1;


               break;

			case 2:

            Kr_in_percent -= 1;
						Kg_in_percent -= 1;

               break;

			case 3:


					Kr_in_percent -= 1;
					Kg_in_percent -= 1;
					Kb_in_percent -= 1;


              break;

              default:

            }




      }else if (percent_sum < 300){

		//	console.warn(` getColorKoefs percent_sum < 300 `);

          delta = 300 - percent_sum;



	//	console.warn(`getColorKoefs delta: ${delta}`);

			  switch (delta) {

              case 1:

						Kr_in_percent   += 1;


               break;

			case 2:

            Kr_in_percent += 1;
						Kg_in_percent += 1;

               break;

			case 3:


					Kr_in_percent += 1;
					Kg_in_percent += 1;
					Kb_in_percent += 1;


              break;

              default:

            }

	}


	percent_sum = Kr_in_percent + Kg_in_percent + Kb_in_percent;


      switch (koef_name) {

        case "red":

            return Kr_in_percent;

        //  break;

        case "green":

          return Kg_in_percent;

        //  break;

        case "blue":

            return Kb_in_percent;

        //  break;

        default:

            return 0;

      }



    }


    getColorCorrectedRawValues(sensor_id:number){

      let rgb_arr = [0,0,0];

      if ( typeof(this.SensorsData) != 'undefined' ){

        rgb_arr[0] = Math.round(this.SensorsData[`a${sensor_id}`][1] *  this.colorKoefs[sensor_id].Kr * 3); //red
        rgb_arr[1] = Math.round(this.SensorsData[`a${sensor_id}`][2] *  this.colorKoefs[sensor_id].Kg * 3); //green
        rgb_arr[2] = Math.round(this.SensorsData[`a${sensor_id}`][3] *  this.colorKoefs[sensor_id].Kb * 3); //blue



        return rgb_arr;

      } else return rgb_arr;



    }



    setColorFilterTable(sensor_id:number, colorFilterTable:any ){

            this.colorFilterTable[sensor_id] = colorFilterTable;

    }

    getColorFilterTable(sensor_id:number){


            return this.colorFilterTable[sensor_id];
    }



    colorFilter(sensor_id:number,need_to_return_color_name:boolean){

      const getColorFilterTableValue = function(value:string,type:string){

            let arr = value.split("-");

            if (type == "high"){

              return Number(arr[1]);

            }else return Number(arr[0]);

      }



      if  ( (typeof(this.SensorsData) == 'undefined') || (typeof(this.SensorsData[`a${sensor_id}`][3]) == 'undefined')){

       return [-1,-1,-1];
      }

      let red_channel      =  this.SensorsData[`a${sensor_id}`][1] *  this.colorKoefs[sensor_id].Kr * 3;
      let green_channel    =  this.SensorsData[`a${sensor_id}`][2] *  this.colorKoefs[sensor_id].Kg * 3 ;
      let blue_channel     =  this.SensorsData[`a${sensor_id}`][3] *  this.colorKoefs[sensor_id].Kb * 3;



      let sum = red_channel + green_channel + blue_channel;

  //  console.warn("sum: " + sum);

      let red_channel_percent       = red_channel     / sum * 100;
      let green_channel_percent     = green_channel  / sum  * 100;
      let blue_channel_percent      = blue_channel  /  sum  * 100;


      // if (sum > this.color_P_initial){
      //
      //     this.color_P_initial = sum;
      // }




        const colors_arr = {

              "red":[255,0,0],
              "magenta":[255,0,255],
              "yellow":[255,255,0],
              "green":[0,255,0],
              "blue":[0,0,255],
              "cyan":[0,255,255],
              "black":[0,0,0],
              "gray":[128,128,128],
              "white":[255,255,255]
        }


        for (var color in colors_arr) {

          if (colors_arr.hasOwnProperty(color)) {


                  let table_object = this.colorFilterTable[sensor_id];

                  let red     =  Math.floor(red_channel_percent * 1000);
                  let green   =  Math.floor(green_channel_percent * 1000);
                  let blue    =  Math.floor(blue_channel_percent * 1000);
                  let bright  =  Math.floor(sum / this.color_P_initial_list[sensor_id]  * 100  * 1000);

                  let red_low   =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].R,"low") * 1000);
                  let red_high  =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].R,"high") * 1000);

                  let green_low  =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].G,"low") * 1000);
                  let green_high =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].G,"high") * 1000);

                  let blue_low   =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].B,"low") * 1000);
                  let blue_high  =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].B,"high") * 1000);

                  let bright_low   =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].Bright,"low") * 1000);
                  let bright_high  =   Math.floor(getColorFilterTableValue(this.colorFilterTable[sensor_id][color].Bright,"high") * 1000);


                  // console.warn("red: " + red);
                  // console.warn("green: " + green);
                  // console.warn("blue: " + blue);
                  // console.warn("bright: " + bright);
                  //
                  // console.warn("red_low: " + red_low);
                  // console.warn("red_high: " + red_high);
                  //
                  // console.warn("green_low: " + green_low);
                  // console.warn("green_high: " + green_high);
                  //
                  // console.warn("blue_low: " + blue_low);
                  // console.warn("blue_high: " + blue_high);
                  //
                  // console.warn("bright_low: " + bright_low);
                  // console.warn("bright_high: " + bright_high);


                  if ( (red > red_low) && (red < red_high) && (green > green_low)  && (green < green_high)  && (blue > blue_low) && (blue < blue_high) && (bright > bright_low)  && (bright < bright_high) && (need_to_return_color_name)){

                        return color;

                  }else if ( (red > red_low) && (red < red_high) && (green > green_low)  && (green < green_high)  && (blue > blue_low) && (blue < blue_high) && (bright > bright_low)  && (bright < bright_high) ){


                        return colors_arr[color];

                  }

          }

        }

         return [-1,-1,-1];


    }

  setRobotPower(leftMotorPower:number,rightMotorPower:number,robot_number:number):void{


  //console.log(`setRobotPower leftMotorPower: ${leftMotorPower} rightMotorPower: ${rightMotorPower} `);

 if ((this.ConnectedRobots.length - 1) >= robot_number ){


   if( [0,3].indexOf(this.ConnectedRobots[0].getDeviceID())!=-1  && this.ConnectedRobots[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

     if ((rightMotorPower > 0) && (leftMotorPower > 0) && (this.isPowerCommandBlocked)){

      return;
     }

  //   console.log("setRobotPower send command");

     clearTimeout(this.a_command_queue_restore_timeout);

     this.ConnectedRobots[0].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.power, [leftMotorPower, rightMotorPower], (response) => {

                //   console.log("pizda=" + response.a0);

                  this.SensorsData = response;

                  this.dataRecieveTime = Date.now();

                });

     }


 }



}

  setRobotPowerAndStepLimits(leftMotorPower:number,rightMotorPower:number,steps_limit:number,robot_number:number):void{

    //  console.log(`setRobotPowerAndStepLimits leftMotorPower: ${leftMotorPower} rightMotorPower: ${rightMotorPower} steps_limit: ${steps_limit} `);

      if ((this.ConnectedRobots.length - 1) >= robot_number ){


        if([0,3].indexOf(this.ConnectedRobots[0].getDeviceID())!=-1 && this.ConnectedRobots[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

      //    console.log("setRobotPowerAndStepLimits send command");

      if ((rightMotorPower > 0) && (leftMotorPower > 0) && (this.isPowerCommandBlocked)){

       return;
     }

      clearTimeout(this.a_command_queue_restore_timeout);


          let steps_limit_low_byte:number  = steps_limit&0x00FF;
          let steps_limit_high_byte:number = steps_limit >> 8;


          this.ConnectedRobots[0].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.rob_pow_encoder, [leftMotorPower, rightMotorPower,steps_limit_high_byte,steps_limit_low_byte], (response) =>{

                     //   console.log("pizda=" + response.a0);

                       this.SensorsData = response;

                       this.dataRecieveTime = Date.now();

                     });

          }


      }

  }

 turnLedOn(led_position:number,robot_number:number){

   if ((this.ConnectedRobots.length - 1) >= robot_number ){


     if([0,3].indexOf(this.ConnectedRobots[0].getDeviceID()) != -1 && this.ConnectedRobots[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

    //   console.log(`turnLedOn led_position: ${led_position}`);


    if (this.led_states[led_position] == 'off') {



          this.led_bit_mask+=this.led_positions[led_position];

      //    console.log(`led_bit_mask: ${this.led_bit_mask}`);

          this.led_states[led_position] = 'on';

          this.ConnectedRobots[0].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.rob_lamps, [this.led_bit_mask], (response) => {


              this.SensorsData = response;

              this.dataRecieveTime = Date.now();


                     });

    }



      }

   }


 }


turnLedOff(led_position:number,robot_number:number){

  if ((this.ConnectedRobots.length - 1) >= robot_number ){


    if([0,3].indexOf(this.ConnectedRobots[0].getDeviceID()) != -1 && this.ConnectedRobots[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

    //  console.log(`turnLedOff led_position: ${led_position}`);

    if (this.led_states[led_position] == 'on') {

      this.led_bit_mask-=this.led_positions[led_position];

    //  console.log(`led_bit_mask: ${this.led_bit_mask}`);

      this.led_states[led_position] = 'off';

      this.ConnectedRobots[0].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.rob_lamps, [this.led_bit_mask], (response) => {


          this.SensorsData = response;

          this.dataRecieveTime = Date.now();

                 });

    }



    }

  }


}

    setClawDegrees(degrees:number,robot_number:number){

      if ((this.ConnectedRobots.length - 1) >= robot_number ){


        if([0,3].indexOf(this.ConnectedRobots[0].getDeviceID()) != -1 && this.ConnectedRobots[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

      //    console.log(`setClawDegrees: ${degrees}`);

          this.ConnectedRobots[0].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.rob_claw, [degrees], (response) => {


              this.SensorsData = response;

              this.dataRecieveTime = Date.now();

                     });

        }

      }

    }

  getLeftPath():number{

    if ( typeof(this.SensorsData) != 'undefined' ){

        if ((!isNaN(this.SensorsData.path0))  /*&& (this.SensorsData.path0 != 0) */){

          this.path_left_buffer = this.SensorsData.path0;

        //  return this.SensorsData.path0;

        }else{


        //  return this.path_left_buffer;

        }

        this.leftPathNew =   this.path_left_buffer;

        if ((this.leftPathNew < this.leftPath) && (this.leftPathNew != 0)) {

              this.leftPathMultiplier++;
        }

        this.leftPath = this.leftPathNew;


      this.leftPathCorrected  = (65536 * this.leftPathMultiplier)  + this.leftPath - this.leftPathCorrection;

        return this.leftPathCorrected;

    }else return -1;

  }

  getRightPath():number{


    if ( typeof(this.SensorsData) != 'undefined' ){

        if ((!isNaN(this.SensorsData.path1)) /*&& (this.SensorsData.path1 != 0)*/) {

          this.path_right_buffer = this.SensorsData.path1;

        //  return this.SensorsData.path0;

        }else{


        //  return this.path_left_buffer;

        }

        this.rightPathNew =   this.path_right_buffer;

        if ((this.rightPathNew < this.rightPath) && (this.rightPathNew != 0)){

              this.rightPathMultiplier++;
        }

        this.rightPath = this.rightPathNew;


      this.rightPathCorrected  = (65536 * this.rightPathMultiplier)  + this.rightPath - this.rightPathCorrection;

      return this.rightPathCorrected;

    }else return -1;

  }

  resetTripMeters(){

    this.leftPathCorrection  = (65536 * this.leftPathMultiplier)  + this.leftPath;
    this.rightPathCorrection = (65536 * this.rightPathMultiplier) + this.rightPath;

  }

  getButtonStartPushed():string{

    if ( typeof(this.SensorsData) != 'undefined' ){

      return ((this.SensorsData.button == 0)?"true":"false");

    }else return "undefined";


  }

  getSensorsData():RobotSensorsData{

      return this.SensorsData;

  }

  // getSensorData(sensor_index:number){
  //
  //     return this.SensorsData[`a${sensor_index}`];
  //
  // }

  // getSensorData(sensor_index:number){

  
          

  //     switch (this.sensors_array[sensor_index]) {

  //       case 1: //line
  //       case 2: //led
  //       case 3: //light
  //       case 4://touch
  //       case 5://proximity

  //             return Math.round(this.SensorsData[`a${sensor_index}`][3] / 2.55);

  //       //  break;

  //       case 6: //proximity

  //             return (this.SensorsData[`a${sensor_index}`][2] * 256 + this.SensorsData[`a${sensor_index}`][3] );

  //       //break;

  //       default:

  //           return  -1;

  //     }

  // }

  getSensorData(sensor_index:number){

     switch (this.sensors_array[sensor_index]) {
       case 1: //line
       case 2: //led
                return Math.round(this.SensorsData[`a${sensor_index}`][3] / 2.55);
       

      case 3: //light
          // console.warn(this.SensorsData[`a${sensor_index}`][0]+"  -0 "+this.SensorsData[`a${sensor_index}`][1]+"-1 "+this.SensorsData[`a${sensor_index}`][2]+"-2 "+this.SensorsData[`a${sensor_index}`][3]+"-3 ");
          var light2 = this.SensorsData[`a${sensor_index}`][3];  
          if (light2<30)  // я взял число с неба
              return  light2;

          else     //АПРОКСИМАЦИЯ КУБ ФУНКЦ.
            return Math.round(0.0000014*light2*light2*light2 - 0.0015701*light2*light2 + 0.6539938*light2+11.4121107);
          
      case 4://touch 0-255
            if (this.SensorsData[`a${sensor_index}`][3]<150)  
               return  0;
            else
              return 100;

      case 5://proximity
            if(Math.round(this.SensorsData[`a${sensor_index}`][3]-35)>100)
                    return 100;
            else if(Math.round(this.SensorsData[`a${sensor_index}`][3]-35)<0)
                    return 0;
            else return Math.round(this.SensorsData[`a${sensor_index}`][3]-35);

      case 6://ultrasonic     
        return (this.SensorsData[`a${sensor_index}`][2] * 256 + this.SensorsData[`a${sensor_index}`][3] );
           

       //  break;

       default:
           return  -1;

     }

 }

  setRobotSensor(robot_number:number,sensor_id:number,sensor_name:string){




    if ((this.ConnectedRobots.length - 1) >= robot_number ){


      if([0,3].indexOf(this.ConnectedRobots[0].getDeviceID()) != -1 && this.ConnectedRobots[robot_number].getState() == DEVICE_STATES["DEVICE_IS_READY"]){

      //  console.log("setRobotSensor");

      switch (sensor_name) {
        case "nosensor":

      //  console.log("Sensor name: none");

          this.sensors_array[sensor_id] = 0;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors,  this.sensors_array, function(response){

                   });



          break;

        case "line":

      //  console.log("Sensor name: line");

          this.sensors_array[sensor_id] = 1;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors, this.sensors_array, function(response){

                   });

            break;

        case "led":

    //    console.log("Sensor name: led");

          this.sensors_array[sensor_id] = 2;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors, this.sensors_array, function(response){

                   });

          break;

        case "light":

    //    console.log("Sensor name: light");

        this.sensors_array[sensor_id] = 3;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors, this.sensors_array, function(response){

                   });

          break;

        case "touch":

    //    console.log("Sensor name: touch");

          this.sensors_array[sensor_id] = 4;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors, this.sensors_array, function(response){

                   });

            break;

        case "proximity":

    //    console.log("Sensor name: proximity");

          this.sensors_array[sensor_id] = 5;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors, this.sensors_array, function(response){

                   });

        break;

        case "ultrasonic":

      //  console.log("Sensor name: ultrasonic");

          this.sensors_array[sensor_id] = 6;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors, this.sensors_array, function(response){

                   });

        break;

        case "color":

    //    console.log("Sensor name: color");

          this.sensors_array[sensor_id] = 7;

        this.ConnectedRobots[robot_number].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.sensors, this.sensors_array, function(response){

                   });

        break;

        default:



      }

    }

  }

  }

  getRecieveTimeDelta(){

      if ( (typeof(this.ConnectedRobots) !== 'undefined') && (typeof(this.ConnectedRobots[0]) !== 'undefined')  ){

        return this.ConnectedRobots[0].getRecieveTimeDelta();

      }
  }

  blockPowerCommand(){

     this.isPowerCommandBlocked = true;
  }

  unblockPowerCommand(){

     this.isPowerCommandBlocked = false;
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

  isRobotReadyToAcceptCommand(){

    if (typeof(this.ConnectedRobots[0]) !== 'undefined'){

         return this.ConnectedRobots[0].isReadyToAcceptCommand();

    }else{

        return true;

    }

     

  }

  registerRobotIsScratchduinoCallback(robot_is_scratchduino_cb:any){

    this.robot_is_scratchduino_callbacks.push(robot_is_scratchduino_cb);

  }

  registerRobotIsRobboCallback(robot_is_robbo_cb:any){

    this.robot_is_robbo_callbacks.push(robot_is_robbo_cb);

  }

  registerRobotStatusChangeCallback(robot_status_change_cb:any){


        this.robot_status_change_callback = robot_status_change_cb;

        this.runRobotStatusChangeLoop();

  }

  proxy_func_RobotStatusChange(){

    if (typeof(this.ConnectedRobots[0]) != 'undefined'){

      this.currentRobotState = this.ConnectedRobots[0].getState();

      if ((this.currentRobotState != this.previousRobotState)){


          // if (this.currentRobotState == DEVICES["DEVICE_IS_READY"]){
          //
          //
          //
          // }else{
          //
          //
          //
          // }

          if ((this.currentRobotState ==  DEVICE_STATES["TIMEOUT"]) || (this.currentRobotState ==  DEVICE_STATES["INITED"])){

            this.searching_in_progress = false;

          }  


          this.robot_status_change_callback(this.currentRobotState,this.searching_in_progress);

         this.previousRobotState =   this.currentRobotState;
      }


    }




  }


  runRobotStatusChangeLoop(){


    this.RobotStatusChangeLoopInterval = setInterval(this.proxy_func_RobotStatusChange.bind(this),300);

  }


  runDataRecieveCommand(device:InterfaceDevice){

  if ( (typeof(this.ConnectedRobots) !== 'undefined') && (this.ConnectedRobots[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]) ){


    if ( (this.ConnectedRobots[0].isReadyToAcceptCommand()) && (!this.a_command_queue_blocked)  ) {


    //   console.log("runDataRecieveCommand");

      this.can_autoreconnect = false;
      //  console.log("this.can_autoreconnect = false;                                                                                   11111111111111111111111");

       //      this.searching_in_progress = false;

       this.ConnectedRobots[0].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.check, [], (response) => {

     // this.ConnectedRobots[0].command(DEVICES[this.ConnectedRobots[0].getDeviceID()].commands.power, [0, 0], (response) => {


           this.SensorsData = response;

             this.dataRecieveTime = Date.now();

        //   this.searching_in_progress = false;
          this.can_autoreconnect = false;
          //  console.log("this.can_autoreconnect = false;                                                                                   222222222222222222222222");

         //  console.log("response: " + this.SensorsData.a0);


        });


    }



  }
  else{this.can_autoreconnect = true;  /*console.log("this.can_autoreconnect = true;                                                                                   11111111111111111111111");*/}




  }

  startDataRecievingLoop(robot:InterfaceDevice):void{


    //  if(device.getDeviceID() == 0 && device.getState() == DEVICE_STATES["DEVICE_IS_READY"]){

        console.log("startDataRecievingLoop");




              if (this.RobotSensorsDataRecievingState == SensorsDataRecievingStates.STOPED ){

                  this.RobotSensorsDataRecievingState == SensorsDataRecievingStates.STARTED;

                this.DataRecievingLoopInterval = setInterval(this.runDataRecieveCommand.bind(this,robot),0);

                }

      //    setInterval(this.runDataRecieveCommand.bind(this,device),100);







  //}



}

}
