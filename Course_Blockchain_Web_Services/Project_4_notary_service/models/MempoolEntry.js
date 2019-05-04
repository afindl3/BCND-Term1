/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
const Constants = require('./Constants');

class MempoolEntry {

	constructor(address){
    this.address = address,
    this.requestTimeStamp = new Date().getTime().toString().slice(0,-3),
    this.message = `${address}:${this.requestTimeStamp}:starRegistry`,
    this.validationWindow = Constants.TimeoutRequestsWindowTime/1000,
    this.messageSignatureValid = false
	}
}

module.exports.MempoolEntry = MempoolEntry;