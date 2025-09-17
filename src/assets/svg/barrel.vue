<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="20" height="20" fill="currentColor"
            class="bi bi-barrel-alt-fill">
            <g>
                <path style="stroke-width: 0px;"
                    d="M20.07,1.64h-4.44v-.51c0-.62-.51-1.13-1.13-1.13h-3c-.62,0-1.13.51-1.13,1.13v.51h-4.44c-1.32,0-2.39,1.07-2.39,2.39v19.59c0,1.32,1.07,2.39,2.39,2.39h14.13c1.32,0,2.39-1.07,2.39-2.39V4.02c0-1.32-1.07-2.39-2.39-2.39ZM11.81,1.43h2.39v.2h-2.39v-.2ZM21.02,23.61c0,.53-.43.95-.95.95H5.93c-.53,0-.95-.43-.95-.95v-5.26h16.04v5.26ZM21.02,16.92H4.98v-6.21h16.04v6.21ZM4.98,9.28v-5.26c0-.53.43-.95.95-.95h14.13c.53,0,.95.43.95.95v5.26H4.98Z" />
                <rect style="stroke-width: 0px; fill: none;" width="20" height="20" />
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