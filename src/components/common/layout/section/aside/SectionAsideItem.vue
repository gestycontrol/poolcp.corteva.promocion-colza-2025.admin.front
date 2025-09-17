<template>
    <template v-if="selected">
        <slot></slot>
    </template>
</template>

<script>
export default {
    props: {
        selected: {
            type: Boolean,
            default: false,
        },
    },
};
</script>