<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M8,21h8a5,5,0,0,0,5-5V8a5,5,0,0,0-5-5H8A5,5,0,0,0,3,8v8A5,5,0,0,0,8,21Z" fill="none"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M5.5,12H6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M18.5,12H18" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M15.9,8.1l-2.5,2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            </path>
            <path d="M11.981,10a2,2,0,1,1-2,2,2,2,0,0,1,2-2" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"></path>
            <path d="M12,5.5V6" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M7.4,7.4l.36.36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            </path>
            <path d="M7.4,16.6l.36-.36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            </path>
            <path d="M16.6,16.6l-.36-.36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            </path>
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