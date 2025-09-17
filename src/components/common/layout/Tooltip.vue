<template>
    <span data-bs-toggle="tooltip" data-bs-html="true" data-bs-custom-class="custom-tooltip" :data-bs-title="title"
        :class="{ 'no-i': noI }" :id="id" v-if="title">
        <slot></slot>
    </span>
    <template v-else>
        <slot></slot>
    </template>
</template>
<script>
import { Tooltip, } from 'bootstrap';
import randomIdMixin from "@/mixins/common/randomIdMixin.js";

export default {
    mixins: [
        randomIdMixin,
    ],
    data() {
        return {
            tooltip: null,
        };
    },
    beforeUnmount() {
        this.clearTooltip();
    },
    mounted() {
        this.setTooltip();
    },
    props: {
        title: String,
        noI: {
            type: Boolean,
            default: false,
        }
    },
    computed: {
        id() {
            return 'tooltip-' + this.randomId;
        },
    },
    watch: {
        title() {
            this.setTooltip();
        },
    },
    methods: {
        clearTooltip() {
            if (this.tooltip) this.tooltip.dispose();
            this.tooltip = null;
        },
        setTooltip() {
            this.clearTooltip();
            this.$nextTick(() => {
                let node = document.getElementById(this.id);

                if (!node) return;
                this.tooltip = new Tooltip(node);
            });
        },
    }
};
</script>