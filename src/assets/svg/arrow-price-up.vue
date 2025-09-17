<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
            viewBox="0 0 24 24" width="24" height="24">
            <g stroke-linecap="round" stroke-width="1.5" stroke="#DD143C" fill="none" stroke-linejoin="round">
                <path d="M12.01,4.51v14.99"></path>
                <path d="M6.023,10.514l5.977,-6.016l5.977,6.016"></path>
            </g>
            <path fill="none" d="M0,0h24v24h-24Z"></path>
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