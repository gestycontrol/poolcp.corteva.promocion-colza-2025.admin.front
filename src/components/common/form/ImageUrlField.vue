<template>
    <div class="form-outline">
        <div v-if="preview" class="border img-ratio-1-1 bg-light mb-1 mx-0 d-flex align-items-center">
            <img alt="" :src="value" class="img-ratio-1-1 img-cover w-100" v-if="value" />
            <div class="mx-auto" v-else>
                <NoImageIcon :size="40" />
            </div>
        </div>
        <div class="input-group" v-if="!value || value.length < 2000">
            <div :class="{ 'form-floating': true, 'focus': smallLabel, [cssClass]: true }">
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
                <Transition v-if="resettable">
                    <span v-if="value" class="clean-field" @click.stop="resetInput">
                        <i>{{ i18n('Cleanup') }}</i>
                        <CleanIcon />
                    </span>
                </Transition>
            </div>
            <label :for="`clickable-${id}`" style="min-width: 3rem;"
                class="btn btn-secondary d-flex align-items-center position-relative overflow-hidden" v-if="!disabled">
                <CloudArrowUpIcon cssClass="custom-icon__inline text-muted" />
                <input :id="`clickable-${id}`" type="file" @change="inputFileChange" class="invisible position-absolute"
                    ref="fileInput" accept="image/png, image/gif, image/jpeg, image/svg+xml, image/webp">
            </label>
            <slot></slot>
        </div>
        <div class="input-group" v-else>
            <div :class="{ 'form-floating': true, 'focus': smallLabel, [cssClass]: true }">
                <input v-bind="disabledInputAttributes" v-model="valueShort" ref="input" @blur="$emit('blur')"
                    @focus="$emit('focus')">
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
                        <i>{{}}</i>
                        <CleanIcon />
                    </span>
                </Transition>
            </div>
            <button style="min-width: 3rem;" type="button"
                class="btn btn-secondary d-flex align-items-center position-relative overflow-hidden"
                @click.stop="resetInput" v-if="!disabled">
                <TrashIcon cssClass="custom-icon__inline text-muted" />
            </button>
            <slot></slot>
        </div>
        <div class="text-danger small ms-1 mt-1" v-if="customErrorMessage">
            {{ customErrorMessage }}
        </div>
    </div>
</template>
<script>
import vModelMixin from "@/mixins/common/vModelMixin.js";
import fieldMixin from "@/mixins/common/fieldMixin.js";
import CleanIcon from "@/assets/svg/clean.vue";
import CloudArrowUpIcon from "@/assets/svg/cloud-arrow-up.vue";
import TrashIcon from "@/assets/svg/trash.vue";
import NoImageIcon from "@/assets/svg/no-image.vue";

import {
    getFileInfo,
    resizeImage,
    getFileBase64,
} from "@/tools/file.js";

export default {
    components: {
        CleanIcon,
        CloudArrowUpIcon,
        TrashIcon,
        NoImageIcon,
    },
    mixins: [
        vModelMixin,
        fieldMixin,
    ],
    props: {
        maxImageSideSize: Number,
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
        preview: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            eventsSet: false,
            overrideErrorMessage: '',
            processing: false,
            valueShort: '',
        };
    },
    created() {
        this.setEvents();
    },
    mounted() {
        this.setEvents();
    },
    watch: {
        value() {
            this.valueShort = (this.value || '').substr(0, 100);
        },
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
                disabled: this.disabled || this.processing,
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

            return attributes;
        },
        disabledInputAttributes() {
            let inputAttributes = { ...this.inputAttributes };
            inputAttributes.disabled = true;
            return inputAttributes;
        },
    },
    methods: {
        async inputFileChange() {
            if (this.processing) return;
            if (!this.$refs['fileInput'] || !this.$refs['fileInput'].files || this.$refs['fileInput'].files.length === 0) {
                this.clearInputValue();
                return;
            }

            this.processing = true;

            for (const file of this.$refs['fileInput'].files) {
                const fileInfo = await this.getFileInformation(file);
                if (!fileInfo) return;

                let resizedImage = await this.handleImageResize(fileInfo);
                this.value = await this.convertToBase64(resizedImage);
                break;
            }

            this.processing = false;
        },
        clearInputValue() {
            if (this.value && this.value.length > 0) {
                this.value = [];
                this.$emit('input', this.value);
            }
        },
        async getFileInformation(file) {
            const info = await getFileInfo(file, false);
            if (!info || (!info.is_image && !info.is_svg_image) || !info.binary) {
                this.overrideErrorMessage = this.i18n('The file is not an image');
                this.processing = false;
                return null;
            }
            return info;
        },
        async handleImageResize(info) {
            let resizedImage = info.binary;

            if (!info.is_svg_image && this.maxImageSideSize && this.maxImageSideSize > 0) {
                const shouldResize = this.maxImageSideSize < Math.max(info.dimensions.width, info.dimensions.height);
                if (shouldResize) {
                    resizedImage = await resizeImage(resizedImage, this.maxImageSideSize);
                }
            }

            return resizedImage;
        },
        async convertToBase64(image) {
            return await getFileBase64(image);
        },
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