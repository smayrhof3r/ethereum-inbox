# ethereum-inbox

As part of my DLT talent program with the Frankfurt School of Finance blockchain center, I'm working through a [Udemy course](https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide) on programming web applications using blockchain.

- The course is a fantastic introduction into coding with **solidity**, the language used for Ethereum. 
- The course is less fantastic in using up-to-date versions of various libraries. It's rather outdated, so there are many warnings along the way regarding the libraries being  no longer supported. 

## The Smart Contract
The smart contract here is very simple: a message variable is stored, with one function to initialise the class with an initial Message, and one function to change the message value (setMessage)

As I've learned on the course now, **functions which change the contract stored values are 'transactions'** and therefore cost time and wei. In our little app, the 'setMessage' function modifies the contract and therefore will take ~15 seconds to run as part of a block, plus a bit more time for other nodes to validate, so could take 20 seconds to come through. The gas price depends on the actions taken, but is not zero. These 'transaction' functions always return the transaction Id once completed.

On the otherhand, as the message variable is public so there is automatically a 'message' function which returns the value of the variable. This is free and basically instant, given it's not a transaction. 

## Testing
The testing architecture is as follows:
<p><img src="https://user-images.githubusercontent.com/101105112/194766488-849a8783-3e4d-44cc-81a9-5f5058ce21a7.png" alt="diagram" width="200"/></p>

The testing uses the 'Mocha' testing framework for Javascript, which feels like the TDD used in the Le Wagon course (Ruby). It will test the functions coming out of the smart contract (i.e. 'message' and 'setMessage') 

The tests are functional and check that a contract is deployed, there is a default initial message, and the message can be updated.

Important learnings from this step:
1. Await / async as a better way to handle async functions that return promises (on course with le Wagon we used .then()
2. The three functions for writing tests (beforeEach, describes, it) and the assert function for checking results
3. The syntax for deploying a contract ( .Contract([interface]).deploy([bytecode], [arguments for constructor function]).send({ [from (account)],[gas]) })
4. The syntax for calling a function ( [contract object].methods.function_name().call() )
5. The syntax for sending a transaction ( [contract object].methods.function_name().send( { [from (account)] } )

## WIP
I'll keep this Read Me updated as the application takes shape
