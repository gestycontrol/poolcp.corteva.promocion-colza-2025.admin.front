<template>
    <div class="form-outline">
        <div class="input-group">
            <div :class="{ 'form-floating': true, 'focus': smallLabel, 'position-relative': true }">
                <div class="toolbar-container" v-if="!disabled">
                    <div class="toolbar">
                        <button type="button" @click="applyStyle('bold')"><b>B</b></button>
                        <button type="button" @click="applyStyle('italic')"><i>I</i></button>
                        <button type="button" @click="applyStyle('underline')"><u>U</u></button>
                    </div>
                </div>
                <div :contenteditable="!disabled" ref="editable"
                    :class="['form-control', 'editable-content', { 'disabled': disabled }]" @input="updateValue"
                    @blur="$emit('blur')" @focus="$emit('focus')"></div>
                <label :for="id" v-if="label">
                    <Tooltip :title="tooltip" v-if="tooltip">
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </Tooltip>
                    <template v-else>
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </template>
                </label>
                <div class="bg"></div>
                <div class="text-danger small ms-1 mt-1" v-if="customErrorMessage">
                    {{ customErrorMessage }}
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script>
import vModelMixin from "@/mixins/common/vModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";

export default {
    mixins: [
        vModelMixin,
        fieldMixin,
    ],
    props: {
        resettable: {
            type: Boolean,
            default: false,
        },
        type: {
            type: String,
            default: 'text',
        },
        step: {
            type: String,
            default: '1',
        },
        smallLabel: {
            type: Boolean,
            default: false,
        },
        pattern: {
            type: String,
            default: '',
        },
        maxlength: {
            type: Number,
        },
        rows: {
            type: Number,
            default: 10,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            eventsSet: false,
            overrideErrorMessage: '',
            value: '',
        };
    },
    created() {
        this.setEvents();
    },
    mounted() {
        this.setEvents();
        if (this.$refs.editable) {
            this.$refs.editable.innerHTML = this.value;
        }
    },
    watch: {
        modelValue(newValue) {
            if (newValue !== this.value) {
                this.value = newValue;
                if (this.$refs.editable) {
                    this.$refs.editable.innerHTML = newValue;
                }
            }
        },
        value(newValue) {
            if (this.$refs.editable && newValue !== this.$refs.editable.innerHTML) {
                this.$refs.editable.innerHTML = newValue;
            }
        }
    },
    computed: {
        customErrorMessage() {
            return this.overrideErrorMessage ? this.overrideErrorMessage : this.errorMessage;
        },
    },
    methods: {
        setEvents() {
            let input = this.$refs['editable'];

            if (this.eventsSet || !input) return;
            this.eventsSet = true;
            input.onblur = () => {
                this.overrideErrorMessage = '';
            };
        },
        resetInput() {
            this.value = '';
            this.$refs.editable.innerHTML = '';
            this.$emit('reset');
        },
        applyStyle(style) {
            if (this.$refs.editable && !this.disabled) {
                this.$refs.editable.focus();
                document.execCommand(style, false, null);
                this.updateValue();
            }
        },
        updateValue() {
            if (this.$refs.editable) {
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);
                const cursorPosition = range.startOffset;
                this.value = this.$refs.editable.innerHTML;
                this.$emit('update:modelValue', this.value);
                // Restore cursor position safely
                try {
                    const newRange = document.createRange();
                    newRange.setStart(range.startContainer, Math.min(cursorPosition, range.startContainer.length));
                    newRange.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(newRange);
                } catch (e) {
                    console.warn("Error restoring cursor position:", e);
                }
            }
        },
    },
};
</script>

<style scoped>
.toolbar-container {
    z-index: 10;
    position: absolute;
    top: 0.3rem;
    right: 0;
}

.toolbar button {
    margin-right: 5px;
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    padding: 5px;
    cursor: pointer;
}

.toolbar button:hover {
    background-color: #e0e0e0;
}

.editable-content {
    min-height: 10rem !important;
    border: 1px solid #ced4da;
    padding: 0.5rem;
    border-radius: 0.25rem;
    overflow: auto;
}

.editable-content.disabled {
    background-color: var(--bs-secondary-bg);
    pointer-events: none;
    opacity: 1;
}

.form-floating>[contenteditable="false"].disabled.form-control:not(:placeholder-shown)~label::after {
    background-color: transparent;
}
</style>