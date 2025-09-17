<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M3,10.58027,10.6984,3.9815a2,2,0,0,1,2.6032,0L21,10.58027" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <line x1="11" y1="21" x2="3" y2="21" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"></line>
            <path d="M15.62359,5.97182V3.75a.75.75,0,0,1,.75-.75H18.9645a.75.75,0,0,1,.75.75V9.47839" fill="none"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M4.2855,9.47839V21" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5">
            </path>
            <path
                d="M16.66707,13H14.188A1.18807,1.18807,0,0,0,13,14.18813V16.6666a1.18906,1.18906,0,0,0,.34941.84043l3.14471,3.145a1.18875,1.18875,0,0,0,1.68066,0l2.47733-2.47672a1.18909,1.18909,0,0,0,0-1.68085l-3.1447-3.145A1.1888,1.1888,0,0,0,16.66707,13Z"
                fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M15.53232,15.53222a.04445.04445,0,1,0,.00008-.00008l-.00008.00008" fill="none"
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