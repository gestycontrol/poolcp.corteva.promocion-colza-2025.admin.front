<template>
  <DefaultLayout>
    <InvoiceFilter :filters="filters">
      <h1 class="h5 mt-2">
        {{ i18n('Invoices') }}
        <span class="small text-muted" v-if="!pagination?.total">({{ invoices.length }})</span>
        <span class="small text-muted" v-else>({{ pagination?.total }})</span>
      </h1>
      <template #buttons>
        <InvoiceCreateAction @created="reload" v-if="can('INVOICE_MANAGE')"
          btnClass="btn btn-sm btn-outline-dark ms-1" />
        <ExportToExcelAction cssClass="btn btn-sm btn-outline-dark ms-1" />
      </template>
    </InvoiceFilter>

    <InvoiceList :invoices="invoices" :loading="loading" :autoLazyLoad="!!pagination.nextPageURI" @deleted="reload"
      @updating="loading = true" @updated="reload" @next="nextPage" />
  </DefaultLayout>
</template>

<script>
import api from "@/api.js";
import paginatedViewMixin from "@/mixins/common/paginatedViewMixin.js";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ExportToExcelAction from "@/components/common/actions/ExportToExcelAction.vue";
import InvoiceCreateAction from "@/components/invoice/InvoiceCreateAction.vue";
import InvoiceFilter from "@/components/invoice/InvoiceFilter.vue";
import InvoiceList from "@/components/invoice/InvoiceList.vue";

export default {
  mixins: [paginatedViewMixin,],
  components: {
    DefaultLayout,
    ExportToExcelAction,
    InvoiceCreateAction,
    InvoiceFilter,
    InvoiceList,
  },
  data() {
    return {
      listPropertyName: 'invoices',
      apiResource: `admin/accounts/${this.account.id}/invoices`,
      invoices: [],
    }
  },
  methods: {
    extendApiParams(params) {
      params.acl = 'invoice';
    },
  },
  mounted() {
    this.$root.setPageTitle(this.i18n('Invoices'));

    api.auth().then((user) => {
      this.$root.loggedUser = user;

      if (!user.loggedIn) {
        return; // Layout non-anonymous will handler redirect
      }

      if (!this.can('INVOICE_MANAGE')
        && !this.can('INVOICE_ACCESS')) {
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
