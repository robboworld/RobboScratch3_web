import {immutable_copy} from '../lib/lib.js';

const initialState = {
    workspace: null
};

const reducer = function (state, action) {
    let workspace_state = {};
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
      case"SEND_WORKSPACE":
        workspace_state = immutable_copy(state);
        workspace_state.workspace = action.payload.workspace;
        return workspace_state;
       break;
    default:
        return state;
    }
};


export {
    reducer as default,
    initialState as SendWorkspaceInitialState
};