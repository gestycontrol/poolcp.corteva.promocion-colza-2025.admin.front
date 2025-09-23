<template>
  <div class="bg-white border p-2 mt-3">
    <div class="table-responsive position-relative" :class="{ 'with-actions-gap': accounts.length < 4, 'opacity-50': loading }">
      <table class="table">
        <thead>
          <tr class="d-none d-lg-table-row">
            <th class="text-nowrap" scope="col">{{ i18n('Id') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Email') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Onboarding Step') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Transfer Mode') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Transfer Holder') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Transfer Details') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Points') }}</th>
            <th class="text-nowrap" scope="col">{{ i18n('Created') }}</th>
            <th data-no-export scope="col" style="min-width: 48px">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          <AccountListItem v-for="account in accounts"
            :account="account" :key="account.id" 
            @deleted="$emit('deleted', $event)" @updated="$emit('updated', $event)" @updating="$emit('updating', $event)" />
          <EmptyListItem v-if="!accounts || accounts.length == 0" :loading="loading" :colspan="9" />
          <LazyLoadListItem v-if="!loading && (lazyLoad || autoLazyLoad)" :autoLazyLoad="autoLazyLoad" :colspan="9"
            @next="$emit('next', $event)" />
        </tbody>
      </table>
      <div class="position-absolute h-100 w-100 top-0" @click.stop v-if="loading"></div>
    </div>
  </div>
</template>

<script>
import AccountListItem from "@/components/account/AccountListItem.vue";
import EmptyListItem from "@/components/common/list/EmptyListItem.vue";
import LazyLoadListItem from "@/components/common/list/LazyLoadListItem.vue";

export default {
  components: {
    AccountListItem,
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
    loading: Boolean,
    lazyLoad: Boolean,
    autoLazyLoad: Boolean,
    accounts: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  methods: {
  },
};
</script>