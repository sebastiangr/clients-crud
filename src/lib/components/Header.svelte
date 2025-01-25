<script lang="ts">
  // Add any necessary TypeScript logic here
  let { name } : { name: string }= $props();
</script>

<header class="fixed top-0 left-0 right-0 bg-gray-200 py-4">
  <h4 class="text-2xl font-bold text-center">Clients admin {name}</h4>
  <nav class="flex justify-center">
    <ul class="flex space-x-4">
      <li><a href="/" class="hover:text-gray-700">Home</a></li>
      <li><a href="/clientes" class="hover:text-gray-700">Clients</a></li>
      <li><a href="/client_view" class="hover:text-gray-700">Client view</a></li>
      <li><a href="/contact" class="hover:text-gray-700">Contact</a></li>
    </ul>
  </nav>
</header>

