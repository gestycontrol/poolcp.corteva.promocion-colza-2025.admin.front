<template>
    <button type="button" class="btn btn-sm btn-outline-dark" @click="showExportModal">
        {{ i18n('Export') }}
    </button>

    <ExportModal ref="ExportModal" :selector="selector" :context="context" :basename="basename" />
</template>
<script>
import ExportModal from "@/components/common/actions/ExportModal.vue";

export default {
    components: {
        ExportModal,
    },
    props: {
        selector: String,
        context: Element,
        basename: String,
    },
    methods: {
        showExportModal() {
            if (!this.$refs['ExportModal']) return;
            this.$refs['ExportModal'].show();
        },
    }
};
</script>