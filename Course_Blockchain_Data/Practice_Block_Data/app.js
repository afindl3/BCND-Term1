/**
 * Importing BlockExplorer API to search Block Data
 */
const be = require('blockexplorer');

/**
 *  Explore Block Data function
 * @param {*} index 
 * 
 * Start by requesting the hash then request the block and use console.log()
 * 
 */
function getBlock(index) {
  	//add your code here
  	be.blockIndex(index).then(blockHash => {
      console.log(blockHash);
      console.log(JSON.parse(blockHash));
      
      let hashAux = JSON.parse(blockHash).blockHash;
      console.log(hashAux + '\n');
      
      be.block(hashAux).then(blockInfo => {
        console.log(blockInfo + '\n');
      }).catch(err => {
        console.log('CAUGHT ERR 2')
        throw err
      })
    }).catch(err => {
      console.log('CAUGHT ERR 1')
      throw err
    })
}

/**
 * Function to execute the `getBlock(index)` function
 * Nothing to implement here.
 */

(function theLoop (i) {
	setTimeout(function () {
        console.log('CALLING GET BLOCK');
        getBlock(i);
        i++;
		if (i < 3) theLoop(i);
	}, 5000);
  })(0);