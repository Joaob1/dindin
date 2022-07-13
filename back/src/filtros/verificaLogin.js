const conexao = require("../conexao");
const jwt = require("jsonwebtoken");
const segredo = require('../segredo');


const verificaLogin = async (req, res, next) => {
    const { authorization: bearerToken } = req.headers
    if (!bearerToken) {
        return res.status(401).json('Token não informado');
    }
    try {
        const tokenSplit = bearerToken.split(' ');
        if (tokenSplit.length < 2) {
            return res.status(401).json({ "mensagem": "Token Inválido" })
        }
        const token = tokenSplit[1];
        if (tokenSplit[0] !== 'Bearer') {
            return res.status(401).json({ "mensagem": "Token Inválido" })
        }
        const verificarToken = await jwt.verify(token, segredo);
        if (!verificarToken) {
            return res.status(401).json('Token inválido');
        }
        const usuario = await conexao.query('SELECT * FROM usuarios WHERE ID = $1', [verificarToken.id]);
        if (usuario.rowCount === 0) {
            return res.status(500).json('Erro de servidor');
        }
        next();
    } catch (error) {
        return res.status(500).json(error.message);
    }
}

module.exports = verificaLogin;