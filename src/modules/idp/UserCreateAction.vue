<template>
  <ActionDropdown :actions="actions" :cssClass="cssClass" />

  <UserModal ref="UserModal" @created="$emit('created', $event)" @updated="$emit('created', $event)" />
</template>
<script>
import UserModal from "@/modules/idp/UserModal.vue";
import ActionDropdown from "@/components/common/list/ActionDropdown.vue";

export default {
  components: {
    UserModal,
    ActionDropdown,
  },
  props: {
    cssClass: String,
  },
  data() {
    return {
      formData: {},
    };
  },
  emits: [
    'added',
    'created'
  ],
  computed: {
    actions() {
      return [
        {
          label: this.i18n('Add New'),
          fn: () => {
            this.$refs['UserModal'].show();
          },
          starred: true,
        },
      ];
    },
  },
  methods: {
  },
};
</script>