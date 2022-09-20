import {firmwares} from './firmwares';
var    arrPorts =[];
var    bitrate = 9600;
var setOptionsOFF = {};
var setOptionsON = {};
setOptionsOFF.dtr=false;
setOptionsOFF.rts=false;
setOptionsOFF.brk=false;
setOptionsOFF.cts=false;
setOptionsOFF.dsr=false;
setOptionsON.dtr=true;
setOptionsON.rts=true;
setOptionsON.brk=false;
setOptionsON.cts=false;
setOptionsON.dsr=false;
var THEEND = false;
const flash_firmware = function(port_path,print_status,config){
  console.warn("START_FLASHING!");
  var  iConnectionId = null;
  var buffer;
  var hexfile = "";
  var hexfileascii = "afawf.awafw.00000001FF";
  var qport;
  var seq = 1;
  var UNO=false;
  var stilluno = false;
  var unotime;
  var DDOS=1;
const  command = {
  "Sync_CRC_EOP" : 0x20,
  "GET_SYNC" : 0x30,
  "GET_SIGN_ON" : 0x31,
  "SET_PARAMETER" : 0x40,
  "GET_PARAMETER" : 0x41,
  "SET_DEVICE" : 0x42,
  "SET_DEVICE_EXT" : 0x45,
  "ENTER_PROGMODE" : 0x50,
  "LEAVE_PROGMODE" : 0x51,
  "CHIP_ERASE" : 0x52,
  "CHECK_AUTOINC" : 0x53,
  "LOAD_ADDRESS" : 0x55,
  "UNIVERSAL" : 0x56,
  "UNIVERSAL_MULTI" : 0x57,
  "PROG_FLASH" : 0x60,
  "PROG_DATA" : 0x61,
  "PROG_FUSE" : 0x62,
  "PROG_LOCK" : 0x63,
  "PROG_PAGE" : 0x64,
  "PROG_FUSE_EXT" : 0x65,
  "READ_FLASH" : 0x70,
  "READ_DATA" : 0x71,
  "READ_FUSE" : 0x72,
  "READ_LOCK" : 0x73,
  "READ_PAGE" : 0x74,
  "READ_SIGN" : 0x75,
  "READ_OSCCAL" : 0x76,
  "READ_FUSE_EXT" : 0x77,
  "READ_OSCCAL_EXT" : 0x78
};
const parameters = {
  "HW_VER" : 0x80,
  "SW_MAJOR" : 0x81,
  "SW_MINOR" : 0x82,
  "LEDS": 0x83,
  "VTARGET": 0x84,
  "VADJUST": 0x85,
  "OSC_PSCALE" : 0x86,
  "OSC_CMATCH" : 0x87,
  "RESET_DURATION" : 0x88,
  "SCK_DURATION" : 0x89,
  "BUFSIZEL" : 0x90,
  "BUFSIZEH" : 0x91,
  "DEVICE" : 0x92,
  "PROGMODE" : 0x93,
  "PARAMODE" : 0x94,
  "POLLING" : 0x95,
  "SELFTIMED" : 0x96,
  "TOPCARD_DETECT" : 0x98
};
const responses = {
  0x10 : "OK",
  0x11 : "FAILED",
  0x12 : "UNKNOWN",
  0x13 : "NODEVICE",
  0x14 : "INSYNC",
  0x15 : "NOSYNC"
};
var options={
 baudRate: 115200,
 dataBits: 8,
 parity: 'none',
 stopBits: 1,
 flowControl: false,
 autoOpen: false  };
 var oneshot = 0;
 var timer = 0;
 var two_dots = false;
 var dots  = ".";
 var iSerialNumberOffset;
 var recieveListener;
 var bufIncomingData = new Uint8Array();
 var iDeviceID = -1;
 var iFirmwareVersion;
 var wait_for_sync= false;
  console.log(`flash_firmware ${port_path}`);
  const LOG = "[" + port_path + "] ";
var dummy = function() {}

var onConnect = function(){
     /////////start
        //      qport.on('data',dummy);
              THEEND= false;
               console.log(LOG + "connected.");
               if ((iDeviceID != -1) &&  (typeof(iDeviceID) != 'undefined')){
                   config.device.device_id = iDeviceID;
               }
               //////////////////////////////////////baud

                   ///////////////////////////firma
                   if(config.device.device_id !== -1 && !isNaN(config.device.device_id)){
                     console.log(LOG+"defined ass:"+config.device.device_id);
                     hexfileascii = firmwares["device_id_" + config.device.device_id]["max_version"];
                     if((iDeviceID==3)||(iDeviceID==4)){
                          options.baudRate = 115200;
                          qport.update(options, () =>{
                         console.log(LOG +  "Baud for connection set back to your anus(115200)");
                    //     print_status(LOG + "Baud for connection set  to 115200");
                         print_status(LOG+"Start downloading firmware for uno(115200)");
                         console.log(LOG+"Start downloading firmware for uno");
                         THEEND=true;
                         fixHex();
                       });
                     }
                     else{
                      options.baudRate = 57600;
                      qport.update(options, () =>{
                       print_status(LOG+"Start downloading firmware for nano(57600)");
                       console.log(LOG+"Start downloading firmware for nano(57600)");
                       THEEND=true;
                       fixHex();
                      });
                     }
                   }
                   //////////////////////////////////////////////////////////////////////////diagnoz
                  else{
                   if(UNO){
                     console.log(LOG +  "UNOTIME!");
                     //   print_status(LOG + "It's UNO, load another diagnostic");
                      options.baudRate = 115200;
                      qport.update(options, (success) =>{
                      console.log(LOG +  "Baud for connection set back to your anus(115200)");
                      //    print_status(LOG + "Baud for connection set  to 115200");
                      });
                     console.log(LOG+"Start downloading diagnostic for uno");
                     print_status(LOG+"Start downloading diagnostic for uno(115200)");
                     hexfileascii = firmwares["diagnoz"];
                     UNO = false;
                     stilluno = true;
                     fixHex();
                   }
                   else{
                       console.log(LOG +  "Baud for connection set back to your anus(57600)");
                       options.baudRate = 57600;
                       qport.update(options, (success) =>{
                 	     UNO = true;
                       //console.log(success);
                       console.log(LOG+"Start downloading diagnostic for nano");
                       print_status(LOG+"Start downloading diagnostic for nano(57600)");
                       hexfileascii = firmwares["diagnostics"];
                       fixHex();
                     });
                   }
                 }
               ////////////////////////////////////////////////////////////////////////////////huinya
}

var ROFL = function(err,ports){
  console.warn("IN SUK");
  for (var i=0; i<ports.length; i++) {
    if(typeof(ports[i].vendorId) !== 'undefined'){
    console.warn("SRAVNIVAU"+ports[i].comName + " and "+port_path );
    if(ports[i].comName==port_path){
      console.log("OPENING PORT epta");
      qport = new _serialport(ports[i].comName, options);
      qport.open(()=>{qport.on('error', function(err) {
             console.log('Error: '+ err.message);});
            onConnect();});
    }
  }
  }
}

_serialport.list(ROFL);

  //   chrome.serial.connect(port_path, {bitrate: bitrate}, onConnect);

function fixHex() {
    hexfile = "";
    buffer = hexfileascii.split(".");
    for(var x = 0; x < buffer.length; x++) {
      var  size = parseInt(buffer[x].substr(1,2),16);
        if(size == 0) {
          //  log("complete!\n");
        //    set_progress(50, "Intel Hex decoded, launching programmer...");
          //  print_status(LOG + "Intel Hex decoded, launching programmer...");
            stk500_program();
            return;
        }
        for(var y = 0; y < (size * 2); y = y + 2){
            // console.log(buffer[x].substr(y+9,2));
            hexfile += String.fromCharCode(parseInt(buffer[x].substr(y+9,2),16));
        }
    }
}

function stk500_program() {
  qport.set(setOptionsOFF,function(result) {
    if(result!=null)
    print_status("DTR on Error:" + result);
  setTimeout(function(){
      qport.set(setOptionsOFF,function(result) {
          if(result!=null)
          print_status("DTR on Error:" + result);
          setTimeout(function() {
              stk500_upload(hexfile);
          },200);
      });
    }, 100);
  });
}

function stk500_upload(heximage) {
    var flashblock = 0;
    transmitPacket(d2b(command.ENTER_PROGMODE)+d2b(command.Sync_CRC_EOP),50);
    var blocksize = 128;
    var   blk = Math.ceil(heximage.length / blocksize);
    print_status(LOG + "Wait about "+blk/4+" secs");
    //  print_status(LOG+ "Serial upload...");
    for(var b = 0; b < Math.ceil(heximage.length / blocksize); b++) {
        var currentbyte = blocksize * b;
        var block = heximage.substr(currentbyte,blocksize);
        /* console.log("Block "+b+" starts at byte "+currentbyte+": "+block) */
        stk500_prgpage(flashblock,block,100);//250
        flashblock = flashblock + 64;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////baud
    setTimeout(function () {

      if (stilluno)
      {
       stilluno=false;
       options.baudRate = 38400;
       qport.update(options, success => {
       console.log(LOG +  "Baud for connection set back to your anus(38400) becourse still uno");
       print_status(LOG + "Waiting for DeviceID on (38400)");
       });
       console.log("onReceiveCallback addded");
       qport.on("data",onReceiveCallback);
     }
     else{
        print_status(LOG + "Waiting for DeviceID on (115200)");//
        options.baudRate = 115200;
        qport.update(options, (success) =>{
        if(success!=null)
        console.error("ERR: " + success);
        console.log(LOG +  "Baud for connection set back to your anus(115200)");
      //  print_status(LOG + "Baud for connection set  to 115200");
        if(THEEND){

                     console.log(LOG +  "END");
                     qport.close(()=>{print_status(LOG + "END. Port closed");});
                     //     setTimeout(function (){reset();},1000);
                   }
     });
        if ((config.device.device_id == -1) && (iDeviceID == -1))
          {
            console.log("onReceiveCallback addded");
            qport.on("data",onReceiveCallback);
						if(UNO)
						{
            console.log("waiting for UNOTIME");
						unotime = setTimeout(()=>{ print_status(LOG + "No DeviceID, its UNO");qport.close(()=>{qport.open(onConnect);});},3000);
            }
          }
        }
    },timer + 1000);
    timer = 0;
}

function stk500_prgpage(address,data,delay,flag) {
  address = hexpad16(address.toString(16)); /* convert and pad number to hex */
  address = address[2] + address[3] + address[0] + address[1];  /* make LSB first */
  //console.log("Programming 0x"+address);
  address = String.fromCharCode(parseInt(address[0] + address[1],16)) +  String.fromCharCode(parseInt(address[2] + address[3],16)); /* h2b */
  transmitPacket(d2b(command.LOAD_ADDRESS)+address+d2b(command.Sync_CRC_EOP),delay);
  var debug = "";
  var datalen = data.length;
  buffer = "";
  transmitPacket(d2b(command.PROG_PAGE)+d2b(0x00)+d2b(datalen)+d2b(0x46)+data+d2b(command.Sync_CRC_EOP),delay);
}

function transmitPacket(buffer,delay) {
    setTimeout(function() {
      //  display_console('.', '', '');
      //  if(verbose_logging){
            var debug = "";
            for (var  x = 0; x < buffer.length; x++) {
                debug += "[" + buffer.charCodeAt(x).toString(16) + "]";
            }
     //       console.log(debug);
      //  }
      //  connection.send(buffer);
        qport.write(str2ab(buffer), function() {

          if (two_dots){

             dots = "...";
             two_dots = false;

          }else{

               dots = "..";
               two_dots = true;
          }

          print_status(LOG +  "Uploading" + dots);

        });
    },delay + timer);
    timer = timer + delay;
}

function hexpad(num,size) {
      var size = 2;
      var s = "00" + num;
    return s.substr(s.length-size);
    }

function hexpad16(num,size) {
      var size = 4;
      var s = "0000" + num;
    return s.substr(s.length-size);
    }

var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  //if(verbose_logging) console.log(encodedString);
  return decodeURIComponent(encodeURIComponent(encodedString));
};

var str2ab = function(str) {
 // var encodedString = unescape(encodeURIComponent(str));
  var encodedString = str;
  //var bytes = new Uint8Array(encodedString.length);
    const buf = Buffer.allocUnsafe(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
  //  bytes[i] = encodedString.charCodeAt(i);
       buf.writeUInt8(encodedString.charCodeAt(i), i);
  }
 //  return bytes.buffer;
 return buf;
};

function d2b(number) {
        return String.fromCharCode(number);
    }
/*
function reset() {
        console.log("Resetting device....");
        //  console.warn("port is: "+ qport.isOpen);
        qport.set(setOptionsOFF,function(result) {
        console.log("DTR off: " + result);
        setTimeout(function(){
        qport.set(setOptionsON,(error)=> {
                console.log("DTR on:" + result);
                console.log("done.\n");
            });
        }, 100);
    });
}*/

var onReceiveCallback = function(info){
   if(DDOS)
   {
      var bufIncomingDataNew = null;
       var buf = new Uint8Array(info);
       //      console.log(LOG + "CALLBACK!!! bytes recieved length <- " + buf.length);
       //     console.log(LOG + "CALLBACK!!! bytes buf <- " + buf);
       //     console.log(LOG + "wait_for_sync: " + wait_for_sync);
       var sIncomingData = new TextDecoder("utf-8").decode(bufIncomingData);
        bufIncomingDataNew = new Uint8Array(bufIncomingData.length + buf.length);
        bufIncomingDataNew.set(bufIncomingData);
        bufIncomingDataNew.set(buf, bufIncomingData.length);
        bufIncomingData = bufIncomingDataNew;
      //  console.log(LOG + "Now we have: " + sIncomingData);
        iSerialNumberOffset = sIncomingData.indexOf("ROBBO");
        iDeviceID  = parseInt(sIncomingData.substring(iSerialNumberOffset + 6, iSerialNumberOffset + 11));
        console.log(+iDeviceID);
        if (!isNaN(iDeviceID)){
          qport.removeListener('data',onReceiveCallback);
        print_status(LOG+"Device ID is:"+iDeviceID);

        //	if(iSerialNumberOffset!=-1 )
        //	{


        //  purgePort();

        if (typeof(iDeviceID) != 'undefined')
        {
          if (!isNaN(iDeviceID))
          {
            DDOS=false;
            if(sIncomingData.length > iSerialNumberOffset + 10){
              UNO    = false;
	             clearTimeout(unotime);
               qport.flush((err)=>{qport.close(()=>{qport.open(onConnect);})});
                /*
     qport.flush(iConnectionId, () => {

       //    setTimeout(() => {

         qport.close(function(err){
           if (!err)
           {
                console.log(LOG + "Connection closed");

                 setTimeout(() => {

                   console.log(LOG + "Trying to reconnect");

                   print_status(LOG + "Connection closed" );
                   print_status(LOG + "Trying to reconnect");

                    chrome.serial.connect(port_path, {bitrate: 38400}, onConnect);
                  }, 3000);}
         });
     });*/
   }
   else
   console.log(LOG + "Nan");
   }
  }
  else {
    console.log(LOG + "hui tebe a ne seriinik");
  }
  }
  //	 }
 }
}
}

const search_ports = function(callback){
  var onGetDevices = function(err,ports) {
    for (var i=0; i<ports.length; i++) {
        if(typeof(ports[i].vendorId) !== 'undefined')
        {
      console.log(ports[i].comName+" finded");
       arrPorts.push(ports[i]);
       callback(ports[i])
     }
    }
  }
    _serialport.list(onGetDevices);
};

export  {
    flash_firmware,
    search_ports

};
