import mongoose from 'mongoose';
import { registerUser, userModel } from '../models/user.js';
import { generateToken } from '../middlewares/auth.js'

/**
 * # Controlador do Registro
 * o controlador do registro é responsável por
 * manipular as informações enviadas pelo cliente
 * para registrar um novo usuário dentro da plataforma.
 */
export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await registerUser(username, email, password);
        res.status(201).json({ 'message': 'Usuário registrado!', 'token': generateToken(user._id) })
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