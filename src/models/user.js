import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

function createUserModel() {
    /**
     * Declaração do esquema da entidade usuário.
     */
    const user = new mongoose.Schema({
        nickname: {
            type: String,
            required: true,
            // nickname ou nome do usuário
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    });


    /**
     * Evento que é executado quando algum dado é salvo no banco de dados.
     * Ele criptografa a senha utilizando função de callback.
     * 
     * @event `this.isModified` verifica se o dicionário inserido é novo.
     */
    user.pre('save', function(next) {
        if (this.isModified('password')) this.password = bcrypt.hashSync(this.password, 10);
        next();
    });


    /**
     * Retorna uma comparação entre a senha não criptografada com aquela
     * que passou pela etapa hash.
     * @param {string} password - Senha como string
     * @returns 
     */
    user.methods.isValidPassword = function(password) {
        return bcrypt.compare(password, this.password);
    };

    return mongoose.model('User', user, 'Accounts');
}


/**
 * Criação do modelo do usuário.
 */
export const userModel = createUserModel();

export const registerUser = async (username, email, password) => {
    return await new userModel({username, email, password}).save()
};
