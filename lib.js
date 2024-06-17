require("dotenv").config();
const config = require("./config");
const rqst = require("rqst");

function parseUrl(url) {
  const inputInlowercase = url.toLowerCase();
  const urlRegex =
    /^((https|http):\/\/)?(([a-zA-Z0-9-]{1,}\.){1,}([a-zA-Z0-9]{1,63}))(:[0-9]{2,5})?(\/.*)?$/;

  const parsedUrl = {
    protocol: "https",
    path: "/",
    hostname: null,
    port: "443",
  };

  const regexResult = inputInlowercase.match(urlRegex);

  if (regexResult != null) {
    parsedUrl.protocol = regexResult[2] == null ? "https" : regexResult[2];
    parsedUrl.path = regexResult[7] == null ? "/" : regexResult[7];
    parsedUrl.hostname = regexResult[3] == null ? null : regexResult[3];
    parsedUrl.port = regexResult[6] == null ? "" : regexResult[6].slice(1);
  }

  return parsedUrl;
}

async function getLastBlock(url = config.mainnet.rpc, queryMethod = rqst) {
  let query = null;
  try {
    const data = {
      jsonrpc: "2.0",
      method: "icx_getLastBlock",
      id: Math.ceil(Math.random() * 1000),
    };

    const parsedUrl = parseUrl(url);
    query = await queryMethod(
      parsedUrl.path,
      JSON.stringify(data),
      parsedUrl.hostname,
      parsedUrl.protocol == "http" ? false : true,
      parsedUrl.port === "" ? false : parsedUrl.port,
    );

    if (query.error == null) {
      return query.result;
    } else {
      throw new Error(JSON.stringify(query.error));
    }
  } catch (err) {
    console.log(`Error running node request. query: ${JSON.stringify(query)}`);
    throw new Error(err);
  }
}

module.exports = {
  getLastBlock,
};
