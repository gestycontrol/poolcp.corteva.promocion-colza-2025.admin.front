<template>
    <div :class="itemClass ? itemClass : 'col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2 col-lg-modal-3'">
        <div class="position-relative multimedia-wrapper" @click="$emit('opened', document)" role="button">
            <img :src="document.url" class="img-thumbnail" alt="" v-if="document.is_image">
            <div class="img-thumbnail d-flex align-items-center position-relative" v-else>
                <div class="w-100 text-center">
                    <VideoIcon v-if="document.is_video" />
                    <FileIcon v-else />
                    <div class="text-truncate small text-muted mt-1 position-absolute w-100 bottom-0 start-0 end-0 p-2">
                        {{ document.name }}
                    </div>
                </div>
            </div>
            <span class="actions-multimedia" @click.stop>
                <ActionDropdown :actions="actions" />
            </span>
        </div>
    </div>
</template>

<script>
import api from "@/api.js";
import ActionDropdown from "@/components/common/list/ActionDropdown.vue";
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";
import VideoIcon from "@/assets/svg/video.vue";
import FileIcon from "@/assets/svg/file.vue";
import ClipIcon from "@/assets/svg/clip.vue";
import CrossIcon from "@/assets/svg/cross.vue";

export default {
    components: {
        ActionDropdown,
        FieldReadonly,
        VideoIcon,
        FileIcon,
        ClipIcon,
        CrossIcon,
    },
    props: {
        document: {
            type: Object,
            default() {
                return {};
            },
        },
        write: Boolean,
        sortMetadata: String,
        sortable: Boolean,
        itemClass: String,
        customActions: [Function, Array],
    },
    emits: [
        'opened',
        'deleted',
        'edit',
        'move',
    ],
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
                if: this.write,
            }, {
                label: this.i18n('Move'),
                fn: () => {
                    let position = parseInt(prompt(this.i18n('In which position would you like to place it?')));

                    if (!isNaN(position) && position > 0) {
                        this.$emit('move', {
                            document: this.document,
                            position
                        });
                    }
                },
                if: this.write && this.sortMetadata && this.sortable,
            }, {
                label: this.i18n('Delete'),
                fn: () => {
                    const onDeleted = () => {
                        this.$emit('deleted', this.document.id);
                        api.clearCache();
                        this.$nextTick(() => {
                            this.$root.setSaved(true);
                            this.$root.setLoading(false);
                        });
                    };

                    this.$root.requestConfirmation(this.i18n('Delete %s?').replace('%s', this.document.name), () => {
                        api.delete(api.urls.gd + 'containers/' + this.document.container_code +
                            '/documents/' + this.document
                                .id).then(onDeleted).catch(() => {
                                    this.$root.setSaved(true);
                                });
                    });
                },
                if: this.write,
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
@media all and (min-width: 992px) {
    .modal {
        .col-lg-modal-3 {
            width: 25% !important;
        }
    }
}

.actions-multimedia {
    position: absolute;
    right: 7px;
    top: 7px;
    background: white;
}

.img-thumbnail {
    aspect-ratio: 1/1;
    width: 100%;
    object-fit: cover;
}
</style>