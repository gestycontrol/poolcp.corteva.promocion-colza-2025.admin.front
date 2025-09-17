<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15.58 13.63" fill="currentColor" width="18" height="18">
            <g>
                <path
                    d="M1.95,11.19c0,.27.22.49.49.49h12.17c.54,0,.97.44.97.97s-.44.97-.97.97H2.43c-1.34,0-2.43-1.09-2.43-2.43V.97C0,.44.44,0,.97,0s.97.44.97.97v10.22ZM10.42,7.5c-.38.38-.99.38-1.37,0l-1.75-1.74-2.72,2.72c-.38.38-.99.38-1.37,0-.38-.38-.38-.99,0-1.37l3.41-3.41c.38-.38.99-.38,1.37,0l1.75,1.74,3.21-3.2c.38-.38.99-.38,1.37,0,.38.38.38.99,0,1.37l-3.89,3.89Z" />
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