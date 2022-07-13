const jwt = require('jsonwebtoken');
const segredo = require('../segredo');

const verificarToken = async (bearerToken) => {
    if (!bearerToken) {
        return res.status(401).json({ "mensagem": "Token não fornecido" })
    }
    const tokenSplit = bearerToken.split(' ');
    if (tokenSplit[0] !== 'Bearer') {
        return res.status(401).json({ "mensagem": "Token Inválido" })
    }
    if (tokenSplit.length < 2) {
        return res.status(401).json({ "mensagem": "Token Inválido" })
    }
    const token = tokenSplit[1];
    const tokenVerificado = await jwt.verify(token, segredo);
    return tokenVerificado;
}

module.exports = verificarToken;