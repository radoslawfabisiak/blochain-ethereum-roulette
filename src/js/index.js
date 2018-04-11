import React from 'react'
import ReactDOM from 'react-dom'
import Web3 from 'web3'
import './../css/index.css'
class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      lastWon: 0,
      betValue: 0.1,
      totalBet: 0,
      maxAmountOfBets: 0,
    }
    if(typeof web3 != 'undefined'){
      console.log("Using web3 detected from external source like Metamask")
      this.web3 = new Web3(web3.currentProvider)
    } else{
      console.log("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
      this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"))
    }
    const MyContract = web3.eth.contract([
      {
        "constant": false,
        "inputs": [],
        "name": "bet",
        "outputs": [],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "destroy",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "startLottery",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "payable": true,
        "stateMutability": "payable",
        "type": "fallback"
      },
      {
        "inputs": [
          {
            "name": "_betValue",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "betsCount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "betValue",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "lastWon",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "maxAmountOfBets",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "players",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "totalBet",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      }
    ])
    this.state.ContractInstance = MyContract.at("0x6b796a8f1e2858d3608f8ab020b71b5984d9f031")
    this.bet = this.bet.bind(this);
    this.play = this.play.bind(this);
  }
  componentDidMount(){
    this.updateState()
    setInterval(this.updateState.bind(this), 10e3)
  }
  updateState(){
    this.state.ContractInstance.betValue((err, result) => {
      if(result != null){
        this.setState({
          betValue: parseFloat(web3.fromWei(result, 'ether'))
        })
      }
    })
    this.state.ContractInstance.totalBet((err, result) => {
      if(result != null){
        this.setState({
          totalBet: parseFloat(web3.fromWei(result, 'ether'))
        })
      }
    })
    this.state.ContractInstance.maxAmountOfBets((err, result) => {
      if(result != null){
        this.setState({
          maxAmountOfBets: parseInt(result)
        })
      }
    })
    this.state.ContractInstance.lastWon((err, result) => {
      if(result != null){
        this.setState({
          lastWon:  result
        })
      }
    })
  }

  bet(){
    this.state.ContractInstance.bet({
      gas: 300000,
      from: web3.eth.accounts[0],
      value: web3.toWei(0.10, 'ether')
    }, (err, result) => {
      console.log(err);
      console.log(result);
    })
  }
  play(){
    this.state.ContractInstance.startLottery({
      gas: 300000,
      from: web3.eth.accounts[0],
    }, (err, result) => {
      console.log(err);
      console.log(result);
    })
  }
  render(){
    return (
      <div className="main-container">
        <h1>Small roulette</h1>
        <div className="block">
          <b>Last account won:</b> &nbsp;
          <span>{this.state.lastWon}</span>
        </div>
        <div className="block">
          <b>Bet value:</b> &nbsp;
          <span>{this.state.betValue}</span>
        </div>
        <div className="block">
          <b>Total ether bet:</b> &nbsp;
          <span>{this.state.totalBet} ether</span>
        </div>
        <div className="block">
          <b>Max amount of bets:</b> &nbsp;
          <span>{this.state.maxAmountOfBets}</span>
        </div>
        <hr/>
        <h2>Let's play!</h2>
        <button onClick={this.bet}>Add bet</button>
        <button onClick={this.play}>Start lottery</button>
      </div>
    )
  }
}
ReactDOM.render(
  <App />,
  document.querySelector('#root')
)