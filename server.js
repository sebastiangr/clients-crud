import { Server } from "socket.io";
import { db, dbEvents } from "./src/lib/server/db.ts"; // Importar el archivo db.ts

const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  // Emitir eventos cuando se agregue un nuevo cliente
  socket.on("nuevoCliente", async (cliente) => {
    await db.crearCliente(cliente);
    const clientes = await db.getClientes();
    io.emit("update", clientes);
  });

  // Escuchar eventos de cambios en la base de datos
  dbEvents.on('cliente-creado', async () => {
    const clientes = await db.getClientes();
    io.emit("update", clientes);
    console.log("DB: cliente creado");
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

console.log("Servidor WebSocket escuchando en el puerto 3000");
