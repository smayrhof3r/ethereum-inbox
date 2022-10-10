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

// this comes from compile.js where we compiled the code
const { interface, bytecode } = require('../compile');

// Mocha test framework example
// class to be tested
// class Car {
//   park() {
//     return 'stopped';
//   }

//   drive() {
//     return 'vroom';
//   }
// }

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
const INITIAL_STRING = 'Hi there!';

beforeEach(async () => {
  // get a list of all accounts from ganache
  // using INSTANCE of web3, configured with ganache provider
  // using eth (ethereum) module
  // async: returns a PROMISE, so needs a .then to resolve
  accounts = await web3.eth.getAccounts();

  // use one of those accounts to deploy contract
  // #Contract takes interface as function so it knows how we interact with it
  // #deploy doesn't 'deploy', just creates object to be deployed
  // inbox object that's returned/stored represents the actual contract. can call functions on it from the interface
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode, arguments: [INITIAL_STRING] })
    .send({ from: accounts[0], gas: '1000000' })
});

describe('Inbox', () => {
  it('deploys a contract', () => {
    // no error when sourcing address. won't work if not deployed. if not defined or null, will fail. must be truthy
    assert.ok(inbox.options.address)
  });

  it('has a default message', async () => {
    // this is how we *call* a method that READS data from the contract
    // need to use async await because it takes some amount of time
    // #message() input any arguments passsed to the function we are calling on the contract
    // #call() input is customising the *transaction*. specifying who pays, how much gas, etc
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });

  it('can be updated', async () => {
    await inbox.methods.setMessage("new message").send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, "new message");
  });

})
