<template>
    <div :class="`col-12 col-lg-10 ${small ? 'col-xl-11 col-xxl-11' : ''} position-relative`">
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        small: Boolean,
    },
};
</script>