<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor">
            <path d="M21,16v3.286h0A1.714,1.714,0,0,1,19.286,21H14" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M3,8V4.714H3A1.714,1.714,0,0,1,4.714,3H10" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M13.01517,6.1225V11a1,1,0,0,0,1,1h6.05965a1,1,0,0,0,1-1V6.2003" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <path d="M22,7,17.65394,3.24345a1,1,0,0,0-1.30788,0L12,7" fill="none" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="1.5"></path>
            <circle cx="6.5471" cy="13.24999" r="2.25" fill="none" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="1.5"></circle>
            <path d="M10.5,20.5V20a2,2,0,0,0-2-2h-4a2,2,0,0,0-2,2v.5A.5.5,0,0,0,3,21h7A.5.5,0,0,0,10.5,20.5Z"
                fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
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