import { Server } from "socket.io";
import { db, dbEvents } from "../server/db"; // Importar el archivo db sin la extensión

const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Mover la lógica de suscripción a eventos fuera de la conexión
dbEvents.on('cliente-creado', async () => {
  console.log("Evento: cliente creado");
  const clientes = await db.getClientes();
  io.emit("update", clientes);
});

dbEvents.on('cliente-actualizado', async () => {
  console.log("Evento: cliente actualizado");
  const clientes = await db.getClientes();
  io.emit("update", clientes);
});

dbEvents.on('cliente-eliminado', async () => {
  console.log("Evento: cliente eliminado");
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
