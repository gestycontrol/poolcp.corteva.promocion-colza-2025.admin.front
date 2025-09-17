<template>
    <div :class="`col-12 col-lg-2 ${small ? 'col-xl-1 col-xxl-1' : ''} position-relative`">
        <ul class="nav flex-column nav-pills sticky-md-top border-top border-start border-end bg-body custom-layout-aside"
            :style="{ top: stickyY }">
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
        small: Boolean,
    },
};
</script>