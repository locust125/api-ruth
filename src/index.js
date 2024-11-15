import app from "./app.js"; // Importa tu aplicación Express
import { port } from "./config.js"; // Importa la configuración del puerto
import { connectToDB } from "./db.js"; // Importa la función para conectar a la base de datos

// Función principal para inicializar la aplicación
async function main() {
  try {
    console.log("Starting the server...");

    // Conectar a la base de datos
    console.log("Connecting to the database...");
    await connectToDB();
    console.log("Database connected successfully!");

    // Iniciar el servidor en el puerto asignado o el predeterminado
    const serverPort = process.env.PORT || port;
    app.listen(serverPort, () => {
      console.log(`Server running on port ${serverPort}`);
      console.log(`http://localhost:${serverPort}/`);
    });
  } catch (error) {
    console.error("An error occurred while starting the server:", error);
    process.exit(1); // Termina el proceso si ocurre un error crítico
  }
}

// Ejecutar la función principal
main();
