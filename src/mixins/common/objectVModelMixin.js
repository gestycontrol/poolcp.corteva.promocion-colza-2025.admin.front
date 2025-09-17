export default {
    data() {
        return {
            value: {},
        }
    },
    props: {
        modelValue: Object,
    },
    emits: ['update:modelValue'],
    created() {
        if (this.modelValue !== undefined) {
            this.value = this.modelValue;
        } else {
            this.value = {};
        }
    },
    watch: {
        modelValue: {
            handler() {
                if (this.modelValue !== undefined) {
                    this.value = this.modelValue;
                } else {
                    this.value = {};
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
    computed: {}
};