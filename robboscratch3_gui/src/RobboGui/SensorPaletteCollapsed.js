import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from './SensorPalleteCollapsed.css';



import {ActionTriggerSensorsPalette} from './actions/sensor_actions';



class SensorPalleteCollapsed extends Component {



  triggerSensorsPalette(){

    console.log("triggerSensorsPalette");
    this.props.onTriggerSensorsPalette();

  }

  render() {

          return (

            <div id={styles.sensor_pallete}>


                  <div id="sensor-pallete-collapsed" className={styles.sensors_panel_collapsed} onClick={this.triggerSensorsPalette.bind(this)}> Sensors pallete   </div>


              </div>


               );
        }

}

const mapStateToProps =  state => ({


  });

const mapDispatchToProps = dispatch => ({



  onTriggerSensorsPalette: () => {

           dispatch(ActionTriggerSensorsPalette());

         }



});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SensorPalleteCollapsed);
