import React from "react";
import { ethers, BigNumber } from "ethers";
import Pledge from "./Pledge";

class App extends React.Component<any, any> {
  // @ts-ignore

  constructor(props: any) {
    super(props);
  }

  public setAmount(a: string) {
    console.log('amount');
  }

  public setShares(s: string) {
    console.log('shares');
  }

  render() {
    const actions = {
      setAmount: (a: string) => this.setAmount(a),
      setShares: (s: string) => this.setShares(s),
    };
    return (
      <>
        <Pledge
          actions={actions}
        />
      </>
    );
  }
}
export default App;
