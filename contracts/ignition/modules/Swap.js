const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("SwapModule", (m) => {
  const newToken = m.contract("Token");
  const oldToken = m.contract("ExistingToken");
  const tokenSwap = m.contract("TokenSwap", [newToken, oldToken]);

  return { newToken, oldToken, tokenSwap };
});