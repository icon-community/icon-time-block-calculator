require("dotenv").config();
const {
  getLastBlock,
  findBlockGivenTime,
  findTimeGivenBlock,
} = require("./lib");
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

  if (block != null) {
    const blockNumber = parseInt(block);
    const unixTime = findTimeGivenBlock(blockNumber);
    const blockTime = new Date(unixTime * 1000);
    console.log(`Block ${blockNumber} > Time: ${unixTime} (${blockTime})`);
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
    const blockResult = findBlockGivenTime(timeNumber);
    console.log(
      `Time ${timeNumber} (${new Date(timeNumber * 1000)}) > Block: ${blockResult}`,
    );
  }
}

main();
