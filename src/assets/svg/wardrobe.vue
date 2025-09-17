<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg viewBox="0 0 64 64" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">

            <g fill-rule="evenodd">
                <g transform="translate(11.000000, 6.000000)" fill="currentColor" fill-rule="nonzero">
                    <path
                        d="M37.001,0 L21,0 L4.999,0 C2.243,0 0,2.248 0,5.01 L0,44.99 C0,47.752 2.243,50 4.999,50 L5,50 L5,53 L7,53 L7,50 L21,50 L35,50 L35,53 L37,53 L37,50 L37.001,50 C39.757,50 42,47.752 42,44.99 L42,5.01 C42,2.248 39.757,0 37.001,0 Z M5,48 L5,48 C3.345,48 2,46.65 2,44.99 L2,5.01 C2,3.35 3.345,2 4.999,2 L20,2 L20,48 L7,48 L5,48 Z M40,44.99 C40,46.65 38.655,48 37.001,48 L37,48 L35,48 L22,48 L22,2 L37.001,2 C38.655,2 40,3.35 40,5.01 L40,44.99 Z">
                    </path>
                    <rect x="16" y="21" width="2" height="7">
                    </rect>
                    <rect x="24" y="21" width="2" height="7">
                    </rect>
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