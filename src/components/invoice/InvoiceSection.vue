<template>
  <div class="bg-white p-2 border">
    <InvoiceFilter :filters="filters">
      <template #default>
        <h2 class="h5">
          {{ i18n('Invoices') }}
          <span class="small text-muted">({{ invoices.length }})</span>
        </h2>
      </template>
    </InvoiceFilter>

    <InvoiceList :invoices="invoices" :loading="loading" @deleted="reload" @updating="loading = true" @updated="reload" :account="account" />
  </div>
</template>

<script>
import api from "@/api.js";
import {
    duplicate,
    flattenUrlObject,
} from "@/tools/object.js";
import InvoiceFilter from "@/components/invoice/InvoiceFilter.vue";
import InvoiceList from "@/components/invoice/InvoiceList.vue";

export default {
  components: {
    InvoiceFilter,
    InvoiceList,
  },
  props: {
    account : {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      invoices: [],
      filters: {},
      loadTimeout: null,
      loading: true,
    }
  },
  mounted() {
    api.auth().then((user) => {
      this.$root.loggedUser = user;

      if (!user.loggedIn) {
        return; // Layout non-anonymous will handle redirect
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
  watch: {
    params: {
      handler() {
        this.reload();
      },
      deep: true,
    },
  },
  computed: {
    params() {
      let params = duplicate(this.filters);
      flattenUrlObject(params);
      params.acl = 'invoice';

      return params;
    },
  },
  methods: {
    load(force) {
      clearTimeout(this.loadTimeout);
      this.loading = true;

      if (!force) {
        this.loadTimeout = setTimeout(() => {
          this.load(true);
        }, 250);
        return;
      }

      api.get(`admin/accounts/${this.account.id}/invoices`, this.params).then(invoices => {
        this.invoices = invoices;
        this.loading = false;
      });
    },
    reload() {
      this.load();
    },
  },
};
</script>
