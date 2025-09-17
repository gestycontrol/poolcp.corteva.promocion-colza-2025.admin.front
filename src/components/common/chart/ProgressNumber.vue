<template>
    <div class="progress-number">
        <div class="progress-number-percent">
            {{ percent }}
        </div>
        <div class="progress">
            <div class="progress-bar" role="progressbar" :aria-label="i18n('Completed percentage')"
                :aria-valuenow="percent + '%'" aria-valuemin="0" aria-valuemax="100" :style="{ width: percent + '%' }">
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        percent: Number,
    },
}
</script>

<style lang="scss" scoped>
.progress-number {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    border-radius: 3px;

    .progress-number-percent {
        margin-right: 10px;
    }

    .progress {
        width: 100%;
        border-radius: 3px;
        background-color: #ebf2f0;
    }

    .progress-bar {
        border-radius: 3px;
    }
}
</style>