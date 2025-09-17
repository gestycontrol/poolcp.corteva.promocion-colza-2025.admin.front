<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-lg">
        <template #title>
            {{ titleOrDefault.split('+').join(i18n('Add')) }}
        </template>
        <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>
        <p class="small">
            {{ i18n('Click on an image to import it.') }}
        </p>
        <DocumentList :documents="documents" @click="importDocument" :write="false" v-if="container" :minimal="true"
            :customClick="true" />
        <template #footer>
            <div class="row">
                <div class="col text-end">
                    <button type="button" class="btn btn-danger" data-bs-dismiss="modal">
                        {{ i18n('Cancel') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import api from "@/api.js";
import randomIdMixin from '@/mixins/common/randomIdMixin.js';
import Modal from "@/components/common/layout/Modal.vue";
import Field from "@/components/common/form/Field.vue";
import DocumentList from "@/components/common/gd/list/DocumentList.vue";
import { nowISO, } from '@/tools/date.js';

export default {
    mixins: [
        randomIdMixin,
    ],
    components: {
        Modal,
        Field,
        DocumentList,
    },
    data() {
        return {
            errorMessage: '',
            gdUrl: api.urls.gd,
        };
    },
    props: {
        sourceContainer: {
            type: Object,
            required: true,
        },
        container: {
            type: Object,
            required: true,
        },
        documentTypeCodes: Array,
        defaultMetadata: Object,
        title: {
            type: String,
        },
    },
    emits: [
        'shown',
        'hidden',
        'submit',
        'added',
    ],
    computed: {
        titleOrDefault() {
            if (this.title === undefined) {
                return this.i18n('Import Document');
            }

            return this.title;
        },
    },
    methods: {
        show() {
            api.get(api.urls.gd + 'containers/' + this.sourceContainer.code + '/documents').then(documents => {
                this.documents = documents.filter(d => {
                    return !this.documentTypeCodes
                        || this.documentTypeCodes.indexOf(d.documentType.code) != -1;
                });

                this.submitted = false;
                this.errorMessage = '';
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
        importDocument(document) {
            this.$root.requestConfirmation(this.i18n('Import document %documentName%?').replace('%documentName%', document.name), () => {
                api.post(
                    `${api.urls.gd}containers/${this.sourceContainer.code}/documents/${document.id}/copyTo/${this.container.code}`
                ).then((addedDocument) => {
                    addedDocument.metadata = this.defaultMetadata || {};
                    addedDocument.uploaded = nowISO();

                    api.put(api.urls.gd + 'containers/' +
                        this.container.code + '/documents/' +
                        addedDocument.id + '/metadata', addedDocument.metadata)
                        .then(() => {
                            this.hide();
                            this.$emit('added', addedDocument);
                        }).catch(() => {
                            this.hide();
                            this.$emit('added', addedDocument);
                        });
                }).catch((err) => {
                    this.submitted = false;
                    this.errorMessage = this.i18n('Could not save. Remember that there cannot be two documents with the same name nor can they be exactly the same in the same container %container%').replace('%container%', this.container.code);
                });
            });
        },
    }
};
</script>