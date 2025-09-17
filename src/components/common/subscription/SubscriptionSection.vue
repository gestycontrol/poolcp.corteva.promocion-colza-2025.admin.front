<template>
  <SubscriptionNotificationTypeList :notificationTypes="notificationTypesWithStatus" :channels="channels"
    @updating="loading = true" @updated="reload" :loading="loading" />
</template>
<script>
import api from "@/api.js";
import SubscriptionNotificationTypeList from "@/components/common/subscription/SubscriptionNotificationTypeList.vue";

export default {
  components: {
    SubscriptionNotificationTypeList,
  },
  data() {
    return {
      subscriptions: [],
      loading: false,
    };
  },
  props: {
    context: {
      type: String,
    },
    notificationTypes: {
      type: Array,
      default() {
        return [];
      },
    },
    channels: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  computed: {
    notificationTypesWithStatus() {
      return this.notificationTypes.map((notificationType) => {
        const channelSubscriptions = this.channels.map(channel => {
          return this.subscriptions.find((subscription) => subscription.topic === notificationType.topic && subscription.event === notificationType.event && subscription.channel === channel.code);
        }).filter(Boolean);
        return {
          ...notificationType,
          channelSubscriptions: this.channels.map((channel) => {
            return {
              ...channel,
              subscription_id: channelSubscriptions.find((subscription) => subscription.channel === channel.code)?.id,
            };
          }),
        };
      });
    },
  },
  watch: {
    context() {
      this.load();
    },
  },
  created() {
    this.load();
  },
  methods: {
    reload() {
      this.load();
    },
    load() {
      this.loading = true;

      api.get(api.urls.subscription + `me/subscriptions`, {
        context: this.context,
      }).then((subscriptions) => {
        this.subscriptions = subscriptions;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
  }
};
</script>