/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level');
const chainDB = './chaindata';

class LevelSandbox {

  constructor() {
    this.db = level(chainDB);
  }

  // Get data from levelDB with key (Promise)
  getLevelDBData(key) {
    let self = this;
    return new Promise(function (resolve, reject) {
      // Add your code here, remember un Promises you need to resolve() or reject()

      // 3) Fetch by key
      self.db.get(key, function (err, value) {
        if (err) {
          console.log('Ooops! ' + err) // likely the key was not found
          reject(err);
        } else {
          resolve(value);
        }
      })

    });
  }

  // Add data to levelDB with key and value (Promise)
  addLevelDBData(key, value) {
    let self = this;
    return new Promise(function (resolve, reject) {
      // Add your code here, remember un Promises you need to resolve() or reject() 

      // 2) Put a key & value
      self.db.put(key, value, function (err) {
        if (err) {
          console.log('Block ' + key + ' submission failed' + err); // some kind of I/O error
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
      // Add your code here, remember un Promises you need to resolve() or reject()
      let count = 0;

      self.db.createKeyStream()
        .on('data', (data) => {
          count++;
        })
        .on('error', (err) => {
          console.log('LevelDB error... ', err)
          reject(err);
        })
        .on('close', () => {
          resolve(count);
        })
    });
  }

}

module.exports.LevelSandbox = LevelSandbox;