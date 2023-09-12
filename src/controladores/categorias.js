const pool = require("../config/conexao");

const listarCategorias = async (req, res) => {
    try {
        const categorias = await pool.query("select * from categorias")
        return res.status(200).json(categorias.rows);
    } catch (error) {
        return res.status(500).json({mensagem: "erro interno do servidor"})
    }
};



module.exports = { listarCategorias };
