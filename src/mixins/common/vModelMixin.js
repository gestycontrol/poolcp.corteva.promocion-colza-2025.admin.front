export default {
    data() {
        return {
            value: '',
        }
    },
    props: {
        modelValue: {
            default: '',
        },
    },
    emits: ['update:modelValue'],
    created() {
        this.initializeValue();
    },
    watch: {
        modelValue() {
            this.initializeValue();
        },
        value() {
            this.updateValue();
        },
    },
    methods: {
        initializeValue() {
            const placeholder = this.placeholderValue === undefined ? null : this.placeholderValue;

            if (this.isEmptyValue(this.modelValue)) {
                this.value = placeholder;
            } else {
                this.value = this.modelValue;
            }
        },
        isEmptyValue(val) {
            return val === null || val === undefined || (typeof val === 'object' && Object.keys(val).length === 0);
        },
        updateValue() {
            let formattedValue = this.parseValue(this.value, this.format, this.type);
            this.$emit('update:modelValue', formattedValue);
        },
        parseValue(value, format, inputType) {
            if (!format && inputType === 'number') {
                format = this.determineNumberFormat();
            }

            format = format === 'euro' ? 'float' : format;

            if (this.isNonNullValue(value)) {
                const formatMap = {
                    'int': this.parseInteger,
                    'float': this.parseFloatValue,
                    'boolean': this.parseBoolean,
                    'bool': this.parseBoolean,
                    'object': this.parseObject,
                };

                if (formatMap.hasOwnProperty(format)) {
                    value = formatMap[format].call(this, value);
                }
            }

            return value;
        },
        determineNumberFormat() {
            const isFloat = this.step && parseFloat(this.step) > 0 && parseFloat(this.step) < 1;

            return isFloat ? 'float' : 'int';
        },
        isNonNullValue(value) {
            return value !== null && value !== undefined;
        },
        parseInteger(value) {
            return value === '' ? null : parseInt(value, 10);
        },
        parseFloatValue(value) {
            return value === '' ? null : parseFloat(value);
        },
        parseBoolean(value) {
            const booleanMap = {
                '': null,
                'false': false,
                'true': true,
            };

            return booleanMap.hasOwnProperty(value) ? booleanMap[value] : !!value;
        },
        parseObject(value) {
            return value === '' ? null : value;
        },
    },
};
