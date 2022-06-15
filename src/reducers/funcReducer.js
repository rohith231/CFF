const ACTIONS = {
  TOGGLE_FUNCS: "toggleFuncs",
};

const funcReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.TOGGLE_FUNCS:
      return {
        ...state,
        [action.payload]: !state[action.payload],
      };
    default:
      return state;
  }
};

export default funcReducer;
