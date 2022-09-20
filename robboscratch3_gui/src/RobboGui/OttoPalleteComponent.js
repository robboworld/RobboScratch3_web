import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './OttoPalleteComponent.css';
import SensorDataBlockComponent  from './SensorDataBlockComponent'

import {ActionTriggerDraggableWindow} from './actions/sensor_actions'

import {defineMessages, intlShape, injectIntl, FormattedMessage} from 'react-intl';

const messages = defineMessages({
    sound_level: {
        id: 'gui.RobboGui.OttoPalette.sound_level',
        description: ' ',
        defaultMessage: 'Sound: '
    },

    distance: {
        id: 'gui.RobboGui.OttoPalette.distance',
        description: ' ',
        defaultMessage: 'Distance: '
    },

    otto: {
        id: 'gui.RobboGui.OttoPalette.otto',
        description: ' ',
        defaultMessage: 'Отто'
    }
  });

class OttoPalleteComponent extends Component {
  onThisWindowClose(){
    console.log("OttoPalette close");
    this.props.onOttoPaletteWindowClose(5);
  }

  startGetDataLoop(){

    var sound_sensor_component = document.getElementById(`otto_sensor-data-block-otto-${this.props.ottoIndex}-sound-level_type-analog`);
    var sound_sensor_value_field = sound_sensor_component.children[0].children[1].children[0];
    var distanse_sensor_component = document.getElementById(`otto_sensor-data-block-otto-${this.props.ottoIndex}-distanse_type-analog`);
    var distanse_sensor_value_field = distanse_sensor_component.children[0].children[1].children[0];
    var getDataLoopInterval = setInterval(() => {
          sound_sensor_value_field.innerHTML = this.props.OCA.get_sound();
          distanse_sensor_value_field.innerHTML = this.props.OCA.get_dist();
          },50);
  }

  componentDidMount(){
      this.startGetDataLoop();
  }

  render() {
    return (
          <div id="otto-1" className={styles.otto_palette}>
                <div id="otto-tittle" className={styles.otto_panel_tittle}>
                    {this.props.intl.formatMessage(messages.otto)}
                      <div className={styles.close_icon} onClick={this.onThisWindowClose.bind(this)}>
                      </div>
                </div>
                <SensorDataBlockComponent key={`otto-${this.props.ottoIndex}-sound-level`} sensorId={`otto-${this.props.ottoIndex}-sound-level`}
                                   deviceName={`otto`} sensorType={`analog`}
                                   sensorFieldText={this.props.intl.formatMessage(messages.sound_level)}
                                   sensorName={`sound_level`}
                                   sensorData={`-1`} />
               <SensorDataBlockComponent key={`otto-${this.props.ottoIndex}-distanse`} sensorId={`otto-${this.props.ottoIndex}-distanse`}
                                                      deviceName={`otto`} sensorType={`analog`}
                                                      sensorFieldText={this.props.intl.formatMessage(messages.distance)}
                                                      sensorName={`distanse`}
                                                      sensorData={`0`} />
          </div>
    );
  }
}

const mapStateToProps =  state => ({
  });

const mapDispatchToProps = dispatch => ({
  onOttoPaletteWindowClose: () => {
      dispatch(ActionTriggerDraggableWindow(5));
    }
});

export default injectIntl(connect(
  mapStateToProps,
  mapDispatchToProps
)(OttoPalleteComponent));
