<template>
  <div class="bg-white border p-2 mt-3">
    <div class="table-responsive position-relative"
      :class="{ 'with-actions-gap': notificationTypes.length < 4, 'opacity-50': loading }">
      <table class="table">
        <caption class="sr-only" data-no-export>{{ i18n('Notification Type List') }}</caption>
        <thead>
          <tr class="d-none d-lg-table-row">
            <th scope="col">{{ i18n('Notification') }}</th>
            <th scope="col" :key="channel.code" v-for="channel in channels">{{ channel.name }}</th>
          </tr>
        </thead>
        <tbody>
          <SubscriptionNotificationTypeListItem v-for="notificationType in notificationTypes"
            :notificationType="notificationType" :key="notificationType.name" @updated="$emit('updated', $event)"
            @updating="$emit('updating', $event)" :channels="channels" />
          <EmptyListItem v-if="!notificationTypes || notificationTypes.length == 0" :loading="loading"
            :colspan="channels.length + 1" />
        </tbody>
      </table>
      <div class="position-absolute h-100 w-100 top-0" @click.stop v-if="loading"></div>
    </div>
  </div>
</template>

<script>
import SubscriptionNotificationTypeListItem from "@/components/common/subscription/SubscriptionNotificationTypeListItem.vue";
import EmptyListItem from "@/components/common/list/EmptyListItem.vue";

export default {
  components: {
    SubscriptionNotificationTypeListItem,
    EmptyListItem,
  },
  emits: [
    'updated',
    'updating',
  ],
  props: {
    loading: Boolean,
    channels: Array,
    notificationTypes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
};
</script>