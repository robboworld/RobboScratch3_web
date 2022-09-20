import classNames from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import styles from  './ColorCorrectorTableComponent.css';
import { ItemTypes } from './drag_constants';
import { DragSource } from 'react-dnd';
import ColorCorrectorTableRowElement from './ColorCorrectorTableRowElement';

import {ActionTriggerColorCorrectorTable} from './actions/sensor_actions';

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';


var mouse_coords = {x:0,y:0};

const colors_arr        = ["Red","Magenta","Yellow","Green","Blue","Cyan","Custom","Black","Gray","White"];
const correctors_arr    = ["R","G","B","Bright"];

var slider_rounded_flag = 0;
var slider_rounded_flag_old = 0;

var one_slider_percent_value_old = 0;

const ColorCorrectorWindowSource = {
  beginDrag(props) {

     console.log("beginDrag");

    return {

          element_type: ItemTypes.COLOR_CORRECTOR_WINDOW
    };
  },

  canDrag(props,monitor) {


     console.log("canDrag");

      //let coord = monitor.getClientOffset();

      let  coord = mouse_coords;

      let color_corrector_table_tittle = document.getElementById("color-corrector-table-tittle");
      let cctt_coords =   color_corrector_table_tittle.getBoundingClientRect();


      if ( ( (coord.x > cctt_coords.left)&(coord.y>cctt_coords.top) ) &  ((coord.x < (cctt_coords.left + cctt_coords.width) )&(coord.y < (cctt_coords.top + cctt_coords.height) ) )) {

          return true;

      }else{

          return false;
      }



        return false;
  }
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }
}
const messages = defineMessages({
  mautocor: {
      id: 'gui.ColorCorrectorTable.auto_correction',
      description: ' ',
      defaultMessage: 'Automatic correction'
  },
  mclose:{
      id: 'gui.ColorCorrectorTable.close',
      description: ' ',
      defaultMessage: 'Close'
  },
  mload:{
      id: 'gui.ColorCorrectorTable.load',
      description: ' ',
      defaultMessage: 'Load'
  },
  msave:{
      id: 'gui.ColorCorrectorTable.save',
      description: ' ',
      defaultMessage: 'Save'
  },
  mapply:{
      id: 'gui.ColorCorrectorTable.apply_changes',
      description: ' ',
      defaultMessage: 'Apply changes'
	},
	showAdvOpt:{
		id: 'gui.ColorCorrectorTable.showAdvOpt',
		description: ' ',
		defaultMessage: 'Show advanced options'
	},
	showMaximallyAdvOpt:{
		id: 'gui.ColorCorrectorTable.showMaximallyAdvOpt',
		description: ' ',
		defaultMessage: 'Show maximally advanced options'
	},
});



class ColorCorrectorTableComponent extends Component {


  componentDidMount () {


       let lcs_1 = document.getElementById("left-color-slider-1");
       lcs_1.addEventListener("input",this.handleSliderChange.bind(this,"left-color-slider-1"), false);

       let lcs_2 = document.getElementById("left-color-slider-2");
       lcs_2.addEventListener("input",this.handleSliderChange.bind(this,"left-color-slider-2"), false);

       let lcs_3 = document.getElementById("left-color-slider-3");
       lcs_3.addEventListener("input",this.handleSliderChange.bind(this,"left-color-slider-3"), false);

       let rcs_1 = document.getElementById("right-color-slider-1");
       rcs_1.addEventListener("input",this.handleSliderChange.bind(this,"right-color-slider-1",this.props.RCA,this.props.color_corrector_table.sensor_caller_id), false);

       let rcs_2 = document.getElementById("right-color-slider-2");
       rcs_2.addEventListener("input",this.handleSliderChange.bind(this,"right-color-slider-2",this.props.RCA,this.props.color_corrector_table.sensor_caller_id), false);

       let rcs_3 = document.getElementById("right-color-slider-3");
       rcs_3.addEventListener("input",this.handleSliderChange.bind(this,"right-color-slider-3",this.props.RCA,this.props.color_corrector_table.sensor_caller_id), false);






       let cctc = ReactDOM.findDOMNode(this);
       cctc.addEventListener("dragstart",this.handleDragStart.bind(this,"dragstart"), false);


       this.updateColorBox();

  }

  componentDidUpdate () {


    //update colors filter table
    var color_corrector_table_object = this.props.RCA.getColorFilterTable(this.props.color_corrector_table.sensor_caller_id);

    colors_arr.forEach(function(color,color_index){


          let color_name = color.toLowerCase();



          correctors_arr.forEach(function(corrector,corrector_index){

                document.getElementById(`color-${color_name}-corrector-${corrector}`).value =  color_corrector_table_object[color_name][corrector];

          });

    });

  }


  updateColorBox(){


      setInterval(() => {

        if (this.props.color_corrector_table.isShowing){


          var color_box = document.getElementById(`color-box-${this.props.color_corrector_table.sensor_caller_id}`);

          var sensors_data = this.props.RCA.colorFilter(this.props.color_corrector_table.sensor_caller_id);

          if (sensors_data[0] != -1){

            color_box.style.backgroundColor = `rgb(${sensors_data[0]},${sensors_data[1]},${sensors_data[2]})`;
            color_box.style.minWidth = '40px';
            color_box.style.minHeight = '40px';
            color_box.style.border = '2px solid';
            color_box.style.backgroundImage = "none";


          }else{

            color_box.style.minWidth = '40px';
            color_box.style.minHeight = '40px';
            color_box.style.border = '2px solid';
            color_box.style.backgroundImage = "url('/build/static/robbo_assets/icon_close_window.png')";
            color_box.style.backgroundColor = `rgb(255,255,255)`;

          }



        }




      },300);

  }

  handleSliderChange(slider_id,RCA,sensor_caller_id,event){

    function isInteger(num) {
      return (num ^ 0) === num;
    }

    function isEqualSign(num1,num2){

      if ((num1 == 0) || (num2 == 0)) {

        return true;

      }else return Math.sign(num1) == Math.sign(num2);


    }


    const recalculateSliderPercents = function(slider_id){

       var  percents = 300;

       const sliders_arr = ["right-color-slider-1","right-color-slider-2","right-color-slider-3"];

       var slider =  document.getElementById(slider_id);

       var slider_value_now = Number(slider.value);//текущее значение пересчиываемого датчикаы

       console.log("slider_value_now: " + slider_value_now);

       var slider_value_old = Number(document.getElementById(slider_id+"-value").innerHTML.replace("%","")); //старое значение показаний датчика (до начала drag) 

       console.log("slider_value_old: " + slider_value_old);

       var filtered_sliders_arr =  sliders_arr.filter(slider => slider != slider_id); //все слайдеры кроме пересчитываемого 

       var checked_sliders_arr =   filtered_sliders_arr.filter(slider => document.getElementById(slider+"-checkbox").checked == true);//слайдеры, отмеченные галочкой

       var unchecked_sliders_arr =   filtered_sliders_arr.filter(slider => document.getElementById(slider+"-checkbox").checked != true);


       checked_sliders_arr.forEach(function(slider,index){

              

          percents  =  percents -  Number(document.getElementById(slider).value); //галочка закрепляет значение слайдера, поэтому вычитаем его из общей суммы процентов 



       });
            

       /*
        Когда мы тянем слайдер, у нас образуется дельта со старым значением. 
        Для сохранения суммы процентов эта дельта по-равному распределяется  между всеми неомеченными слайдерами.  

     */ 


      var percent_delta = slider_value_now - slider_value_old; //дельта нового значения слайдера и старого 

    

      var one_slider_percent_value;
      var one_slider_percent_value_without_round = percent_delta / unchecked_sliders_arr.length; //распределение дельты на каждый неотмеченный слайдер
      console.log("one_slider_percent_value_without_round: " + one_slider_percent_value_without_round);
      one_slider_percent_value = one_slider_percent_value_without_round;

      if (!isInteger(one_slider_percent_value_without_round)){



          one_slider_percent_value =  Math.round(one_slider_percent_value_without_round);

          console.log("one_slider_percent_value_rounded: " +   one_slider_percent_value);

          slider_rounded_flag_old = slider_rounded_flag;
          slider_rounded_flag+=1;

          console.log("slider_rounded_flag: " + slider_rounded_flag);

        if (slider_rounded_flag == 2){

          console.log("slider_rounded_flag == 2");

        //  if (isEqualSign(one_slider_percent_value,one_slider_percent_value_old)){

        //    console.log("isEqualSign: true");

            one_slider_percent_value_old = one_slider_percent_value;

            if (one_slider_percent_value > 0){

                one_slider_percent_value-=1;

            }else if (one_slider_percent_value < 0){

                one_slider_percent_value-=1;

            }else if (one_slider_percent_value == 0){

                one_slider_percent_value-=1;
            }
          //}

            slider_rounded_flag_old = slider_rounded_flag;
            slider_rounded_flag = 0;

        }


      }



      console.log("one_slider_percent_value: " + one_slider_percent_value);

     
      let value = 0;
      let value_is_negative = false;
      unchecked_sliders_arr.forEach(function(slider,index){

              let value_buf = 0;
              value_buf = (Number(document.getElementById(slider).value) -  one_slider_percent_value);
              value +=  value_buf;

               
              // Может быть так, что тянем рычажок вверх, а другой уже в 0. В этом случае действие нужно запретить. 

      

             value_is_negative = ((value_buf < 0) || (value_is_negative))?true:false; 

                console.log("Number(document.getElementById(slider).value): " + Number(document.getElementById(slider).value));
                console.log("value1: " + value);

      });

      if ((slider_value_now + value ) < (percents -1)){

        let sum = slider_value_now + value;

          console.log("Low then : " +  percents + "sum: " + sum);

      }

      //проверяем, что текущеее значение слайдера + текущие значения неомеченных слайдеров не превышают общую сумму процентов. 
      if (((slider_value_now + value ) <= percents) && ((value) >= 0) && (!value_is_negative)) {

      one_slider_percent_value_old = one_slider_percent_value;
      slider_rounded_flag_old = slider_rounded_flag;

      document.getElementById(slider_id+"-value").innerHTML = slider_value_now + "%";

        unchecked_sliders_arr.forEach(function(slider,index){

              let value =  Number(document.getElementById(slider).value) -  one_slider_percent_value;
              console.log("value2: " + value);

              document.getElementById(slider).value  = value;
              document.getElementById(slider+"-value").innerHTML = value + "%";

        });

      }else{


          document.getElementById(slider_id).value = Number(document.getElementById(slider_id+"-value").innerHTML.replace("%",""));

          one_slider_percent_value    =    one_slider_percent_value_old;
          slider_rounded_flag         =    slider_rounded_flag_old;

          if (slider_rounded_flag >= 2){

            slider_rounded_flag-=1;
          }

      }



    }

  //   console.log("handleSliderChange: " + slider_id);

     //var slider_type = typeof(document.getElementById(slider_id+"-checkbox"));

     if (document.getElementById(slider_id+"-checkbox") != null){

       const sliders_arr = ["right-color-slider-1","right-color-slider-2","right-color-slider-3"];

       var checked_sliders_arr = sliders_arr.filter(slider => document.getElementById(slider+"-checkbox").checked == true);

       if ((document.getElementById(slider_id+"-checkbox").checked == true) || (checked_sliders_arr.length >= 2)){


          document.getElementById(slider_id).value = Number(document.getElementById(slider_id+"-value").innerHTML.replace("%",""));

       }else{

         //if (slider_id.startsWith("right")){

              recalculateSliderPercents(slider_id);
        // }




       }
          let red_color_slider_value      =   document.getElementById("right-color-slider-1").value;
          let green_color_slider_value    =   document.getElementById("right-color-slider-2").value;
          let blue_color_slider_value     =   document.getElementById("right-color-slider-3").value;

          RCA.setColorKoefs(sensor_caller_id,red_color_slider_value,green_color_slider_value, blue_color_slider_value);
     }else{
          document.getElementById(slider_id+"-value").innerHTML =  document.getElementById(slider_id).value + "%";
     }
  }

  handleDragStart(event_name,event){
  //   console.log("handleDragStart: " +  event_name + "clientX: " +  event.clientX  + "clientY: " +  event.clientY );
  //  ev.stopPropagation();

    mouse_coords.x = event.clientX;
    mouse_coords.y = event.clientY;

  }

  automaticCollorCorrection(RCA,sensor_caller_id){
    	RCA.colorAutoCorection(sensor_caller_id);

      document.getElementById("right-color-slider-1").value = RCA.getColorKoefs(sensor_caller_id,"red");
      document.getElementById("right-color-slider-2").value = RCA.getColorKoefs(sensor_caller_id,"green");
      document.getElementById("right-color-slider-3").value = RCA.getColorKoefs(sensor_caller_id,"blue");

      document.getElementById("right-color-slider-1"+"-value").innerHTML =  document.getElementById("right-color-slider-1").value + "%";
      document.getElementById("right-color-slider-2"+"-value").innerHTML =  document.getElementById("right-color-slider-2").value + "%";
      document.getElementById("right-color-slider-3"+"-value").innerHTML =  document.getElementById("right-color-slider-3").value + "%";
	}
	
	setDisplayOfAdvancedSettings() {
		var checkboxAdv = document.getElementById("showAdvancedOptions");
		var advOpt = document.getElementById("right-slider-block");

    var buttonSave = document.getElementById("buttons-row-save");
    var buttonLoad = document.getElementById("buttons-row-load");
    var buttonAppl = document.getElementById("buttons-row-apply");

		if(checkboxAdv.checked == true){
      advOpt.style.display = "inline-block";
		} else {
			advOpt.style.display = "none";
		}

		var checkboxAdvMax = document.getElementById("showMaxAdvancedOptions");
		var advOptMax = document.getElementById("data-block");

		if(checkboxAdvMax.checked == true){
      advOptMax.style.display = "inline-block";
      
      buttonAppl.style.display = "inline-block";
      buttonLoad.style.display = "inline-block";
      buttonSave.style.display = "inline-block";
		} else {
      advOptMax.style.display = "none";
      
      buttonAppl.style.display = "none";
      buttonLoad.style.display = "none";
      buttonSave.style.display = "none";
    }
  }
  
  calculatePercents(color, id) {
    var rgb_arr = this.props.RCA.getColorCorrectedRawValues(id);
    var sum = rgb_arr[0]+rgb_arr[1]+rgb_arr[2];
    if(typeof(rgb_arr)!='undefined'){
      switch(color){
        case "R": return rgb_arr[0]*100/sum+"%";
        case "G": return rgb_arr[1]*100/sum+"%";
        case "B": return rgb_arr[2]*100/sum+"%";
      }
    } else console.error("Unrecognized Error lol");
  }

  onButtonApplyChangesClick(RCA, sensor_id){

       console.log("onButtonApplyChangesClick" );


       var color_corrector_table_object = {};

       colors_arr.forEach(function(color,color_index){


             let color_name = color.toLowerCase();

               color_corrector_table_object[color_name] = {};

             correctors_arr.forEach(function(corrector,corrector_index){

                   color_corrector_table_object[color_name][corrector] = document.getElementById(`color-${color_name}-corrector-${corrector}`).value;

             });

       });


        RCA.setColorFilterTable(sensor_id, color_corrector_table_object );

  }

  onButtonSaveClick(){


       console.log("onButtonSaveClick()" );

        var color_corrector_table_object = {};

        colors_arr.forEach(function(color,color_index){


              let color_name = color.toLowerCase();

                color_corrector_table_object[color_name] = {};

              correctors_arr.forEach(function(corrector,corrector_index){

                    color_corrector_table_object[color_name][corrector] = document.getElementById(`color-${color_name}-corrector-${corrector}`).value;

              });

        });


      //  var pom = document.createElement('a');

        var contents = new Blob([JSON.stringify(color_corrector_table_object,null,' ')], {type : 'application/json'});


        function exportToFileEntry(fileEntry) {






              chrome.fileSystem.getDisplayPath(fileEntry, function(path) {

              });



                fileEntry.createWriter(function(fileWriter) {

                  var truncated = false;
              //    var blob = new Blob([contents]);

                  fileWriter.onwriteend = function(e) {
                    // if (!truncated) {
                    //   truncated = true;
                    //   // You need to explicitly set the file size to truncate
                    //   // any content that might have been there before
                    //   this.truncate(blob.size);
                    //
                    //   console.log(`Saving color table  to ${path} completed`);
                    //
                    //   return;
                    // }

                      console.log(`Saving color table to ${path} completed`);

                //    status.innerText = 'Export to '+fileDisplayPath+' completed';
                  };

                  fileWriter.onerror = function(e) {

                    console.log(`Saving color table failed: ${e.toString()}`);

                  };

                  fileWriter.write(contents);

                });

    }


        chrome.fileSystem.chooseEntry( {

              type: 'saveFile',
              suggestedName: `color_table.json`,   //  suggestedName: `project-${timestamp}.json`,
              accepts: [ { description: 'Robboscratch3 color table files (*.json)',
                          extensions: ['json']} ],
              acceptsAllTypes: true
              }, exportToFileEntry);


        // pom.setAttribute('href', URL.createObjectURL(contents, {
        //    type: "application/json"
        // }));
        // pom.setAttribute('download', "color_corrector_table"+ ".json");
        // pom.click();
  }


  onButtonLoadClick(){


    console.log("onButtonLoadClick" );

    function updateTable(color_corrector_table_object_loaded){


        var color_corrector_table_object = JSON.parse(color_corrector_table_object_loaded);

        colors_arr.forEach(function(color,color_index){


              let color_name = color.toLowerCase();



              correctors_arr.forEach(function(corrector,corrector_index){

              document.getElementById(`color-${color_name}-corrector-${corrector}`).value = color_corrector_table_object[color_name][corrector];

              });

        });
    }


    function readFile(e){
           var file = e.target.files[0];
           if (!file) {
              return;
           }
           var reader = new FileReader();
           reader.onload = function(e){
            //  var contents = e.target.result.replace("data:application/json;base64,", "");



            updateTable(e.target.result);


           };
           reader.readAsText(file);
        }

    var oInputFile = document.createElement("input");
         oInputFile.setAttribute('type', "file");


      oInputFile.style.position = "absolute";
      oInputFile.style.left = "0px";
      oInputFile.style.top = "0px";
      oInputFile.style.width = "1px";
      oInputFile.style.height = "1px";
      oInputFile.addEventListener('change', readFile, false);
      document.body.appendChild(oInputFile);

      setTimeout(function(){
                   oInputFile.click();
                   oInputFile.focus();
                 }, 1000);

  }


  onThisWindowClose(){
    console.log("ColorCorrectorTable close");
    this.props.onCloseColorCorrectorTable(this.props.color_corrector_table.sensor_caller_id);
  }

  render() {

    var top   =  this.props.color_corrector_table.position_top;
    var left  =  this.props.color_corrector_table.position_left;

    var sensor_caller_id = this.props.color_corrector_table.sensor_caller_id;
    var RCA = this.props.RCA;



    return this.props.connectDragSource(
				<div id={`color-corrector-table-${this.props.color_corrector_table.sensor_caller_id}_sensor-caller-id-${this.props.color_corrector_table.sensor_caller_id}`}
						className={classNames(
								{[styles.color_corrector_table]: true},
								{[styles.color_corrector_table_show]: this.props.color_corrector_table.isShowing},
								{[styles.color_corrector_table_hide]: !this.props.color_corrector_table.isShowing}
						)}
						style={{
								position: 'fixed',
								top: `${top}px`,
								left: `${left}px`,
						}}>
						<div className={classNames({[styles.color_corrector_table_tittle]: true})}
									id="color-corrector-table-tittle">
								Color corrector {this.props.color_corrector_table.sensor_caller_id+1}
						</div>

						<div id="content" className={styles.content}>
								<input type="checkbox" id="showAdvancedOptions" onClick={this.setDisplayOfAdvancedSettings.bind(this)}/> {this.props.intl.formatMessage(messages.showAdvOpt)}
								<br></br>
								<input type="checkbox" id="showMaxAdvancedOptions" onClick={this.setDisplayOfAdvancedSettings.bind(this)}/> {this.props.intl.formatMessage(messages.showMaximallyAdvOpt)}

								<div id="data-row" className={styles.row}>
										<div id="left-slider-block"
												className={classNames(
														{[styles.data_block]: true},
														{[styles.display_none]: true}
												)}>
												<div className={styles.left_slider_labels}>
														<span className={styles.slider_label}>R</span>
														<span className={styles.slider_label}>G</span>
														<span className={styles.slider_label}>B</span>
												</div>

												<div className={styles.left_slider_values}>
														<span className={styles.slider_value} id={"left-color-slider-1-value"}>100%</span>
														<span className={styles.slider_value} id={"left-color-slider-2-value"}>100%</span>
														<span className={styles.slider_value} id={"left-color-slider-3-value"}>100%</span>
												</div>

												<div className={styles.sliders}>
														<input type="range" id="left-color-slider-1" className={styles.color_slider} min="0" max="200" step="1" defaultValue="100"></input>
														<input type="range" id="left-color-slider-2" className={styles.color_slider} min="0" max="200" step="1" defaultValue="100"></input>
														<input type="range" id="left-color-slider-3" className={styles.color_slider} min="0" max="200" step="1" defaultValue="100"></input>
												</div>


												<div>
														<div className={styles.automatic_correcton_button_left}>
																<button>{this.props.intl.formatMessage(messages.mautocor)}</button>
														</div>

														<div className={styles.rgb_sum}>
																R+G+B:
																<input id={`rgb-sum`} className={classNames({[styles.rgb_sum_input]: true})} type="text">
																</input>
														</div>
												</div>
										</div>

										<div id={`color-box-${sensor_caller_id}`} className={classNames({[styles.data_block]: true})}></div>

										<div className={styles.automatic_correcton_button_right}>
												<button  onClick={this.automaticCollorCorrection.bind(this,this.props.RCA,
																	this.props.color_corrector_table.sensor_caller_id)}> {this.props.intl.formatMessage(messages.mautocor)}</button>
										</div>

										<br></br>

										<div id="right-slider-block" className={classNames({[styles.data_block]: true})} style={{display: 'none'}}>
												<div className={styles.left_slider_labels}>
														<span className={styles.slider_label}>R</span>
														<span className={styles.slider_label}>G</span>
														<span className={styles.slider_label}>B</span>
												</div>

												<div className={styles.left_slider_values}>
														<span className={styles.slider_value} id={"right-color-slider-1-value"}>100%</span>
														<span className={styles.slider_value} id={"right-color-slider-2-value"}>100%</span>
														<span className={styles.slider_value} id={"right-color-slider-3-value"}>100%</span>
												</div>

												<div className={styles.sliders}>
														<input type="range" id="right-color-slider-1" className={styles.color_slider} min="0" max="300" step="1" defaultValue="100"></input>
														<input type="range" id="right-color-slider-2" className={styles.color_slider} min="0" max="300" step="1" defaultValue="100"></input>
														<input type="range" id="right-color-slider-3" className={styles.color_slider} min="0" max="300" step="1" defaultValue="100"></input>
												</div>

												<div className={styles.checkboxes_block}>
															<input id="right-color-slider-1-checkbox" type="checkbox" className={styles.checkboxes}></input>
															<input id="right-color-slider-2-checkbox" type="checkbox" className={styles.checkboxes}></input>
															<input id="right-color-slider-3-checkbox" type="checkbox" className={styles.checkboxes}></input>
												</div>
										</div>

										<div id="data-block" className={classNames({[styles.data_block]: true})} style={{display: 'none'}}>
													<div id="color-row-1" className={styles.color_row}>
																<div id="color-row-1-col-1"
																			className={classNames(
                                                {[styles.color_col]: true},
                                                {[styles.color_col_header_label]: true}
									              								)} >
																</div>

																<div id="color-row-1-col-2"
																			className={classNames(
                                                {[styles.color_col]: true},
                                                {[styles.color_col_header_label]: true}
																              	)} >
																				R
                                        {/* {this.calculatePercents.call(this, "R", this.props.color_corrector_table.sensor_caller_id)} */}
																</div>

																<div id="color-row-1-col-3"

																			className={classNames(

																				{[styles.color_col]: true},
																				{[styles.color_col_header_label]: true}


																	)} >
																				G
                                        {/* {this.calculatePercents.call(this, "G", this.props.color_corrector_table.sensor_caller_id)} */}
																</div>

																<div id="color-row-1-col-4"

																			className={classNames(

																				{[styles.color_col]: true},
																				{[styles.color_col_header_label]: true}


																	)} >
																			B
                                      {/* {this.calculatePercents.call(this, "B", this.props.color_corrector_table.sensor_caller_id)} */}
																</div>

																<div id="color-row-1-col-5"

																			className={classNames(

																				{[styles.color_col]: true},
																				{[styles.color_col_header_label]: true}


																	)} >
																			Bright

																</div>


													</div> {/* row1 end */}

                          <div id="color-row-2" className={styles.color_row}>
																<div id="color-row-2-col-1"
																			className={classNames(
                                                {[styles.color_col]: true},
                                                {[styles.color_col_header_label]: true}
									              								)} >
																</div>

																<div id="color-row-2-col-2"
																			className={classNames(
                                                {[styles.color_col]: true},
                                                {[styles.color_col_percent]: true}, 
																              	)} >
                                                {this.calculatePercents.call(this, "R", this.props.color_corrector_table.sensor_caller_id)}
                                </div>

                                <div id="color-row-2-col-3"
																			className={classNames(
                                                {[styles.color_col]: true},
                                                {[styles.color_col_percent]: true}, 
                                                )} >
                                                {this.calculatePercents.call(this, "G", this.props.color_corrector_table.sensor_caller_id)}
																</div>

																<div id="color-row-2-col-4"

																			className={classNames(
                                                {[styles.color_col]: true},
                                                {[styles.color_col_percent]: true}, 
                                                )} >
                                                {this.calculatePercents.call(this, "B", this.props.color_corrector_table.sensor_caller_id)}
																</div>

																<div id="color-row-2-col-5"
																			className={classNames(
                                                {[styles.color_col]: true},
                                                {[styles.color_col_percent]: true}, 
                                                )} >
																</div>
                          </div>

													{

																colors_arr.map(function(color_name,index){

																	return    <ColorCorrectorTableRowElement key={`color-row-${index+3}`} rowId={index+3} colorName={color_name} colorIntervalValue={"20-30"} RCA={RCA}
																																						sensorID={sensor_caller_id} />

																})

													}

											</div>

								</div>

								<div id="buttons-row" className={styles.row}>
									<button id="buttons-row-close" className={styles.button_cancel} onClick={this.onThisWindowClose.bind(this)} >{this.props.intl.formatMessage(messages.mclose)}</button>
									<button id="buttons-row-save" className={styles.buttons} onClick={this.onButtonSaveClick.bind(this)}>{this.props.intl.formatMessage(messages.msave)}</button>
									<button id="buttons-row-load" className={styles.buttons} onClick={this.onButtonLoadClick.bind(this)}>{this.props.intl.formatMessage(messages.mload)}</button>
									<button id="buttons-row-apply" className={styles.buttons} onClick={this.onButtonApplyChangesClick.bind(this, this.props.RCA, this.props.color_corrector_table.sensor_caller_id)}>{this.props.intl.formatMessage(messages.mapply)}</button>
							</div>
						</div>
				</div>
    )
  };
};


const mapStateToProps =  state => ({


  color_corrector_table:state.scratchGui.color_corrector_table


  });

const mapDispatchToProps = dispatch => ({

  onCloseColorCorrectorTable:  (sensor_caller_id) => {

      dispatch(ActionTriggerColorCorrectorTable(sensor_caller_id));
    }


});



export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(DragSource(ItemTypes.COLOR_CORRECTOR_WINDOW, ColorCorrectorWindowSource, collect)(ColorCorrectorTableComponent)));
