<template>
  <div class="p-5 text-center">
    <span class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">Cargando...</span>
    </span>
  </div>
</template>

<script>
import api from "@/api.js";

export default {
  components: {},
  data() {
    return {};
  },
  created() {
    if (!this.$route.query.code &&
      !this.$route.query.error) {
      this.$route.query.error = 'Error';
    }

    api.login(
      this.$route.query, {
      name: this.$route.name,
      params: this.$route.params
    }).then((route) => {
      this.$router.push(route);
    });
  },
  methods: {},
};
</script>