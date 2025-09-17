<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="1.1" x="0px" y="0px" width="23px"
            height="25px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">
            <path
                d="M30.284,6.665l-7.778,7.778l-4.243-4.243l-6.364,6.364l0.707,0.707l5.657-5.657l3.536,3.536  L7.657,29.293L4.121,30l-0.707-0.707L2.707,30L2,29.293l0.707-0.707L2,27.879l0.707-3.536l8.485-8.485l-0.707-0.707l7.071-7.071  l0.707,0.707l7.071-7.071L30.284,6.665z"
                style="fill: #111918;" />
        </svg>
    </i>
</template>
<script>
export default {
    props: {
        big: {
            type: Boolean,
            default: false,
        },
        inline: {
            type: Boolean,
            default: false,
        }
    }
}
</script>