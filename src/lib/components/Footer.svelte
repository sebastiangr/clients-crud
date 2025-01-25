<script lang="ts">
  import { onMount } from "svelte";
  import { io } from "socket.io-client";

  let connected = false;

  onMount(() => {    
    const socket = io("http://localhost:3000", {
      transports: ['websocket'], // Asegúrate de usar el transporte correcto
    });

    socket.on("connect", () => {
      connected = true;
    });

    socket.on("disconnect", () => {
      connected = false;
    });

    return () => {
      socket.disconnect();
    };
  });
</script>

<footer class="fixed bottom-0 left-0 right-0">
  <div>
    Estado de conexión: {connected ? "Conectado" : "Desconectado"}
  </div>
</footer>

<style>
  footer {
    padding: 1rem;
    background-color: #f8f9fa;
    text-align: center;
  }
</style>
