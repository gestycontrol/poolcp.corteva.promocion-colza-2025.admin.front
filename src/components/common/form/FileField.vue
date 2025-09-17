<template>
    <div class="form-outline">
        <div class="input-group">
            <div :class="{ 'focus': true }">
                <label :for="id" v-if="label">
                    <Tooltip :title="tooltip" v-if="tooltip">
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </Tooltip>
                    <template v-else>
                        {{ label + (required || pseudoRequired ? '*' : '') }}
                    </template>
                </label>
                <input type="file" v-bind="inputAttributes" ref="input" @change="inputChange" :id="id"
                    @blur="$emit('blur')" @focus="$emit('focus')">
                <div class="text-danger small ms-1 mt-1" v-if="customErrorMessage">
                    {{ customErrorMessage }}
                </div>
            </div>
            <slot></slot>
        </div>
    </div>
</template>
<script>
import fieldMixin from "@/mixins/common/fieldMixin.js";
import {
    getFileInfo,
    imageMimeTypes,
    videoMimeTypes,
    fileMimeTypes,
} from "@/tools/file.js";

export default {
    mixins: [
        fieldMixin,
    ],
    props: {
        resettable: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        multiple: {
            type: Boolean,
            default: true,
        },
        images: {
            type: String,
            default: '',
        },
        videos: {
            type: String,
            default: '',
        },
        files: {
            type: String,
            default: '',
        },
        pseudoRequired: {
            type: Boolean,
            default: false,
        },
        required: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            type: 'file',
            value: [],
            customErrorMessage: '',
        };
    },
    computed: {
        fileTypeDescription() {
            let types = [];

            if (this.images) {
                types.push(this.i18n('photos'));
            }

            if (this.videos) {
                types.push(this.i18n('videos'));
            }

            if (this.files) {
                types.push(this.i18n('files'));
            }

            return types.join(', ').replace(/, ([^,]*)$/, this.i18n(' and $1'));
        },
        inputAttributes() {
            let attrs = {
                class: 'form-control',
            };

            if (this.multiple) {
                attrs.multiple = '';
            }

            if (this.required) {
                attrs.required = '';
            }

            if (this.disabled) {
                attrs.disabled = '';
            }

            if (this.allowedMimeTypes.length &&
                this.allowedMimeTypes[0] != '*') {
                attrs.accept = this.allowedMimeTypes.join(',');
            }

            return attrs;
        },
        allowedMimeTypes() {
            let mimeTypes = [];

            if (this.images) {
                if (this.images == '*') {
                    mimeTypes = [
                        ...mimeTypes,
                        ...imageMimeTypes,
                    ];
                } else {
                    mimeTypes = [
                        ...mimeTypes,
                        ...this.images.split(',')
                    ];
                }
            }

            if (this.videos) {
                if (this.videos == '*') {
                    mimeTypes = [
                        ...mimeTypes,
                        ...videoMimeTypes,
                    ];
                } else {
                    mimeTypes = [
                        ...mimeTypes,
                        ...this.videos.split(',')
                    ];
                }
            }

            if (this.files) {
                if (this.files == '*') {
                    mimeTypes = [
                        ...mimeTypes,
                        ...fileMimeTypes,
                    ];
                } else {
                    mimeTypes = [
                        ...mimeTypes,
                        ...this.files.split(',')
                    ];
                }
            }

            return mimeTypes;
        },
    },
    emits: [
        'input',
    ],
    methods: {
        async inputChange() {
            if (this.processing) return;
            if (!this.$refs['input']) return;
            if (!this.$refs['input'].files ||
                this.$refs['input'].files.length == 0) {
                if (this.value && this.value.length > 0) {
                    this.value = [];
                    this.$emit('input', this.value);
                }

                return;
            }

            this.processing = true;

            let files = [];

            for (const element of this.$refs['input'].files) {
                let info = await getFileInfo(element, false);
                files.push(info);
            }

            this.value = files;
            this.processing = false;

            this.$emit('input', this.value);
        },
        getFiles() {
            return this.value;
        },
    },
};
</script>

<style scoped>
.form-floating.focus .form-control {
    padding-top: 0.4rem;
    height: 2.1rem;
}
</style>