import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * # Geração de Tokens
 * todo e qualquer sistema que se preze possui um sistema de
 * tokens. Bom, no meu sistema não seria diferente. Escolhi
 * que eles expirem em sete dias, para evitar que tokens
 * de acesso sejam capturados e, mais tarde, utilizados para
 * furto de informações, nesse caso, contas.
 * @param {*} userId - Pode ser tanto um `objectId` quanto uma `string`.
 * @returns 
 */
export function generateToken(userId) {
    if (typeof userId !== 'string') return jwt.sign({'_id': JSON.stringify(userId)}, process.env.TOKEN, { expiresIn: '7d'});
    else return jwt.sign({'_id': userId}, process.env.TOKEN, { expiresIn: '7d'})
}

/**
 * # Validação de Tokens
 * Essa função é responsável por realizar a verificação
 * do token. Ela valida se ele é ou não válido para
 * prosseguir dentro da aplicação.
 * @param {*} req - Corpo da requisição do cliente.
 * @param {*} res - Resposta do host parao cliente.
 * @param {*} next - Realiza o callback da rota.
 * @returns 
 */
export function validateToken(req, res, next) {
    const auth = req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if (!auth || !token) return res.status(404).send('Ocorreu um erro ao validar sua sessão.');

    jwt.verify(token, process.env.TOKEN, (err, user) => {
        if (err) return res.status(405).send('Seu token está expirado.');
        req.user = user;
        next();
    });
}