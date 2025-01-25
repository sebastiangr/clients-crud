<script lang="ts">
  import type { PageData } from './$types';
  import { enhance } from '$app/forms';
  import { onMount } from "svelte";
  import { io } from "socket.io-client";

  export let data: PageData;

  let clienteForm = {
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  let clienteEditando: number | null = null;

  onMount(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Conectado al servidor WebSocket");
    });

    socket.on("update", (clientes) => {
      data.clientes = clientes; // Actualiza la lista de clientes
    });

    return () => {
      socket.disconnect();
    };
  });
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-6">Gestión de Clientes</h1>
  
  <!-- Formulario de Nuevo/Editar Cliente -->
  <form 
    method="POST" 
    action={clienteEditando ? '?/actualizar' : '?/crear'} 
    use:enhance 
    class="bg-gray-100 p-4 rounded mb-6"
  >
    {#if clienteEditando}
      <input type="hidden" name="id" value={clienteEditando} />
    {/if}
    
    <div class="grid grid-cols-2 gap-4">
      <input 
        type="text" 
        name="nombre" 
        placeholder="Nombre" 
        bind:value={clienteForm.nombre}
        required 
        class="input"
      />
      <input 
        type="email" 
        name="email" 
        placeholder="Email" 
        bind:value={clienteForm.email}
        required 
        class="input"
      />
      <input 
        type="tel" 
        name="telefono" 
        placeholder="Teléfono" 
        bind:value={clienteForm.telefono}
        class="input"
      />
      <input 
        type="text" 
        name="direccion" 
        placeholder="Dirección" 
        bind:value={clienteForm.direccion}
        class="input"
      />
    </div>
    
    <button type="submit" class="btn mt-4">
      {clienteEditando ? 'Actualizar Cliente' : 'Agregar Cliente'}
    </button>
    
    {#if clienteEditando}
      <button 
        type="button" 
        class="btn-secondary ml-2"
        on:click={() => {
          clienteEditando = null;
          clienteForm = { nombre: '', email: '', telefono: '', direccion: '' };
        }}
      >
        Cancelar
      </button>
    {/if}
  </form>
  
  <!-- Lista de Clientes -->
  <div class="space-y-4">
    {#each data.clientes as cliente (cliente.id)}
      <div class="bg-white shadow rounded p-4 flex justify-between items-center">
        <div>
          <h2 class="font-bold">{cliente.nombre}</h2>
          <p class="text-gray-600">{cliente.email}</p>
          <p class="text-gray-500">
            {cliente.telefono || 'Sin teléfono'}
          </p>
          <p class="text-gray-500">
            {cliente.direccion || 'Sin dirección'}
          </p>
        </div>
        
        <div class="flex space-x-2">
          <button 
            class="btn-edit"
            on:click={() => {
              clienteEditando = cliente.id;
              clienteForm = { 
                nombre: cliente.nombre, 
                email: cliente.email, 
                telefono: cliente.telefono || '', 
                direccion: cliente.direccion || ''
              };
            }}
          >
            Editar
          </button>
          
          <form method="POST" action="?/eliminar" use:enhance>
            <input type="hidden" name="id" value={cliente.id} />
            <button type="submit" class="btn-delete">
              Eliminar
            </button>
          </form>
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .input {
    @apply border rounded-md p-2 w-full;
  }
  .btn {
    @apply bg-blue-500 text-white rounded-md p-2;
  }
  .btn-secondary {
    @apply bg-gray-300 text-black rounded-md p-2;
  }
  .btn-edit {
    @apply bg-yellow-500 text-white rounded-md p-2;
  }
  .btn-delete {
    @apply bg-red-500 text-white rounded-md p-2;
  }
</style>
