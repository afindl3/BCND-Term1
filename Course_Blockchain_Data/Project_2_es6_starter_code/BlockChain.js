/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

  constructor() {
    this.db = new LevelSandbox.LevelSandbox();
    this.generateGenesisBlock();
  }

  // Auxiliar method to create a Genesis Block (always with height= 0)
  // You have to options, because the method will always execute when you create your blockchain
  // you will need to set this up statically or instead you can verify if the height !== 0 then you
  // will not create the genesis block
  generateGenesisBlock() {
    // Add your code here
    this.getBlockHeight().then(count => {
      if (count == 0) {

        const genesisBlock = new Block.Block('Genesis block');
        genesisBlock.height = 0;
        genesisBlock.time = new Date().getTime().toString().slice(0, -3);
        genesisBlock.hash = SHA256(JSON.stringify(genesisBlock)).toString();

        this.db.addLevelDBData(0, JSON.stringify(genesisBlock).toString()).then((block) => {
          if (block) {
            console.log('Added genesis block: ' + block + '\n');
          }
        }).catch(err => {
          console.log('Error adding genesis block ' + err);
        });
      }
    }).catch(err => {
      console.log('Error getting block height ' + err);
    })

  }

  // Get block height, it is auxiliar method that return the height of the blockchain
  getBlockHeight() {
    // Add your code here
    return new Promise((resolve, reject) => {
      resolve(this.db.getBlocksCount());
    })
  }

  // Add new block
  addBlock(newBlock) {
    // Add your code here
    return new Promise((resolve, reject) => {
      this.getBlockHeight().then(height => {
        if (height) {
          this.getBlock(height - 1).then(previousBlock => {

            newBlock.height = height;
            newBlock.previousBlockHash = JSON.parse(previousBlock).hash;
            newBlock.time = new Date().getTime().toString().slice(0, -3)
            newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

            resolve(this.db.addLevelDBData(height, JSON.stringify(newBlock).toString()));
          }).catch(err => {
            reject(err);
          });
        }
      }).catch(err => {
        reject(err);
      })
    });
  }

  // Get Block By Height
  getBlock(blockHeight) {
    // Add your code here
    return new Promise((resolve, reject) => {
      resolve(this.db.getLevelDBData(blockHeight));
    });
  }

  // Validate if Block is being tampered by Block Height
  validateBlock(blockHeight) {
    // Add your code here
    return new Promise((resolve, reject) => {
      this.getBlock(blockHeight).then(block => {
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
              this.getBlock(i).then(block => {
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

  // Utility Method to Tamper a Block for Test Validation
  // This method is for testing purpose
  _modifyBlock(height, block) {
    return new Promise((resolve, reject) => {
      this.db.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
        resolve(blockModified);
      }).catch((err) => { console.log(err); reject(err) });
    });
  }

}

module.exports.Blockchain = Blockchain;