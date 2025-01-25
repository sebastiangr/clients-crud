import { Server } from "socket.io";
import { db, dbEvents } from "../server/db"; // Importar el archivo db sin la extensión

/**
 * Creates a new instance of the Server class listening on port 3000.
 * 
 * @param {number} port - The port number on which the server will listen for incoming connections.
 * @param {object} options - Configuration options for the server.
 * @param {object} options.cors - Configuration options for Cross-Origin Resource Sharing (CORS).
 * @param {string} options.cors.origin - Specifies the origin that is allowed to access the server.
 * @param {string[]} options.cors.methods - Specifies the HTTP methods that are allowed when accessing the server.
 * @param {boolean} options.cors.credentials - Indicates whether or not the server supports credentials in CORS requests.
 * 
 * This code initializes a new Socket.IO server that listens on port 3000. It also configures CORS settings to allow
 * requests from "http://localhost:5173" using GET and POST methods, and it supports credentials in CORS requests.
 * 
 * Example usage:
 * 
 * This setup is useful for creating a real-time communication server that can be accessed from a client application
 * running on "http://localhost:5173". The server can handle WebSocket connections and facilitate real-time data exchange
 * between the client and the server.
 */
const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Mover la lógica de suscripción a eventos fuera de la conexión
dbEvents.on('cliente-creado', async () => {
  console.log("Evento socket: cliente creado");
  const clientes = await db.getClientes();
  io.emit("update", clientes);
});

dbEvents.on('cliente-actualizado', async () => {
  console.log("Evento socket: cliente actualizado");
  const clientes = await db.getClientes();
  io.emit("update", clientes);
});

dbEvents.on('cliente-eliminado', async () => {
  console.log("Evento socket: cliente eliminado");
  const clientes = await db.getClientes();
  io.emit("update", clientes);
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Emitir eventos cuando se agregue un nuevo cliente
  socket.on("nuevoCliente", async (cliente) => {
    await db.crearCliente(cliente);
    const clientes = await db.getClientes();
    io.emit("update", clientes);
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

export default io;
