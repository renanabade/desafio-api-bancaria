const jwt = require("jsonwebtoken");

const verificarToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    tokenUsuarioLogado = jwt.verify(token, "secret");
    next();
  } catch (error) {
    return res.status(400).json({
      mensagem:
        "Para acessar este recurso um token de autenticação válido deve ser enviado.",
    });
  }
};

module.exports = { verificarToken };
