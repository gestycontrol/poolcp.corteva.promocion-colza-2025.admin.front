<template></template>

<script>
export default {
    props: {
        selected: {
            type: Boolean,
            default: false,
        },
    },
    emits: [
        'click',
    ],
};
</script>