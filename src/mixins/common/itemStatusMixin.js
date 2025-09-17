import { getAttr } from "@/tools/object.js";

export default {
    data() {
        return {
            completed: false,
        };
    },
    props: {
        disabledComplete: {
            type: Boolean,
            default: false,
        },
        completedField: {
            type: String,
            default: null,
        },
        autocomplete: {
            type: Boolean,
            default: false,
        },
    },
    computed: {
        firstEmptyRequiredField() {
            let markableAsComplete = true,
                firstEmptyRequiredField = null;

            if (!this.requiredFields) return [];

            this.requiredFields.forEach((fieldWithOptions) => {
                if (!markableAsComplete) return;

                fieldWithOptions = fieldWithOptions.split('#');
                let f = fieldWithOptions[0],
                    options = fieldWithOptions[1],
                    value = getAttr(this.formData, f);

                if (!value &&
                    value !== 0 &&
                    value !== false) {
                    markableAsComplete = false;
                } else if (Array.isArray(value)) {
                    let ignoreValues = false,
                        hasEmptyValue = false,
                        hasValue = false;

                    value.forEach(val => {
                        hasValue = true;

                        if (val &&
                            typeof (val) == 'object') {
                            ignoreValues = true;
                        } else if (!val &&
                            val !== 0 &&
                            val !== false) {
                            hasEmptyValue = true;
                        } else if (options === 'true' && val !== true) {
                            hasEmptyValue = true;
                        }
                    });

                    if (!ignoreValues &&
                        (hasEmptyValue || !hasValue)) {
                        markableAsComplete = false;
                    }
                } else if (options === 'true' && value !== true) {
                    markableAsComplete = false;
                }

                if (!markableAsComplete) {
                    firstEmptyRequiredField = [
                        f,
                        value
                    ];
                }
            });

            return firstEmptyRequiredField;
        },
        markableAsComplete() {
            if (this.disabledComplete) return false;

            return !this.firstEmptyRequiredField;
        },
    },
    mounted() {
        if (this.completedField &&
            this.formData[this.completedField]) {
            this.completed = true;
        }
    },
    watch: {
        completedField() {
            if (this.completedField &&
                this.formData[this.completedField]) {
                this.completed = true;
            }
        },
        markableAsComplete() {
            if (!this.markableAsComplete &&
                this.completed) {
                this.completed = false;
            }

            if (this.markableAsComplete &&
                this.autocomplete &&
                !this.completed) {
                this.completed = true;
            }
        },
        completed() {
            if (this.completedField) {
                this.formData[this.completedField] = this.completed;
            }
        },
    },
};