/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key
  getLevelDBDataByHeight(key) {
    let self = this;
    return new Promise(function (resolve, reject) {
      // Add your code here, remember in Promises you need to resolve() or reject()
      self.db.get(key, function (err, value) {
        if (err) {
          if (err.type == 'NotFoundError') {
            resolve(undefined);
          } else {
            reject(err);
          }
        } else {
          resolve(value);
        }
      })
    });
  }

  // Get data from levelDB with hash
  getLevelDBDataByHash(hash) {
    let self = this;
    let block = null;
    return new Promise(function (resolve, reject) {
      self.db.createReadStream()
        .on('data', function (data) {
          if (JSON.parse(data.value).hash === hash) {
            block = data.value;
          }
        })
        .on('error', function (err) {
          reject(err)
        })
        .on('close', function () {
          resolve(block);
        });
    });
  }

  getLevelDBDataByWalletAddress(walletAddress) {
    let self = this;
    let blocks = [];
    return new Promise(function (resolve, reject) {
      self.db.createReadStream()
        .on('data', function (data) {
          if (JSON.parse(data.value).body.address === walletAddress) {
            blocks.push(JSON.parse(data.value));
          }
        })
        .on('error', function (err) {
          reject(err)
        })
        .on('close', function () {
          resolve(blocks);
        });
    });
  }

  // Add data to levelDB with key and value 
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function (resolve, reject) {
      // Add your code here, remember un Promises you need to resolve() or reject() 
      self.db.put(key, value, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      })
    });
  }

  // Method that return the height
  getBlocksCount() {
    let self = this;
    return new Promise((resolve, reject) => {
      // Add your code here, remember in Promises you need to resolve() or reject()
      let count = 0;
      self.db.createKeyStream()
        .on('data', (data) => {
          count++;
        })
        .on('error', (err) => {
          reject(err);
        })
        .on('close', () => {
          resolve(count);
        })
    });
  }

}

module.exports.LevelSandbox = LevelSandbox;