<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M3,10.58027,10.6984,3.9815a2,2,0,0,1,2.6032,0L21,10.58027" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M4.2855,9.47839V20" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            </path>
            <line x1="11" y1="20" x2="3" y2="20" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"></line>
            <polyline points="14.56 15.5 21 15.5 21 15.509 20.306 19 15.259 19 14.258 14 13 14" fill="none"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></polyline>
            <path d="M19.828,21.41479a.05.05,0,1,1-.00029-.00029l.00029.00029" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M15.8,21.41479a.05.05,0,1,1-.00029-.00029l.00029.00029" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M15.62359,5.97182V3.75a.75.75,0,0,1,.75-.75H18.9645a.75.75,0,0,1,.75.75V9.47839" fill="none"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
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