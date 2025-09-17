<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" :modalClass="modalClass"
        :modalBackdropClass="modalBackdropClass">
        <template #title>
            <slot name="title">{{ image.name }}</slot>
        </template>
        <div class="position-relative">
            <div :class="{ border: !this.fullscreen, 'fullscreen-image': this.fullscreen }">
                <img :src="image.url" class="w-100 no-height-overflow" @load="imageLoaded" alt="" />
            </div>
            <div class="position-absolute multimedia-navigation" v-if="navigation">
                <a class="prev" href="javascript:void" @click="$emit('prev')">
                    <LeftArrowIcon />
                </a>
                <a class="next" href="javascript:void" @click="$emit('next')">
                    <RightArrowIcon />
                </a>
            </div>
        </div>
        <template #footer v-if="buttons">
            <div class="row">
                <div class="col text-start me-auto">
                    <button type="button" @click="hide" class="btn btn-outline-dark btn-sm me-2">
                        {{ i18n('Close') }}
                    </button>
                </div>
                <div class="col text-end">
                    <slot name="actions"></slot>
                    <button type="button" @click="download" class="btn btn-dark btn-sm ms-1">
                        {{ i18n('Download') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import Modal from "@/components/common/layout/Modal.vue";
import LeftArrowIcon from "@/assets/svg/left-arrow.vue";
import RightArrowIcon from "@/assets/svg/right-arrow.vue";

export default {
    components: {
        Modal,
        LeftArrowIcon,
        RightArrowIcon,
    },
    props: {
        image: {
            type: Object,
            default() {
                return {};
            },
        },
        navigation: Boolean,
        buttons: {
            type: Boolean,
            default: true
        },
        fullscreen: Boolean,
    },
    emits: [
        'shown',
        'hidden',
        'next',
        'prev',
    ],
    watch: {},
    computed: {
        modalBackdropClass() {
            if (this.fullscreen) return 'modal-image-backdrop modal-image-backdrop-fullscreen';
            return 'modal-image-backdrop';
        },
        modalClass() {
            if (this.fullscreen) return 'modal-image modal-fullscreen';
            return 'modal-image modal-xl modal-x2l';
        },
    },
    methods: {
        inIframe() {
            try {
                return window.self !== window.top;
            } catch (e) {
                return true;
            }
        },
        download() {
            window.open(this.image.url);
        },
        show() {
            this.$refs['modal'].show({
                fullscreen: this.inIframe()
            });
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
};
</script>