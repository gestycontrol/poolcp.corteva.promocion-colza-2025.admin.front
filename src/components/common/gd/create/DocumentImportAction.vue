<template>
    <button type="button" class="btn btn-sm btn-outline-dark ms-1" @click="showDocumentImportModal">
        {{ titleOrDefault }}
    </button>

    <DocumentImportModal :sourceContainer="sourceContainer" :container="container" ref="DocumentImportModal"
        @added="$emit('added', $event)" :documentTypeCodes="documentTypeCodes" :defaultMetadata="defaultMetadata"
        :title="title" />
</template>
<script>
import DocumentImportModal from "@/components/common/gd/create/DocumentImportModal.vue";
import FileEarmarkPlusIcon from "@/assets/svg/file-earmark-plus.vue";

export default {
    components: {
        DocumentImportModal,
        FileEarmarkPlusIcon,
    },
    props: {
        customDocumentTypes: Array,
        multiple: Boolean,
        sourceContainer: {
            type: Object,
            required: true,
        },
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
    },
    data() {
        return {
            formData: {},
        };
    },
    computed: {
        titleOrDefault() {
            if (this.title === undefined) {
                return this.i18n('New Document');
            }

            return this.title;
        },
    },
    emits: [
        'added',
    ],
    methods: {
        showDocumentImportModal() {
            this.$refs['DocumentImportModal'].show();
        },
    }
};
</script>