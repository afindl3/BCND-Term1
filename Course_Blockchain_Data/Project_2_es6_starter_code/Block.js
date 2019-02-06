/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data){
		// Add your Block properties
    // Example: this.hash = "";
    this.hash = "",
    this.height = "",
    this.body = data,
    this.time = "",
    this.previousBlockHash = ""
	}
}

module.exports.Block = Block;