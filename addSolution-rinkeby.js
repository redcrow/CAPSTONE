const zokratesProof = require("./zokrates/code/square/proof.json");
const Web3 = require('web3');
let web3 = new Web3('https://rinkeby.infura.io/v3/c12065cb244243f7887b7db0e6738987');

const contract = require("./eth-contracts/build/contracts/SolnSquareVerifier.json");
const contractAddress = "0x22857783E706e1236aBa5E711F1469515B305027";
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
const privateKey = "...SECRET...";
const publicKey = "0x11FfFC1d7a623833b878AD38e0DBf8fBE2a41E1c";

//nftContract.methods.symbol().call().then(console.log);

web3.eth.defaultAccount = publicKey;
console.log(web3.eth.defaultAccount);

async function addSolution() {
  const nonce = await web3.eth.getTransactionCount(publicKey, 'latest'); //get latest nonce
  console.log(nonce);
  //the transaction
  const tx = {
    'from': publicKey,
    'to': contractAddress,
    'nonce': nonce,
    'gas': 500000,
    'maxPriorityFeePerGas': 1999999987,
    'data': nftContract.methods.addSolution(1, "0x11FfFC1d7a623833b878AD38e0DBf8fBE2a41E1c", ["0x206bcaab629f7ecb23ef7c02474d25fafc1067a759ed2f5aafdc1c3187760b77","0x0035b086196d470e9fd03e4da9f62808cbf8eba20e79e228f5aa177bc1fa9ecb"], [["0x1337b218f8b67caf5fde362792c2b7a4d74443d11c3697847f4d1ae8c8c21513", "0x090ef1e2a05b0f0e94dcfaa9001683baf5bf6d6b7adf481c3badc9c690eaafda"], ["0x1d653a7a9fd2f00d92960fdea450ef4c5ee58899616e1229f1d5c2bf36536780", "0x29d6c1d2106fd595621fb31a13036be636d7f26c4bca9ce050947e063c1e702d"]], ["0x214ec356c4f60570b068071339766e501fdab5b00093abb620f6d218ba179f32", "0x10aa76bd6abdcc8cfe6e88e5bd8d46084a174cc0ac3385d244c62ef3071125df"], ["0x0000000000000000000000000000000000000000000000000000000000000009", "0x0000000000000000000000000000000000000000000000000000000000000001"]).encodeABI()
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

addSolution();