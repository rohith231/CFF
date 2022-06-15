import React, { createContext, useReducer } from "react";
import funcReducer from "reducers/funcReducer";

const initialState = {};
const initChartState = {};

const GlobalState = ({ children }) => {
  const [state, dispatch] = useReducer(funcReducer, initialState);
  const [chartState, chartDispatch] = useReducer(funcReducer, initChartState);

  return (
    <funcContext.Provider value={[state, dispatch]}>
      <chartContext.Provider value={[chartState, chartDispatch]}>
        {children}
      </chartContext.Provider>
    </funcContext.Provider>
  );
};
export const funcContext = createContext(initialState);
export const chartContext = createContext(initChartState);

export default GlobalState;
