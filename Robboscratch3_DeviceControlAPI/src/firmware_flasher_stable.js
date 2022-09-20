import {firmwares} from './firmwares';


var    arrPorts = [];
var    bitrate = 57600;



const flash_firmware = function(port_path,print_status,config){
  var  iConnectionId = null;
  var buffer;
  var hexfile = "";
  var hexfileascii = "afawf.awafw.00000001FF";

  var DTRRTSOn = { dtr: true, rts: true };
  var DTRRTSOff = { dtr: false, rts: false };

  const serial = chrome.serial;
  var seq = 1;

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


  console.log(`flash_firmware ${port_path}`);

  const LOG = "[" + port_path + "] ";


  var onErrorCallback = function (info){

    console.log("onErrorCallback");

     if (info.connectionId == iConnectionId){

         console.error(LOG + "error: " + info.error);
     //    print_status(LOG + "Error: " + info.error);

         if (info.error == "break"){

            console.error(LOG + "error: " + info.error);

           //   state = DEVICE_STATES["DEVICE_ERROR"];

             chrome.serial.setPaused(iConnectionId, false, function (){


                    console.error(LOG + "Unpaused.");
                 //   print_status(LOG +   "Unpaused.");

                   //   state = DEVICE_STATES["CONNECTED"];


             });




         }else if ( (info.error == "overrun") || (info.error == "frame_error") ) {


           chrome.serial.setPaused(iConnectionId, false, function (){

                   console.log("Unpaused.");

           });


           //    console.error(LOG + "Ignore these errors!");


         } else if ((info.error == "device_lost")){

           print_status(LOG + "device_lost");


           // chrome.serial.setPaused(iConnectionId, false, function (){
           //
           //         console.log(LOG + "Unpaused.");
           //        print_status(LOG + "Unpaused.");
           //
           //     chrome.serial.disconnect(iConnectionId, function(result){
           //
           //
           //
           //            console.log(LOG + "Connection closed: " + result);
           //
           //             setTimeout(() => {
           //
           //               console.log(LOG + "Trying to reconnect");
           //
           //              // print_status(LOG + "Connection closed: " + result);
           //          //     print_status(LOG + "Trying to reconnect");
           //
           //                chrome.serial.connect(port_path, {bitrate: bitrate}, onConnect);
           //
           //
           //               }, 3000);
           //
           //
           //     });
           //
           // });



         } else if (info.error == "disconnected") {





         } else {

            console.error("Other errors");






         }





     }

  }

   chrome.serial.onReceiveError.removeListener(onErrorCallback);

   chrome.serial.onReceiveError.addListener(onErrorCallback);


   var onConnect = function(connectionInfo){
     /////////start
          if(typeof(connectionInfo)!== "undefined")
          {
             iConnectionId = connectionInfo.connectionId;
           if (typeof(iConnectionId) !== 'undefined')
           {
              console.log(LOG + "iConnectionId:" + iConnectionId);
              if (print_status){
               print_status(LOG + "iConnectionId:" + iConnectionId);
              }
               console.log(LOG + "connected.");
               if (print_status){
                    print_status(LOG + "connected.");
               }
               if ((iDeviceID != -1) &&  (typeof(iDeviceID) != 'undefined')){
                   config.device.device_id = iDeviceID;
               }
//////////////////////////////////////baud
               chrome.serial.update(iConnectionId, {bitrate: 57600}, success => {
                 if(success)
                 {
                   console.log(LOG +  "Baud for connection set back to your anus(57600)");
                   print_status(LOG + "Baud for connection set  to 57600");

                   ///////////////////////////firma
                   if(config.device.device_id !== -1 /*|| config.device.device_firmware_version !==-1*/)
                   {
              ///       if(config.device.device_id = 3)
              //       chrome.serial.update(iConnectionId, {bitrate: 57600}, success => {
              //         if(success)
              //         {
                //         console.log(LOG +  "Baud for connection set back to your anus(57600)");
                  //       print_status(LOG + "Baud for connection set  to 57600");
                    //   }
                   console.log(LOG+"defined ass:"+config.device.device_id);
                   hexfileascii = firmwares["device_id_" + config.device.device_id]["max_version"];
                   print_status(LOG+"Start downloading firmware");
                   console.log(LOG+"Start downloading firmware");
                   fixHex();
                 }
//////////////////////////////////////////////////////////////////////////diagnoz
                 else{
                   console.log(LOG+"Start downloading diagnostic");
                   print_status(LOG+"Start downloading diagnostic");
                   hexfileascii = firmwares["diagnostics"];
                   fixHex();
                       }
                 }
               });



////////////////////////////////////////////////////////////////////////////////huinya
          }
                else{
                         console.error("Connection id is undefined");
             }
          }
                else{
                 console.log("connection info undefined");
               //
             }
   }


     chrome.serial.connect(port_path, {bitrate: bitrate}, onConnect);

  //////////////////////////////////////////////////////////////////////////////////////main
//              let board = $('#board_list').val();
//              if(!board || board === '' || board === 'none'){
//                  display_console("", "Board not selected, please go to Tools > Board.");
//                  return set_progress(0, "Error in finding board", true);
///              }
        //      set_progress(0, "connecting to device");
//              ensure_connection(success => {
//                  if (!success) {
//                      return set_progress(0, 'Error in connecting to device.', true);
//                  }

/*                set_progress(10, "Packaging file...");
                  let sketchfile = editor.getSession().getValue();//btoa(editor.getSession().getValue());
                  set_progress(20, "Uploading to compiler server...");
                  display_console("Uploading to remote compiling server: " + server_address);
                  $.post(server_address + "/compile", {sketch: sketchfile, board}, function (data) {
                      console.log(data);
                      display_console(data.stdout, data.stderr, '\n\n');
                      if (!data.success) {
                          set_progress(0, data.msg, true);
                          return;//console.error(data.stderr || data.msg);
                      }
                      termmode = 0;
  */
                  //        connection.tempBaud(boards[board].upload_speed, success=> {
                      //    if(!success){
                        //      display_console("", "Could not set baudrate.", '\n\n');
                        //      return set_progress(0, "Error in preparing board", true);
                        //  }
                    //      set_progress(30, "Processing results...");
                  //        hexfileascii = atob(data.hex);
                    //      console.log("Got file contents, running hex fixer");
              //            set_progress(40, "Decoding Intel Hex file...");
                  //        fixHex();
                //      });
              //    });
          //    });

////////////////////////////////////////////////////////////////////////////////////////////////////functions



function fixHex() {
    hexfile = "";
    buffer = hexfileascii.split(".");
    for(var x = 0; x < buffer.length; x++) {
      var  size = parseInt(buffer[x].substr(1,2),16);
        if(size == 0) {
          //  log("complete!\n");
        //    set_progress(50, "Intel Hex decoded, launching programmer...");
            print_status(LOG + "Intel Hex decoded, launching programmer...");
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
    //set_progress(60, "Putting Arduino in program mode (DTR Reset)...");
    print_status("Putting Arduino in program mode (DTR Reset)...");
    serial.setControlSignals(iConnectionId,DTRRTSOff,function(result) {
        console.log("DTR off: " + result);
        print_status("DTR off: " + result);

        setTimeout(function(){
            serial.setControlSignals(iConnectionId,DTRRTSOn,function(result) {
                console.log("DTR on:" + result);
                print_status("DTR on:" + result);

                setTimeout(function() {
                  //  set_progress(70, "Reset complete...prepping upload blocks..");
                  //  log("Arduino reset, now uploading.\n");

                  print_status("Reset complete...prepping upload blocks..");
                  print_status("Arduino reset, now uploading.");

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
  //  termmode = 0;
  //  display_console("Binary data broken into "+blk+" blocks (block size is 128)\nComplete when you see "+blk+" dots: \n\n", "", "\n");
  //  set_progress(80, "Serial upload...");

    print_status(LOG + "Binary data broken into "+blk+" blocks (block size is 128)");
    print_status(LOG+ "Serial upload...");

    for(var b = 0; b < Math.ceil(heximage.length / blocksize); b++) {
        var currentbyte = blocksize * b;
        var block = heximage.substr(currentbyte,blocksize);
        /* console.log("Block "+b+" starts at byte "+currentbyte+": "+block) */
      //  flag = 0;
        stk500_prgpage(flashblock,block,250);
        flashblock = flashblock + 64;
    }
    ////////////////////////////////////////////////////////////////////////////////////////////baud
    setTimeout(function () {
                        chrome.serial.update(iConnectionId, {bitrate: 115200}, success => {
                            if(success)
                            {
                              console.log(LOG +  "Baud for connection set back to your anus(115200)");
                              print_status(LOG + "Baud for connection set  to 115200");
                              if ((config.device.device_id == -1) && (iDeviceID == -1))
                              {

                                     console.log("onReceiveCallback addded");
                                     recieveListener =  chrome.serial.onReceive.addListener(onReceiveCallback);



                               }
                               else{

                                 chrome.serial.disconnect(iConnectionId, function(result){



                                        console.log(LOG + "Connection closed: " + result);

                                  });

                               }
                            }
        });
    },timer + 1000);
    timer = 0;
}

function stk500_prgpage(address,data,delay,flag) {
  address = hexpad16(address.toString(16)); /* convert and pad number to hex */
  address = address[2] + address[3] + address[0] + address[1];  /* make LSB first */
//  if(verbose_logging) console.log("Programming 0x"+address);
  address = String.fromCharCode(parseInt(address[0] + address[1],16)) +  String.fromCharCode(parseInt(address[2] + address[3],16)); /* h2b */
  transmitPacket(d2b(command.LOAD_ADDRESS)+address+d2b(command.Sync_CRC_EOP),delay);
  var debug = "";
  var datalen = data.length;
  buffer = "";
  transmitPacket(d2b(command.PROG_PAGE)+d2b(0x00)+d2b(datalen)+d2b(0x46)+data+d2b(command.Sync_CRC_EOP),delay);
}


var oneshot = 0;
var timer = 0;
var two_dots = false;
var dots  = ".";

function transmitPacket(buffer,delay) {
    setTimeout(function() {
      //  display_console('.', '', '');
      //  if(verbose_logging){
            var debug = "";
            for (var  x = 0; x < buffer.length; x++) {
                debug += "[" + buffer.charCodeAt(x).toString(16) + "]";
            }
            console.log(debug);
      //  }
      //  connection.send(buffer);
        chrome.serial.send(iConnectionId, str2ab(buffer), function() {

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

/* pads an 8 bit number */

function hexpad(num,size) {
      var size = 2;
      var s = "00" + num;
    return s.substr(s.length-size);
    }

/* pads an 16 bit number */

function hexpad16(num,size) {
      var size = 4;
      var s = "0000" + num;
    return s.substr(s.length-size);
    }


/* Interprets an ArrayBuffer as UTF-8 encoded string data. */
var ab2str = function(buf) {
  var bufView = new Uint8Array(buf);
  var encodedString = String.fromCharCode.apply(null, bufView);
  //if(verbose_logging) console.log(encodedString);
  return decodeURIComponent(encodeURIComponent(encodedString));
};

/* Converts a string to UTF-8 encoding in a Uint8Array; returns the array buffer. */
var str2ab = function(str) {
 // var encodedString = unescape(encodeURIComponent(str));
  var encodedString = str;
  var bytes = new Uint8Array(encodedString.length);
  for (var i = 0; i < encodedString.length; ++i) {
    bytes[i] = encodedString.charCodeAt(i);
  }
  return bytes.buffer;
};

function d2b(number) {
        return String.fromCharCode(number);
    }



function reset() {
    log("Resetting device....");
    serial.setControlSignals(connection.connectionId,DTRRTSOff,function(result) {
        console.log("DTR off: " + result);
        setTimeout(function(){
            serial.setControlSignals(connection.connectionId,DTRRTSOn,function(result) {
                console.log("DTR on:" + result);
                log("done.\n");
            });
        }, 100);
    });
}





var iSerialNumberOffset;
var recieveListener;
var bufIncomingData = new Uint8Array();
var iDeviceID = -1;
var iFirmwareVersion;
var wait_for_sync= false;


var onReceiveCallback = function(info)
{

         var bufIncomingDataNew = null;

       var buf = new Uint8Array(info.data);
     console.log(LOG + "CALLBACK!!! bytes recieved length <- " + buf.length);
      console.log(LOG + "CALLBACK!!! bytes buf <- " + buf);
      console.log(LOG + "wait_for_sync: " + wait_for_sync);
var sIncomingData = new TextDecoder("utf-8").decode(bufIncomingData);
          bufIncomingDataNew = new Uint8Array(bufIncomingData.length + buf.length);
        bufIncomingDataNew.set(bufIncomingData);
        bufIncomingDataNew.set(buf, bufIncomingData.length);
        bufIncomingData = bufIncomingDataNew;

   console.log(LOG + "Now we have: " + sIncomingData);




 iSerialNumberOffset = sIncomingData.indexOf("ROBBO");


iDeviceID  = parseInt(sIncomingData.substring(iSerialNumberOffset + 6, iSerialNumberOffset + 11));
console.log(+iDeviceID);
print_status(LOG+"Device ID is:"+iDeviceID);

//	if(iSerialNumberOffset!=-1 )
//	{


      //  purgePort();

if (typeof(iDeviceID) != 'undefined')
{
   if (!isNaN(iDeviceID))
   {
     if(sIncomingData.length > iSerialNumberOffset + 10){





     chrome.serial.onReceive.removeListener(onReceiveCallback);


     chrome.serial.onReceiveError.addListener(onErrorCallback);
     console.log(LOG + "onReceiveError listner added");


     chrome.serial.flush(iConnectionId, () => {

   //    setTimeout(() => {

         chrome.serial.disconnect(iConnectionId, function(result){



                console.log(LOG + "Connection closed: " + result);

                 setTimeout(() => {

                   console.log(LOG + "Trying to reconnect");

                   print_status(LOG + "Connection closed: " + result);
                   print_status(LOG + "Trying to reconnect");

                    chrome.serial.connect(port_path, {bitrate: 115200}, onConnect);


                   }, 3000);


         });



     //  }, 3000);





     });





// var firmware = firmwares["device_id_" + iDeviceID]["max_version"];
//  	      print_status(LOG+"Start downloading firmware");
//                   fixHex(firmware);

   }
   else
   console.log(LOG + "Nan");

   }
 }
else {
console.log(LOG + "hui tebe a ne seriinik");
}

//	 }
}


// var SerialConnection = function() {
//     this.connectionId = -1;
//     this.baud = 115200;
//     this.lineBuffer = "";
//
//     this.boundOnReceive = this.onReceive.bind(this);
//     this.boundOnReceiveError = this.onReceiveError.bind(this);
//     serial.onReceive.addListener(this.boundOnReceive);
//     serial.onReceiveError.addListener(this.boundOnReceiveError);
//
//     this.onConnect = new chrome.Event();
//     this.onReadLine = new chrome.Event();
//     this.onError = new chrome.Event();
// };
//
//
// SerialConnection.prototype.onReceive = function(info) {
//   if (receiveInfo.connectionId !== this.connectionId) {
//     return;
//   }
//
//
//               var bufIncomingDataNew = null;
//
//             var buf = new Uint8Array(info.data);
//           console.log(LOG + "CALLBACK!!! bytes recieved length <- " + buf.length);
//            console.log(LOG + "CALLBACK!!! bytes buf <- " + buf);
//            console.log(LOG + "wait_for_sync: " + wait_for_sync);
//     var sIncomingData = new TextDecoder("utf-8").decode(bufIncomingData);
//                bufIncomingDataNew = new Uint8Array(bufIncomingData.length + buf.length);
//              bufIncomingDataNew.set(bufIncomingData);
//              bufIncomingDataNew.set(buf, bufIncomingData.length);
//              bufIncomingData = bufIncomingDataNew;
//
//         console.log(LOG + "Now we have: " + sIncomingData);
//
//
//
//
//       iSerialNumberOffset = sIncomingData.indexOf("ROBBO");
//
//
//      iDeviceID  = parseInt(sIncomingData.substring(iSerialNumberOffset + 6, iSerialNumberOffset + 11));
//      console.log(+iDeviceID);
//      print_status(LOG+"Device ID is:"+iDeviceID);
//
//
// };
//
// SerialConnection.prototype.onReceiveError = function(errorInfo) {
//   if (errorInfo.connectionId === this.connectionId) {
//     this.onError.dispatch(errorInfo);
//   }
// };
//
// SerialConnection.prototype.getDevices = function(callback) {
//   serial.getDevices(callback);
// };
//
//
//
//
//
// SerialConnection.prototype.connect = function(path) {
//   serial.connect(path, {bitrate: this.baud}, connectionInfo => {
//       if (!connectionInfo) {
//           log("Connection failed.");
//           return;
//       }
//       this.connectionId = connectionInfo.connectionId;
//       this.onConnect.dispatch();
//       serial.setControlSignals(connection.connectionId,DTRRTSOn,function(result) {
//           console.log("DTR on: " + result);
//       });
//   })
// };
//
// SerialConnection.prototype.send = function(msg) {
//   if (this.connectionId < 0) {
//     throw 'Invalid connection';
//   }
//   serial.send(this.connectionId, str2ab(msg), function() {});
// };
//
// SerialConnection.prototype.disconnect = function() {
//     if (this.connectionId < 0) {
//         throw 'Invalid connection';
//     }
//     serial.disconnect(this.connectionId, success => {
//         if(!success) console.error('could not disconnect');
//         this.connectionId = -1;
//     });
// };
//
// SerialConnection.prototype.setBaud = function(baud) {
//     if (this.connectionId < 0) {
//         throw 'Invalid connection';
//     }
//     if(this.baud === baud) return;
//     serial.update(this.connectionId, {bitrate: baud}, success => {
//         if(success) {
//             console.log("Baud for connection set to " + baud);
//             this.baud = baud;
//         }
//         else console.error("Could not set baud rate.");
//     });
// };
//
// SerialConnection.prototype.tempBaud = function(baud, cb) {
//     if (this.connectionId < 0) {
//         throw 'Invalid connection';
//     }
//     serial.update(this.connectionId, {bitrate: baud}, success => {
//         if(success) {
//             console.log("Baud for connection set to " + baud + " temporarily");
//         }
//         else console.error("Could not set baud rate.");
//         cb(success);
//     });
// };
//
// SerialConnection.prototype.resetBaud = function(cb) {
//     if (this.connectionId < 0) {
//         throw 'Invalid connection';
//     }
//     serial.update(this.connectionId, {bitrate: this.baud}, success => {
//         if(success) {
//             console.log("Baud for connection set back to " + this.baud);
//         }
//         else console.error("Could not set baud rate.");
//         cb(success);
//     });
// };
//
// SerialConnection.prototype.isConnected = function() {
//     return this.connectionId > 0;
// };
//
//
// const connection = new SerialConnection();


////////////////////////////////////////////////////////////////////////////////////////end
}





////////


const search_ports = function(callback){
  var onGetDevices = function(ports) {
    for (var i=0; i<ports.length; i++) {
      console.log(ports[i].path);
       arrPorts.push(ports[i]);
       callback(ports[i])
    }
  }

    chrome.serial.getDevices(onGetDevices);
};
export  {
    flash_firmware,
    search_ports
};
