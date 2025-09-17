<template>
    <div class="loading-overlay">
        <div class="p-5 text-center w-100">
            <span class="spinner-border spinner-border-lg" role="status">
                <span class="visually-hidden">{{ i18n('Loading...') }}</span>
            </span>
        </div>
    </div>
</template>
<script>
export default {
    components: {
    },
};
</script>

<style lang="scss" scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 2147483647;
    display: flex;
    align-items: center;
}
</style>