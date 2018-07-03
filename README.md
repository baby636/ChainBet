## Node.js implementation of the Bitcoin Cash ChainBet protocol

This repo contains a node.js implementation of the ChainBet protocol. The specification of the ChainBet protocol is here: [https://github.com/fyookball/ChainBet](https://github.com/fyookball/ChainBet).  An example program (coinflip.js) and a npm package are provided to demonstrate how to use the npm package.

## Coinflip.js Example

The following coinflip.js example shows a simple command-line program which facilitates a trustless p2p coin flip bet on the Bitcoin Cash blockchain using the ChainBet npm package.  Running this example requires that at least one player is already running the program in "client mode" before another player uses "host mode" to announce a coin flip bet wager.

 1. install node.js (v8.11.3 or later)
 2. `git clone https://github.com/jcramer/chainbet`
 3. `cd chainbet/examples`
 4. `npm install`
 5. `node coinflip`

### CoinFlip Winner
![CoinFlip Winner](https://github.com/jcramer/chainbet/blob/master/examples/images/Coin%20Flip%20Winner.png?raw=true)

### CoinFlip Loser
![CoinFlip Loser](https://github.com/jcramer/chainbet/blob/master/examples/images/Coin%20Flip%20Loser.png?raw=true)

## Dev Usage

```js
let chainbet = require('chainbet');

// 1) Create Script Buffer object for any phase
chainbet.Host.encodePhase1Message(0x01, 1000, 'bitcoincash:qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c');
// <Buffer 6a 04 54 45 42 00 02 01 00 02 01 00 02 01 00 02 01 00 05 31 32 33 34 35 36 62 69 74 63 6f 69 6e 63 61 73 68 3a 71 7a 73 30 32 76 30 35 6c 37 71 73 35 ... >

// 2) Decode Script Hex for any ChainBet phase
let scriptHex = Buffer('01010100000000000003e81111111111111111111111111111111111111111a0f531f4ff810a415580c12e54a7072946bb927e');
chainbet.Core.decodePhaseData(scriptHex);

// { phase: 1,
//   type: 1,
//   amount: 1000,
//   hostCommitment: 11111111111111111111
//   address: 'bitcoincash:qzs02v05l7qs5s24srqju498qu55dwuj0cx5ehjm2c' }

```
