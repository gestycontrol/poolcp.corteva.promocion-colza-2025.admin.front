<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill-rule="nonzero">
                    <path
                        d="M8,2.5 C8.27614237,2.5 8.5,2.72385762 8.5,3 L8.5,7.5 L5.75,7.5 C5.35057977,7.5 5.02408478,7.81223 5.00127317,8.2059318 L5,8.25 L5,11 L0.5,11 C0.223857625,11 0,10.7761424 0,10.5 L0,3 C0,2.72385762 0.223857625,2.5 0.5,2.5 L8,2.5 Z"
                        fill="#E1E1E1"></path>
                    <rect fill="#FF7000" x="10" y="0" width="6" height="6" rx="1"></rect>
                    <path
                        d="M13,7.5 C13.2761424,7.5 13.5,7.72385762 13.5,8 L13.5,15.5 C13.5,15.7761424 13.2761424,16 13,16 L5.5,16 C5.22385762,16 5,15.7761424 5,15.5 L5,11 L7.75,11 C8.14942023,11 8.47591522,10.68777 8.49872683,10.2940682 L8.5,10.25 L8.5,7.5 L13,7.5 Z"
                        fill="#FFC942"></path>
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