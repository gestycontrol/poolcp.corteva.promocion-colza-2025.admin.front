<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(5.000000, 5.000000)" stroke="#979797">
                    <polyline points="0 0 2.96363993 2.96363994 6 6"></polyline>
                    <polyline
                        transform="translate(3.000000, 3.000000) rotate(-90.000000) translate(-3.000000, -3.000000) "
                        points="1.66533454e-15 1.39591866e-14 2.96363993 2.96363994 6 6"></polyline>
                </g>
                <circle stroke="#979797" cx="8" cy="8" r="7"></circle>
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