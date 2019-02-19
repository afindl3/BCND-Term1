const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockchainClass = require('./BlockChain.js');

let myBlockChain = new BlockchainClass.Blockchain();

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

  /**
   * Constructor to create a new BlockController, you need to initialize here all your endpoints
   * @param {*} app 
   */
  constructor(app) {
    this.app = app;
    this.blocks = [];
    this.initializeMockData();
    this.getBlockByIndex();
    this.postNewBlock();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
   */
  getBlockByIndex() {
    this.app.get("/api/block/:index", (req, res) => {
      // Add your code here
      let blockNumber = req.params.index;
      blockNumber = Number(blockNumber);
      if(!isNaN(blockNumber)) {
        myBlockChain.getBlock(blockNumber).then((block) => {
          res.send(block);
        }).catch((err) => {
          res.send('Error, block does not exist (' + err.message + ')');
        });
      } else {
        res.send('Error, must specify a block number');
      }
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post("/api/block", (req, res) => {
      // Add your code here
      if (req.body.data) {
        let newBlock = new BlockClass.Block(req.body.data);
        myBlockChain.addBlock(newBlock).then((block) => {
          res.send(block);
        }).catch((err) => {
          res.send('Error, adding block' + err.message);
        });
      } else {
        res.send('Error, no request body');
      }

    });
  }

  /**
   * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
   */
  initializeMockData() {
    (function theLoop(i) {
      setTimeout(function () {
        let blockTest = new BlockClass.Block("Test Block - " + (i + 1));
        // Be careful this only will work if your method 'addBlock' in the Blockchain.js file return a Promise
        myBlockChain.addBlock(blockTest).then(block => {
          if (block) {
            console.log('Added block ' + JSON.parse(block).height + ': ' + block + '\n');
            i++;
            if (i < 5) theLoop(i);
          }
        }).catch(err => {
          console.log(err);
        });
      }, 1000);
    })(0);
  }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }