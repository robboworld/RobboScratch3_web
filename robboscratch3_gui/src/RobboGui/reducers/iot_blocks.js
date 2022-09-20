const initialState = {
    login: "mail@yandex.ru",
    pass: "pass",
    broker_protocol: "ws",
    broker_adress: "maqiatto.com",
    broker_port: 8883,
    connection_status: false,
    connection_log: "",

    generate: false
};

var client;

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
        case 'UPDATE_IOT_BLOCK_LOGIN':
            return Object.assign({}, state, {
                login: action.login
            });
        case 'UPDATE_IOT_BLOCK_PASS':
            return Object.assign({}, state, {
                pass: action.pass
            });
        case 'UPDATE_IOT_BLOCK_PROTOCOL':
            return Object.assign({}, state, {
                broker_protocol: action.broker_protocol
            });
        case 'UPDATE_IOT_BLOCK_ADRESS':
            return Object.assign({}, state, {
                broker_adress: action.broker_adress
            });
        case 'UPDATE_IOT_BLOCK_PORT':
            return Object.assign({}, state, {
                broker_port: action.broker_port
            });
        case 'UPDATE_IOT_BLOCK_CONNECTION':
            return Object.assign({}, state, {
                connection_status: action.connection_status
            });
        case 'UPDATE_IOT_BLOCK_LOG':
            return Object.assign({}, state, {
                connection_log: action.connection_log
            });
        case 'GENERATE_IOT_BLOCK':
            return Object.assign({}, state, {
                generate: action.generate
            });
        default:
            return state;
    }
};

export {
    reducer as default,
    initialState as iot_block_InitialState,
};