<template>
  <DefaultLayout>
    <UserFilter :filters="filters">
      <h1 class="h5 mt-2">
        {{ i18n('Users') }}
        <span class="small text-muted" v-if="!pagination?.total">({{ users.length }})</span>
        <span class="small text-muted" v-else>({{ pagination?.total }})</span>
      </h1>
      <template #buttons>
        <ExportToExcelAction cssClass="btn btn-sm btn-outline-dark ms-1 me-1" />
        <UserCreateAction @created="reload" v-if="canIDP('USER_MANAGE')" />
      </template>
    </UserFilter>

    <UserList :users="users" :loading="loading" :autoLazyLoad="!!pagination.nextPageURI" @deleted="reload"
      @updating="loading = true" @updated="reload" @next="nextPage" />
  </DefaultLayout>
</template>

<script>
import api from "@/api.js";
import paginatedViewMixin from "@/mixins/common/paginatedViewMixin.js";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ExportToExcelAction from "@/components/common/actions/ExportToExcelAction.vue";
import UserCreateAction from "@/modules/idp/UserCreateAction.vue";
import UserFilter from "@/modules/idp/UserFilter.vue";
import UserList from "@/modules/idp/UserList.vue";
import * as idp from "@/modules/idp/idp.js";

export default {
  mixins: [paginatedViewMixin,],
  components: {
    DefaultLayout,
    ExportToExcelAction,
    UserCreateAction,
    UserFilter,
    UserList,
  },
  data() {
    return {
      listPropertyName: 'users',
      apiResource: `${api.urls.idp}users`,
      users: [],
      canIDP: idp.can,
    }
  },
  mounted() {
    this.$root.setPageTitle(this.i18n('Users'));

    api.auth().then((user) => {
      this.$root.loggedUser = user;

      if (!user.loggedIn) return; // Layout non-anonymous will handler redirect

      idp.auth().then(() => {
        let canIDP =false;

        [
          'USER_ACCESS',
          'USER_MANAGE',
        ].forEach((permission) => {
          if (idp.can(permission)) {
      canIDP = true;
          }
        });

        if(canIDP){
          this.load();
        }
      });
    });
  },
      watch: {
        params: {
      handler() {
        this.pagination.loadPages = 1;
        this.reload();
      },
      deep: true,
    },
  },
  methods: {
    afterLoad() {
        // El filtrado de usuarios sin perfiles ahora se hace en UserList.vue
        // Solo mantenemos el filtro de provider apps
        this.users = this.users.filter((user) => {
          return user?.provider?.identifier !== 'apps';
        });
    },
    extendApiParams(params) {
      params.acl = 'user';
    },
  },
};
</script>