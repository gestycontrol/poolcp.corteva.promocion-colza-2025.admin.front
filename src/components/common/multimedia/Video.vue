<template>
    <video controls class="ratio ratio-16x9">
        <source :src="video.url" type="video/mp4">

        <track v-for="(subtitle, index) in video.subtitles" :key="'subtitle-' + index" :label="subtitle.label"
            kind="subtitles" :srclang="subtitle.srclang" :src="subtitle.src" :default="subtitle.default || false">

        <track v-for="(description, index) in video.descriptions" :key="'description-' + index"
            :label="description.label" kind="descriptions" :srclang="description.srclang" :src="description.src"
            :default="description.default || false">

        <track v-for="(chapter, index) in video.chapters" :key="'chapter-' + index" :label="chapter.label"
            kind="chapters" :srclang="chapter.srclang" :src="chapter.src" :default="chapter.default || false">
    </video>
</template>

<script>
export default {
    props: {
        video: {
            type: Object,
            default() {
                return {
                    url: '',
                    subtitles: [],
                    descriptions: [],
                    chapters: []
                };
            },
        },
    },
    emits: [
        'started',
        'ended',
        'paused',
        'enterfullscreen',
        'exitfullscreen',
    ],
    methods: {
        play() { },
        pause() { },
        stop() { },
        position() { },
    }
};
</script>
