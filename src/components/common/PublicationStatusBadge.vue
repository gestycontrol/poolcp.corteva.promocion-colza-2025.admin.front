<template>
    <span :title="statusText">
        <EyeIcon v-if="statusCode === 'published'" />
        <EyeCrossIcon v-else />
    </span>
</template>

<script>
import EyeIcon from '@/assets/svg/eye.vue';
import EyeCrossIcon from '@/assets/svg/eye-cross.vue';

export default {
    name: 'PublicationStatusBadge',
    components: {
        EyeIcon,
        EyeCrossIcon,
    },
    props: {
        status: {
            type: [String, Object],
            required: true
        }
    },
    computed: {
        statusCode() {
            if (typeof this.status === 'string') {
                return this.status;
            }

            return this.status?.code || 'draft';
        },
        statusText() {
            if (typeof this.status === 'string') {
                return this.status;
            }

            return this.status?.name || this.i18n(`publication_status_${this.statusCode}`);
        },
    }
};
</script>