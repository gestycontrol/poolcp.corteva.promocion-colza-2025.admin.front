<template>
  <tr @dblclick="$refs['actions'].callFirstStarredAction();" class="d-block d-lg-table-row bg-white px-2 py-2 mb-2 border p-lg-0 mb-lg-0 border-lg-0">
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Id') }}</span>
      <FieldReadonly :value="account.id" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Email') }}</span>
      <FieldReadonly :value="account.email" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Onboarding Step') }}</span>
      <FieldReadonly :value="account.onboarding_step" format="int" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Transfer Mode') }}</span>
      <FieldReadonly :value="account.transfer_mode" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Transfer Holder') }}</span>
      <FieldReadonly :value="account.transfer_holder" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Transfer Details') }}</span>
      <FieldReadonly :value="account.transfer_details" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Points') }}</span>
      <FieldReadonly :value="account.points" format="int" />
    </td>
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Created') }}</span>
      <FieldReadonly :value="account.created_at" format="datetime" />
    </td>
    <td data-no-export class="d-block d-lg-table-cell text-end border-0 border-lg-bottom" @click.stop>
      <ActionDropdown ref="actions" :actions="actions" />
    </td>
  </tr>
</template>

<script>
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";
import ActionDropdown from "@/components/common/list/ActionDropdown.vue";

export default {
  components: {
    FieldReadonly,
    ActionDropdown,
  },
  props: {
    account: Object,
  },
  data() {
    return {};
  },
  emits: [
    'deleted',
    'updating',
    'updated',
  ],
  methods: {
  },
  computed: {
    actions() {
      return [{
        label: this.i18n('Detail'),
        fn: () => {
          this.$router.push({ name: 'AccountDetail', params: { id: this.account.id } });
        },
        if: (this.account.acl?.update) === true || (this.account.acl?.view) === true,
        starred: true,
      },
      ];
    },
  },
};
</script>