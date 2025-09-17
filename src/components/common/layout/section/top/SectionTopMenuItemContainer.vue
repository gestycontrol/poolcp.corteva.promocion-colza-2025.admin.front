<template>
    <div class="sticky-top" :style="{ top: stickyY }">
        <ul class="nav mt-3 bg-white custom-shadow-bar">
            <slot></slot>
        </ul>
    </div>
</template>
<script>
export default {
    props: {
        stickyY: {
            type: String,
            default: "124px",
        },
    },
};
</script>