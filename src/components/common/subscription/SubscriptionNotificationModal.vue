<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-lg">
        <template #title>
            {{ i18n('Notifications') }}
        </template>

        <article class="card mb-2" v-for="notification in notifications" :key="notification.id"
            :class="{ 'notification-unread': !notification.is_read }">
            <div class="card-header" @click="showNotifications[notification.id] = !showNotifications[notification.id]"
                role="button">
                <div class="d-flex">
                    <div style="padding-top: 0.15rem">
                        <h1 class="h6 mb-0">{{ notification.messages.excerpt }}</h1>
                    </div>
                    <div class="text-nowrap ms-auto">
                        <small>
                            {{ formatDate(notification.created_at) }}
                            {{ formatTime(notification.created_at) }}
                        </small>
                    </div>
                </div>
            </div>
            <div class="card-body" v-if="notification.messages.content && showNotifications[notification.id]">
                <div class="notification-content" v-dompurify-html="cleanContent(notification.messages.content)"></div>
            </div>
        </article>

        <template #footer>
            <div class="row">
                <div class="col text-end">
                    <button type="button" @click="hide" class="btn btn-outline-dark btn-sm me-2">
                        {{ i18n('Close') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import api from "@/api.js";
import Modal from "@/components/common/layout/Modal.vue";
import {
    formatDate,
    formatTime,
} from "@/tools/date.js";

export default {
    components: {
        Modal,
    },
    props: {
        context: {
            type: String,
        },
        topic: {
            type: String,
        },
    },
    data() {
        return {
            formatDate,
            formatTime,
            notifications: [],
            showNotifications: {},
        };
    },
    emits: [
        'shown',
        'hidden',
    ],
    methods: {
        cleanContent(content) {
            content = content.trim().replace(/<br\s*\/?>/g, '<br>');

            while (content.endsWith('<br>')) {
                content = content.slice(0, -4).trim();
            }

            return content;
        },
        show() {
            this.notifications = [];
            this.showNotifications = {};
            this.load().then(() => {
                this.$refs['modal'].show();
            });
        },
        load() {
            if (!this.topic) return Promise.resolve();
            let promise = api.get(api.urls.subscription + `me/notifications`, {
                context: this.context,
                topic: this.topic,
                channel: 'pop',
            });

            promise.then(notifications => {
                this.notifications = notifications;

                if (notifications.length > 0) {
                    this.showNotifications[notifications[0].id] = true;
                }
            });

            return promise;
        },
        hide() {
            this.$refs['modal'].hide();
        },
        shown() {
            this.$emit('shown');
        },
        hidden() {
            this.$emit('hidden');
        },
    }
}
</script>