let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();
module.exports = class Chainbet {
  
  // Phase 1: Bet Offer Announcement
  static encodePhase1(type, amount, targetAddress) {

    // Set Phase 1 ChainBet payload length
    var pushdatalength = 0x1f // 31 bytes with optional targetAddress
    if(targetAddress == undefined) {
      pushdatalength = 0x0b   // 11 bytes without targetAddress
    }
    
    let script = [
      BITBOX.Script.opcodes.OP_RETURN,
      // pushdata, 4 bytes
      0x04,
      // 4 byte Terab prefix
      0x00,
      0x42,
      0x45,
      0x54,
      BITBOX.Script.opcodes.OP_PUSHDATA1,
      pushdatalength,
      // 1 byte version id
      0x01,
      // 1 byte phase id
      0x01,
      // 1 byte bet type id
      type,
    ];
    
    // add 8 byte amount
    amount = this.amount2Hex(amount)
    amount.forEach((item, index) => {
      script.push(item);
    })

    // add optional 20 byte target address
    if(targetAddress != undefined) {
      // optional 20 byte HASH160 public key hash
      let addr = BITBOX.Crypto.hash160(targetAddress);
      addr.forEach((item, index) => { script.push(item); })
    }

    let encoded = BITBOX.Script.encode(script);
    //let asm = BITBOX.Script.toASM(encoded);
    return encoded;
  } 

  // Phase 2: Bet Participant Acceptance
  static encodePhase2(betTxId, multisigPubKey) {

    // set Phase 2 ChainBet payload length to 67 bytes
    var pushdatalength = 0x43

    let script = [
      BITBOX.Script.opcodes.OP_RETURN,
      // pushdata, 4 bytes
      0x04,
      // 4 byte Terab prefix
      0x00,
      0x42,
      0x45,
      0x54,
      BITBOX.Script.opcodes.OP_PUSHDATA1,
      pushdatalength,
      // 1 byte version id
      0x01,
      // 1 byte phase id
      0x02,
    ];

    // 32 byte betTxId hex
    betTxId = Buffer(betTxId, 'hex')
    betTxId.forEach((item, index) => { script.push(item); })

    // 33 byte participant (Bob) multisig Pub Key hex 
    multisigPubKey = Buffer(multisigPubKey, 'hex')
    multisigPubKey.forEach((item, index) => { script.push(item); })

    return BITBOX.Script.encode(script)
  }

  // Phase 3: Bet Host Funding
  static encodePhase3(betTxId, participantTxId, hostP2SHTxId, hostMultisigPubKey) {
    
    // set Phase 3 ChainBet payload length to 131 bytes
    var pushdatalength = 0x83

    let script = [
      BITBOX.Script.opcodes.OP_RETURN,
      // pushdata, 4 bytes
      0x04,
      // 4 byte prefix
      0x00,
      0x42,
      0x45,
      0x54,
      BITBOX.Script.opcodes.OP_PUSHDATA1,
      pushdatalength,
      // 1 byte version id
      0x01,
      // 1 byte phase id
      0x03,
    ];

    // 32 byte bet tx id
    betTxId = Buffer(betTxId, 'hex')
    betTxId.forEach((item, index) => { script.push(item); })

    // 32 byte participant tx id
    participantTxId = Buffer(participantTxId, 'hex')
    participantTxId.forEach((item, index) => { script.push(item); })

    // 32 byte host P2SH id
    hostP2SHTxId = Buffer(hostP2SHTxId, 'hex')
    hostP2SHTxId.forEach((item, index) => { script.push(item); })

    // 33 byte host (Alice) Multisig Pub Key
    hostMultisigPubKey = Buffer(hostMultisigPubKey, 'hex')
    hostMultisigPubKey.forEach((item, index) => { script.push(item); })

    return BITBOX.Script.encode(script)
  }

    // Phase 4: Bet Participant Funding
    static encodePhase4(betTxId, participantTxId, participantSig1, participantSig2) {

      // set Phase 4 ChainBet payload length to 210 bytes
      var pushdatalength = 0xd2

      let script = [
        BITBOX.Script.opcodes.OP_RETURN,
        // pushdata, 4 bytes
        0x04,
        // 4 byte prefix
        0x00,
        0x42,
        0x45,
        0x54,
        BITBOX.Script.opcodes.OP_PUSHDATA1,
        pushdatalength,
        // 1 byte version id
        0x01,
        // 1 byte phase id
        0x04,
      ];

      // 32 byte bet tx id
      betTxId = Buffer(betTxId, 'hex')
      betTxId.forEach((item, index) => { script.push(item); })

      // 32 byte Participant tx id
      participantTxId = Buffer(participantTxId, 'hex')
      participantTxId.forEach((item, index) => { script.push(item); })

      // 72 byte Participant signature 1
      participantSig1 = Buffer(participantSig1, 'hex')  // TODO: check for padding (71 vs 72 bytes)
      participantSig1.forEach((item, index) => { script.push(item); })

      // 72 byte Participant signature 2
      participantSig2 = Buffer(participantSig2, 'hex')  // TODO: check for padding (71 vs 72 bytes)
      participantSig2.forEach((item, index) => { script.push(item); })

      return BITBOX.Script.encode(script)
    }

    // Phase 5: Funding Transaction
    static encodePhase5() {
      // TODO
    }

    // Phase 6: Bet Participant Resignation
    static encodePhase6(betTxId, secretValue) {

      // set Phase 6 ChainBet payload length to 66 bytes
      var pushdatalength = 0x42
    
      let script = [
        BITBOX.Script.opcodes.OP_RETURN,
        // pushdata, 4 bytes
        0x04,
        // 4 byte prefix
        0x00,
        0x42,
        0x45,
        0x54,
        BITBOX.Script.opcodes.OP_PUSHDATA1,
        pushdatalength,
        // 1 byte version id
        0x01,
        // 1 byte phase id
        0x06,
      ];

      // 32 byte bet txn id
      betTxId = Buffer(betTxId, 'hex')
      betTxId.forEach((item, index) => { script.push(item); })

      // 32 byte Secret value
      secretValue = Buffer(secretValue, 'hex')
      secretValue.forEach((item, index) => { script.push(item); })

      return BITBOX.Script.encode(script)
    }

    // get big-endian hex from satoshis
    static amount2Hex(amount) {
      var hex = amount.toString(16)
      const len = hex.length
      for (let i = 0; i < 16 - len; i++) {
        hex = '0' + hex;
      }
      let buf = Buffer.from(hex, 'hex')
      return buf
    }

    static decode(op_return) {
      let data = op_return.split("00424554");
      let buf = Buffer.from(data[1].trim(), 'hex');
      let version = buf[0];
      let phase = buf[1];
      let results = { version: version, phase: phase };
      if(phase === 0x01) {
        // type
        results.type = buf[2];
        // amount
        results.amount = parseInt(buf.slice(3,11).toString('hex'), 16);
        // // target address
        if (buf.length > 11)
            results.address = buf.slice(11).toString('hex');
      } else if(phase === 0x02) {
        // Bet Txn Id
        results.betTxId = buf.slice(2, 34).toString('hex');
        // Multi-sig Pub Key
        results.multisigPubKey = buf.slice(34).toString('hex');
      } else if(phase === 0x03) {
        // 32 byte Bet Txn Id
        results.betTxId = buf.slice(2, 34).toString('hex');
        // 32 byte Participant Txn Id
        results.participantTxId = buf.slice(34, 66).toString('hex');
        // 32 byte Host P2SH txid
        results.hostP2SHId = buf.slice(66, 98).toString('hex');
        // 33 byte Host (Alice) multsig pubkey
        results.hostMultisigPubKey = buf.slice(98).toString('hex');
      } else if(phase === 0x04) {
        // 32 byte Bet Txn Id
        results.betTxId = buf.slice(2, 34).toString('hex');
        // 32 byte Participant Txn Id
        results.participantTxId = buf.slice(34, 66).toString('hex');
        // 72 byte Participant Signature 1
        results.participantSig1 = buf.slice(66, 138).toString('hex');
        // 72 byte Participant Signature 2
        results.participantSig2 = buf.slice(138).toString('hex');
      } else if(phase === 0x05) {
      } else if(phase === 0x06) {
        // 32 byte Bet Txn Id
        results.betTxId = buf.slice(2, 34).toString('hex');
        // 32 byte Secret Value
        results.secretValue = buf.slice(34, 66).toString('hex');
      }
      return results;
    }
  }