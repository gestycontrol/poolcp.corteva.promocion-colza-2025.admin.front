<template>
    <div class="form-outline">
        <div class="input-group">
            <div :class="{ 'form-floating': formFloating, 'focus': smallLabel, [cssClass]: true }">
                <input v-bind="inputAttributes" v-model="value" ref="input" @blur="$emit('blur')"
                    @focus="$emit('focus')">
                <label :for="id" v-if="label">
                    <Tooltip :title="tooltip" v-if="tooltip">
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </Tooltip>
                    <template v-else>
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </template>
                </label>
                <div class="text-danger small ms-1 mt-1" v-if="customErrorMessage">
                    {{ customErrorMessage }}
                </div>
                <Transition v-if="resettable">
                    <span v-if="value" class="clean-field" @click.stop="resetInput">
                        <i>{{ i18n('Cleanup') }}</i>
                        <CleanIcon />
                    </span>
                </Transition>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
import vModelMixin from "@/mixins/common/vModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";
import CleanIcon from "@/assets/svg/clean.vue";

export default {
    components: {
        CleanIcon,
    },
    mixins: [
        vModelMixin,
        fieldMixin,
    ],
    props: {
        formFloating: {
            type: Boolean,
            default: true,
        },
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
            default: 200,
        },
        min: {
            type: [Number, String,],
        },
        max: {
            type: [Number, String,],
        },
        title: {
            type: String,
            default: '',
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
                min: this.min,
                max: this.max,
                title: this.title,
                'data-custom-autofocus': this.customAutofocus ? 'on' : false,
                'data-pseudo-required': this.pseudoRequired ? 'true' : 'false',
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

            // Avoid unintended validation failure for relative URLs
            if (attributes.type === 'url'
                && this.value
                && (this.value.startsWith('#')
                    || this.value.startsWith('/'))
            ) {
                attributes.type = 'text';
            }

            return attributes;
        },
    },
    methods: {
        setEvents() {
            let input = this.$refs['input'];

            if (this.eventsSet ||
                !input) return;
            this.eventsSet = true;

            if (!input.title) return;

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
            this.value = "";
            this.$emit('reset');
        },
    },
};
</script>

<style lang="scss" scoped>
.clean-field {
    .custom-icon {
        max-width: 12px;
        max-height: 12px;
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>