export default {
    data() {
        return {
            value: [],
        }
    },
    props: {
        modelValue: Array,
    },
    emits: ['update:modelValue'],
    created() {
        if (this.modelValue !== undefined &&
            Array.isArray(this.modelValue)) {
            this.value = this.modelValue;
        } else {
            this.value = [];
        }
    },
    watch: {
        modelValue: {
            handler() {
                if (this.modelValue !== undefined &&
                    Array.isArray(this.modelValue)) {
                    this.value = this.modelValue;
                } else {
                    this.value = [];
                }
            },
            deep: true,
        },
        value: {
            handler() {
                this.$emit('update:modelValue', this.value)
            },
            deep: true,
        },
    },
    computed: []
};