import { PrismaClient } from '@prisma/client'
import { EventEmitter } from 'events'

// Crear un emisor de eventos global
export const dbEvents = new EventEmitter();

const prisma = new PrismaClient()

// Middleware para capturar cambios
prisma.$use(async (params, next) => {
  const result = await next(params)
  
  switch(params.action) {
    case 'create':
      dbEvents.emit('cliente-creado', result);
      break;
    case 'update':
      dbEvents.emit('cliente-actualizado', result);
      break;
    case 'delete':
      dbEvents.emit('cliente-eliminado', params.args.where.id);
      break;
  }
  
  return result
})


export const db = {
  getClientes: async () => {
    return await prisma.cliente.findMany({
      orderBy: { createdAt: 'desc' }
    })
  },

  crearCliente: async (datos: { 
    nombre: string, 
    email: string, 
    telefono?: string,
    direccion?: string
  }) => {
    return await prisma.cliente.create({ data: datos })
  },

  actualizarCliente: async (id: number, datos: { 
    nombre?: string, 
    email?: string, 
    telefono?: string,
    direccion?: string
  }) => {
    return await prisma.cliente.update({
      where: { id },
      data: datos
    })
  },

  eliminarCliente: async (id: number) => {
    return await prisma.cliente.delete({
      where: { id }
    })
  }
}