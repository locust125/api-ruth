import User from "../models/User.js";


export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Verifica si se proporciona una nueva contraseña en la solicitud
        if (req.body.password) {
            // Encripta la nueva contraseña
            req.body.password = await User.encryptPassword(req.body.password);
        }

        const updateUser = await User.findByIdAndUpdate(id, req.body, {
            new: true,
        });
        if (!updateUser)
            return res.status(404).send({ message: "Id not found" });

        const response = {
            data: updateUser,
        };
        res.status(200).json(response);
    } catch (error) {
        if (error instanceof mongoose.Error.CastError)
            return res.status(400).send({ message: "Invalid Id" });
        return res.status(500).send("Something went wrong");
    }
};