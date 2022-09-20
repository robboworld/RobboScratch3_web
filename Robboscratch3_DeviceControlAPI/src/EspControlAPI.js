/* @flow */
import DeviceControlAPI from './DeviceControlAPI';
//import EspSensorsData from './EspSensorsData';
import {InterfaceDevice,searchDevices,getConnectedDevices,pushConnectedDevices,DEVICES,DEVICE_STATES} from './chrome';
const DEVICE_HANDLE_TIMEOUT = 1 * 60 * 1000;
type EspSensorsData = {
    status :  number
};
export default class EspControlAPI extends DeviceControlAPI {

    EspSensorsDataRecievingState;//:SensorsDataRecievingState;
    SensorsData;//:EspSensorsData;

    ConnectedDevices;//: Array<InterfaceDevice>;
    ConnectedEsps;//: Array<InterfaceDevice>;
    ConnectedEspsSerials;//:Array<string>;

    handleConnectedDevicesInterval;//:IntervalID;
    DataRecievingLoopInterval;//:IntervalID;
    automaticDeviceHandleProcessStopTimeout;//:any;
    sensors_array;//:Array<number>;
    constructor(){
        super();
        this.init_all();
        this.searching_in_progress = false;
        this.sensors_array = [0,0];
        this.stopSearchProcess();
        this.stopDataRecievingProcess();

        this.esp_status_change_cb = () => {};
    }
    init_all(){
        //this.RobotSensorsDataRecievingState = SensorsDataRecievingStates.STOPED;
        this.ConnectedDevices = [];
        this.ConnectedEsps = [];
        this.ConnectedEspsSerials = [];
        this.dataRecieveTime = 0;
        this.previousEspState = DEVICE_STATES["INITED"];
        this.currentEspState =  DEVICE_STATES["INITED"];
        //this.a_can_send = true;
    }
    toString(){
        return "EspControlAPI object appears";
    }

    searchEspDevices(){
        //console.log("Search ESP.")
        this.init_all();
        this.stopDataRecievingProcess();
        this.searching_in_progress = true;
    
        if (typeof(this.esp_status_change_cb) === 'function'){
            this.esp_status_change_cb(this.currentEspState,this.searching_in_progress);
        }
    
        this.handleConnectedDevicesInterval = setInterval(function (self){
                let devices = getConnectedDevices(); //:Array<InterfaceDevice>
                self.ConnectedDevices = devices;
                handleConnectedDevices(self.ConnectedDevices,self);
            },100,this);
        
        this.automaticDeviceHandleProcessStopTimeout = setTimeout(function(self){
                console.log("Stop devices handle process.");
                clearInterval(self.handleConnectedDevicesInterval);
                self.searching_in_progress = false;
                if (typeof(self.esp_status_change_cb) === 'function'){
                    self.esp_status_change_cb(self.currentEspState,self.searching_in_progress);
                }
            }, DEVICE_HANDLE_TIMEOUT, this);
        var handleConnectedDevices = function (Devices,self){ //:EspControlAPI
            //console.log("Handle connected ESP.");
            if (typeof(Devices)!== 'undefined'){
                if (Devices.length != 0){
                    Devices.forEach(function (device){ //:InterfaceDevice
                        //console.log("Trying ESP");
                        if ((device!=null)&&([7].indexOf(device.getDeviceID())!=-1 ) && (device.getState() == DEVICE_STATES["DEVICE_IS_READY"])){
                            if (self.ConnectedEspsSerials.indexOf(device.getSerialNumber()) == -1 ){
                                console.warn("We have new ready ESSSP!!!");
                                self.searching_in_progress = false;

                                if (typeof(self.esp_status_change_cb) === 'function'){
                                    self.esp_status_change_cb(self.currentEspState,self.searching_in_progress);
                                }

                                console.warn("Esp serial: " + device.getSerialNumber());
                                self.startDataRecievingLoop(device);
                                self.ConnectedEsps.push(device);
                                self.ConnectedEspsSerials.push(device.getSerialNumber());

                                //device.command(DEVICES[device.getDeviceID()].commands.sensors, self.sensors_array, function(response){});
                            }
                        }else{
                            //console.log("Device ID: " + device.getDeviceID()  + " " + "State:  " + device.getState() + " " + "State name: " + self.getStateNameByID(device.getState())
                            //+ " " + "Device serial: " + device.getSerialNumber() );
                        }
                    });
                }else{
                    //console.log("Devices array is empty");
                }
            }
        }
    }

    checkEspByPort(port,callback){
        var result = {};
        result.device = {};

        result.code = -1;
        result.device.id = -1;
        result.device.firmware_version = -1;
        result.device.serial_number = -1;

        for (var i = 0; i < this.ConnectedEsps.length; i++) {
            if ((this.ConnectedEsps[i].getPortName() == port) && (this.ConnectedEsps[i].getState() == DEVICE_STATES["DEVICE_IS_READY"]) ){
                result.code = 0;
                result.device.id = this.ConnectedEsps[i].getDeviceID();
                result.device.firmware_version = this.ConnectedEsps[i].getFirmwareVersion();
                result.device.serial_number = this.ConnectedEsps[i].getShorterSerialNumber();

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
        if(typeof(this.ConnectedEsps[0])!='undefined'){
            this.ConnectedEsps[0].disco(onDisconnectedCb);
        }
        //     else{
        //         let devices = getConnectedDevices();
        //         devices.forEach((device,device_index) => {
        //             console.log(`Close device: ${device.getPortName()}`);
        //             device.disco();
        //         });
        //  }
    }

    getSensorData(sensor_index){ //:number
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

    proxy_func_EspStatusChange(){
        if (typeof(this.ConnectedEsps[0]) != 'undefined'){
            this.currentEspState = this.ConnectedEsps[0].getState();
            if ((this.currentEspState != this.previousEspState)){
                this.esp_status_change_cb(this.currentEspState,this.searching_in_progress);
                this.previousEspState =   this.currentEspState;
            }
        }
    }

    runEspStatusChangeLoop(){
        this.EspStatusChangeLoopInterval = setInterval(this.proxy_func_EspStatusChange.bind(this),300);
    }

    registerEspStatusChangeCallback(esp_status_change_cb){ //:any
        this.esp_status_change_cb = esp_status_change_cb;
        this.runEspStatusChangeLoop();
    }

    runDataRecieveCommand(device){ //:InterfaceDevice
        if ((typeof(this.ConnectedEsps[0])!='undefined') &&this.ConnectedEsps[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
            if (this.ConnectedEsps[0].isReadyToAcceptCommand()){
            this.ConnectedEsps[0].command(DEVICES[this.ConnectedEsps[0].getDeviceID()].commands.check, [], (response) => {
                this.SensorsData = response;
                    this.dataRecieveTime = Date.now();
                });
            }
        }
    }
    startDataRecievingLoop(esp){ //:InterfaceDevice
        console.log("startDataRecievingLoop");
        // if (this.EspSensorsDataRecievingState == SensorsDataRecievingStates.STOPED ){
        //     this.EspSensorsDataRecievingState == SensorsDataRecievingStates.STARTED;
        this.DataRecievingLoopInterval = setInterval(this.runDataRecieveCommand.bind(this,esp),0);
        //}
    }

    stopSearchProcess(){
        console.log("stopSearchProcess");
        clearInterval(this.handleConnectedDevicesInterval);
        clearTimeout(this.automaticDeviceHandleProcessStopTimeout);
        this.searching_in_progress = false;
        if ( typeof (this.ConnectedDevices) != 'undefined'){
            this.ConnectedDevices.forEach(function(device){ //:InterfaceDevice
                    device.stopCheckingSerialNumber();
            });
        }
    }

    setWifi(login,password){
        let q =0;
        let w =0;
        let a = ""+login+"$p"+password+"$";
        var res=[];
        for(let z=0;z<48;z++) {
            if(z<a.length){
                if(a.charCodeAt(z)>1039) res[z]=a.charCodeAt(z)-911;
                else {
                    res[z]=a.charCodeAt(z);
                }
            }
            else {
                res[z]=42;
            }
        }
        if((typeof(this.ConnectedEsps[0])!='undefined') &&[7].indexOf(this.ConnectedEsps[0].getDeviceID()) != -1 && this.ConnectedEsps[0].getState() == DEVICE_STATES["DEVICE_IS_READY"]){
            this.ConnectedEsps[0].command(DEVICES[this.ConnectedEsps[0].getDeviceID()].commands.wifi, res , (response) => {
                this.SensorsData = response;
                this.dataRecieveTime = Date.now();
            });
        }
    }
}
