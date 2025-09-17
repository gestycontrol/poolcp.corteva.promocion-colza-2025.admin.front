<template>
    <i :class="{ 'custom-icon': !inline, 'custom-icon__big': big, 'custom-icon__inline': inline }">
        <svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink" class="bi bi-chat-right">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g fill="currentColor" fill-rule="nonzero">
                    <path
                        d="M2,1 C1.44771525,1 1,1.44771525 1,2 L1,10 C1,10.5522847 1.44771525,11 2,11 L11.586,11 C12.1163896,11.0001133 12.6250145,11.2109013 13,11.586 L15,13.586 L15,2 C15,1.44771525 14.5522847,1 14,1 L2,1 Z M14,0 C15.1045695,0 16,0.8954305 16,2 L16,14.793 C16,14.9953268 15.8779834,15.1776856 15.6910007,15.2549747 C15.5040179,15.3322638 15.2888857,15.2892474 15.146,15.146 L12.293,12.293 C12.1055073,12.1054506 11.8511948,12.0000566 11.586,12 L2,12 C0.8954305,12 0,11.1045695 0,10 L0,2 C0,0.8954305 0.8954305,0 2,0 L14,0 Z">
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