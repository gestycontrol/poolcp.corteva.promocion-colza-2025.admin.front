<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-1415.000000, -228.000000)">
                    <g transform="translate(1402.000000, 222.000000)">
                        <g transform="translate(13.000000, 6.000000)">
                            <polygon points="0 0 24 0 24 24 0 24"></polygon>
                            <path
                                d="M7.801,10.46 C7.96,9.91 8.446,9.5 9.047,9.5 C9.775,9.5 10.366,10.09 10.366,10.819 C10.366,11.471 9.837,12 9.185,12 C9.837,12 10.366,12.529 10.366,13.181 C10.366,13.909 9.776,14.5 9.047,14.5 C8.446,14.5 7.96,14.09 7.801,13.54"
                                stroke="#171C47" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                            <path
                                d="M14.275,14.5 L12.866,14.5 L12.866,9.5 L14.275,9.5 C15.338,9.5 16.2,10.362 16.2,11.425 L16.2,12.576 C16.199,13.638 15.338,14.5 14.275,14.5 L14.275,14.5 Z"
                                stroke="#171C47" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                            <path
                                d="M10.115,5.544 L8.638,4.066 C11.776,2.738 15.539,3.347 18.096,5.905 C21.204,9.013 21.436,13.9 18.805,17.281"
                                stroke="#171C47" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                            <path
                                d="M5.195,6.719 C2.565,10.101 2.796,14.988 5.904,18.095 C8.461,20.652 12.224,21.262 15.362,19.934 L13.884,18.456"
                                stroke="#171C47" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            </path>
                        </g>
                    </g>
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