<template>
  <tr @dblclick="$refs['actions'].callFirstStarredAction();"
    class="d-block d-lg-table-row bg-white px-2 py-2 mb-2 border p-lg-0 mb-lg-0 border-lg-0">
    <td class="d-block d-lg-table-cell">
      <span class="small d-lg-none fw-bold" data-no-export>{{ i18n('Notification') }}</span>
      <FieldReadonly :value="notificationType" />
    </td>
    <td class="d-block d-lg-table-cell" v-for="channelSubscription in notificationType.channelSubscriptions"
      :key="channelSubscription.code">
      <span class="small d-lg-none fw-bold" data-no-export>{{ channelSubscription.name }}</span>
      <Field type="checkbox" :modelValue="!!channelSubscription.subscription_id"
        :disabled="channelSubscription.code === 'pop' && hasAnyNonPopSubscription"
        @update:modelValue="updatedValue(notificationType, channelSubscription, $event)" />
    </td>
  </tr>
</template>

<script>
import api from "@/api.js";
import Field from "@/components/common/form/Field.vue";
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";

export default {
  components: {
    Field,
    FieldReadonly,
  },
  props: {
    readonly: Boolean,
    notificationType: Object,
  },
  data() {
    return {
      localSubscribed: {},
    };
  },
  emits: [
    'updating',
    'updated',
  ],
  methods: {
    updatedValue(notificationType, channelSubscription, checked) {
      let old_checked = !!channelSubscription.subscription_id;
      if (old_checked === checked) return;
      this.$emit('updating');

      const onFail = () => {
        this.$emit('reload');
      };

      if (checked) {
        api.post(api.urls.subscription + `me/subscriptions`, {
          event: notificationType.event,
          topic: notificationType.topic,
          channel: channelSubscription.code,
        }).then((subscription) => {
          this.$emit('updated');
        }).catch(onFail);
      } else if (channelSubscription.subscription_id) {
        api.delete(api.urls.subscription + `me/subscriptions/${channelSubscription.subscription_id}`).then(() => {
          this.$emit('updated');
        }).catch(onFail);
      } else {
        onFail();
      }
    },
  },
  computed: {
    hasAnyNonPopSubscription() {
      return this.notificationType.channelSubscriptions.some((channelSubscription) => {
        return channelSubscription.subscription_id
          && channelSubscription.code !== 'pop';
      });
    },
    actions() {
      return [{
        label: this.i18n('Edit'),
        fn: () => {
          this.$emit('edit', this.notificationType);
        },
        if: (this.notificationType.acl?.update) === true,
        starred: true,
      },
      {
        label: this.i18n('Detail'),
        fn: () => {
          this.$emit('edit', this.notificationType);
        },
        if: (this.notificationType.acl?.update) !== true,
        starred: true,
      },
      {
        label: this.i18n('Delete'),
        fn: () => {
          this.$emit('updating', this.notificationType);
          this.$root.requestConfirmation(this.i18n('Delete? This action cannot be undone.'), () => {
            api.delete(`notificationTypes/${this.notificationType.id}`).then(() => {
              this.$emit('deleted', this.notificationType);
            }).catch(() => {
              // Force reload
              this.$emit('updated', this.notificationType);
            });
          });
        },
        if: (this.notificationType.acl?.delete) === true,
        starred: false,
      },
      ];
    },
  },
};
</script>