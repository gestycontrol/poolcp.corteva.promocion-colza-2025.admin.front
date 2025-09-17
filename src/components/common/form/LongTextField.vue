<template>
    <div class="form-outline">
        <div class="input-group">
            <div :class="{ 'form-floating': true, 'focus': smallLabel }">
                <textarea v-bind="inputAttributes" v-model="value" ref="input" @blur="$emit('blur')"
                    @focus="$emit('focus')"></textarea>
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
    },
    data() {
        return {
            eventsSet: false,
            overrideErrorMessage: '',
        };
    },
    created() {
        this.setEvents();
    },
    mounted() {
        this.setEvents();
    },
    computed: {
        customErrorMessage() {
            return this.overrideErrorMessage ? this.overrideErrorMessage : this.errorMessage;
        },
        inputAttributes() {
            let attributes = {
                id: this.id,
                type: this.type,
                class: 'form-control' + (this.label ? '' : ' no-label'),
                placeholder: this.placeholder ? this.placeholder : this.label,
                required: this.required,
                readonly: this.readonly,
                disabled: this.disabled,
                autocomplete: this.autocompleteAttr,
                step: this.step,
                pattern: this.pattern,
                maxlength: this.maxlength,
                title: this.title,
                'data-custom-autofocus': this.customAutofocus ? 'on' : false,
                'data-pseudo-required': this.pseudoRequired ? 'true' : 'false',
                rows: this.rows,
            };

            [
                'required',
                'readonly',
                'disabled',
                'autocomplete',
                'step',
                'pattern',
                'maxlength',
                'title',
                'data-custom-autofocus',
                'data-pseudo-required',
            ].forEach(k => {
                if (!attributes[k] ||
                    attributes[k] === 'false') delete attributes[k];
            });

            return attributes;
        },
    },
    methods: {
        setEvents() {
            let input = this.$refs['input'];

            if (this.eventsSet ||
                !input) return;
            this.eventsSet = true;
            input.onblur = () => {
                if (!input.checkValidity) return;
                if (!input.checkValidity()) {
                    this.overrideErrorMessage = input.title;
                }
            };
            input.onfocus = () => {
                this.overrideErrorMessage = '';
            };
        },
        resetInput() {
            this.value = '';
            this.$emit('reset');
        },
    },
};
</script>