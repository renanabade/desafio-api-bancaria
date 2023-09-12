const jwt = require("jsonwebtoken");

//função que resgata os dados do token mandados no header
async function resgatarIdPorToken(bearerToken) {
  const token = bearerToken.split(" ")[1];
  const dadosToken = jwt.verify(token, "secret");
  return dadosToken;
}

module.exports = { resgatarIdPorToken };
