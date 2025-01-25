import type { Actions, ServerLoad } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { fail, redirect } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
  return {
    clientes: await db.getClientes()
  };
};

export const actions: Actions = {
  crear: async ({ request }) => {
    const datos = await request.formData();
    const nombre = datos.get('nombre')?.toString();
    const email = datos.get('email')?.toString();
    const telefono = datos.get('telefono')?.toString();
    const direccion = datos.get('direccion')?.toString();

    if (!nombre || !email) {
      return fail(400, { 
        nombre, 
        email, 
        telefono, 
        direccion, 
        error: 'Nombre y email son requeridos' 
      });
    }

    try {
      await db.crearCliente({ nombre, email, telefono, direccion });
      return { success: true };
    } catch (error) {
      return fail(500, { 
        nombre, 
        email, 
        telefono, 
        direccion, 
        error: 'Error al crear cliente' 
      });
    }
  },

  actualizar: async ({ request }) => {
    const datos = await request.formData();
    const id = Number(datos.get('id'));
    const nombre = datos.get('nombre')?.toString();
    const email = datos.get('email')?.toString();
    const telefono = datos.get('telefono')?.toString();
    const direccion = datos.get('direccion')?.toString();

    if (!id || !nombre || !email) {
      return fail(400, { 
        id, 
        nombre, 
        email, 
        telefono, 
        direccion, 
        error: 'ID, nombre y email son requeridos' 
      });
    }

    try {
      await db.actualizarCliente(id, { nombre, email, telefono, direccion });
      return { success: true };
    } catch (error) {
      return fail(500, { 
        id, 
        nombre, 
        email, 
        telefono, 
        direccion, 
        error: 'Error al actualizar cliente' 
      });
    }
  },

  eliminar: async ({ request }) => {
    const datos = await request.formData();
    const id = Number(datos.get('id'));

    if (!id) {
      return fail(400, { error: 'ID de cliente requerido' });
    }

    try {
      await db.eliminarCliente(id);
      return { success: true };
    } catch (error) {
      return fail(500, { error: 'Error al eliminar cliente' });
    }
  }
};