import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './QuadcopterPalleteComponent.css';
import SensorDataBlockComponent  from './SensorDataBlockComponent'

import {ActionTriggerDraggableWindow} from './actions/sensor_actions'

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';



const messages = defineMessages({

    battery_level: {
        id: 'gui.RobboGui.QuadcopterPalette.battery_level',
        description: ' ',
        defaultMessage: 'Battery level: '
    },

    yaw: {
        id: 'gui.RobboGui.QuadcopterPalette.yaw',
        description: ' ',
        defaultMessage: 'Yaw: '
    },

    x_coord: {
        id: 'gui.RobboGui.QuadcopterPalette.x_coord',
        description: ' ',
        defaultMessage: 'X coord: '
    },

    y_coord: {
        id: 'gui.RobboGui.QuadcopterPalette.y_coord',
        description: ' ',
        defaultMessage: 'Y coord: '
    },
    z_coord: {
        id: 'gui.RobboGui.QuadcopterPalette.z_coord',
        description: ' ',
        defaultMessage: 'Z coord:  '
    },
    quadcopter: {
        id: 'gui.RobboGui.QuadcopterPalette.quadcopter',
        description: ' ',
        defaultMessage: 'Quadcopter'
    },
    meters:  {
        id: 'gui.RobboGui.QuadcopterPalette.meters',
        description: ' ',
        defaultMessage: 'meters'
    },
    degrees:{
        id: 'gui.RobboGui.QuadcopterPalette.degrees',
        description: ' ',
        defaultMessage: 'degrees'
    }

  });



class QuadcopterPalleteComponent extends Component {

  onThisWindowClose(){

    console.log("QuadcopterPalette close");
    this.props.onQuadcopterPaletteWindowClose(0);

  }

  startBatteryWarningLoop(){

    let bat_level = 0;

    var battery_sensor_component = document.getElementById(`quadcopter_sensor-data-block-copter-${this.props.quadcopterIndex}-battery-level_type-analog`);

    var battery_sensor_value_field = battery_sensor_component.children[0].children[1].children[0];

        this.batteryWarningLoop = setInterval(() => {

                bat_level =  this.props.QCA.get_battery_level();

                if (this.props.QCA.isQuadcopterConnected()){

                    if (bat_level < 5){

                            battery_sensor_value_field.classList.toggle(styles.battery_low_red_warning);

                    }else if (bat_level < 15){

                            battery_sensor_value_field.classList.toggle(styles.battery_low_yelolow_warning); 

                    }else{

                            battery_sensor_value_field.classList.remove(styles.battery_low_yelolow_warning);
                            battery_sensor_value_field.classList.remove(styles.battery_low_red_warning);

                    }

                }

                

        },1000);

  }

  startGetDataLoop(){


    var battery_sensor_component = document.getElementById(`quadcopter_sensor-data-block-copter-${this.props.quadcopterIndex}-battery-level_type-analog`);

    var battery_sensor_value_field = battery_sensor_component.children[0].children[1].children[0];


    var x_coord_sensor_component = document.getElementById(`quadcopter_sensor-data-block-copter-${this.props.quadcopterIndex}-coord-x_type-analog`);

    var x_coord_sensor_value_field = x_coord_sensor_component.children[0].children[1].children[0];



    var y_coord_sensor_component = document.getElementById(`quadcopter_sensor-data-block-copter-${this.props.quadcopterIndex}-coord-y_type-analog`);

    var y_coord_sensor_value_field = y_coord_sensor_component.children[0].children[1].children[0];


    var z_coord_sensor_component = document.getElementById(`quadcopter_sensor-data-block-copter-${this.props.quadcopterIndex}-coord-z_type-analog`);

    var z_coord_sensor_value_field  = z_coord_sensor_component.children[0].children[1].children[0];

    var yaw_sensor_component = document.getElementById(`quadcopter_sensor-data-block-copter-${this.props.quadcopterIndex}-yaw_type-analog`);

    var yaw_sensor_value_field  = yaw_sensor_component.children[0].children[1].children[0];



    var getDataLoopInterval = setInterval(() => {

          battery_sensor_value_field.innerHTML = this.props.QCA.get_battery_level() + " % "; // + this.props.QCA.get_battery_level_raw() + "V";

          x_coord_sensor_value_field.innerHTML =  this.props.QCA.telemetry_palette_get_coord("X") + " " + this.props.intl.formatMessage(messages.meters); //this.props.QCA.get_coord("X");

          y_coord_sensor_value_field.innerHTML =  this.props.QCA.telemetry_palette_get_coord("Y") + " " + this.props.intl.formatMessage(messages.meters); //this.props.QCA.get_coord("Y");

          z_coord_sensor_value_field.innerHTML = this.props.QCA.telemetry_palette_get_coord("Z") + " " + this.props.intl.formatMessage(messages.meters);

          yaw_sensor_value_field.innerHTML     = this.props.QCA.telemetry_palette_get_coord("W") + " " + this.props.intl.formatMessage(messages.degrees);


    },50);



  }

  componentDidMount(){


      this.startGetDataLoop();
      this.startBatteryWarningLoop();

  }


  render() {



    return (

          <div id="quadcopter-1" className={styles.quadcopter_palette}>


                <div id="quadcopter-tittle" className={styles.quadcopter_panel_tittle}>

                    {this.props.intl.formatMessage(messages.quadcopter)}

                      <div className={styles.close_icon} onClick={this.onThisWindowClose.bind(this)}>

                      </div>

                </div>

                <SensorDataBlockComponent key={`copter-${this.props.quadcopterIndex}-battery-level`} sensorId={`copter-${this.props.quadcopterIndex}-battery-level`}
                                   deviceName={`quadcopter`} sensorType={`analog`}
                                   sensorFieldText={this.props.intl.formatMessage(messages.battery_level)}
                                   sensorName={`battery-level`}
                                   sensorData={`---`} />

               <SensorDataBlockComponent key={`copter-${this.props.quadcopterIndex}-coord-x`} sensorId={`copter-${this.props.quadcopterIndex}-coord-x`}
                                                      deviceName={`quadcopter`} sensorType={`analog`}
                                                      sensorFieldText={this.props.intl.formatMessage(messages.x_coord)}
                                                      sensorName={`coord-x`}
                                                      sensorData={`0`} />

              <SensorDataBlockComponent key={`copter-${this.props.quadcopterIndex}-coord-y`} sensorId={`copter-${this.props.quadcopterIndex}-coord-y`}
                                                                                             deviceName={`quadcopter`} sensorType={`analog`}
                                                                                             sensorFieldText={this.props.intl.formatMessage(messages.y_coord)}
                                                                                             sensorName={`coord-y`}
                                                                                             sensorData={`0`} />

            <SensorDataBlockComponent key={`copter-${this.props.quadcopterIndex}-coord-z`} sensorId={`copter-${this.props.quadcopterIndex}-coord-z`}
                                                                                            deviceName={`quadcopter`} sensorType={`analog`}
                                                                                            sensorFieldText={this.props.intl.formatMessage(messages.z_coord)}
                                                                                            sensorName={`coord-z`}
                                                                                            sensorData={`0`} />

            <SensorDataBlockComponent key={`copter-${this.props.quadcopterIndex}-yaw`} sensorId={`copter-${this.props.quadcopterIndex}-yaw`}
              deviceName={`quadcopter`} sensorType={`analog`}
              sensorFieldText={this.props.intl.formatMessage(messages.yaw)}
              sensorName={`yaw`}
              sensorData={`0`} />


          </div>



    );


  }


}


const mapStateToProps =  state => ({


  });

const mapDispatchToProps = dispatch => ({



  onQuadcopterPaletteWindowClose: () => {

      dispatch(ActionTriggerDraggableWindow(0));
    }

});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(QuadcopterPalleteComponent));
