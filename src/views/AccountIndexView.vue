<template>
  <DefaultLayout>
    <AccountFilter :filters="filters">
      <h1 class="h5 mt-2">
        {{ i18n('Accounts') }}
        <span class="small text-muted" v-if="!pagination?.total">({{ accounts.length }})</span>
        <span class="small text-muted" v-else>({{ pagination?.total }})</span>
      </h1>
      <template #buttons>
        <AccountCreateAction @created="reload" v-if="can('ACCOUNT_MANAGE')" btnClass="btn btn-sm btn-outline-dark ms-1" />
        <ExportToExcelAction cssClass="btn btn-sm btn-outline-dark ms-1" />
      </template>
    </AccountFilter>

    <AccountList :accounts="accounts" :loading="loading" :autoLazyLoad="!!pagination.nextPageURI"
      @deleted="reload" @updating="loading = true" @updated="reload" @next="nextPage" />
  </DefaultLayout>
</template>

<script>
import api from "@/api.js";
import paginatedViewMixin from "@/mixins/common/paginatedViewMixin.js";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ExportToExcelAction from "@/components/common/actions/ExportToExcelAction.vue";
import AccountCreateAction from "@/components/account/AccountCreateAction.vue";
import AccountFilter from "@/components/account/AccountFilter.vue";
import AccountList from "@/components/account/AccountList.vue";

export default {
  mixins: [paginatedViewMixin, ],
  components: {
    DefaultLayout,
    ExportToExcelAction,
    AccountCreateAction,
    AccountFilter,
    AccountList,
  },
  data() {
    return {
      listPropertyName: 'accounts',
      apiResource:  `admin/accounts`,
      accounts: [],
    }
  },
  methods: {
    extendApiParams(params) {
      params.acl = 'account';
    },
  },
  mounted() {
    this.$root.setPageTitle(this.i18n('Accounts'));

    api.auth().then((user) => {
      this.$root.loggedUser = user;

      if (!user.loggedIn) {
        return; // Layout non-anonymous will handler redirect
      }

      if (!this.can('ACCOUNT_MANAGE')
        && !this.can('ACCOUNT_ACCESS')) {
        this.$router.push({
          name: 'Index',
        });
        return;
      }

      this.load();
    });
  },
};
</script>
