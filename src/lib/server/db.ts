import { PrismaClient } from '@prisma/client';
import { EventEmitter } from 'events';
import pkg from 'pg'; // Importar el cliente de PostgreSQL
const { Client } = pkg; // Desestructurar el cliente

// Crear un emisor de eventos global
export const dbEvents = new EventEmitter();

// Crear una instancia de PrismaClient para interactuar con la base de datos
const prisma = new PrismaClient();
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Asegúrate de que la URL de conexión sea correcta
});

client.connect();

// Escuchar notificaciones del canal 'cliente_changes'
client.on('notification', async (msg) => {
  console.log('Notificación recibida:', msg.payload);
  // Emitir evento a través del WebSocket
  dbEvents.emit('cliente-creado', msg.payload); // Asegúrate de que esto emita el evento correcto
});

// Iniciar la escucha
await client.query('LISTEN cliente_changes');

// Middleware para capturar cambios en la base de datos
prisma.$use(async (params, next) => {
  // Ejecutar la operación de base de datos
  const result = await next(params);
  
  // Verificar el tipo de operación y emitir eventos correspondientes
  switch(params.action) {
    case 'create':
      console.log("Cliente creado:", result);
      dbEvents.emit('cliente-creado', result);
      break;
    case 'update':
      console.log("Cliente actualizado:", result);
      dbEvents.emit('cliente-actualizado', result);
      break;
    case 'delete':
      console.log("Cliente eliminado con ID:", params.args.where.id);
      dbEvents.emit('cliente-eliminado', params.args.where.id);
      break;
  }
  
  return result;
});

// Exportar funciones para interactuar con la base de datos
export const db = {
  // Obtener todos los clientes ordenados por fecha de creación descendente
  getClientes: async () => {
    return await prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' }
    });
  },

  // Crear un nuevo cliente
  crearCliente: async (datos: { 
    nombre: string, 
    email: string, 
    telefono?: string,
    direccion?: string
  }) => {
    return await prisma.cliente.create({ data: datos });
  },

  // Actualizar un cliente existente por ID
  actualizarCliente: async (id: number, datos: { 
    nombre?: string, 
    email?: string, 
    telefono?: string,
    direccion?: string
  }) => {
    return await prisma.cliente.update({
      where: { id },
      data: datos
    });
  },

  // Eliminar un cliente por ID
  eliminarCliente: async (id: number) => {
    return await prisma.cliente.delete({
      where: { id }
    });
  }
};

// Ejemplo práctico de uso:
// Escuchar eventos de creación de clientes
// dbEvents.on('cliente-creado', (cliente) => {
//   console.log('Nuevo cliente creado:', cliente);
// });

// Crear un nuevo cliente con un correo electrónico único
// db.crearCliente({
//   nombre: 'Juan Pérez',
//   email: 'juan.perez.unique@example.com', // Cambiar el correo electrónico para evitar conflictos
//   telefono: '123456789',
//   direccion: 'Calle Falsa 123'
// }).then(cliente => {
//   console.log('Cliente creado:', cliente);
// });
