<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke="currentColor">
            <line x1="21" y1="8" x2="3" y2="8" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1"></line>
            <path d="M17.5,13A4.5,4.5,0,1,1,13,17.5,4.5,4.5,0,0,1,17.5,13" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
            <path d="M14.673,21H6a3,3,0,0,1-3-3V6A3,3,0,0,1,6,3H18a3,3,0,0,1,3,3v8.673" fill="none"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="1"></path>
            <path d="M17.393,15.983v1.758l1.382.843" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1"></path>
            <path d="M13.749,11.45a.049.049,0,1,0,.049.049.049.049,0,0,0-.049-.049" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
            <path d="M10.249,11.45a.048.048,0,0,0-.048.049.049.049,0,1,0,.048-.049" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
            <path d="M6.749,11.45A.048.048,0,0,0,6.7,11a.049.049,0,1,0,.048-.049" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
            <path d="M10.249,14.45a.048.048,0,0,0-.048.049.049.049,0,1,0,.048-.049" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
            <path d="M6.749,14.45A.048.048,0,0,0,6.7,14.5a.049.049,0,1,0,.048-.049" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
            <path d="M10.249,17.451a.048.048,0,0,0-.048.049.049.049,0,1,0,.048-.049" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
            <path d="M6.749,17.451A.048.048,0,0,0,6.7,17.5a.049.049,0,1,0,.048-.049" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1"></path>
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