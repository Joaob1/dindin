const conexao = require("../conexao");
const verificarToken = require("../filtros/verificarToken");

const listarCategorias = async (req, res) => {
    const token = await verificarToken(req.headers.authorization);
    try {
        const { rows: categorias } = await conexao.query("SELECT * FROM categorias");
        return res.status(200).json(categorias);
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = {
    listarCategorias
};