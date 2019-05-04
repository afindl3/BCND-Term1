/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/
const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./models/Block.js');

class Blockchain {

  constructor() {
    this.db = new LevelSandbox.LevelSandbox();
  }

  // Get block height, it is auxiliar method that return the height of the blockchain
  getBlockchainHeight() {
    // Add your code here
    return new Promise((resolve, reject) => {
      resolve(this.db.getBlocksCount());
    })
  }

  // Add new block
  addBlock(newBlock) {
    // Add your code here
    return new Promise((resolve, reject) => {
      this.getBlockchainHeight().then(height => {
        if (height) {
          this.getBlockByHeight(height - 1).then(previousBlock => {
            newBlock.previousBlockHash = JSON.parse(previousBlock).hash; 
            newBlock.height = height;
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
            resolve(this.db.addLevelDBData(height, JSON.stringify(newBlock).toString()));
          }).catch(err => {
            reject(err);
          });
        } else {
          // Genesis block - height, time & previousBlockHash already initialized 
          newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
          resolve(this.db.addLevelDBData(height, JSON.stringify(newBlock).toString()));
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  // Get Block By Height
  getBlockByHeight(blockHeight) {
    // Add your code here
    return new Promise((resolve, reject) => {
      resolve(this.db.getLevelDBDataByHeight(blockHeight));
    });
  }

  // Get Block By Hash
  getBlockByHash(blockHash) {
    return new Promise((resolve, reject) => {
      resolve(this.db.getLevelDBDataByHash(blockHash));
    });
  }

  // Get Block By Wallet Address
  getBlocksByWalletAddress(walletAddress) {
    return new Promise((resolve, reject) => {
      resolve(this.db.getLevelDBDataByWalletAddress(walletAddress));
    });
  }

  // Validate if Block is being tampered by Block Height
  validateBlock(blockHeight) {
    // Add your code here
    return new Promise((resolve, reject) => {
      this.getBlockByHeight(blockHeight).then(block => {
        block = JSON.parse(block);
        let blockHash = block.hash;
        block.hash = '';
        let validBlockHash = SHA256(JSON.stringify(block).toString());

        if (validBlockHash == blockHash) {
          resolve(true);
        } else {
          console.log('Block ' + blockHeight + ' invalid hash: ' + blockHash + '<->' + validBlockHash);
          resolve(false);
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  // Validate Blockchain
  validateChain() {
    // Add your code here
    let errorLog = [];
    return new Promise((resolve, reject) => {
      this.getBlockHeight().then(height => {
        let previousHash = '';
        for (let i = 0; i < height; i++) {
          this.validateBlock(i).then(valid => {
            if (!valid) {
              console.log('Invalid block data (block hash does not match hash of block data), block: ' + i);
              errorLog.push(i);
            } else {
              this.getBlockByHeight(i).then(block => {
                block = JSON.parse(block);
                if (i === 0) {
                  previousHash = block.hash;
                } else if (block.previousBlockHash !== previousHash) {
                  console.log('Invalid block link (previousBlockHash does not match the previous block\'s hash), block: ' + i);
                  errorLog.push(i);
                }
                if (i === (height - 1)) {
                  resolve(errorLog);
                }
                previousHash = block.hash;
              }).catch(err => {
                reject(err);
              });
            }
          }).catch(err => {
            reject(err);
          })
        }
      }).catch(err => {
        reject(err);
      });
    });
  }

}

module.exports.Blockchain = Blockchain;