require("dotenv").config();
const { getLastBlock } = require("./lib");
const block = process.env.BLOCK;
const time = process.env.TIME;

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
  const secondsFromGenesis = parseInt(parseInt(height) * 2);
  const genesisTime = new Date((currentTime - secondsFromGenesis) * 1000);

  if (block != null) {
    const blockNumber = parseInt(block);
    // const blockTime = new Date((currentTime - blockNumber * 2) * 1000);
    const blockTime = new Date(genesisTime.getTime() + blockNumber * 2 * 1000);
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
    const blockNumber = parseInt((currentTime - timeNumber) / 2);

    if (blockNumber < 0) {
      const targetBlock = parseInt(
        (timeNumber - genesisTime.getTime() / 1000) / 2,
      );
      console.log(
        `Time ${time} > Block: ${targetBlock} > Time: ${new Date(time)}`,
      );
    } else {
      const blockTime = new Date(
        genesisTime.getTime() + blockNumber * 2 * 1000,
      );
      console.log(
        `Time ${timeNumber} > Block: ${blockNumber} > Time: ${blockTime}`,
      );
    }
  }
}

main();
