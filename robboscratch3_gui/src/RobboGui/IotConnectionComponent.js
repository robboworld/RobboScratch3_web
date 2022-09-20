import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { defineMessages, injectIntl } from 'react-intl';

import styles from './IotConnectionComponent.css';
import {
    ActionTriggerNewDraggableWindow,
    ActionUpdateIotBlockLogin,
    ActionUpdateIotBlockPass,
    ActionUpdateIotBlockProtocol,
    ActionUpdateIotBlockAdress,
    ActionUpdateIotBlockPort,
    ActionMqttConnect,
    ActionGenerateIotBlocks,
    ActionGreenFlag,
} from './actions/sensor_actions';

const messages = defineMessages({
    iot_connection: {
        id: 'gui.RobboGui.iot_connection',
        description: ' ',
        defaultMessage: 'Iot connection'
    },
    login: {
        id: 'gui.RobboGui.login',
        description: ' ',
        defaultMessage: 'Login'
    },
    password: {
        id: 'gui.RobboGui.password',
        description: ' ',
        defaultMessage: 'Password'
    },
    broker_setting: {
        id: 'gui.RobboGui.broker_setting',
        description: ' ',
        defaultMessage: 'Broker setting'
    },
    broker_protocol: {
        id: 'gui.RobboGui.broker_protocol',
        description: ' ',
        defaultMessage: 'Broker protocol'
    },
    broker_adress: {
        id: 'gui.RobboGui.broker_adress',
        description: ' ',
        defaultMessage: 'Broker adress'
    },
    broker_port: {
        id: 'gui.RobboGui.broker_port',
        description: ' ',
        defaultMessage: 'Broker port'
    },
    connection_status: {
        id: 'gui.RobboGui.connection_status',
        description: ' ',
        defaultMessage: 'Connection status',
    },
    connection_log: {
        id: 'gui.RobboGui.connection_log',
        description: ' ',
        defaultMessage: 'Connection log',
    },
    connect: {
        id: 'gui.RobboGui.connect',
        description: ' ',
        defaultMessage: 'Connect',
    },
    generate: {
        id: 'gui.RobboGui.generate',
        description: ' ',
        defaultMessage: 'Generate'
    }

});

class IotConnectionComponent extends Component {
    constructor(props) {
        super(props);
        this.handleLoginChange = this.handleLoginChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleProtocolChange = this.handleProtocolChange.bind(this);
        this.handleAdressChange = this.handleAdressChange.bind(this);
        this.handlePortChange = this.handlePortChange.bind(this);
    }
    onThisWindowClose() {
        console.log("iotconnection close");
        this.props.onIotWindowClose("iot_connection");
    }

    handleLoginChange(e) {
        this.props.updateIotBlockLogin(e.target.value);
    }
    handlePasswordChange(e) {
        this.props.updateIotBlockPass(e.target.value);
    }
    handleProtocolChange(e) {
        this.props.updateIotBlockProtocol(e.target.value);
    }
    handleAdressChange(e) {
        this.props.updateIotBlockAdress(e.target.value);
    }
    handlePortChange(e) {
        this.props.updateIotBlockPort(e.target.value);
    }
    connect() {
        let options = {};
    
        options.port = this.props.iot_blocks.broker_port;
        options.host = this.props.iot_blocks.broker_adress;
        options.hostname = this.props.iot_blocks.broker_adress;
        options.protocol = this.props.iot_blocks.broker_protocol;
        options.username = this.props.iot_blocks.login;
        options.password = this.props.iot_blocks.pass;
        options.path = "/mqtt";
        
        this.props.mqttConnect(options, this.props.IOT);
    }
    generate() {
        this.props.generate(true);
    }

    render() {
        return (
            <div id="iot-connection" className={styles.iot_connection}>

                <div id="iot_connection_tittle" className={styles.iot_connection_tittle}>
                    {this.props.intl.formatMessage(messages.iot_connection)}

                    <div className={styles.close_icon} onClick={this.onThisWindowClose.bind(this)}></div>
                </div>

                <div id="iot-connection-content" className={styles.iot_connection_content}>
                    <div id="iot-connection-content-raw-1" className={styles.iot_connection_content_raw}>
                        <div id="raw-1-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            {this.props.intl.formatMessage(messages.login)}
                        </div>

                        <div id="raw-1-iot-connection-content-column-2" className={styles.iot_connection_content_column}>
                            <input type="text" name="login" value={this.props.iot_blocks.login} onChange={this.handleLoginChange} />
                        </div>
                    </div>

                    <div id="iot-connection-content-raw-2" className={styles.iot_connection_content_raw}>
                        <div id="raw-2-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            {this.props.intl.formatMessage(messages.password)}
                        </div>

                        <div id="raw-2-iot-connection-content-column-2" className={styles.iot_connection_content_column}>
                            <input type="text" name="password" value={this.props.iot_blocks.pass} onChange={this.handlePasswordChange} />
                        </div>
                    </div>

                    <div id="iot-connection-content-raw-3" className={styles.iot_connection_content_raw}>
                        <div id="raw-3-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            <b>{this.props.intl.formatMessage(messages.broker_setting)}</b>
                        </div>
                    </div>
                    <div id="iot-connection-content-raw-4" className={styles.iot_connection_content_raw} >
                        <div id="raw-4-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            {this.props.intl.formatMessage(messages.broker_protocol)}
                        </div>
                        <div id="raw-4-iot-connection-column-2" className={styles.iot_connection_content_column}>
                            <input type="text" name="broker_protocol" value={this.props.iot_blocks.broker_protocol} onChange={this.handleProtocolChange} />
                        </div>
                    </div>
                    <div id="iot-connection-content-raw-5" className={styles.iot_connection_content_raw}>
                        <div id="raw-5-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            {this.props.intl.formatMessage(messages.broker_adress)}
                        </div>
                        <div id="raw-5-iot-connection-column-2" className={styles.iot_connection_content_column}>
                            <input type="text" name="broker_adress" value={this.props.iot_blocks.broker_adress} onChange={this.handleAdressChange} />
                        </div>
                    </div>
                    <div id="iot-connection-content-raw-6" className={styles.iot_connection_content_raw} >
                        <div id="raw-6-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            {this.props.intl.formatMessage(messages.broker_port)}
                        </div>
                        <div id="raw-6-iot-connection-column-2" className={styles.iot_connection_content_column}>
                            <input type="number" name="broker_port" value={this.props.iot_blocks.broker_port} onChange={this.handlePortChange} />
                        </div>

                    </div>

                    <div id="iot-connection-content-raw-7" className={styles.iot_connection_content_raw}>
                        <div id="raw-7-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            {this.props.intl.formatMessage(messages.connection_status)}
                        </div>

                        <div id="raw-7-iot-connection-column-2" className={styles.iot_connection_content_column}>

                            {this.props.IOT.connectionStatus.toString()}
                            {
                                this.props.IOT.connectionStatus ? <div className={styles.connection_true_icon}></div> : <div className={styles.connection_false_icon}></div>
                            }
                        </div>

                    </div>

                    <div id="iot-connection-content-raw-8" className={styles.iot_connection_content_raw}>
                        <div id="raw-8-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            {this.props.intl.formatMessage(messages.connection_log)}
                        </div>

                        <div id="raw-8-iot-connection-column-2" className={styles.iot_connection_content_column}>
                            {this.props.IOT.connectionLog}
                        </div>
                    </div>

                    <div id="iot-connection-content-raw-9" className={styles.iot_connection_content_raw}>
                        <div id="raw-9-iot-connection-column-1" className={styles.iot_connection_content_column}>
                            <button onClick={this.generate.bind(this)}> {this.props.intl.formatMessage(messages.generate)} </button>
                        </div>
                        <div id="raw-9-iot-connection-column-2" className={styles.iot_connection_content_column}>
                            <button onClick={this.connect.bind(this)}> {this.props.intl.formatMessage(messages.connect)} </button>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            </div >
        )
    };
}

IotConnectionComponent.defaultProps = {
    iot_blocks: {
        login: "mail@yandex.ru",
        pass: "pass",
        broker_protocol: "ws",
        broker_adress: "maqiatto.com",
        broker_port: 8883,
        connection_status: false,
        connection_log: "",
        generate: false,
    }
};

const mapStateToProps = state => ({
    iot_blocks: state.scratchGui.iot_blocks,

});

const mapDispatchToProps = dispatch => ({
    onIotWindowClose: (window_id) => {
        dispatch(ActionTriggerNewDraggableWindow(window_id));
    },
    updateIotBlockLogin: (login) => {
        dispatch(ActionUpdateIotBlockLogin(login));
    },
    updateIotBlockPass: (pass) => {
        dispatch(ActionUpdateIotBlockPass(pass));
    },
    updateIotBlockProtocol: (protocol) => {
        dispatch(ActionUpdateIotBlockProtocol(protocol));
    },
    updateIotBlockAdress: (adress) => {
        dispatch(ActionUpdateIotBlockAdress(adress));
    },
    updateIotBlockPort: (port) => {
        dispatch(ActionUpdateIotBlockPort(port));
    },
    mqttConnect: (options, IOT) => {
        dispatch(ActionMqttConnect(options, IOT));
    },
    greenFlag: (vm) => {
        dispatch(ActionGreenFlag(vm));
    },
    generate: (generate) => {
        dispatch(ActionGenerateIotBlocks(generate));
    }
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(IotConnectionComponent));