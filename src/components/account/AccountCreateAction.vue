<template>
    <button type="button" :class="btnClass" @click="showAccountModal">
        {{ i18n('Add New') }}
    </button>

    <AccountModal ref="AccountModal" @created="$emit('created', $event)" />
</template>
<script>
import AccountModal from "@/components/account/AccountModal.vue";

export default {
  components: {
    AccountModal,
  },
  props: {
    btnClass: {
      type: String,
      default: 'btn btn-sm btn-outline-dark',
    },
  },
  data() {
    return {
      formData: {},
    };
  },
  emits: [
    'created'
  ],
  methods: {
    showAccountModal() {
      this.$refs['AccountModal'].show();
    },
  }
};
</script>