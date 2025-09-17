<template>
  <template v-if="count > 0">
    <span :class="{ 'opacity-75': loading, 'with-unread': unread, 'small': small, [cssClass]: true, }"
      class="btn-notifications text-nowrap" role="button" @click="showSubscriptionNotificationModal">
      <BellIcon />
      <template v-if="unread > 0">
        <span class="ms-1">
          {{ unread }}
        </span>
      </template>
    </span>
    <SubscriptionNotificationModal ref="SubscriptionNotificationModal" :context="context" :topic="topic"
      @hidden="reload" />
  </template>
</template>
<script>
import api from "@/api.js";
import BellIcon from "@/assets/svg/bell.vue";
import SubscriptionNotificationModal from "@/components/common/subscription/SubscriptionNotificationModal.vue";

export default {
  components: {
    BellIcon,
    SubscriptionNotificationModal,
  },
  data() {
    return {
      loading: false,
      count: 0,
      unread: 0,
    };
  },
  props: {
    cssClass: {
      type: String,
      default: '',
    },
    small: {
      type: Boolean,
      default: false,
    },
    context: {
      type: String,
    },
    topic: {
      type: String,
    },
  },
  computed: {
  },
  watch: {
    context() {
      this.load();
    },
    topic() {
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

      api.get(api.urls.subscription + `me/notifications/count`, {
        context: this.context,
        topic: this.topic,
        channel: 'pop',
      }).then((stats) => {
        this.count = stats.count;
        this.unread = stats.unread;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    showSubscriptionNotificationModal() {
      if (!this.$refs['SubscriptionNotificationModal']) return;
      this.$refs['SubscriptionNotificationModal'].show();
    }
  }
};
</script>