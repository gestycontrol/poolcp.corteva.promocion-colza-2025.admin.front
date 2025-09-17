<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" @submit="submit">
        <template #title>
            {{ i18n('Edit') }}
        </template>
        <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="mb-2">
            <Field type="dictionary" :rest="'types/gdDocuments/' + container.containerType.code" :required="true"
                :disabled="true || submitted" :customAutofocus="true" :label="i18n('Document Type')"
                v-model="formData.document_type_code" :errorMessage="errorMessages.document_type_code"
                :sort="(a, b) => { return a.name.localeCompare(b.name); }"
                :filter="(option) => !documentTypeCodes || !documentTypeCodes.length || documentTypeCodes.indexOf(option._originalObject.code) != -1" />
        </div>
        <div class="mb-2">
            <Field type="textarea" :disabled="submitted" :customAutofocus="true" :label="i18n('Remarks')"
                v-model="formData.metadata.observations" :errorMessage="errorMessages.observations" :maxlength="150" />
        </div>
        <template #footer>
            <div class="row">
                <div class="col text-end">
                    <button type="submit" class="btn btn-dark btn-sm" :disabled="submitted">
                        {{ i18n('Save') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import api from "@/api.js";
import { updateFile, } from "@/tools/file.js";
import { duplicate, } from "@/tools/object.js";
import Modal from "@/components/common/layout/Modal.vue";
import Field from "@/components/common/form/Field.vue";

const defaultFormData = {
    metadata: {},
};

export default {
    components: {
        Modal,
        Field,
    },
    data() {
        return {
            submitted: false,
            formData: JSON.parse(JSON.stringify(defaultFormData)),
            errorMessages: {},
            errorMessage: '',
            documentTypesByCode: null,
        };
    },
    props: {
        document: Object,
        container: {
            type: Object,
            required: true,
        },
        documentTypeCodes: Array,
    },
    emits: [
        'shown',
        'hidden',
        'submit',
        'added',
        'updated',
    ],
    created() {
        api.cached('types/gdDocuments/' + this.container.containerType.code).then(
            documentTypes => {
                let documentTypesByCode = {};

                if (documentTypes && Array.isArray(documentTypes)) {
                    documentTypes.forEach(dT => {
                        documentTypesByCode[dT.code] = dT;
                    });
                }

                this.documentTypesByCode = documentTypesByCode;
            });
    },
    methods: {
        show() {
            this.formData = duplicate(defaultFormData);
            this.formData.document_type_code = this.document.documentType.code;
            this.formData.metadata = duplicate(this.document.metadata);
            this.submitted = false;
            this.$refs['modal'].show();
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
        submit() {
            this.errorMessage = '';
            this.submitted = true;

            updateFile(
                this.document.container_code,
                this.document.id,
                this.formData.document_type_code,
                this.formData.metadata
            ).then((document) => {
                this.hide();
                this.$emit('updated', document);
            }).catch((err) => {
                this.submitted = false;
                this.errorMessage = this.i18n('Could not save.');
            });
        },
    }
};
</script>