import express from "express";
import morgan from "morgan";
import cors from "cors";

// blog
import login from "./routes/login.routes.js"
import  User from "./routes/user.routes.js";
import events from "./routes/event.routes.js";
const app = express();

app.use(cors());
app.use(morgan("dev")); 
app.use(express.json());


app.use(login);
app.use(events);

app.use(User);

app.use((req, res) => {
    res.status(404).json("Ruta no encontrada");
});

export default app;
