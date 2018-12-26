const {createHash} = require('crypto')
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')  
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

FAMILY_NAME='carnet'

function hash(v) {
    return createHash('sha512').update(v).digest('hex');
}

class CarnetClient {
    constructor(vehicleNo) {
      const privateKeyStrBuf = this.getUserPriKey(vehicleNo);
      const privateKeyStr = privateKeyStrBuf.toString().trim();
      const context = createContext('secp256k1');
      const privateKey = Secp256k1PrivateKey.fromHex(privateKeyStr);
      this.signer = new CryptoFactory(context).newSigner(privateKey);
      this.publicKey = this.signer.getPublicKey().asHex();
      this.address = hash("carnet").substr(0, 6) + hash(this.publicKey).substr(0, 64);
      console.log("Storing at: " + this.address);
    }
    register(Info) {
      this._wrap_and_send("register", [vehicleNo,claimNo,validity]);
    }
    claim(Info) {
      this._wrap_and_send("deposit", [claimNo,validity,amount,vehicleNo]);
    }

}

getUserPriKey(vehicleNo) 
{
    console.log(vehicleNo);
    console.log("Current working directory is: " + process.cwd());
    var userprivkeyfile = '/root/.sawtooth/keys/'+vehicleNo+'.priv';
    return fs.readFileSync(userprivkeyfile);
  }

  getUserPubKey(vehicleNo) 
  {
    console.log(vehicleNo);
    console.log("Current working directory is: " + process.cwd());
    var userpubkeyfile = '/root/.sawtooth/keys/'+vehicleNo+'.pub';
    return fs.readFileSync(userpubkeyfile);
  }

  _wrap_and_send(action,Info) 
  {
    var payload = ''
    const address = this.address;
    console.log("wrapping for: " + this.address);
    var inputAddressList = [address];
    var outputAddressList = [address];
    if (action === "register") {
  const pubKeyStrBuf = this.getUserPubKey(Info[1]);
      const pubKeyStr = pubKeyStrBuf.toString().trim();
      var toAddress = hash("carnet").substr(0, 6) + hash(pubKeyStr).substr(0, 64);
      inputAddressList.push(toAddress);
      outputAddressList.push(toAddress);
      payload = action+","+Info[0]+","+pubKeyStr;
    } 
    else {
  payload = action+","+Info[0];
    }  
    var enc = new TextEncoder('utf8');
    const payloadBytes = enc.encode(payload);
    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: 'carnet',
    familyVersion: '1.0',
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: this.signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: this.signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes),
    }).finish();
    const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: this.signer.sign(transactionHeaderBytes),
    payload: payloadBytes
    });
    const transactions = [transaction];
    const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: this.signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish();
    const batchSignature = this.signer.sign(batchHeaderBytes);
    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: batchSignature,
      transactions: transactions,
    });
    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish();
    this._send_to_rest_api(batchListBytes);  
  }
  _send_to_rest_api(batchListBytes)
  {
    if (batchListBytes == null) {
      var geturl = 'http://rest-api:8008/state/'+this.address
      console.log("Getting from: " + geturl);
      return fetch(geturl, {
        method: 'GET',
      })
      .then((response) => response.json())
      .then((responseJson) => {
        var data = responseJson.data;
        var vehicleNo = new Buffer(data, 'base64').toString();
        return vehicleNo;
      })

.catch((error) => {
        console.error(error);
      });   
    }
    else{
      fetch('http://rest-api:8008/batches', {
     method: 'POST',
           headers: {
      'Content-Type': 'application/octet-stream'
        },
        body: batchListBytes
  })
  .then((response) => response.json())
  .then((responseJson) => {
        console.log(responseJson);
      })
      .catch((error) => {
     console.error(error);
      });   
    }
  }


module.exports.CarnetClient = CarnetClient;