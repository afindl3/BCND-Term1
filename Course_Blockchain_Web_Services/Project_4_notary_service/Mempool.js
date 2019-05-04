/* ===== Mempool Class ==========================
|  Class with a constructor for new mempool 		|
|  ================================================*/
const bitcoinMessage = require('bitcoinjs-message'); 
const MempoolEntry = require('./models/MempoolEntry');
const Constants = require('./models/Constants');

class Mempool {
  
  constructor() {
    this.mempool = [];
    this.mempoolValid = [];
  }

  addRequestValidation(reqBody) {
    let mempoolEntry;
    const index = this.mempool.findIndex(mempoolObj => mempoolObj.address === reqBody.address);
    if (index === -1) {
      // Request does not exist in the mempool - add new request to mempool
      mempoolEntry = new MempoolEntry.MempoolEntry(reqBody.address);
      this.mempool.push(JSON.parse(JSON.stringify(mempoolEntry)));
      setTimeout(() => { 
        this.removeValidationRequest(reqBody.address) 
      }, Constants.TimeoutRequestsWindowTime);
    } else {
      // Request does exist in mempool - update validation window & return existing request
      this.mempool[index].validationWindow = this.calculateValidationWindow(this.mempool[index].requestTimeStamp);
      mempoolEntry = this.mempool[index];
    }
    return mempoolEntry;
  }

  removeValidationRequest(address) {
    // Removes the newly added request from the mempool after 5 minutes
    const index = this.mempool.findIndex(mempoolObj => mempoolObj.address === address);
    if (index !== -1) {
      console.log('Removing request ' + address + ' from the mempool');
      this.mempool.splice(index, 1);
    } else {
      console.log('Timeout reached for request ' + address + ' however object was already removed from the mempool when added to the blockchain');
    }
    
  }

  calculateValidationWindow(requestTimeStamp) {
    // Calculates the time remaining until the request is automatically removed from the mempool
    const timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestTimeStamp;
    const timeLeft = (Constants.TimeoutRequestsWindowTime/1000) - timeElapse;
    return timeLeft;
  }

  validateRequestByWallet(reqBody) {
    // Find your request in the mempool array by wallet address.
    // Verify your window time & the signature.
    let mempoolEntry;
    const index = this.mempool.findIndex(mempoolObj => mempoolObj.address === reqBody.address);
    if (index !== -1) {
      // Request does exist in the mempool - implies that validation window has not been exceed otherwise the request would have been removed
      const isValid = bitcoinMessage.verify(this.mempool[index].message, this.mempool[index].address, reqBody.signature);
      this.mempool[index].messageSignatureValid = isValid;
      this.mempool[index].validationWindow = this.calculateValidationWindow(this.mempool[index].requestTimeStamp);
      mempoolEntry = this.mempool[index];
    } 
    return mempoolEntry;
  }

  verifyAddressRequest(reqBody) {
    // Verify if the request validation exists and if it is valid.
    let isValid = undefined;
    const index = this.mempool.findIndex(mempoolObj => mempoolObj.address === reqBody.address);
    if (index !== -1) {
      isValid = this.mempool[index].messageSignatureValid;
    }
    return isValid
  }
}

module.exports.Mempool = Mempool;