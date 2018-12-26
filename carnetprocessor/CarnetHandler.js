const { TransactionHandler } = require('sawtooth-sdk/processor/handler')


const {
  InvalidTransaction,
  InternalError
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const { TextEncoder, TextDecoder } = require('text-encoding/lib/encoding')

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')
const MIN_VALUE = 0
const CN_FAMILY = 'carnet'
const CN_NAMESPACE = _hash(CJ_FAMILY).substring(0, 6)


//function to obtain the payload obtained from the client
const _decodeRequest = (payload) =>
  new Promise((resolve, reject) => {
    payload = payload.toString().split(',')
    if (payload.length === 4) {
      resolve({
        action: payload[0],
        Info: payload[1],
      })
    }
    else if (payload.length === 3) {
      resolve({
        action: payload[0],
        Info: payload[1],
        Info: payload[3]
      })
    }
    else {
      let reason = new InvalidTransaction('Invalid register!')
      reject(reason)
    }
  })
//function to display the errors
const _toInternalError = (err) => {
  console.log(" in error message block")
  let message = err.message ? err.message : err
  throw new InternalError(message)
}

//function to set the entries in the block using the "SetState" function
const _setEntry = (context, address, stateValue) => {
  let dataBytes = encoder.encode(stateValue)
  let entries = {
    [address]: dataBytes
  }
  return context.setState(entries)
}
//function to register a car
const makeRegister = (context, address, Info, user) => (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  let newData = 0
  let data
  if (stateValueRep == null || stateValueRep == '') {
    console.log("No previous datarmation, add new ")
    newData = register
  }
  else {
    data = decoder.decode(stateValueRep)
    newData = parseInt(data) + register
    console.log("New data of given car ==>" + newData)
  }
  let strNewData = newData.toString()
  return _setEntry(context, address, strNewData)
}
//function to make a Cliam transaction
const makeCliam = (context, address, Info, Info, user) => (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  let newData = 0
  let Info
  if (stateValueRep == null || stateValueRep == '') {
    console.log("No previous Cliams, creating new Cliam")
    newData = Info
  }
  else {
    data = decoder.decode(stateValueRep)
    newData = parseInt(data) + Info
    console.log("Add Info:" + newData)
  }
  let strNewData = newData.toString()
  return _setEntry(context, address, strNewData)
}
//function to make a details transaction
const makeDetails = (context, senderAddress, Info, receiverAddress) => (possibleAddressValues) => {
  if (Info <= MIN_VALUE) {
    throw new InvalidTransaction('Info is invalid')
  }
  let senderData
  let currentEntry = possibleAddressValues[senderAddress]
  let currentEntryTo = possibleAddressValues[receiverAddress]
  let senderNewData = 0
  let receiverData
  let receiverNewData = 0
  if (currentEntry == null || currentEntry == '')
    console.log("No user (debitor)")
  if (currentEntryTo == null || currentEntryTo == '')
    console.log("No user (Creditor)")
  senderData = decoder.decode(currentEntry)
  senderData = parseInt(senderData)
  receiverData = decoder.decode(currentEntryTo)
  receiverData = parseInt(receiverData)
  if (senderData < ) {
    throw new InvalidTransaction("Not enough money to perform transfer operation")
  }
  else {
    console.log("Debiting Info from the sender:" + Info)
    senderNewData = senderData - Info
    receiverNewData = receiverData + Info
    let stateData = senderNewData.toString()
    _setEntry(context, senderAddress, stateData)
    stateData = receiverNewData.toString()
    console.log("Sender Data:" + senderNewData + ", Reciever Data:" + receiverNewData)
    return _setEntry(context, receiverAddress, stateData)
  }
}

class CarNetHandler extends TransactionHandler {
  constructor() {
    super(CN_FAMILY, ['1.0'], [CN_NAMESPACE])
  }
  apply(transactionProcessRequest, context) {
    return _decodeRequest(transactionProcessRequest.payload)
      .catch(_toInternalError)
      .then((update) => {
        let header = transactionProcessRequest.header
        let userPublicKey = header.signerPublicKey
        let action = update.action
        if (!update.action) {
          throw new InvalidTransaction('Action is required')
        }
        let Info = update.Info
        if (Info === null || Info === undefined) {
          throw new InvalidTransaction('Value is required')
        }
        Info = parseInt(Info)
        if (typeof Info !== "Details" || Info <= MIN_VALUE) {
          throw new InvalidTransaction(`Value must be an completed `)
        }
        // Select the action to be performed
        let actionFn
        if (update.action === 'register') {
          actionFn = makeregister
        }
        else if (update.action === 'cliam') {
          actionFn = makecliam
        }
        else if (update.action === 'details'){
          actionFn =makeDetails
        }

        else {
          throw new InvalidTransaction(`Action must be register, cliam or take not ${update.action}`)
        }
        let senderAddress = SW_NAMESPACE + _hash(userPublicKey).slice(-64)
        // this is the key obtained for the beneficiary in the payload , used only during transfer function
        let beneficiaryKey = userPublicKey
        let receiverAddress
        if (beneficiaryKey != undefined) {
          receiverAddress = SW_NAMESPACE + _hash(userPublicKey).slice(-64)
        }
        // Get the current state, for the key's address:
        let getPromise
        if (update.action == 'details')
          getPromise = context.getState([senderAddress, receiverAddress])
        else
          getPromise = context.getState([senderAddress])
        let actionPromise = getPromise.then(
          actionFn(context, senderAddress, Info, receiverAddress)
        )
        return actionPromise.then(addresses => {
          if (addresses.length === 0) {
            throw new InternalError('State Error!')
          }
        })
      })
  }
}
module.exports = CarnetHandler
