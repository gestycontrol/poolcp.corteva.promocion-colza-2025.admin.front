<template>
  <div class="p-5 text-center">
    <span class="spinner-border spinner-border-sm" role="status">
      <span class="visually-hidden">
        {{ i18n('Loading...') }}
      </span>
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
    api.auth().then((user) => {
      if (!user || !user.id) {
        api.login(
          this.$route.query, {
          name: this.$route.name,
          params: this.$route.params
        }).then((route) => {
          this.$router.push(route);
        });
        return;
      }

      this.$root.loggedUser = user;

      const pagePermissions = {
        SectionIndex: ['SECTION_ACCESS', 'SECTION_MANAGE',],
      }

      const firstAccessiblePage = Object.keys(pagePermissions).find((page) => {
        return pagePermissions[page].some((permission) => {
          return this.$root.can(permission);
        });
      });

      if (firstAccessiblePage) {
        this.$router.push({
          name: firstAccessiblePage,
        });
      } else {
        localStorage.clear();
        this.$router.push({
          name: 'LoginError',
        });
      }
    });
  },
  methods: {},
};
</script>