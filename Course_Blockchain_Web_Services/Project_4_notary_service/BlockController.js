const BlockClass = require('./models/Block.js');
const BlockchainClass = require('./BlockChain.js');
const MempoolClass = require('./Mempool.js');
const Hex2ascii = require('hex2ascii');

let myBlockChain = new BlockchainClass.Blockchain();
let myMempool = new MempoolClass.Mempool();

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
    this.getBlockByHeight();
    this.getBlockByHash();
    this.getBlocksByWalletAddress();
    this.postNewBlock();
    this.requestValidation();
    this.validate();
  }

  /**
   * Implement a GET Endpoint to retrieve a block by height, url: "/api/block/:height"
   */
  getBlockByHeight() {
    this.app.get("/stars/height/:height", (req, res) => {
      // Add your code here
      let blockNumber = req.params.height;
      blockNumber = Number(blockNumber);
      if (!isNaN(blockNumber)) {
        myBlockChain.getBlockByHeight(blockNumber).then(block => {
          block = JSON.parse(block);
          block.body.star.storyDecoded = Hex2ascii(block.body.star.storyEncoded);
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
   * Implement a GET Endpoint to retrieve a block by hash, url: "/stars/:hash"
   */
  getBlockByHash() {
    this.app.get("/stars/hash/:hash", (req, res) => {
      let blockHash = req.params.hash;
      myBlockChain.getBlockByHash(blockHash).then(block => {
        block = JSON.parse(block);
        block.body.star.storyDecoded = Hex2ascii(block.body.star.storyEncoded);
        res.send(block);
      }).catch((err) => {
        res.send('Error, block does not exist (' + err.message + ')');
      });
    });
  }

  /**
   * Implement a GET Endpoint to retrieve a block by wallet address, url: "/stars/:address"
   */
  getBlocksByWalletAddress() {
    this.app.get("/stars/address/:address", (req, res) => {
      let walletAddress = req.params.address;
      myBlockChain.getBlocksByWalletAddress(walletAddress).then(blocks => {
        blocks.forEach(block => {
          block.body.star.storyDecoded = Hex2ascii(block.body.star.storyEncoded);
        });
        res.send(blocks);
      }).catch((err) => {
        res.send('Error, block does not exist (' + err.message + ')');
      });
    });
  }

  /**
   * Implement a POST Endpoint to add a new Block, url: "/api/block"
   */
  postNewBlock() {
    this.app.post("/api/block", (req, res) => {
      if(!req.body.address || !req.body.star || !req.body.star.story){
        throw new Error('Request must include a wallet address & star data');
      }

      // Returns true if request was added to the mempool & if the request signature was validated 
      const isValid = myMempool.verifyAddressRequest(req.body);
      if (isValid) {
        // Encode the story data of the star, this is the object you will save as a body of your block:
        let body = {
          address: req.body.address,
          star: {
            ra: req.body.star.ra,
            dec: req.body.star.dec,
            mag: req.body.star.mag,
            cen: req.body.star.cen,
            storyEncoded: Buffer(req.body.star.story).toString('hex')
          }
        };
        // Add your code here
        let newBlock = new BlockClass.Block(body);
        myBlockChain.addBlock(newBlock).then(block => {
          block = JSON.parse(block);
          block.body.star.storyDecoded = Hex2ascii(block.body.star.storyEncoded);
          // Star has been successfully added to the blockchain - remove from the mempool
          myMempool.removeValidationRequest(block.body.address)
          res.status(200).json({
            message: 'Success - added star data to the blockchain',
            payload: block
          });
        }).catch((err) => {
          res.status(500).json({
            message: 'Error adding block ' + err.message
          });
        });
      } else if (isValid === false) {
        res.status(401).json({
          message: 'Unauthorized - request signature invalid'
        });
      } else if (isValid === undefined) {
        res.status(404).json({
          message: 'Not found - request does not exist in mempool'
        });
      }
    });
  }

  /**
   * Implement a POST Endpoint to add a new request to the mempool, url: "/requestValidation"
   */
  requestValidation() {
    this.app.post("/requestValidation", (req, res) => {
      if(!req.body.address){
        throw new Error('Request must include a wallet address');
      }
      const mempoolEntry = myMempool.addRequestValidation(req.body);
      res.status(200).json({
        message: 'Success - request added/exists in mempool',
        payload: mempoolEntry
      });
    });
  }

  /**
   * Implement a POST Endpoint to validate the signature of a request in the mempool, url: "/message-signature/validate"
   */
  validate() {
    this.app.post("/message-signature/validate", (req, res) => {
      if(!req.body.address || !req.body.address ){
        throw new Error('Request must include a wallet address & signature');
      }
      const mempoolEntry = myMempool.validateRequestByWallet(req.body);
      if (mempoolEntry) {
        if (mempoolEntry.messageSignatureValid) {
          res.status(200).json({
            message: 'Success - request signature valid',
            payload: mempoolEntry
          });
        } else if (!mempoolEntry.messageSignatureValid) {
          res.status(401).json({
            message: 'Unauthorized - request signature invalid'
          });
        }
      } else {
        res.status(404).json({
          message: 'Not found - request does not exist in mempool'
        });
      }
    })
  }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app); }