import { Schema, model } from "mongoose";
import crypto from "crypto"; // Usamos el módulo integrado de Node.js
import mongoosePaginate from "mongoose-paginate-v2";

export const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
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
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

UserSchema.plugin(mongoosePaginate);

// Función para encriptar contraseñas manualmente
UserSchema.statics.encryptPassword = async (password) => {
    const salt = crypto.randomBytes(16).toString("hex"); // Generar un salt único
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512") // Generar hash con el salt
        .toString("hex");
    return `${salt}:${hash}`; // Concatenar salt y hash
};

// Función para comparar contraseñas
UserSchema.statics.comparePassword = async (password, storedPassword) => {
    const [salt, originalHash] = storedPassword.split(":"); // Separar salt y hash
    const hash = crypto
        .pbkdf2Sync(password, salt, 1000, 64, "sha512") // Recalcular el hash
        .toString("hex");
    return hash === originalHash; // Comparar el hash recalculado con el almacenado
};

export default model("User", UserSchema);
