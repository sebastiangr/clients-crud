// Importa la clase Server de la librería socket.io
import { Server } from "socket.io"; 
// Importa las funciones db y dbEvents del archivo db.ts
import { db, dbEvents } from "./src/lib/server/db.ts"; 

// Crea una nueva instancia del servidor WebSocket en el puerto 3000 con configuración CORS
const io = new Server(3000, {
  cors: {
    origin: "http://localhost:5173", // Permite solicitudes desde esta URL
    methods: ["GET", "POST"], // Permite estos métodos HTTP
    credentials: true // Permite el uso de credenciales (cookies, headers de autorización, etc.)
  }
});

// Maneja el evento de conexión de un nuevo cliente
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado"); // Muestra un mensaje en la consola cuando un cliente se conecta

  // Emitir eventos cuando se agregue un nuevo cliente
  socket.on("nuevoCliente", async (cliente) => {
    await db.crearCliente(cliente); // Crea un nuevo cliente en la base de datos
    const clientes = await db.getClientes(); // Obtiene la lista actualizada de clientes
    io.emit("update", clientes); // Emite un evento "update" con la lista de clientes a todos los clientes conectados
  });

  // Escuchar eventos de cambios en la base de datos
  dbEvents.on('cliente-creado', async () => {
    const clientes = await db.getClientes(); // Obtiene la lista actualizada de clientes
    io.emit("update", clientes); // Emite un evento "update" con la lista de clientes a todos los clientes conectados
    console.log("DB: cliente creado"); // Muestra un mensaje en la consola cuando se crea un cliente en la base de datos
  });

  // Maneja el evento de desconexión de un cliente
  socket.on("disconnect", () => {
    console.log("Cliente desconectado"); // Muestra un mensaje en la consola cuando un cliente se desconecta
  });
});

console.log("Servidor WebSocket escuchando en el puerto 3000"); // Muestra un mensaje en la consola indicando que el servidor está escuchando en el puerto 3000

/*
Analogía práctica:
Imagina que tienes una tienda física y decides implementar un sistema de notificaciones en tiempo real para tus empleados. Cada vez que un cliente entra a la tienda, se enciende una luz y se muestra un mensaje en una pantalla indicando que hay un nuevo cliente. Si el cliente realiza una compra, se actualiza una lista de clientes en la pantalla para que todos los empleados puedan verla. Además, si un cliente se va de la tienda, se muestra un mensaje indicando que el cliente se ha ido.

En este código, el servidor WebSocket actúa como el sistema de notificaciones en tiempo real. Cuando un cliente se conecta (entra a la tienda), se muestra un mensaje en la consola. Si el cliente envía un evento "nuevoCliente" (realiza una compra), se actualiza la base de datos y se emite un evento "update" con la lista de clientes actualizada para que todos los clientes conectados (empleados) puedan verla. Además, si se crea un cliente en la base de datos desde otra fuente, se emite un evento "update" con la lista de clientes actualizada. Finalmente, si un cliente se desconecta (se va de la tienda), se muestra un mensaje en la consola.
*/
