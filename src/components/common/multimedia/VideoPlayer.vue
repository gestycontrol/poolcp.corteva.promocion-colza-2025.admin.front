<template>
    <div class="position-relative">
        <div v-if="isExternalVideo" v-html="embedHtml" class="ratio ratio-16x9"></div>
        <Video v-else :video="video" ref="video" @started="started" @ended="ended" @paused="paused"
            @enterfullscreen="enterfullscreen" @exitfullscreen="exitfullscreen" />

        <div class="position-absolute multimedia-navigation multimedia-navigation-video" v-if="navigation">
            <a class="prev" href="javascript:void" @click="$emit('prev')">
                <LeftArrowIcon />
            </a>
            <a class="next" href="javascript:void" @click="$emit('next')">
                <RightArrowIcon />
            </a>
        </div>
    </div>
</template>

<script>
import Video from "@/components/common/multimedia/Video.vue";
import LeftArrowIcon from "@/assets/svg/left-arrow.vue";
import RightArrowIcon from "@/assets/svg/right-arrow.vue";
import { detectExternalVideo, generateEmbedHtml } from "@/tools/video.js";

export default {
    components: {
        Video,
        LeftArrowIcon,
        RightArrowIcon,
    },
    props: {
        video: {
            type: Object,
            default() {
                return {};
            },
        },
        navigation: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        'started',
        'ended',
        'paused',
        'enterfullscreen',
        'exitfullscreen',
        'next',
        'prev',
    ],
    data() {
        return {
            externalVideoInfo: null,
        };
    },
    computed: {
        isExternalVideo() {
            return this.externalVideoInfo !== null;
        },
        embedHtml() {
            if (!this.externalVideoInfo) return '';
            return generateEmbedHtml(this.externalVideoInfo);
        },
    },
    watch: {
        video: {
            handler(newVideo) {
                this.detectVideoType();
            },
            immediate: true,
        },
    },
    methods: {
        detectVideoType() {
            if (this.video && this.video.url) {
                this.externalVideoInfo = detectExternalVideo(this.video.url);
            } else {
                this.externalVideoInfo = null;
            }
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