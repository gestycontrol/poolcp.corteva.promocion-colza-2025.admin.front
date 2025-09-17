<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
                <polyline stroke="#E34848" points="2.09545135 2.04118919 7.94492566 7.94812409 13.9379311 14">
                </polyline>
                <polyline stroke="#E34848"
                    transform="translate(8.016691, 8.020595) rotate(-90.000000) translate(-8.016691, -8.020595) "
                    points="2.09545135 2.04118919 7.94492566 7.94812409 13.9379311 14"></polyline>
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