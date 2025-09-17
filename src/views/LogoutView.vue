<template>
  <DefaultLayout :allowAnonymous="true" :showMenu="false">
    <div class="text-center">
      <h1 class="mt-3">¡Hasta pronto!</h1>
      <p>Has cerrado sesión.</p>
      <router-link :to="{ name: 'Index' }">
        Acceder
      </router-link>
    </div>
  </DefaultLayout>
</template>

<script>
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import api from "@/api.js";

export default {
  components: {
    DefaultLayout,
  },
  created() {
    api.logout();
  },
};
</script>