<template>
    <tr :class="{ 'custom-click': customClick }">
        <td @click="$emit('click', document)" v-if="!minimal">
            <FieldReadonly :value="document.id" />
        </td>
        <td @click="$emit('click', document)" v-if="!minimal">
            <FieldReadonly :value="document.customDocumentType ? document.customDocumentType : document.documentType" />
        </td>
        <td @click="$emit('click', document)" v-if="!minimal">
            <FieldReadonly :value="document.metadata.observations" />
        </td>
        <td @click="$emit('click', document)">
            <FieldReadonly :value="document.uploaded" :format="minimal ? 'date' : 'datetime'" />
        </td>
        <td @click="$emit('click', document)">
            <FieldReadonly :value="document.name" />
        </td>
        <td @click="$emit('click', document)">
            <FieldReadonly :value="document.metadata.uploadedby" />
        </td>
        <td @click.stop v-if="!customClick">
            <a class="btn btn-link btn-sm ps-0 pe-0 text-decoration-underline" :href="document.url" target="_blank">
                <template v-if="document.is_image">
                    <img :src="document.url" alt="" style="width: 100px">
                </template>
                <template v-else>
                    {{ i18n('File') }}
                </template>
            </a>
        </td>
        <td v-else>
            <template v-if="document.is_image">
                <img :src="document.url" alt="" style="width: 100px">
            </template>
            <template v-else>
            </template>
        </td>
        <td class="text-end" @click.stop>
            <ActionDropdown :actions="actions" />
        </td>
    </tr>
</template>

<script>
import api from "@/api.js";
import ActionDropdown from "@/components/common/list/ActionDropdown.vue";
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";

export default {
    components: {
        ActionDropdown,
        FieldReadonly,
    },
    props: {
        document: {
            type: Object,
            default() {
                return {};
            },
        },
        customClick: Boolean,
        write: Boolean,
        minimal: Boolean,
        sortMetadata: String,
        sortable: Boolean,
        itemClass: String,
        customActions: [Function, Array],
    },
    emits: [
        'deleted',
        'edit',
        'click',
        'move',
    ],
    methods: {
        onDeleted() {
            this.$emit('deleted', this.document.id);
            api.clearCache();
            this.$nextTick(() => {
                this.$root.setSaved(true);
                this.$root.setLoading(false);
            });
        },
    },
    computed: {
        actions() {
            if (this.customActions &&
                Array.isArray(this.customActions)) {
                return this.customActions;
            }

            let actions = [{
                label: this.i18n('Download'),
                fn: () => {
                    window.open(this.document.url);
                },
            }, {
                label: this.i18n('Edit'),
                fn: () => {
                    this.$emit('edit', this.document);
                },
                if: !!this.write,
            }, {
                label: this.i18n('Move'),
                fn: () => {
                    let position = parseInt(prompt(this.i18n('At what position do you want to place it?')));

                    if (!isNaN(position) && position > 0) {
                        this.$emit('move', {
                            document: this.document,
                            position
                        });
                    }
                },
                if: !!this.write && !!this.sortMetadata && !!this.sortable === true,
            }, {
                label: this.i18n('Delete'),
                fn: () => {
                    this.$root.requestConfirmation(this.i18n('Delete %documentName%?').replace('%documentName%', this.document.name), () => {
                        api.delete(api.urls.gd + 'containers/' + this.document.container_code +
                            '/documents/' + this.document
                                .id).then(this.onDeleted).catch(() => {
                                    this.$root.setSaved(true);
                                });
                    });

                },
                if: !!this.write,
            },];

            if (this.customActions &&
                typeof (this.customActions) === 'function') {
                actions = this.customActions(this.document, actions);
            }

            return actions;
        },
    },
};
</script>

<style lang="scss" scoped>
.custom-click:hover {
    background: rgba(10, 100, 255, 0.1);
}

.custom-click {
    cursor: pointer;
}
</style>