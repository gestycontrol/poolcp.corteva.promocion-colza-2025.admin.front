<template>
  <DefaultLayout>
    <InvoiceProductFilter :filters="filters">
      <h1 class="h5 mt-2">
        {{ i18n('Invoice Products') }}
        <span class="small text-muted" v-if="!pagination?.total">({{ invoiceProducts.length }})</span>
        <span class="small text-muted" v-else>({{ pagination?.total }})</span>
      </h1>
      <template #buttons>
        <InvoiceProductCreateAction @created="reload" v-if="can('INVOICE_PRODUCT_MANAGE')" btnClass="btn btn-sm btn-outline-dark ms-1" />
        <ExportToExcelAction cssClass="btn btn-sm btn-outline-dark ms-1" />
      </template>
    </InvoiceProductFilter>

    <InvoiceProductList :invoiceProducts="invoiceProducts" :loading="loading" :autoLazyLoad="!!pagination.nextPageURI"
      @deleted="reload" @updating="loading = true" @updated="reload" @next="nextPage" />
  </DefaultLayout>
</template>

<script>
import api from "@/api.js";
import paginatedViewMixin from "@/mixins/common/paginatedViewMixin.js";
import DefaultLayout from "@/layouts/DefaultLayout.vue";
import ExportToExcelAction from "@/components/common/actions/ExportToExcelAction.vue";
import InvoiceProductCreateAction from "@/components/invoiceProduct/InvoiceProductCreateAction.vue";
import InvoiceProductFilter from "@/components/invoiceProduct/InvoiceProductFilter.vue";
import InvoiceProductList from "@/components/invoiceProduct/InvoiceProductList.vue";

export default {
  mixins: [paginatedViewMixin, ],
  components: {
    DefaultLayout,
    ExportToExcelAction,
    InvoiceProductCreateAction,
    InvoiceProductFilter,
    InvoiceProductList,
  },
  data() {
    return {
      listPropertyName: 'invoiceProducts',
      apiResource:  `admin/invoices/${this.invoice.id}/products/${this.product.id}/invoiceProducts`,
      invoiceProducts: [],
    }
  },
  methods: {
    extendApiParams(params) {
      params.acl = 'invoiceProduct';
    },
  },
  mounted() {
    this.$root.setPageTitle(this.i18n('Invoice Products'));

    api.auth().then((user) => {
      this.$root.loggedUser = user;

      if (!user.loggedIn) {
        return; // Layout non-anonymous will handler redirect
      }

      if (!this.can('INVOICE_PRODUCT_MANAGE')
        && !this.can('INVOICE_PRODUCT_ACCESS')) {
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
