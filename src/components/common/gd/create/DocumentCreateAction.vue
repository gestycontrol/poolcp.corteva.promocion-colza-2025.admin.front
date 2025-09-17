<template>
    <button type="button" class="btn btn-sm btn-outline-dark ms-1" @click="showDocumentCreateModal">
        {{ titleOrDefault }}
    </button>

    <DocumentCreateModal :container="container" ref="DocumentCreateModal" @added="$emit('added', $event)"
        :documentTypeCodes="documentTypeCodes" :defaultMetadata="defaultMetadata" :title="title"
        :maxImageSideSize="maxImageSideSize" :multiple="multiple" :customDocumentTypes="customDocumentTypes"
        :sortMetadata="sortMetadata" />
</template>
<script>
import DocumentCreateModal from "@/components/common/gd/create/DocumentCreateModal.vue";
import FileEarmarkPlusIcon from "@/assets/svg/file-earmark-plus.vue";

export default {
    components: {
        DocumentCreateModal,
        FileEarmarkPlusIcon,
    },
    computed: {
        titleOrDefault() {
            if (this.title === undefined) {
                return this.i18n('New Document');
            }

            return this.title;
        },
    },
    props: {
        customDocumentTypes: Array,
        multiple: Boolean,
        container: {
            type: Object,
            required: true,
        },
        documentTypeCodes: Array,
        defaultMetadata: Object,
        title: {
            type: String,
        },
        maxImageSideSize: {
            type: Number,
        },
        sortMetadata: String,
    },
    data() {
        return {
            formData: {},
        };
    },
    emits: [
        'added',
    ],
    methods: {
        showDocumentCreateModal() {
            this.$refs['DocumentCreateModal'].show();
        },
    }
};
</script>