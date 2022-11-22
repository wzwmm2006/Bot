const { ethers } = require("ethers");
const { getMethodData } = require("./etherscan");
const { Network, Alchemy } = require('alchemy-sdk');
// 微信机器�?
const wechat = require("./wechat_api");

const settings = {
    apiKey: "",
    network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 验证合约是否为ERC721 ERC1155
async function verifyConstract2(tx, provider){
    //let tokenType = alchemy.nft.getContractMetadata(tx);
    alchemy.nft.getContractMetadata(tx.to)
    .then(console.log);
    //console.log(tokenType);
    
}

module.exports = class Watcher{
    _options = {};
    onMint = null;
    _provider = null;

    constructor(options) {
      if (options) {
        Object.assign(this._options, options);
      }
    }

    _provider = new ethers.providers.AlchemyProvider(
        "mainnet",
        "ySSVjvQ8CsFvqxW6TAeDw14XlY9FpZOy"
    );

    async run() {
      const queue = [];
      
      this._provider.on(
        [
          ethers.utils.id("Transfer(address,address,uint256)"),
          ethers.utils.hexZeroPad(ethers.constants.HashZero, 32),
        ],
        (log) => {
          if (log.topics.length == 4 && log.data == "0x") {
            queue.push(log);
          }
        }
      );

      const CONTRACT_CACHE = {};

      while (true) {
        let log = queue.pop();
        if (!log) {
          await sleep(1000);
          continue;
        }

        //if (this.onMint) {
          try {
            const tx = await this._provider.getTransaction(log.transactionHash);
            //console.log(tx.value);
            // 只获取free mint的nft
            if (tx.value.toBigInt() > 0) {
              continue;
            }

            const address = tx.to;  // token合约
            if (!(address in CONTRACT_CACHE)) {
              CONTRACT_CACHE[address] = true;

              // 获取合约metadata
              let metadata = await alchemy.nft.getContractMetadata(tx.to);
              if (metadata.tokenType == "ERC721" || metadata.tokenType === "ERC1155") {
                let gasprice = await alchemy.core.getFeeData();
                console.log(gasprice);

                // 合约函数调用数据
                let msg = "[Free Mint NFT]";
                msg = msg + "\rName :" + metadata.name + "\r[address]:" + metadata.address;
                msg = msg + "\rMint :https://etherscan.io/address/" + metadata.address + "#writeContract";
                msg = msg + "\rOpensea :https://opensea.io/assets/ethereum/ethereum/" + metadata.address;
                msg = msg + "\r-----------------------------------";
                msg = msg + "\rgas :  " + parseInt(gasprice.lastBaseFeePerGas/10**9) +"  "+parseInt(gasprice.maxFeePerGas/10**9);

                console.log(msg);
                wechat.SendMsg(msg);
              }
            }
          } catch (e) {
            console.error("出现异常�? + e);
          }
        //}
      }
    }
  };