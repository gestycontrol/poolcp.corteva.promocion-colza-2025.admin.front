<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline, 'pointer': true }">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
            xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" version="1.1" x="0px" y="0px" width="25px"
            height="25px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve">

            <path
                d="M23.621,13.328L7.657,29.293L2,30l0.707-5.657L18.672,8.379L23.621,13.328z M24.328,12.621  l2.293-2.293l-4.95-4.95l-2.293,2.293L24.328,12.621z M28.87,5.251L26.749,3.13c-0.781-0.781-2.047-0.781-2.828,0l-1.542,1.542  l4.95,4.95L28.87,8.08C29.651,7.299,29.651,6.032,28.87,5.251z"
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
        },
    },
}
</script>