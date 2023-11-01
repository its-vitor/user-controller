import { registerUser, userModel } from '../models/user.js';
import { generateToken } from '../middlewares/auth.js'

/**
 * Lista de endereços de email válidos.
 */
const emailsValid = new Array(
    "gmail.com", 
    "outlook.com", 
    "yahoo.com", 
    "hotmail.com", 
    "live.com", 
    "msn.com", 
    "terra.com.br", 
    "uol.com.br", 
    "bol.com.br"
);

const isEmailValid = (email) => {
    const domain = email.toLowerCase().split("@");
    if ( domain.lenght !== 2) return false;
    return  /^[a-z0-9._]+$/.test(domain[0]) && emailsValid.includes(domain[1]);
}

/**
 * # Controlador do Registro
 * o controlador do registro é responsável por
 * manipular as informações enviadas pelo cliente
 * para registrar um novo usuário dentro da plataforma.
 */
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        if (isEmailValid(email)) {
            const user = await registerUser(username, email, password);
            res.status(201).json({ 'message': 'Usuário registrado!', 'token': generateToken(user._id) })
        } else {
            res.status(400).json({ 'message': 'Endereço de email inválido.'})
        }
    } catch (error) {
        res.status(500).json({ 'message': 'Servidor em manutenção. Tente novamente mais tarde.'})
    }
};

/**
 * # Controlador de Login
 * o controlador de login é responsável por
 * manipular as informações enviadas pelo cliente
 * para iniciar uma sessão através da geração de um
 * token utilizando jsonwebtoken.
 */
export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await userModel.findOne({email});
    if (!user) res.status(401).json({ message: 'Endereço de email inválido.' });
    if (!await user.isValidPassword(password)) res.status(401).json({ 'message': 'Senha incorreta. Tente novamente' });
    res.status(200).json({ 'message': 'Login realizado com sucesso', 'token': generateToken(user._id) });
};