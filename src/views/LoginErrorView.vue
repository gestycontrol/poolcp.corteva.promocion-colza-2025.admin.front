<template>
  <DefaultLayout :allowAnonymous="true" :showMenu="false">
    <div class="text-center">
      <h1 class="mt-3">¡Upss!</h1>
      <p>Parece que hubo un problema iniciando sesión. Por favor, vuelve a intentarlo más tarde.</p>

      <router-link :to="{ name: 'Index' }">
        Volver al inicio
      </router-link>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";

export default {
  components: {
    DefaultLayout,
  },
};
</script>