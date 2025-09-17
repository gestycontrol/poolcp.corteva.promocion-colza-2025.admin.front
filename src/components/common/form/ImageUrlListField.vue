<template>
    <div class="form-outline">
        <div class="input-group">
            <div :class="{ [cssClass]: true }">
                <label :for="id" v-if="label">
                    <Tooltip :title="tooltip" v-if="tooltip">
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </Tooltip>
                    <template v-else>
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </template>
                </label>
                <Transition v-if="resettable">
                    <span v-if="value" class="clean-field" @click.stop="resetInput">
                        <i>{{ i18n('Cleanup') }}</i>
                        <CleanIcon />
                    </span>
                </Transition>

            </div>
            <div class="w-100 mt-2">
                <div class="row g-2">
                    <template v-for="(valueItem, index) in ((value || []).length + (disabled ? 0 : 1))" :key="index">
                        <div class="col-12 col-sm-6 col-lg-4">
                            <ImageUrlField :modelValue="(value || [])[index]" :preview="preview" :disabled="disabled"
                                @update:modelValue="updateInnerModelValue(index, $event)"
                                :maxImageSideSize="maxImageSideSize"
                                :label="i18n('Image #{number}').replace('{number}', index + 1)">
                                <button type="button" class="btn btn-secondary"
                                    v-if="index < (value || []).length - 1 && !disabled" @click="moveItemRight(index)"
                                    :style="arrowButtonStyle" v-dompurify-html="arrowButtonHtml"></button>
                            </ImageUrlField>
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <div class="text-danger small ms-1 mt-1" v-if="customErrorMessage">
            {{ customErrorMessage }}
        </div>
    </div>
</template>
<script>
import arrayVModelMixin from "@/mixins/common/arrayVModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";
import CleanIcon from "@/assets/svg/clean.vue";
import ImageUrlField from "@/components/common/form/ImageUrlField.vue";

export default {
    components: {
        CleanIcon,
        ImageUrlField,
    },
    mixins: [
        arrayVModelMixin,
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
        preview: {
            type: Boolean,
            default: false,
        },
        maxImageSideSize: Number,
        arrowButtonStyle: {
            type: String,
            default: 'border-left: 1px solid #999 !important; padding-left: 0.25em !important; padding-right: 0.25em !important;',

        },
        arrowButtonHtml: {
            type: String,
            default: '<svg height="1rem" width="1rem" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 330 330"><path d="M250.606 154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213.001-5.857 5.858-5.857 15.355.001 21.213l139.393 139.39L79.393 304.394c-5.857 5.858-5.857 15.355.001 21.213C82.322 328.536 86.161 330 90 330s7.678-1.464 10.607-4.394l149.999-150.004a14.996 14.996 0 000-21.213z"/></svg>',
        },
    },
    data() {
        return {
            overrideErrorMessage: '',
        };
    },
    computed: {
        expectsObject() {
            return this.format == 'object';
        },
        customErrorMessage() {
            return this.overrideErrorMessage ? this.overrideErrorMessage : this.errorMessage;
        },
    },
    methods: {
        moveItemRight(index) {
            let newValue = [...(this.value || [])];
            let item = newValue.splice(index, 1)[0];
            newValue.splice(index + 1, 0, item);
            this.$emit('update:modelValue', newValue);
        },
        updateInnerModelValue(index, value) {
            let newValue = [...(this.value || [])];

            if (index > newValue.length) {
                newValue.push(value);
            } else {
                newValue[index] = value;
            }

            this.$emit('update:modelValue', newValue);
        },
        resetInput() {
            this.value = [];
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