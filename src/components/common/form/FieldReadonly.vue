<template>
    <div class="read-only" :class="label ? '' : ' no-label'">
        <div class="small text-muted">
            <Tooltip :title="tooltip" v-if="tooltip">
                {{ label }}
            </Tooltip>
            <template v-else>
                {{ label }}
            </template>
        </div>
        <div :class="formatParentClass">
            <FormattedValue :value="value === undefined ? modelValue : value" :format="format" :suffix="suffix"
                :prefix="prefix" :formatClass="formatClass" :step="step" :allowZero="allowZero" />
            <slot></slot>
        </div>
    </div>
</template>
<script>
import FormattedValue from "@/components/common/form/FormattedValue.vue";
import Tooltip from "@/components/common/layout/Tooltip.vue";

export default {
    components: {
        FormattedValue,
        Tooltip,
    },
    props: {
        allowZero: {
            type: Boolean,
            default: false,
        },
        tooltip: String,
        modelValue: {},
        value: {},
        format: {
            type: String,
        },
        formatClass: {
            type: [String, Function],
        },
        step: {
            type: String,
        },
        label: {},
        suffix: String,
        prefix: String,
        formatParentClass: {
            type: String,
            default: "text-truncate",
        },
    },
};
</script>

<style scoped>
.read-only {
    margin-top: 0.35rem;
}

.read-only .small.text-muted {
    line-height: 1.1;
}
</style>