<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" @submit="submit">
        <template #title>
            {{ titleOrDefault.split('+').join(i18n('Add')) }}
        </template>
        <div :class="{ 'drop-zone': true, dragging: draggingFile }" :id="dropZoneId" @drop="dropHandler"
            :data-dragging-text="i18n('Drop Your Files Here')" @dragover="dragOverHandler"
            @dragleave="dragLeaveHandler">
            <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>
            <div class="mb-2" v-if="!customDocumentTypes || !customDocumentTypes.length">
                <Field type="dictionary" :rest="'types/gdDocuments/' + container.containerType.code" :required="true"
                    :disabled="submitted || (documentTypeCodes && documentTypeCodes.length === 1) || files.length > 0"
                    :customAutofocus="true" :label="i18n('Document Type')" v-model="formData.document_type_code"
                    :errorMessage="errorMessages.document_type_code"
                    :sort="(a, b) => { return a.name.localeCompare(b.name); }"
                    :filter="(option) => !documentTypeCodes || !documentTypeCodes.length || documentTypeCodes.indexOf(option._originalObject.code) != -1" />
            </div>
            <div class="mb-2" v-else>
                <Field type="dictionary" :list="customDocumentTypes" :required="true" :disabled="submitted"
                    format="object" :customAutofocus="true" :label="i18n('Document Type')"
                    v-model="formData.customDocumentType" :errorMessage="errorMessages.customDocumentType"
                    :sort="(a, b) => { return a.name.localeCompare(b.name); }" />
            </div>
            <template v-if="canSelectFile">
                <div class="mb-2">
                    <Field type="textarea" :disabled="submitted" :customAutofocus="true" :label="i18n('Remarks')"
                        v-model="formData.metadata.observations" :errorMessage="errorMessages.observations"
                        :maxlength="150" />
                </div>
                <div class="mb-2">
                    <FileField :multiple="multiple" @input="fileInput" :required="true"
                        :disabled="submitted || !canSelectFile" :customAutofocus="true" :label="i18n('File')"
                        :errorMessage="errorMessages.file" ref="fileInput" :files="listOfValidFileTypes" />
                </div>
            </template>
        </div>
        <template #footer>
            <div class="row">
                <div class="col text-end">
                    <button type="submit" class="btn btn-dark btn-sm" :disabled="submitted">
                        {{ i18n('Upload') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import api from "@/api.js";
import { uploadFile, } from "@/tools/file.js";
import { duplicate, } from "@/tools/object.js";
import randomIdMixin from '@/mixins/common/randomIdMixin.js';
import Modal from "@/components/common/layout/Modal.vue";
import Field from "@/components/common/form/Field.vue";
import FileField from "@/components/common/form/FileField.vue";

const defaultFormData = {
    metadata: {},
};

export default {
    mixins: [
        randomIdMixin,
    ],
    components: {
        Modal,
        Field,
        FileField,
    },
    data() {
        return {
            draggingFile: false,
            clearDragTimeout: null,
            submitted: false,
            formData: JSON.parse(JSON.stringify(defaultFormData)),
            errorMessages: {},
            errorMessage: '',
            files: [],
            documentTypesByCode: null,
            gdUrl: api.urls.gd,
        };
    },
    props: {
        customDocumentTypes: Array,
        multiple: Boolean,
        container: {
            type: Object,
            required: true,
        },
        documentTypeCodes: Array,
        defaultMetadata: Object,
        title: {
            type: String,
        },
        maxImageSideSize: {
            type: Number,
        },
        sortMetadata: String,
    },
    emits: [
        'shown',
        'hidden',
        'submit',
        'added',
    ],
    computed: {
        canSelectFile() {
            return this.formData.customDocumentType || this.formData.document_type_code;
        },
        dropZoneId() {
            return 'drop-zone-' + this.randomId;
        },
        listOfValidFileTypes() {
            let customDocumentType = this.formData.customDocumentType,
                document_type_code = this.formData.document_type_code;

            if (customDocumentType) {
                document_type_code = customDocumentType.document_type_code;
            }

            if (!document_type_code ||
                !this.documentTypesByCode ||
                !this.documentTypesByCode[document_type_code] ||
                !this.documentTypesByCode[document_type_code].acceptedMimeTypes) {
                return '*';
            }

            return this.documentTypesByCode[document_type_code].acceptedMimeTypes.join(',');
        },
        titleOrDefault() {
            if (this.title === undefined) {
                return this.i18n('New Document');
            }

            return this.title;
        },
    },
    methods: {
        dropHandler(event) {
            let htmlFileInput;
            event.preventDefault();
            this.draggingFile = false;

            if (!this.canSelectFile) return;
            if (!this.$refs['fileInput']) return;
            htmlFileInput = document.getElementById(this.$refs['fileInput'].id);
            if (!htmlFileInput) return;

            if (event.dataTransfer.items) {
                const dT = new DataTransfer();

                [...event.dataTransfer.items].forEach((item, i) => {
                    if (item.kind === 'file') {
                        dT.items.add(item.getAsFile());
                    }
                });

                htmlFileInput.files = dT.files;
                this.fileInput(dT.files);
            } else {
                htmlFileInput.files = evt.dataTransfer.files;
                this.fileInput(evt.dataTransfer.files);
            }
        },
        dragOverHandler(event) {
            event.preventDefault();
            if (!this.canSelectFile) return;
            this.draggingFile = true;
            clearTimeout(this.clearDragTimeout);
        },
        dragLeaveHandler(event) {
            event.preventDefault();
            if (!this.draggingFile) return;
            if (!this.canSelectFile) {
                this.draggingFile = false;
                return;
            }

            clearTimeout(this.clearDragTimeout);
            this.clearDragTimeout = setTimeout(() => {
                this.draggingFile = false;
            }, 100);
        },
        show() {
            api.cached('types/gdDocuments/' + this.container.containerType.code).then(
                documentTypes => {
                    documentTypes = documentTypes.filter((documentType) => !this.documentTypeCodes || !this
                        .documentTypeCodes.length || this.documentTypeCodes.indexOf(documentType.code) != -1
                    );

                    let documentTypesByCode = {};

                    if (documentTypes && Array.isArray(documentTypes)) {
                        documentTypes.forEach(dT => {
                            documentTypesByCode[dT.code] = dT;
                        });
                    }

                    clearTimeout(this.clearDragTimeout);
                    this.draggingFile = false;
                    this.clearDragTimeout = null;
                    this.submitted = false;
                    this.formData = JSON.parse(JSON.stringify(defaultFormData));

                    if (documentTypes.length === 1) {
                        this.formData.document_type_code = documentTypes[0].code;
                    }

                    this.errorMessages = {};
                    this.errorMessage = '';
                    this.files = [];
                    this.documentTypesByCode = documentTypesByCode;
                    this.$refs['modal'].show();
                });
        },
        hide() {
            this.$refs['modal'].hide();
        },
        shown() {
            this.$emit('shown');
        },
        hidden() {
            this.$emit('hidden');
        },
        fileInput(files) {
            let processedFiles = Array.from(files).map(file => file.binary ? file.binary : file);

            if (this.multiple || processedFiles.length == 0) {
                this.files = processedFiles;
            } else {
                this.files = processedFiles.slice(0, 1);
            }
        },
        submit() {
            if (!this.files[0]) {
                this.errorMessage = this.i18n('Select a file to continue.');
                return;
            }

            this.errorMessage = '';
            this.submitted = true;
            let customDocumentType = this.formData.customDocumentType,
                document_type_code = this.formData.document_type_code;

            let metadata = Object.assign(this.formData.metadata, this.defaultMetadata);

            if (customDocumentType) {
                document_type_code = customDocumentType.document_type_code;

                if (customDocumentType.metadata) {
                    metadata = Object.assign(metadata, customDocumentType.metadata);
                }
            }

            Promise.all(this.files.map(file =>
                uploadFile(
                    this.container.code,
                    document_type_code,
                    file,
                    file.name,
                    duplicate(metadata),
                    this.$root.loggedUser,
                    this.maxImageSideSize,
                    this.sortMetadata,
                ).then((document) => {
                    this.$emit('added', document);
                })
            )).then(() => {
                this.hide();
            }).catch((err) => {
                this.submitted = false;
                this.errorMessage = this.i18n('Could not save. Remember that there cannot be two documents with the same name nor can they be exactly the same in the same container %container%').replace('%container%', this.container.code);
            });
        },
    }
};
</script>
<style>
.drop-zone.dragging {
    outline: 2px dashed blue;
    opacity: 0.7;
    position: relative;
}

.drop-zone.dragging>* {
    opacity: 0.3;
    pointer-events: none;
}

.drop-zone.dragging::after {
    content: attr(data-dragging-text);
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    text-align: center;
    margin-top: -0.5em;
    color: blue;
}
</style>