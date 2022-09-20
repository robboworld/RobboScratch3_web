

const initialState = ["test"];

const  reducer = function (state, action) {

  if (typeof state === 'undefined') state = initialState;

  return state;


}


export {
    reducer as default,

};
