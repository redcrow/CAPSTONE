const Web3 = require('web3');
let web3 = new Web3('https://rinkeby.infura.io/v3/c12065cb244243f7887b7db0e6738987');

const contract = require("./eth-contracts/build/contracts/SolnSquareVerifier.json");
const contractAddress = "0x22857783E706e1236aBa5E711F1469515B305027";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
const privateKey = "...";
const publicKey = "0x11FfFC1d7a623833b878AD38e0DBf8fBE2a41E1c";

//nftContract.methods.symbol().call().then(console.log);

web3.eth.defaultAccount = publicKey;
console.log(web3.eth.defaultAccount);

async function mint() {
  const nonce = await web3.eth.getTransactionCount(publicKey, 'latest'); //get latest nonce
  console.log(nonce);
  //the transaction
  const tx = {
    'from': publicKey,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'maxPriorityFeePerGas': 1999999987,
    'data': nftContract.methods.mint("0x7Fd8AD419dbDe17cD6673c03Eb7D671cE125C955", 1).encodeABI()
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, privateKey);
  signPromise.then((signedTx) => {

    web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(err, hash) {
      if (!err) {
        console.log("The hash of your transaction is: ", hash, "\nCheck Alchemy's Mempool to view the status of your transaction!"); 
      } else {
        console.log("Something went wrong when submitting your transaction:", err)
      }
    });
  }).catch((err) => {
    console.log("Promise failed:", err);
  });
}

mint();