<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor">
            <line x1="12" y1="3" x2="11.99999" y2="4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"></line>
            <path d="M6.5,10.5v-1A5.5,5.5,0,0,1,12,4h0a5.5,5.5,0,0,1,5.5,5.5v1" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <path
                d="M17.5,10.5a8.19857,8.19857,0,0,0,2.359,5.65761.49555.49555,0,0,1-.35438.84231L4.49541,17a.49563.49563,0,0,1-.35438-.84241A8.19857,8.19857,0,0,0,6.5,10.5"
                fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M9.274,16.99994a2.73893,2.73893,0,1,0,5.452,0" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
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