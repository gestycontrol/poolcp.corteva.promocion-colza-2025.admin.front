<template>
  <div class="bg-white border p-2 mt-3">
    <div class="table-responsive position-relative" :class="{ 'with-actions-gap': invoices.length < 4, 'opacity-50': loading }">
      <table class="table">
        <thead>
          <tr class="d-none d-lg-table-row">
            <th class="text-nowrap" scope="col">{{ i18n('Id') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Name') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Is Valid') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Points') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Created') }}</th>
            <th data-no-export scope="col" style="min-width: 48px">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <InvoiceListItem v-for="invoice in invoices"
            :invoice="invoice" :key="invoice.id" @edit="showInvoiceModal"
            @deleted="$emit('deleted', $event)" @updated="$emit('updated', $event)" @updating="$emit('updating', $event)" :account="account" />
          <EmptyListItem v-if="!invoices || invoices.length == 0" :loading="loading" :colspan="6" />
          <LazyLoadListItem v-if="!loading && (lazyLoad || autoLazyLoad)" :autoLazyLoad="autoLazyLoad" :colspan="6"
            @next="$emit('next', $event)" />
        </tbody>
      </table>
      <div class="position-absolute h-100 w-100 top-0" @click.stop v-if="loading"></div>
    </div>
  </div>
  <InvoiceModal ref="InvoiceModal" @updated="$emit('updated', $event)" :account="account" />
</template>

<script>
import InvoiceListItem from "@/components/invoice/InvoiceListItem.vue";
import InvoiceModal from "@/components/invoice/InvoiceModal.vue";
import EmptyListItem from "@/components/common/list/EmptyListItem.vue";
import LazyLoadListItem from "@/components/common/list/LazyLoadListItem.vue";

export default {
  components: {
    InvoiceListItem,
    InvoiceModal,
    EmptyListItem,
    LazyLoadListItem,
  },
  emits: [
    'updated',
    'deleted',
    'updated',
    'updating',
    'next',
  ],
  props: {
    account: {
      type: Object,
      required: true,
    },
    loading: Boolean,
    lazyLoad: Boolean,
    autoLazyLoad: Boolean,
    invoices: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
    showInvoiceModal(invoice) {
      if (!this.$refs.InvoiceModal) {
        return;
      }

      this.$refs.InvoiceModal.show(invoice.id);
    },
  },
};
</script>