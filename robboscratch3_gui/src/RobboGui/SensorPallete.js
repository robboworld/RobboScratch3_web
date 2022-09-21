import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './SensorPallete.css';
import SensorComponent from './SensorComponent';
import SensorDataBlockComponent  from './SensorDataBlockComponent'
import SensorChooseWindowComponent from './SensorChooseWindowComponent';

import QuadcopterPreviewComponent from './QuadcopterPreviewComponent';
import QuadcopterPalleteComponent from './QuadcopterPalleteComponent';

import RobotPreviewComponent from './RobotPreviewComponent';
import RobotPalleteComponent from './RobotPalleteComponent';

import LaboratoryPreviewComponent from './LaboratoryPreviewComponent';
import LaboratoryPalleteComponent from './LaboratoryPalleteComponent';

import OttoPreviewComponent from './OttoPreviewComponent';
import OttoPalleteComponent from './OttoPalleteComponent';

import ArduinoPreviewComponent from './ArduinoPreviewComponent';
import ArduinoPalleteComponent from './ArduinoPalleteComponent';

import EspPreviewComponent from './EspPreviewComponent';


import DraggableWindowComponent from './DraggableWindowComponent';


import {ActionTriggerExtensionPack} from './actions/sensor_actions';
import {ActionTriggerSensorChooseWindow} from './actions/sensor_actions';
import {ActionTriggerSensorsPalette} from './actions/sensor_actions';
import {ActionRobotsConnectionStatusCheckStart} from './actions/sensor_actions';
import {ActionLaboratoriesConnectionStatusCheckStart} from './actions/sensor_actions';
import {ActionRobotGetDataStart} from  './actions/sensor_actions';
import {ActionLaboratoryGetDataStart} from './actions/sensor_actions';



class SensorPallete extends Component {


  componentDidMount () {


      //console.log("triggerSensorsPalette");
      //this.props.startSensorsGetDataLoop();

    //  console.log("startRobotsConnectionStatusCheck");
  //    this.props.startRobotsConnectionStatusCheck(0,this.props.RCA);

      // console.log("startLaboratoriesConnectionStatusCheck");
      // this.props.startLaboratoriesConnectionStatusCheck(0,this.props.LCA);
      //
      //
      //
      // console.log("startLaboratoryGetData");
      // this.props.startLaboratoryGetData(0);

  }


  triggerSensorsPalette(){

    console.log("triggerSensorsPalette");
    this.props.onTriggerSensorsPalette();

  }

  triggerExtensionPack(){

      console.log("triggerExtensionPack()");
      this.props.onTriggerExtensionPack();

  }

  triggerSensorChooseWindow(){

      console.log("triggerSensorChooseWindow()");
      this.props.onTriggerSensorChooseWindow(0);

  }

  render() {
//  console.log(this.props.tracks);

 var initial_coords_robot = [200,200];
 var initial_coords_lab = [400,200];
 var initial_coords_quadcopter = [600,200];
 var initial_coords_otto = [800,200];
 var initial_coords_arduino = [900,200];

  return (

      <div id={styles.sensor_pallete}>


        <RobotPreviewComponent RCA={this.props.RCA} robotIndex={0} />

         <LaboratoryPreviewComponent LCA={this.props.LCA} labIndex={0} />

       {/* <QuadcopterPreviewComponent QCA={this.props.QCA} quadcopterIndex={0} /> */}


      {/*  <OttoPreviewComponent OCA={this.props.OCA} ottoIndex={0} />  

        <ArduinoPreviewComponent ACA={this.props.ACA} arduinoIndex={0}/> */}

        <EspPreviewComponent ECA={this.props.ECA} espIndex={0} /> 


      {/*  <DraggableWindowComponent draggableWindowId={0} initialCoords={initial_coords_quadcopter}>

              <QuadcopterPalleteComponent QCA={this.props.QCA} quadcopterIndex={0}/>

        </DraggableWindowComponent>  */}


        <DraggableWindowComponent draggableWindowId={1} initialCoords={initial_coords_robot}>

              <RobotPalleteComponent RCA={this.props.RCA} robotIndex={0} VM={this.props.VM}/>

        </DraggableWindowComponent>

        

        <DraggableWindowComponent draggableWindowId={2} initialCoords={initial_coords_lab}>

              <LaboratoryPalleteComponent LCA={this.props.LCA} labIndex={0}/>

        </DraggableWindowComponent>

        {/*<DraggableWindowComponent draggableWindowId={5} initialCoords={initial_coords_otto}>

              <OttoPalleteComponent OCA={this.props.OCA} ottoIndex={0}/>

        </DraggableWindowComponent>  

        <DraggableWindowComponent draggableWindowId={6} initialCoords={initial_coords_arduino}>

              <ArduinoPalleteComponent ACA={this.props.ACA} arduinoIndex={0}/>

      </DraggableWindowComponent>  */}




      </div>
  );
}

}

const mapStateToProps =  state => ({

      // robot_sensors:state.scratchGui.robot_sensors,
      // lab_external_sensors:state.scratchGui.lab_external_sensors,
      // robot_special_sensors:state.scratchGui.robot_special_sensors,
      // lab_special_sensors:state.scratchGui.lab_special_sensors,
      // sensors_choose_window:state.scratchGui.sensors_choose_window,
      // robots:state.scratchGui.robots,
      // laboratories:state.scratchGui.laboratories,
      // settings:state.scratchGui.settings
  });

const mapDispatchToProps = dispatch => ({

  onTriggerExtensionPack: () => {

      dispatch(ActionTriggerExtensionPack());
    },

  onTriggerSensorChooseWindow: (sensor_caller_id) => {

         dispatch(ActionTriggerSensorChooseWindow(sensor_caller_id));
       },

  onTriggerSensorsPalette: () => {

           dispatch(ActionTriggerSensorsPalette());
         },

  startRobotsConnectionStatusCheck: (robot_number,RCA) => {

       dispatch(ActionRobotsConnectionStatusCheckStart(robot_number,RCA));

  },

  startLaboratoriesConnectionStatusCheck: (laboratory_number,LCA) => {

       dispatch(ActionLaboratoriesConnectionStatusCheckStart(laboratory_number,LCA));

  },

  startRobotGetData: (robot_number) => {

      dispatch(ActionRobotGetDataStart(robot_number));

  },

  startLaboratoryGetData: (laboratory_number) => {

      dispatch(ActionLaboratoryGetDataStart(laboratory_number));

  }


});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SensorPallete);
