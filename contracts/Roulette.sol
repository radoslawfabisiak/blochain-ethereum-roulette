pragma solidity 0.4.21;

contract Roulette {
  address public owner;
  uint256 public betValue;
  uint256 public totalBet;
  uint256 public betsCount;
  address public lastWon;
  uint256 public maxAmountOfBets = 30;
  address[] public players;

  function() public payable {}
  function Roulette(uint256 _betValue) public {
    owner = msg.sender;
    if(_betValue != 0 ) betValue = _betValue;
  }
  function destroy() public {
    if(msg.sender == owner) selfdestruct(owner);
  }

  function bet() public payable {
    require(msg.value >= betValue);
    betsCount++;
    players.push(msg.sender);
    totalBet += msg.value;
  }

  function startLottery() public {
    // TO DO: find any secure stuff to prevent hacking by check the block number
    uint256 winner = block.number % players.length + 1;
    lastWon = players[winner];
    givemoney(winner);
  }

  function resetData() internal {
    players.length = 0;
    totalBet = 0;
    betsCount = 0;
  }

  function givemoney(uint256 winner) internal {
    uint256 winnerEtherAmount = totalBet;
    players[winner].transfer(winnerEtherAmount);
    resetData();
  }

}