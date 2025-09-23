<template>
  <tr @dblclick="$refs['actions'].callFirstStarredAction();"
    class="d-block d-lg-table-row bg-white px-2 py-2 mb-2 border p-lg-0 mb-lg-0 border-lg-0">
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Id') }}</span>
      <FieldReadonly :value="invoice.id" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Name') }}</span>
      <FieldReadonly :value="invoice.name" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Is Valid') }}</span>
      <FieldReadonly :value="invoice.is_valid" format="boolean" v-if="invoice.is_valid !== null" />
      <FieldReadonly :value="invoice.is_valid" v-else />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Points') }}</span>
      <FieldReadonly :value="invoice.points" format="int" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Created') }}</span>
      <FieldReadonly :value="invoice.created_at" format="datetime" />
    </td>
    <td data-no-export class="d-block d-lg-table-cell text-end border-0 border-lg-bottom" @click.stop>
      <ActionDropdown ref="actions" :actions="actions" />
    </td>
  </tr>
</template>

<script>
import api from "@/api.js";
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";
import ActionDropdown from "@/components/common/list/ActionDropdown.vue";

export default {
  components: {
    FieldReadonly,
    ActionDropdown,
  },
  props: {
    account: {
      type: Object,
      required: true,
    },
    invoice: Object,
  },
  data() {
    return {};
  },
  emits: [
    'edit',
    'deleted',
    'updating',
    'updated',
  ],
  methods: {
  },
  computed: {
    actions() {
      return [{
        label: this.i18n('Edit'),
        fn: () => {
          this.$emit('edit', this.invoice);
        },
        if: (this.invoice.acl?.update) === true,
        starred: true,
      },
      {
        label: this.i18n('Detail'),
        fn: () => {
          this.$emit('edit', this.invoice);
        },
        if: (this.invoice.acl?.update) !== true,
        starred: true,
      },
      {
        label: this.i18n('Delete'),
        fn: () => {
          this.$emit('updating', this.invoice);
          this.$root.requestConfirmation(this.i18n('Delete? This action cannot be undone.'), () => {
            api.delete(`admin/accounts/${this.account.id}/invoices/${this.invoice.id}`).then(() => {
              this.$emit('deleted', this.invoice);
            }).then(() => {
              // Force reload
              this.$emit('updated', this.invoice);
            });
          });
        },
        if: (this.invoice.acl?.delete) === true,
        starred: false,
      },
      ];
    },
  },
};
</script>