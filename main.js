require("dotenv").config();
const { getLastBlock } = require("./lib");
const block = process.env.BLOCK;
const time = process.env.TIME;
// const secondsPerBlock = 2.3940387069264473;
const secondsPerBlock = 2.00378;

async function main() {
  if (block == null && time == null) {
    console.log("Please provide a block number or time");
    return;
  }
  if (block != null && time != null) {
    console.log("Please provide only one of block number or time");
    return;
  }

  const lastBlock = await getLastBlock();
  const { height } = lastBlock;
  console.log(`Current block: ${height}`);

  const currentTime = parseInt(new Date().getTime() / 1000);
  const secondsFromGenesis = parseInt(parseInt(height) * secondsPerBlock);
  const genesisTime = new Date((currentTime - secondsFromGenesis) * 1000);

  if (block != null) {
    const blockNumber = parseInt(block);
    // const blockTime = new Date((currentTime - blockNumber * 2) * 1000);
    const blockTime = new Date(
      genesisTime.getTime() + blockNumber * secondsPerBlock * 1000,
    );
    console.log(`Block ${blockNumber} > Time: ${blockTime}`);
  }

  if (time != null) {
    let timeNumber = parseInt(time);

    if (Number.isNaN(timeNumber)) {
      try {
        const timeDate = new Date(time);
        timeNumber = parseInt(timeDate.getTime() / 1000);
      } catch (err) {
        console.log("Invalid time format");
        console.log(err);
      }
    }
    const blockNumber = parseInt((currentTime - timeNumber) / secondsPerBlock);

    if (blockNumber < 0) {
      const targetBlock = parseInt(
        (timeNumber - genesisTime.getTime() / 1000) / secondsPerBlock,
      );
      console.log(
        `Time ${timeNumber} > Block: ${targetBlock} > Time: ${new Date(time)}`,
      );
    } else {
      const blockNumber2 = height - blockNumber;
      const blockTime = new Date(
        genesisTime.getTime() + blockNumber2 * secondsPerBlock * 1000,
      );
      console.log(
        `Time ${timeNumber} > Block: ${blockNumber2} > Time: ${blockTime}`,
      );
    }
  }
}

main();
