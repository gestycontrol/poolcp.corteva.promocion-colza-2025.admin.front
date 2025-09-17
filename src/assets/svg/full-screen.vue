<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg width="16" height="16" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none"
            stroke="currentColor">
            <polyline points="20 8 8 8 8 20" />
            <line x1="8" y1="8" x2="24" y2="24" />
            <polyline points="56 20 56 8 44 8" />
            <line x1="56" y1="8" x2="40" y2="24" />
            <polyline points="44 56 56 56 56 44" />
            <line x1="56" y1="56" x2="40" y2="40" />
            <polyline points="8 44 8 56 20 56" />
            <line x1="8" y1="56" x2="24" y2="40" />
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