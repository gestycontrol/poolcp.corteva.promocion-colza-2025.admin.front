<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-xl modal-x2l">
        <template #title>
            <slot name="title">{{ video.name }}</slot>
        </template>
        <VideoPlayer :video="video" :navigation="navigation" @started="started" @ended="ended" @paused="paused"
            @enterfullscreen="enterfullscreen" @exitfullscreen="exitfullscreen" @next="$emit('next')"
            @prev="$emit('prev')" />
        <template #footer>
            <div class="row">
                <div class="col text-start">
                    <button type="button" @click="hide" class="btn btn-outline-dark btn-sm me-2">
                        {{ i18n('Close') }}
                    </button>
                </div>
                <div class="col text-end" v-if="!isExternalVideo">
                    <button type="button" @click="download" class="btn btn-dark btn-sm me-2">
                        {{ i18n('Download') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import Modal from "@/components/common/layout/Modal.vue";
import VideoPlayer from "@/components/common/multimedia/VideoPlayer.vue";

export default {
    components: {
        Modal,
        VideoPlayer,
    },
    props: {
        video: {
            type: Object,
            default() {
                return {};
            },
        },
        downloadAction: {
            type: Function,
        },
        navigation: Boolean,
    },
    emits: [
        'shown',
        'hidden',
        'started',
        'ended',
        'paused',
        'enterfullscreen',
        'exitfullscreen',
        'next',
        'prev',
    ],
    computed: {
        isExternalVideo() {
            // This is now handled by VideoPlayer component
            return false;
        },
    },
    methods: {
        inIframe() {
            try {
                return window.self !== window.top;
            } catch {
                return true;
            }
        },
        download() {
            if (this.downloadAction) {
                this.downloadAction();
            } else {
                window.open(this.video.url);
            }
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
        started() {
            this.$emit('started');
        },
        ended() {
            this.$emit('ended');
        },
        paused() {
            this.$emit('paused');
        },
        enterfullscreen() {
            this.$emit('enterfullscreen');
        },
        exitfullscreen() {
            this.$emit('exitfullscreen');
        },
    }
};
</script>