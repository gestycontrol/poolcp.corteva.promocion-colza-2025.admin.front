<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' width="16" height="12"
            :style="`transform: rotate(${rotate}deg)`" fill="currentColor">
            <path fill='none' stroke='#343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'
                d='m2 5 6 6 6-6' />
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
        rotate: {
            type: Number,
            default: 0,
        },
    }
}
</script>