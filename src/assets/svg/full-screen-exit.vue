<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg width="16" height="16" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"
            stroke="currentColor">
            <polyline points="52 40 40 40 40 52" />
            <line x1="40" y1="40" x2="56" y2="56" />
            <polyline points="24 52 24 40 12 40" />
            <line x1="24" y1="40" x2="8" y2="56" />
            <polyline points="12 24 24 24 24 12" />
            <line x1="24" y1="24" x2="8" y2="8" />
            <polyline points="40 12 40 24 52 24" />
            <line x1="40" y1="24" x2="56" y2="8" />
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