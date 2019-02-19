# Project #3. Blockchain Web Services

## Setup project for Review.

To setup the project for review do the following:
1. Download the project.
2. Run command __npm install__ to install the project dependencies.
3. Run command __node app.js__ in the root directory.

## Testing the project

The file __app.js__ in the root directory has all the code to be able to test the project, please review the comments in the file and test each feature as follows:

* Run `node app.js` in the terminal to initiate the blcokchain with mock data. This command should create 5 blocks which will print in the terminal.

* From Postman send a GET request to `http://localhost:8000/api/block/${blockNumber}` to retrieve the data associated with a specified block. Should receive a response similar to:
```
{
    "hash": "2fba92a9d54f41eb702f690f638d5082a83545a76dc35321fe93a78f1e937fe3",
    "height": 3,
    "body": "Test Block - 3",
    "time": "1550591306",
    "previousBlockHash": "f787b9ee7adab30e6d3e2eddaedae905584ff2a60786c4f1818a3c365e84a386"
}
```
* From Postman send a POST request to `http://localhost:8000/api/block` to add a block to the end of a chain. The payload should be as follows:
```
{
    "data":"Some data example"
}
```
and a similar response should be recieved:
```
{
    "hash": "aeae90ba4cb9b7522f54cc18ac9833bf9415e3d7e7e23b9b66ab7c85a41b61ab",
    "height": 6,
    "body": "Some data example",
    "time": "1550592947",
    "previousBlockHash": "237bb98b4baab3c0a6266cf4e46698d10283105a4a71a8aa7539d7710cf7ea13"
}
```

