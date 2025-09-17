<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1"
            viewBox="0 0 24 24" width="24" height="24" stroke="currentColor">
            <path d="M12.967,3l-8.217,11h7.25l-0.967,7l8.217,-11h-7.25Z" stroke-linecap="round" stroke-width="1.5"
                fill="none" stroke-linejoin="round"></path>
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