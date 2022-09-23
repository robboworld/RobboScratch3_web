import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import styles from  './EspPreviewComponent.css'
import {ActionTriggerDraggableWindow} from './actions/sensor_actions'

class EspPreviewComponent extends Component {
    onEspStatusChange(esp_state,esp_is_searching){
        var Esp_searching_icon;
        var Esp_connection_status;

        esp_is_searching = false;

        Esp_searching_icon = document.getElementById(`esp-preview-${this.props.espIndex}`);

        if (typeof(Esp_searching_icon) != 'undefined'){
            if (esp_is_searching){
                Esp_searching_icon.style.backgroundImage = " url(/build/static/robbo_assets/searching.gif)";
                Esp_searching_icon.style.backgroundRepeat = "no-repeat";
                Esp_searching_icon.style.backgroundPosition = "center";
            }else{
                Esp_searching_icon.style.backgroundImage = "";
            }
            Esp_connection_status = document.getElementById(`esp-preview-${this.props.espIndex}`);
            if(esp_state == 6){
                Esp_connection_status.classList.remove(styles.esp_status_connected);
                Esp_connection_status.classList.remove(styles.esp_status_disconnected);
                Esp_connection_status.classList.add(styles.esp_status_connected);
            }else{
                Esp_connection_status.classList.remove(styles.esp_status_disconnected);
                Esp_connection_status.classList.remove(styles.esp_status_connected);
                Esp_connection_status.classList.add(styles.esp_status_disconnected);
            }
        }
    }

    componentDidMount () {
        this.isEspConnected = false;
        this.esp_is_searching = false;

        // this.startEspConnectionStatusCheck();
        console.log(this.props)
        this.props.ECA.registerEspStatusChangeCallback(this.onEspStatusChange.bind(this));
    }

    render() {
        return (
            <div id={`esp-preview-${this.props.espIndex}`}
                className={classNames({[styles.espPreview]: true},
                    {[styles.esp_status_connected]: this.isEspConnected},
                    {[styles.esp_status_disconnected]: !this.isEspConnected}
                )}
                onClick={this.props.onTriggerEspPallete}>

                <div id={`esp-${this.props.espIndex}-preview-pic`}  className={styles.espPreviewPic} ></div>

                <div id={`esp-${this.props.espIndex}-searching-icon`} className={classNames(
                                {[styles.esp_loading_icon]: true},
                                {[styles.esp_loading_icon_hidden]: (/*(this.props.robots[0].robot_connected) || */(!this.esp_is_searching))},
                                {[styles.esp_loading_icon_showing]: ((this.esp_is_searching) /*&& (!this.props.robots[0].robot_connected)*/)}
                                )}>
                </div>

                <div id={`esp-${this.props.espIndex}-connection-status`}  className={classNames(
                                {[styles.esp_connection_status]: true},
                                {[styles.esp_status_connected]: this.isEspConnected},
                                {[styles.esp_status_disconnected]: !this.isEspConnected})}>
                </div>
            </div>
        );
    }
}


const mapStateToProps =  state => ({});

const mapDispatchToProps = dispatch => ({
    onTriggerEspPallete: () => {
        dispatch(ActionTriggerDraggableWindow(6));
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(EspPreviewComponent);
