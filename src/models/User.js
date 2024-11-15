import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";  // Corrección del nombre importado
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

UserSchema.statics.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);  // Corregido a 'bcrypt'
    return bcrypt.hash(password, salt);
};

UserSchema.statics.comparePassword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword);  // Corregido a 'bcrypt'
};

export default model("User", UserSchema);
