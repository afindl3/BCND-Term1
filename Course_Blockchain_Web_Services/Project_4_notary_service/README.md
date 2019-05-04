# Project #3. Blockchain Web Services

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.

## Testing the project

The file __app.js__ in the root directory has all the code to be able to test the project, please review the comments in the file and test each feature as follows:

1. Run `node app.js` in the terminal to initiate the blockchain.

2. From Postman send a POST request to `http://localhost:8000/requestValidation` to add a new request to the mempool. The payload should be as follows:
```
{
    "address":"1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF"
}
```
and a similar response should be recieved:
```
{
    "message": "Success - request added/exists in mempool",
    "payload": {
        "address": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
        "requestTimeStamp": "1556993712",
        "message": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF:1556993712:starRegistry",
        "validationWindow": 300,
        "messageSignatureValid": false
    }
}
```

3. Use the wallet address and the message returned in Step 2 to generate a signature (Electrum used in this case). From Postman send a POST request to `http://localhost:8000/message-signature/validate` to validate the signature of a request in the mempool. The payload should be as follows:
```
{
	"address":"1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
	"signature":"H8y6HvdQwx5cgdSdw8WarS1DPjj1wFJOHza/oX15rYzKE0qaUJ8ROUNZDvx/NHtgR74APMBxGqMj5xPwjDA8gh0="
}
```
and a similar response should be recieved:
```
{
    "message": "Success - request signature valid",
    "payload": {
        "address": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
        "requestTimeStamp": "1556993712",
        "message": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF:1556993712:starRegistry",
        "validationWindow": 150,
        "messageSignatureValid": true
    }
}
```

4. From Postman send a POST request to `http://localhost:8000/api/block` to add a block to the end of a chain. The payload should be as follows:
```
{
	  "address": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
    "star": {
        "dec": "68° 52' 56.9",
        "ra": "16h 29m 1.0s",
        "story": "The third star found"
    }
}
```
and a similar response should be recieved:
```
{
    "message": "Success - added star data to the blockchain",
    "payload": {
        "hash": "42f6329007f291895015776de1f0701574f3700079d725790973a78bdc1926c0",
        "height": 2,
        "body": {
            "address": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
            "star": {
                "ra": "16h 29m 1.0s",
                "dec": "68° 52' 56.9",
                "storyEncoded": "546865207468697264207374617220666f756e64",
                "storyDecoded": "The third star found"
            }
        },
        "time": "1556993739",
        "previousBlockHash": "561a34a48c83a0838c8baa909bfb6180a58c086f6210653979df06c46355d4bb"
    }
}
```

5. From Postman send a GET request to `http://localhost:8000/stars/height/${blockNumber}` to retrieve block data by block height/number. Should receive a response similar to:
```
{
    "hash": "42f6329007f291895015776de1f0701574f3700079d725790973a78bdc1926c0",
    "height": 2,
    "body": {
        "address": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "storyEncoded": "546865207468697264207374617220666f756e64",
            "storyDecoded": "The third star found"
        }
    },
    "time": "1556993739",
    "previousBlockHash": "561a34a48c83a0838c8baa909bfb6180a58c086f6210653979df06c46355d4bb"
}
```

6. From Postman send a GET request to `http://localhost:8000/stars/hash/${blockHash}` to retrieve block data by block hash. Should receive a response similar to:
```
{
    "hash": "42f6329007f291895015776de1f0701574f3700079d725790973a78bdc1926c0",
    "height": 2,
    "body": {
        "address": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
        "star": {
            "ra": "16h 29m 1.0s",
            "dec": "68° 52' 56.9",
            "storyEncoded": "546865207468697264207374617220666f756e64",
            "storyDecoded": "The third star found"
        }
    },
    "time": "1556993739",
    "previousBlockHash": "561a34a48c83a0838c8baa909bfb6180a58c086f6210653979df06c46355d4bb"
}
```

7. From Postman send a GET request to `http://localhost:8000/stars/address/${address}` to retrieve block data by block wallet address. Note: more than one block may be returned per address. Should receive a response similar to:
```
[
    {
        "hash": "42f6329007f291895015776de1f0701574f3700079d725790973a78bdc1926c0",
        "height": 2,
        "body": {
            "address": "1N1LRUzsn1woSVMGehVsPDc7e9JSv9mzwF",
            "star": {
                "ra": "16h 29m 1.0s",
                "dec": "68° 52' 56.9",
                "storyEncoded": "546865207468697264207374617220666f756e64",
                "storyDecoded": "The third star found"
            }
        },
        "time": "1556993739",
        "previousBlockHash": "561a34a48c83a0838c8baa909bfb6180a58c086f6210653979df06c46355d4bb"
    }
]
```

