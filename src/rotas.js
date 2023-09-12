const express = require("express");
const {
  cadastrarUsuario,
  login,
  detalharUsuario,
  editarUsuario,
} = require("./controladores/usuarios");

const { listarCategorias } = require("./controladores/categorias");

const { 
  listarTransacoes,
  detalharTransacao,
  cadastrarTransacao,
  atualizarTranscao,
  excluirTransacao,
  extratoTransacoes
} = require("./controladores/transacoes");

const { verificarToken } = require("./intermediarios/validarLogin");

const router = express();

router.use(verificarToken);

router.post("/usuario", cadastrarUsuario);
router.post("/login", login);
router.get("/usuario", detalharUsuario);
router.put("/usuario", editarUsuario);

router.get("/categorias", listarCategorias);

router.get("/transacoes", listarTransacoes);
router.get("/transacao/:id", detalharTransacao)
router.post("/transacoes", cadastrarTransacao)
router.put("/transacao/:id", atualizarTranscao)
router.delete("/transacao/:id", excluirTransacao)
router.get("/transacao/extrato", extratoTransacoes)


module.exports = router;
