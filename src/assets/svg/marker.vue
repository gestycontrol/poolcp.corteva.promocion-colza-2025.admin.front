<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12.5 16.52" width="16" height="16" fill="currentColor"
            class="bi bi-geo-alt-fill">
            <g>
                <path style="stroke-width: 0px;"
                    d="M6.25,16.52l-.34-.33c-.24-.23-5.91-5.65-5.91-9.95C0,2.8,2.8,0,6.25,0s6.25,2.8,6.25,6.25c0,4.3-5.67,9.72-5.91,9.95l-.34.33ZM6.25,1C3.35,1,1,3.35,1,6.25c0,3.3,4.03,7.64,5.25,8.88,1.22-1.24,5.25-5.58,5.25-8.88,0-2.9-2.35-5.25-5.25-5.25ZM6.25,9.62c-1.86,0-3.38-1.51-3.38-3.38s1.51-3.38,3.38-3.38,3.38,1.51,3.38,3.38-1.51,3.38-3.38,3.38ZM6.25,3.88c-1.31,0-2.38,1.07-2.38,2.38s1.07,2.38,2.38,2.38,2.38-1.07,2.38-2.38-1.07-2.38-2.38-2.38Z" />
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