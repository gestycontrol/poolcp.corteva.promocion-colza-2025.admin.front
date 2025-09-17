<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px"
            width="24px" height="24px" viewBox="0 0 24 24" stroke="currentColor">
            <g>
                <g>
                    <path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        d="M19.714,9.612V4    c0-0.552-0.448-1-1-1h-1.857c-0.552,0-1,0.448-1,1v2.306"></path>
                    <path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        d="M3,10.714l7.698-6.598    c0.749-0.642,1.854-0.642,2.603,0L21,10.714"></path>
                    <path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        d="M4.286,9.612V19    c0,1.105,0.895,2,2,2H11"></path>
                    <path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        d="M21,21l-1.639-1.639"></path>
                    <path fill="none" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
                        d="M16.724,13    c2.057,0,3.724,1.668,3.724,3.724s-1.668,3.724-3.724,3.724S13,18.781,13,16.724S14.668,13,16.724,13">
                    </path>
                </g>
            </g>
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