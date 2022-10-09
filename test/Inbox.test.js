const assert = require('assert');
const ganache = require('ganache-cli'); //this is our local eth test network. auto-creates test accounts for us

// capitalized because its a constructor function we use to create INSTANCES of web3
// when setting up an instance, need to set up a provider which lets us send and receive requests between ganache and web3

////// FIX FROM STACK OVERFLOW FOR TIMEOUT ISSUE \\\\\
////// https://ethereum.stackexchange.com/questions/69446/timeout-exceeded-during-the-transaction-confirmation-process#answers
const OPTIONS = {
  defaultBlock: "latest",
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5
};
////// END FIX FROM STACK OVERFLOW FOR TIMEOUT ISSUE \\\\\

const Web3 = require('web3');
const web3 = new Web3(ganache.provider(), null, OPTIONS); //provider depends on the network

const { interface, bytecode } = require('../compile');

// Mocha test framework example
// class to be tested
class Car {
  park() {
    return 'stopped';
  }

  drive() {
    return 'vroom';
  }
}

// Mocha test example
// let car; // declaring the car outside the function so it isn't scoped to just the beforeEach

// beforeEach(() => {
//   // common setup code before multiple tests
//   car = new Car();
// });

// // describe groups tests by a type we define
// describe('car class tests', ()=> {
//   it('returns stopped when the car is parked', () => {
//     assert.equal(car.park(), 'stopped'); //assert is from the assert library we required, NOT the mocha functions
//   })

//   it('can drive', () => {
//     assert.equal(car.drive(), 'vroom');
//   })
// })

// testing the contract
let accounts;
let inbox;

beforeEach(async () => {
  // get a list of all accounts from ganache
  // using INSTANCE of web3, configured with ganache provider
  // using eth (ethereum) module
  // async: returns a PROMISE, so needs a .then to resolve
  accounts = await web3.eth.getAccounts();

  // use one of those accounts to deploy contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: ['Hi there!'] })
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    console.log(inbox);
  });
})
