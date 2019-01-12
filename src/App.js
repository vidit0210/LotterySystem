import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";
import { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } from "constants";
class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = { manager: "" };
  // } Same as DecLARED Below State

  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };

  OnSubmit = async event => {
    event.preventDefault();
    const account = await web3.eth.getAccounts(function(error, result) {});

    this.setState({ message: "Processing your Transaction" });
    await lottery.methods.enter().send({
      from: account[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    this.setState({
      message: "You Have Been Entered in the Lottery ,All the Best!"
    });
  };

  onClick = async () => {
    const account = await web3.eth.getAccounts(function(error, result) {});
    this.setState({ message: "Processing your Transaction" });

    await lottery.methods.pickWinner().send({
      from: account[0]
    });

    this.setState({ message: "Winner Has Been Picked" });
  };
  async componentDidMount() {
    const manager = await lottery.methods.Manager().call(); //Don't need to specify from in Call as we are using injected Meta Mask in react.
    const players = await lottery.methods.getAllplayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This Contract is Deployed by {this.state.manager}. There are Currently{" "}
          {this.state.players.length} players ,competing to Win{" "}
          {web3.utils.fromWei(this.state.balance, "ether")} Ether.
        </p>
        <hr />
        <form onSubmit={this.OnSubmit}>
          <h4>Want to try your Luck</h4>
          <div>
            <label>Amount of Ether to Enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter!</button>
        </form>
        <hr />
        <h2>Ready to Pick a Winner?</h2>
        <button onClick={this.onClick}>Pick!</button>
        <hr />
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}

export default App;
