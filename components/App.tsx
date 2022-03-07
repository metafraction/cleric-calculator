import React, { useReducer } from "react";
import { ethers, BigNumber } from "ethers";
import { RGThemeProvider } from "@raidguild/design-system";
import CalculatorForm from "./CalculatorForm";
import initialState from "../state/initialState";
import reducer from "../state/reducer";

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const setAmount = (a: string) => {
    console.log("amount");
  };

  const setShares = (s: string) => {
    console.log("shares");
  };

  return (
    <RGThemeProvider>
      <CalculatorForm state={state} dispatch={dispatch} />
    </RGThemeProvider>
  );
};

export default App;
