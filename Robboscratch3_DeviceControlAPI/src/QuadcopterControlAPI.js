import DeviceControlAPI from './DeviceControlAPI';
//import RobotSensorsData from './RobotSensorsData';
import {Crazyradio} from './crazyradio';


export default class QuadcopterControlAPI extends DeviceControlAPI {

   constructor(){

      super();

      this.searching_in_progress = false;
      this.radioState = "disconnected";
      this.data_recieve_time = 0;
      this.getDataInterval = null;
      this.move_with_speed_interval_cleared = true;
      this.move_with_speed_interval = null;

      this.x_speed = Number(0);
      this.y_speed = Number(0);
      this.rotation = Number(0);
      this.z_distance = Number(0);

      this.quadcopter_status_change_cb = () => {};

      this.dataRecieveTimeout = null;

      this.need_to_init_telemetry_delta = false;

      this.telemetry_x_delta = 0;
      this.telemetry_y_delta = 0;


   }


   searchQuadcopterDevices(){

    console.warn("search copter devices");

     this.searching_in_progress = true;

     this.need_to_init_telemetry_delta = true;

     //this.move_to_coords_interval  = null;

     this.telemetryData = {};
     this.telemetryDataRaw = [];


     this.global_toc_data_object = null;

    // this.data_recieve_time = 0;
     this.data_check_time   = Date.now();

     //if (this.radioState === "connected") {

       Crazyradio.close();
       this.radioState = "disconnected";


  //  }

  if (this.quadcopter_status_change_cb){

    this.quadcopter_status_change_cb(this.radioState,this.searching_in_progress);
  }


     if (this.radioState === "disconnected") {

       // if (this.quadcopter_status_change_cb){
       //
       //   this.quadcopter_status_change_cb(this.radioState,this.searching_in_progress);
       // }

     Crazyradio.open((state) => {
       console.log("Crazyradio opened: " + state);
       if (state === true) {
         Crazyradio.setChannel(80, (state) => {
           //Crazyradio.setDatarate("250Kbps", (state) => {
			Crazyradio.setDatarate("2Mbps", (state) => {
             if (state) {


               this.data_check_time = Date.now();


                 // TODO:  recconect after STOP block; check older versions
                  setTimeout(()=> {

                     if ((this.data_check_time - this.data_recieve_time) > 1500){

                      this.startDataRecieving();

                    }

                  },300);












             }
           });
         });

       }else{

          this.searching_in_progress = false;

          if (this.quadcopter_status_change_cb){

            this.quadcopter_status_change_cb(this.radioState,this.searching_in_progress);
          }

       }
     });
   } else if (this.radioState === "connected") {

    // this.radioState = "disconnected";
    // this.searching_in_progress = false;
    // Crazyradio.close();


   }


   }


   isQuadcopterSearching(){

         return   this.searching_in_progress;
   }

  isQuadcopterConnected(){

      let is_connected = false;

      this.data_check_time = Date.now();

      if ((this.data_check_time - this.data_recieve_time) > 1000){

            this.radioState = "disconnected";

      }else{

            this.radioState = "connected";
            this.searching_in_progress = false;

      }

      is_connected = (this.radioState === "connected")?true:false;


      return is_connected;

  }

  registerQuadcopterStatusChangeCallback(cb){

      this.quadcopter_status_change_cb = cb;

  }


  cleanQuadcopterInitData(){

        console.log(`cleanQuadcopterInitData`);

        return new Promise((resolve,reject)=>{

          var  packet = new ArrayBuffer(1);
          var  dv  = new DataView(packet);
          dv.setUint8(0,0xff,true);


          Crazyradio.sendPacket(packet).then(result => {

              console.log(`cleanQuadcopterInitData incoming data: ${result.data}`);


              if (result.state === true) {


              }else{



              }

          }).catch(error => {



          });

          var sent_packets = 0;
          var recieved_packets = 0;

          var can_resolve = true;

         var cleanQuadcopterInitDataInterval =  setInterval(() => {



           if (sent_packets == recieved_packets){


             sent_packets++;
             console.log(`cleanQuadcopterInitData sent_packets: ${sent_packets}`);

             Crazyradio.sendPacket(packet).then(result => {

                 console.log(`cleanQuadcopterInitData incoming data: ${result.data}`);


                 if (result.state === true) {

                     recieved_packets++;
                     console.log(`cleanQuadcopterInitData recieved_packets: ${recieved_packets}`);

                     if (( [0xf3,0xf7].indexOf(result.data[0]) != -1 )){


                         clearInterval(cleanQuadcopterInitDataInterval);

                       //    if (sent_packets == recieved_packets){


                             if (can_resolve){

                                 setTimeout(() => {

                                       resolve("Quadcopter init data clean step was succesfully passed");

                                 }, 1000);

                               can_resolve = false;

                             }

                       //    }



                     }


                 }else{



                 }

             }).catch(error => {

                     reject();

             });


           }





          },100);



          setTimeout(() => {

              clearInterval(cleanQuadcopterInitDataInterval);

          },50000)



          // Crazyradio.sendPacket(packet1, function(state, data) {
          //   if (state === true) {
          //    console.log("success 1");
          //   } else {
          //     console.log("unsuccess 1");
          //   }
          // })


        });


  }

  TOC_GET_INFO(){



    console.log(`tocLenRecieve`);

    return new Promise((resolve,reject)=>{

      var  packet = new ArrayBuffer(2);
      var  dv  = new DataView(packet);
      dv.setUint8(0,0x5C,true);
    //  dv.setUint8(1,0x01,true); //old Flow v1
     dv.setUint8(1,0x03,true); //new Flow v2


      Crazyradio.sendPacket(packet).then(result => {

          console.log(`tocLenRecieve incoming data: ${result.data}`);


          if (result.state === true) {

              return  this.TOC_DATA_DEVIDER();

          }else{

                return  this.TOC_DATA_DEVIDER();

          }

      }).then(result => {

        if (result.state === true) {

          if ( ([0x50,0x54,0x56,0x5C].indexOf(result.data[0]) != -1 ) ){ //проверяем, является ли ответ нужным нам.

                   let toc_log_len = result.data[2];
                   console.log(`toc_log_len: ${toc_log_len}`);
                   resolve(toc_log_len);

            }


        }else{



        }



      }).catch(error => {



      });








    });


  }


  TOC_GET_ITEM(item_index){


    console.log(`TOC_GET_ITEM`);

    return new Promise((resolve,reject)=>{

      var  packet = new ArrayBuffer(3);
      var  dv  = new DataView(packet);
      dv.setUint8(0,0x5C,true);
      dv.setUint8(1,0x00,true);
     // dv.setUint8(1,0x02,true);
      dv.setUint8(2,Number(item_index),true);


      Crazyradio.sendPacket(packet).then(result => {

        console.log(`TOC_GET_ITEM incoming data: ${result.data}`);


        if (result.state === true) {

            return  this.TOC_DATA_DEVIDER();

        }else{

              return  this.TOC_DATA_DEVIDER();

        }

    }).then(result => {

        console.log(`TOC_GET_ITEM incoming data: ${result.data}`);

      if (result.state === true) {





          resolve(result.data);




      }else{



      }



    }).catch(error => {




    });


});

}


  TOC_CREATE_BLOCK(telemetry_element_table,prefered_telemetry_table,block_id){

    console.log(`TOC_CREATE_BLOCK`);

    return new Promise((resolve,reject)=>{

      var array_buffer_length = prefered_telemetry_table.length * 2 + 3;

      var  packet = new ArrayBuffer(array_buffer_length);

      var  dv  = new DataView(packet);
      dv.setUint8(0,0x51,true);
      dv.setUint8(1,0x00,true);



    //  var block_id = Math.floor( Math.random() * 100);

      dv.setUint8(2,block_id,true);

      var type;
      var input

      for (var i = 0; i < prefered_telemetry_table.length; i++) {

        type = (telemetry_element_table[prefered_telemetry_table[i]].telemetry_element_type << 4) + telemetry_element_table[prefered_telemetry_table[i]].telemetry_element_type;
        dv.setUint8((3 + i * 2 ),type,true);
        dv.setUint8((4 + i * 2),telemetry_element_table[prefered_telemetry_table[i]].telemetry_element_id,true);

         input = new Uint8Array(packet);
        console.log(`TOC_CREATE_BLOCK creating packet... packet: ${input}`);

      }



      Crazyradio.sendPacket(packet).then(result => {

        console.log(`TOC_CREATE_BLOCK incoming data: ${result.data}`);


        if (result.state === true) {

            return  this.TOC_DATA_DEVIDER();

        }else{

              return  this.TOC_DATA_DEVIDER();

        }

    }).then(result => {

        console.log(`TOC_CREATE_BLOCK incoming data: ${result.data}`);

      if (result.state === true) {





        this.TOC_CHECK_HEADER([0x51], result.data, 5).then((data) => {

              resolve(result.data);


        }).catch((error) => {



        })




      }else{



      }



    }).catch(error => {




    });



  });

  }


    TOC_DATA_DEVIDER_F3(try_counter){


      console.log(`TOC_DATA_DEVIDER_F3 try_counter: ${try_counter}`);

      return new Promise((resolve,reject)=>{


      //  var try_counter = 0;

        var  packet = new ArrayBuffer(1);
        var  dv  = new DataView(packet);
        dv.setUint8(0,0xf3,true);


         Crazyradio.sendPacket(packet).then(result => {

              console.log(`TOC_DATA_DEVIDER_F3 incoming data: ${result.data}`);

              if (result.state === true) {

                  resolve(result);

              }else{

                  if (try_counter != 0 ){

                  //  try_counter++

                    this.TOC_DATA_DEVIDER_F3(try_counter  - 1).then((result) =>{

                        console.log(`TOC_DATA_DEVIDER_F3 incoming data: ${result.data}`);

                        resolve(result);

                    }).catch((error) => {



                    })

                  }else{

                      console.log(`TOC_DATA_DEVIDER_F3  ${try_counter} attempts passed but getting 0 `);
                      resolve(result);

                  }



              }


         }).catch(() => {




         });

      });

    }

    TOC_DATA_DEVIDER_FF(try_counter){

      console.log(`TOC_DATA_DEVIDER_FF try_counter: ${try_counter}`);

      return new Promise((resolve,reject)=>{


        //var try_counter = 0;

        var  packet = new ArrayBuffer(1);
        var  dv  = new DataView(packet);
        dv.setUint8(0,0xff,true);


         Crazyradio.sendPacket(packet).then(result => {

              console.log(`TOC_DATA_DEVIDER_FF incoming data: ${result.data}`);

              if (result.state === true) {



                  resolve(result);

              }else{

                  if (try_counter != 0){

                  //  try_counter++

                    this.TOC_DATA_DEVIDER_FF((try_counter - 1)).then((result) =>{

                        console.log(`TOC_DATA_DEVIDER_FF incoming data: ${result.data}`);

                        resolve(result);

                    }).catch((error) => {



                    })

                  }else{

                    console.log(`TOC_DATA_DEVIDER_FF  ${try_counter} attempts passed but getting 0 `);

                    resolve(result);


                  }



              }


         }).catch(() => {




         });

      });

    }


    TOC_DATA_DEVIDER(){

      console.log(`TOC_DATA_DEVIDER`);

      return new Promise((resolve,reject)=>{


            this.TOC_DATA_DEVIDER_FF(5).then((result) => {


                if (result.state === true) {

                    return this.TOC_DATA_DEVIDER_F3(5);

                }else{

                    return this.TOC_DATA_DEVIDER_F3(5);

                }





            }).then((result) => {


                resolve(result);


            }).catch((error) => {



            })

        });



    }

    TOC_CHECK_HEADER(header_values_to_check,data,try_counter){

      console.log(`TOC_CHECK_HEADER try_counter ${try_counter}`);

      return new Promise((resolve,reject)=>{

        if ( (header_values_to_check.indexOf(data[0]) != -1 ) ){

            resolve(data);

        }else{


          if (try_counter != 0 ){


              this.TOC_DATA_DEVIDER_FF(5).then((result) => {

              return  this.TOC_CHECK_HEADER(header_values_to_check, result,(try_counter - 1))



            }).then((result)=> {

                  resolve(result);

            }).catch((error) => {




              });


            }else{


              console.log(`TOC_CHECK_HEADER  ${try_counter} attempts passed but getting bad answer `);

              resolve(result);


            }

        }


      });


    }

  TOC_START_BLOCK(block_id){


    console.log(`TOC_START_BLOCK`);

    return new Promise((resolve,reject)=>{



      var  packet = new ArrayBuffer(4);

      var  dv  = new DataView(packet);
      dv.setUint8(0,0x51,true);
      dv.setUint8(1,0x03,true);
      dv.setUint8(2,block_id,true);
      dv.setUint8(3,Number(20),true);




      Crazyradio.sendPacket(packet).then(result => {

        console.log(`TOC_START_BLOCK incoming data: ${result.data}`);




        if (result.state === true) {

            return  this.TOC_DATA_DEVIDER();

        }else{

              return  this.TOC_DATA_DEVIDER();

        }

    }).then(result => {

        console.log(`TOC_START_BLOCK incoming data: ${result.data}`);

      if (result.state === true) {

            this.TOC_CHECK_HEADER([0x51], result.data, 5).then((data) => {

                  resolve(result.data);


            }).catch((error) => {



            })



  }else{



      }



    }).catch(error => {




    });



  });


  }

  PROCESS_TELEMETRY_DATA(data){

  //  console.log(`PROCESS_TELEMETRY_DATA`);


      /*
          this.telemetryData[0] - x,y,z

          this.telemetryData[1]  - yaw,vbat

      */

    // this.data_recieve_time = Date.now();


    this.telemetryDataRaw[data[1]] = data;

    var buffer;
    var view;

   //
    buffer = this.telemetryDataRaw[1].slice(5,9).buffer

    view = new DataView(buffer);

   this.telemetryData.yaw = view.getFloat32(0,true);

  // console.log(`Quadcopter telemetry  data yaw: ${this.telemetryData.yaw} `);

   //
   //
   //
   //
   //
   //
   //

    buffer = this.telemetryDataRaw[1].slice(9,13).buffer

    view = new DataView(buffer);

   this.telemetryData.vbat = view.getFloat32(0,true);

  // console.log(`Quadcopter telemetry  data vbat: ${this.telemetryData.vbat} `);




   buffer = this.telemetryDataRaw[0].slice(5,9).buffer

   view = new DataView(buffer);

  this.telemetryData.x = view.getFloat32(0,true);

// console.log(`Quadcopter telemetry  data x: ${this.telemetryData.x} `);


   buffer = this.telemetryDataRaw[0].slice(9,13).buffer

   view = new DataView(buffer);

  this.telemetryData.y = view.getFloat32(0,true);

// console.log(`Quadcopter telemetry  data y: ${this.telemetryData.y} `);


   buffer = this.telemetryDataRaw[0].slice(13).buffer

   view = new DataView(buffer);

  this.telemetryData.z = view.getFloat32(0,true);

 //console.log(`Quadcopter telemetry  data z: ${this.telemetryData.z} `);

  if (this.need_to_init_telemetry_delta){

      this.need_to_init_telemetry_delta = false;

      this.telemetry_x_delta = Number(this.telemetryData.x.toFixed(7));
      this.telemetry_y_delta = Number(this.telemetryData.y.toFixed(7));
  }


  }

  GET_TELEMETRY_DATA(){

    console.log(`GET_TELEMETRY_DATA`);

    this.radioState = "connected";
    this.searching_in_progress = false;

    if (this.quadcopter_status_change_cb){

      this.quadcopter_status_change_cb(this.radioState,this.searching_in_progress);

      // this.dataRecieveTimeout = setTimeout(()=>{
      //
      //   this.radioState = "disconnected";
      //   this.searching_in_progress = false;
      //
      //   this.quadcopter_status_change_cb(this.radioState,this.searching_in_progress);
      //
      // },1000);

    }

    this.getDataInterval =  setInterval(()=>{




      if (Crazyradio.handle != null){


        var  packet = new ArrayBuffer(1);
        var  dv  = new DataView(packet);
        dv.setUint8(0,0xff,true);


        Crazyradio.sendPacket(packet).then(result => {




            if (result.state === true) {

                  if ( ([0x50,0x54,0x56,0x5C,0x52].indexOf(result.data[0]) != -1 ) ){

                    //    console.log(`Quadcopter get data: ${result.data} `);
                     this.data_recieve_time = Date.now();

                     if (this.radioState == "disconnected"){

                       this.radioState = "connected";
                       this.searching_in_progress = false;

                       if (this.quadcopter_status_change_cb){

                           this.quadcopter_status_change_cb(this.radioState,this.searching_in_progress);
                       }

                     }



                     if (this.quadcopter_status_change_cb){

                       clearTimeout(this.dataRecieveTimeout);

                       // TODO:  recconect after STOP block; check older versions
                       this.dataRecieveTimeout = setTimeout(()=>{

                         this.radioState = "disconnected";
                         this.searching_in_progress = false;

                         this.quadcopter_status_change_cb(this.radioState,this.searching_in_progress);

                       },1000);

                     }

                     this.PROCESS_TELEMETRY_DATA(result.data);
                  }


            }else{



            }

        }).catch(error => {



        });

      }






    },50);


    // setTimeout(()=>{
    //
    //    clearInterval(this.getDataInterval);
    //
    // },5000);

  }

  TOC_BLOCK_STEP(telemetry_element_table,prefered_telemetry_table,block_id){

    console.log(`TOC_BLOCK_STEP`);

    return new Promise((resolve,reject)=>{

      var data_scanning_interval = setInterval(() => {

        if ( (typeof(this.global_toc_data_object) != 'undefined') && (this.global_toc_data_object != null) ){

            if ( ([0x51].indexOf(this.global_toc_data_object[0]) != -1 ) ){

                console.log(`TOC_BLOCK_STEP use data captured by GET_ITEM`);

                switch (this.global_toc_data_object[1]) {

                  case 0:


                  clearInterval(data_scanning_interval);
                  this.TOC_START_BLOCK(this.global_toc_data_object[2]).then(data => {



                      resolve(data);


                  }).catch(error => {



                  });


                    break;

                  case 3:

                     clearInterval(data_scanning_interval);
                    resolve(this.global_toc_data_object);

                      break;
                  default:

                }

            }else if ( ([0x50,0xf3,0xf7].indexOf(this.global_toc_data_object[0]) != -1 ) ){

                clearInterval(data_scanning_interval);
                this.TOC_CHECK_HEADER([0x51], this.global_toc_data_object, 15).then((data) => {

                    // clearInterval(data_scanning_interval);

                    if ( ([0x51].indexOf(data[0]) != -1 ) ){


                          resolve(data);

                    }

                }).catch((error) => {



                })

            }

          }

      },50);


      this.runningStep = "TOC_BLOCK_STEP_1_START_BLOCK";
      this.TOC_CREATE_BLOCK(telemetry_element_table,prefered_telemetry_table,block_id).then(data => {

          if (data[3] == 0){

                console.log("Quadcopter TOC_CREATE_BLOCK step was sucessfully passed");

                this.runningStep = "TOC_BLOCK_STEP_2";
                this.TOC_START_BLOCK(data[2]).then(data => {


                     clearInterval(data_scanning_interval);
                    resolve(data);

                }).catch(error => {



                });

          }


      }).catch(error => {



      });

    });




  }

  getStringFromTypedArray(arr){

      var str = '';


       var i = 0;

       for (var i = 0; i < arr.length; i++) {

          str = str + String.fromCharCode(arr[i]);

       }


        return str;




  }

  PROCESS_TOC_GET_ITEM_RESULT(data,telemetry_element_table,prefered_telemetry_table){


    var telemetry_element_name;
    var telemetry_element_group;

    data = data.slice(2);

    while (data[0] == 0){

      data = data.slice(1);
    }

    telemetry_element_name  =  this.getStringFromTypedArray(data.slice(data.indexOf(0) + 1, data.length - 1));
    telemetry_element_group =  this.getStringFromTypedArray(data.slice(2,data.indexOf(0)));

      console.log(`TOC_GET_ITEM  telemetry_element_name ${telemetry_element_name}`);

    telemetry_element_table[data[0]] = {

        telemetry_element_type: data[1],
        telemetry_element_group_and_name: this.getStringFromTypedArray(data.slice(2)),
        telemetry_element_group:  this.getStringFromTypedArray(data.slice(2,data.indexOf(0))),
        telemetry_element_name:   this.getStringFromTypedArray(data.slice(data.indexOf(0) + 1, data.length - 1)),
        telemetry_element_id:      data[0]

  }


  if ( (["vbat","x","y","z"].indexOf(telemetry_element_name) != -1) && (["stateEstimate","pm"].indexOf(telemetry_element_group) != -1) ){


      prefered_telemetry_table.push(data[0]);

      console.log(`TOC_GET_ITEM adding element to  prefered_telemetry_table  ${telemetry_element_name} ${prefered_telemetry_table}`);

  }

   console.log(`telemetry_element id: ${data[0]}  type: ${telemetry_element_table[data[0]].telemetry_element_type} group:  ${telemetry_element_table[data[0]].telemetry_element_group} name:  ${telemetry_element_table[data[0]].telemetry_element_name} `);

    var telemetry_object = {};

      telemetry_object.telemetry_element_table  = telemetry_element_table;
      telemetry_object.prefered_telemetry_table = prefered_telemetry_table;

      return telemetry_object;


  }


  TOC_GET_ITEMS(toc_log_len){

    console.log(`TOC_GET_ITEMS`);

	

    return new Promise((resolve,reject)=>{


          var telemetry_object = {};
          var telemetry_element_table = [];
          var prefered_telemetry_table = [];

         /* var toc_item_index = 0;
          var toc_item_recieved_answers = 0;
          var toc_item_sent_queries = 0;
          var telemetry_object = {};

          var time_now = Date.now();
          var toc_get_item_sent_time = Date.now();
          var toc_get_item_time_delta = 250;

          var telemetry_element_table = [];
          var prefered_telemetry_table = [];

          var telemetry_element_name;
          var telemetry_element_group;


          this.runningStep = "TOC_GET_ITEM";

          var  TOC_GET_ITEM_INTERVAL =    setInterval(() => {


            time_now = Date.now();
            if ( (toc_item_sent_queries == toc_item_recieved_answers) || ( (time_now - toc_get_item_sent_time) > toc_get_item_time_delta )  ){


                          toc_get_item_sent_time = Date.now();
                          toc_item_sent_queries++;
                          console.log(`TOC_GET_ITEM toc_item_sent_queries  ${toc_item_sent_queries} `);

                          this.TOC_GET_ITEM(toc_item_index).then(data => {

                                console.log(`TOC_GET_ITEM  data resolver`);

                                if (toc_item_recieved_answers >= 243){

                                  this.global_toc_data_object = data;
                                }


                                if ( ([0x50,0x54,0x56,0x5C].indexOf(data[0]) != -1 ) ){   //проверяем, является ли ответ нужным нам.

                                    console.log(`TOC_GET_ITEM  correct answer`);

                                    //telemetry_object = this.PROCESS_TOC_GET_ITEM_RESULT(data,telemetry_element_table,prefered_telemetry_table);

                                    data = data.slice(2);

                                    while (data[0] == 0){

                                      data = data.slice(1);
                                    }

                                    telemetry_element_name  =  this.getStringFromTypedArray(data.slice(data.indexOf(0) + 1, data.length - 1));
                                    telemetry_element_group =  this.getStringFromTypedArray(data.slice(2,data.indexOf(0)));

                                      console.log(`TOC_GET_ITEM  telemetry_element_name ${telemetry_element_name}`);

                                    telemetry_element_table[data[0]] = {

                                        telemetry_element_type: data[1],
                                        telemetry_element_group_and_name: this.getStringFromTypedArray(data.slice(2)),
                                        telemetry_element_group:  this.getStringFromTypedArray(data.slice(2,data.indexOf(0))),
                                        telemetry_element_name:   this.getStringFromTypedArray(data.slice(data.indexOf(0) + 1, data.length - 1)),
                                        telemetry_element_id:      data[0]

                                  }

                                  if ((telemetry_element_name == "yaw" ) && (telemetry_element_group == "controller")){

                                    prefered_telemetry_table.push(data[0]);

                                    console.log(`TOC_GET_ITEM adding element to  prefered_telemetry_table  ${telemetry_element_name} ${prefered_telemetry_table}`);

                                  }


                                  if ( (["vbat","x","y","z"].indexOf(telemetry_element_name) != -1) && (["stateEstimate","pm"].indexOf(telemetry_element_group) != -1) ){


                                      prefered_telemetry_table.push(data[0]);

                                      console.log(`TOC_GET_ITEM adding element to  prefered_telemetry_table  ${telemetry_element_name} ${prefered_telemetry_table}`);

                                  }

                                   console.log(`telemetry_element id: ${data[0]}  type: ${telemetry_element_table[data[0]].telemetry_element_type} group:  ${telemetry_element_table[data[0]].telemetry_element_group} name:  ${telemetry_element_table[data[0]].telemetry_element_name} `);

                                    toc_item_index++;
                                    toc_item_recieved_answers++;
                                    console.log(`TOC_GET_ITEM toc_item_recieved_answers  ${toc_item_recieved_answers} `);

                                    if ((toc_item_index == toc_log_len) ){


                                      telemetry_object.telemetry_element_table  = telemetry_element_table;
                                      telemetry_object.prefered_telemetry_table = prefered_telemetry_table;

                                        clearInterval(TOC_GET_ITEM_INTERVAL);
                                      //  resolve(telemetry_object);

                                    }


                              }


                          }).catch((error) => {



                          });

            }


        },100);*/


        telemetry_element_table[92] = {
        
                          telemetry_element_type: 0x07,
                          telemetry_element_group_and_name:"",
                          telemetry_element_group:  "stateEstimate",
                          telemetry_element_name:    "x",
                          telemetry_element_id:     92
        
                                  }
        
        telemetry_element_table[93] = {
        
                          telemetry_element_type: 0x07,
                          telemetry_element_group_and_name:"",
                          telemetry_element_group:  "stateEstimate",
                          telemetry_element_name:    "y",
                          telemetry_element_id:     93
        
                                  }
        
        telemetry_element_table[94] = {
        
                          telemetry_element_type: 0x07,
                          telemetry_element_group_and_name:"",
                          telemetry_element_group:  "stateEstimate",
                          telemetry_element_name:    "z",
                          telemetry_element_id:     94
        
                                  }
        
        telemetry_element_table[122] = {
        
                            telemetry_element_type: 0x07,
                            telemetry_element_group_and_name:"",
                            telemetry_element_group:  "controller",
                            telemetry_element_name:    "yaw",
                            telemetry_element_id:     122
        
                                    }
        
        telemetry_element_table[13] = {
        
                            telemetry_element_type: 0x07,
                            telemetry_element_group_and_name:"",
                            telemetry_element_group:  "pm",
                            telemetry_element_name:    "vbat",
                            telemetry_element_id:     13
        
                                    }
        
        
        prefered_telemetry_table = [92,93,94,122,13];
        
        telemetry_object.telemetry_element_table  = telemetry_element_table;
        telemetry_object.prefered_telemetry_table = prefered_telemetry_table;
        
         resolve(telemetry_object);

    });

  }

  startDataRecieving(){

    clearInterval(this.move_with_speed_interval);
    clearInterval(this.getDataInterval);
    this.move_with_speed_interval_cleared = true;


        this.cleanQuadcopterInitData().then(result => {

            console.log(result);

            return this.TOC_GET_INFO();


        }).then(toc_log_len => {

              console.log("Quadcopter TOC Len Recieve step was sucessfully passed");

            return this.TOC_GET_ITEMS(toc_log_len);

        }).then((telemetry_object) => {

          var prefered_telemetry_table =  telemetry_object.prefered_telemetry_table;
          var telemetry_element_table  =  telemetry_object.telemetry_element_table;

          var prefered_telemetry_table1 = prefered_telemetry_table.slice(0,3);

          console.log(`prefered_telemetry_table1  ${prefered_telemetry_table1}`);


          this.runningStep = "TOC_BLOCK_STEP_1";

          this.TOC_BLOCK_STEP(telemetry_element_table, prefered_telemetry_table1, 0).then(data => {

               if (data[3] == 0){

                  console.log(`startDataRecieving running step: ${this.runningStep}`);

                   var prefered_telemetry_table2 = prefered_telemetry_table.slice(3,prefered_telemetry_table.length);
                    console.log(`main branch prefered_telemetry_table2  ${prefered_telemetry_table2}`);

                  return this.TOC_BLOCK_STEP(telemetry_element_table, prefered_telemetry_table2,1);
                }

          }).then(data => {

            if (data[3] == 0){

                  this.runningStep = "GET_TELEMETRY_DATA";
                  this.GET_TELEMETRY_DATA();
            }

          }).catch(error => {



          });

        }).catch(error => {



        });


  }


  move_to_coord(x_coord,y_coord,height,yaw){   //yaw - угол поворота

          clearInterval(this.move_with_speed_interval);
          this.move_with_speed_interval_cleared = true;


                    var  packet = new ArrayBuffer(18);
                    var  dv  = new DataView(packet);

                  dv.setUint8(0,0x70,true);
                  dv.setUint8(1,0x07,true);

                  dv.setFloat32(2,x_coord,true);
                  dv.setFloat32(6,y_coord,true);
                  dv.setFloat32(10,height,true);
                  dv.setFloat32(14,yaw,true);

                 //dv.setFloat32(10,yaw,true);
                 //dv.setFloat32(14,height,true);


                Crazyradio.sendPacket(packet).then(result => {


                  if (result.state === true) {

                            if ( ([0x50,0x54,0x56,0x5C,0x52].indexOf(result.data[0]) != -1 ) ){

                                  console.log(`Quadcopter get data: ${result.data} `);



                                    this.PROCESS_TELEMETRY_DATA(result.data);


                            }


                      }else{



                      }

                  }).catch(error => {



                  });





  }

  move_with_speed(vx,vy,yaw,height){

    if (this.radioState === "connected"){


      this.z_distance = Number(height);
      this.x_speed    = Number(vx);
      this.y_speed    = Number(vy);
      this.rotation   = Number(yaw);


  if (this.move_with_speed_interval_cleared){

        this.start_command_sending();


  }









    }


  }

  get_x_telemetry_delta(){

    return this.telemetry_x_delta;
  }

  get_y_telemetry_delta(){

    return this.telemetry_y_delta;
  }



  telemetry_palette_get_coord(coord){

    switch (coord) {

      case "X":

      let x_coord = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.x) != 'undefined'){

          if (this.telemetry_x_delta > 0){

              if (this.telemetryData.x > 0){

                 x_coord = this.telemetryData.x - this.telemetry_x_delta;

              }else{

                    x_coord = this.telemetryData.x - this.telemetry_x_delta;

              }

              

          }
          //   else{ //this.telemetry_x_delta < 0

          //       if (this.telemetryData.x > 0){

          //        x_coord = this.telemetryData.x + this.telemetry_x_delta;

          //     }else{

          //           x_coord = this.telemetryData.x - this.telemetry_x_delta;

          //     }

          // }
           
            x_coord = x_coord.toFixed(2);

        }

      }

        return x_coord;

        break;

      case "Y":

      let y_coord = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.y) != 'undefined'){

             if (this.telemetry_y_delta > 0){

              if (this.telemetryData.y > 0){

                 y_coord = this.telemetryData.y - this.telemetry_y_delta;

              }else{

                    y_coord = this.telemetryData.y - this.telemetry_y_delta;

              }

              

          }
          //   else{ //this.telemetry_y_delta < 0

          //       if (this.telemetryData.y > 0){

          //        y_coord = this.telemetryData.y + this.telemetry_y_delta;

          //     }else{

          //           y_coord = this.telemetryData.y - this.telemetry_y_delta;

          //     }

          // }

            y_coord = y_coord * (-1); //Invert y axis;
          
            y_coord = y_coord.toFixed(2);


        }

      }

      return y_coord;

          break;

      case "Z":

      let z_coord = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.z) != 'undefined'){

            z_coord = this.telemetryData.z.toFixed(2);

        }

      }

      return z_coord;

      case "W":

      let yaw = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.yaw) != 'undefined'){

            yaw = this.telemetryData.yaw.toFixed(2);

        }

      }

      return yaw;

            break;

      default:

      return 0;

    }


  }


  /*
    X , Y, Z, W

  */
  get_coord(coord){

    switch (coord) {

      case "X":

      let x_coord = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.x) != 'undefined'){

            x_coord = this.telemetryData.x.toFixed(7);

        }

      }

        return x_coord;

        break;

      case "Y":

      let y_coord = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.y) != 'undefined'){

            y_coord = this.telemetryData.y.toFixed(7);

        }

      }

      return y_coord;

          break;

      case "Z":

      let z_coord = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.z) != 'undefined'){

            z_coord = this.telemetryData.z.toFixed(7);

        }

      }

      return z_coord;

      case "W":

      let yaw = 0;

      if (typeof(this.telemetryData) != 'undefined'){

        if (typeof(this.telemetryData.yaw) != 'undefined'){

            yaw = this.telemetryData.yaw.toFixed(7);

        }

      }

      return yaw;

            break;

      default:

      return 0;

    }


  }

   get_battery_level(){

  //  console.log(`Quadcopter get_battery_level()`);


    let bat_level = 0;

    const max_bat_level_real = 4.2;
    const min_bat_level = 2.9; //3.7 //2.2

    const max_bat_level_fake = max_bat_level_real - min_bat_level;

    let current_bat_level = 0;

    if (typeof(this.telemetryData) != 'undefined'){

      if (typeof(this.telemetryData.vbat) != 'undefined'){

          //bat_level = this.telemetryData.vbat.toFixed(7); //вольты


          current_bat_level =this.telemetryData.vbat;
          bat_level = Math.round((current_bat_level - min_bat_level) / max_bat_level_fake * 100); //проценты от min до max

          bat_level = (bat_level < 0)?0:bat_level;
          bat_level = (bat_level > 100)?100:bat_level;

      }

    }
        return bat_level;
  }



  get_battery_level_raw(){

   //  console.log(`Quadcopter get_battery_level()`);

    let bat_level = 0;

   if (typeof(this.telemetryData) != 'undefined'){

      if (typeof(this.telemetryData.vbat) != 'undefined'){

          bat_level = this.telemetryData.vbat.toFixed(3);  //toFixed(7)

         
      }

    }
        return bat_level;
  }


  // startDataRecieving(){
  //
  //   var  packet = new ArrayBuffer(2);
  //   var  dv  = new DataView(packet);
  //
  // dv.setUint8(0,0x5C,true);
  // dv.setUint8(1,0x01,true);
  //
  //
  //
  // Crazyradio.sendPacket(packet, (state, data) => {
  //   if (state === true) {
  //
  //       var toc_log_len = 6;
  //       var telemetry_element_table = [];
  //
  //       if ( ([0x50,0x54,0x56,0x5C].indexOf(data[1]) != -1 ) ){ //проверяем, является ли ответ нужным нам.
  //
  //         toc_log_len = data[3];
  //         console.log(`toc_log_len: ${toc_log_len}`);
  //
  //       } else  { //если не является, запрашиваем данные повторно
  //
  //
  //       //     packet = new ArrayBuffer(1);
  //       //     dv  = new DataView(packet);
  //       //
  //       // dv.setUint8(0,0xf3,true);
  //
  //
  //
  //
  //       // Crazyradio.sendPacket(packet, (state, data) => {
  //       //
  //       //   if (state === true) {
  //       //
  //       //     if ( ([0x50,0x54,0x56,0x5C].indexOf(data[1]) != -1 ) ){ //проверяем, является ли ответ нужным нам.
  //       //
  //       //       toc_log_len = data[3];
  //       //
  //       //     }else{
  //       //
  //       //                 packet = new ArrayBuffer(1);
  //       //                 dv  = new DataView(packet);
  //       //
  //       //             dv.setUint8(0,0xff,true);
  //       //
  //       //
  //       //
  //       //
  //       //             Crazyradio.sendPacket(packet, (state, data) => {
  //       //
  //       //               if (state === true) {
  //       //
  //       //                 if ( ([0x50,0x54,0x56,0x5C].indexOf(data[1]) != -1 ) ){ //проверяем, является ли ответ нужным нам.
  //       //
  //       //                   toc_log_len = data[3];
  //       //
  //       //                 }
  //       //
  //       //                 console.log(`toc_log_len: ${toc_log_len}`);
  //       //
  //       //                 let toc_element_id = 0;
  //       //
  //       //                 for (toc_element_id = 0; toc_element_id < toc_log_len; toc_element_id++){
  //       //
  //       //                     packet = new ArrayBuffer(3);
  //       //                     dv  = new DataView(packet);
  //       //
  //       //                   dv.setUint8(0,0x50,true);
  //       //                   dv.setUint8(1,0x00,true);
  //       //                   dv.setUint8(2,Number(toc_element_id),true);
  //       //
  //       //                   Crazyradio.sendPacket(packet, (state, data) => {
  //       //                     if (state === true) {
  //       //
  //       //                   //    if (typeof(data) != 'undefined'){
  //       //
  //       //                       if (([0x50,0x54,0x56,0x5C].indexOf(data[1]) != -1 ) ){
  //       //
  //       //                           telemetry_element_table[data[3]] = {
  //       //
  //       //                                 telemetry_element_type: data[4],
  //       //                                 telemetry_element_group_and_name: data.slice(5),
  //       //
  //       //                           }
  //       //
  //       //                         console.log(`telemetry_element id: ${data[3]}  type: ${data[4]} group_and_name:  ${String.fromCharCode(data.slice(5))}`);
  //       //
  //       //                       }else{
  //       //
  //       //
  //       //
  //       //
  //       //                       }
  //       //
  //       //
  //       //
  //       //                   //    }
  //       //
  //       //                     } else {
  //       //                     //  $("#packetLed").removeClass("good");
  //       //                     }
  //       //                   });
  //       //
  //       //                 }
  //       //
  //       //               }else{
  //       //
  //       //
  //       //
  //       //               }
  //       //   });
  //       //
  //       //     }
  //       //
  //       //   }else{
  //       //
  //       //
  //       //
  //       //   }
  //       // });
  //
  //
  //
  //
  //          let toc_fetch_interval = setInterval(() => {
  //
  //            Crazyradio.getData( (state, data) => {
  //
  //
  //              if (([0x50,0x54,0x56,0x5C].indexOf(data[1]) != -1 ) ){
  //
  //                 //получили длину TOC
  //
  //
  //                 toc_log_len = data[3];
  //                 console.log(`toc_log_len: ${toc_log_len}`);
  //                clearInterval(toc_fetch_interval);
  //
  //              }
  //
  //
  //          });
  //
  //
  //          },30);
  //
  //          setTimeout(function(){
  //
  //             clearInterval(toc_fetch_interval);
  //
  //
  //          },30000)
  //
  //
  //         //      toc_log_len = 0;
  //
  //       }
  //
  //
  //
  //
  //   } else {
  //   //  $("#packetLed").removeClass("good");
  //   }
  // });
  //
  //
  // }

  start_command_sending(){

  //  clearInterval(this.getDataInterval);

  //  setTimeout(()=>{

      this.move_with_speed_interval_cleared = false;

      this.move_with_speed_interval  =   setInterval(function(self){


          var  packet = new ArrayBuffer(18);
          var  dv  = new DataView(packet);

        dv.setUint8(0,0x7C,true);
        dv.setUint8(1,0x05,true);

        dv.setFloat32(2,self.x_speed,true);
        dv.setFloat32(6,self.y_speed,true);
        dv.setFloat32(10,self.rotation,true);
        dv.setFloat32(14,self.z_distance,true);



        Crazyradio.sendPacket(packet).then(result => {




            if (result.state === true) {

                // if (!this.move_with_speed_interval_cleared){
                //
                //         this.start_command_sending();
                //
                // }


                  if ( ([0x50,0x54,0x56,0x5C,0x52].indexOf(result.data[0]) != -1 ) ){

                    //    console.log(`Quadcopter get data: ${result.data} `);



                          this.PROCESS_TELEMETRY_DATA(result.data);


                  }


            }else{



            }

        }).catch(error => {



        });

      },100,this);


  //  },5000)







  }

  fly_up(){

    console.log("copter fly_up()")

        if (this.radioState === "connected"){


          this.z_distance = Number(0.3);
          this.start_command_sending();








        }


  }

  copter_land(){

    console.log("copter copter_land()");

    clearInterval(this.move_with_speed_interval);
    //clearInterval(this.getDataInterval);
    this.move_with_speed_interval_cleared = true;
    Crazyradio.close(() => {  Crazyradio.handle = null});



  }


}
