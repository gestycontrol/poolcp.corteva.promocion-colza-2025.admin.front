<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" @submit="submit">
        <template #title>
            {{ i18n('Import %s').split('%s').join(name) }}
        </template>
        <div v-if="importInfo">
            <template v-if="importInfo.ended_at && (!importInfo.errors || Object.keys(importInfo.errors).length == 0)">
                <div class="alert alert-success mb-3">
                    {{ strings.success.split('%s').join(formatDate(importInfo.ended_at) + ' ' +
                        formatTime(importInfo.ended_at)) }}
                </div>
            </template>
            <template v-else-if="importInfo.ended_at">
                <div class="alert alert-warning mb-3">
                    <p>{{ strings.error.split('%s').join(formatDate(importInfo.ended_at) + ' ' +
                        formatTime(importInfo.ended_at)) }}</p>
                    <ul class="mb-0">
                        <li v-for="(error, line) in importInfo.errors" :key="line">
                            {{ line }}: {{ i18n(error) }}
                        </li>
                    </ul>
                </div>
            </template>
            <template v-else>
                <div class="alert alert-info mb-3">
                    {{ strings.running.split('%s').join(formatDate(importInfo.created_at) + ' ' +
                        formatTime(importInfo.created_at)) }}
                    {{ Math.round(importInfo.row_current / Math.max(importInfo.row_count, 1) * 100) }}%
                </div>
            </template>
        </div>
        <div v-if="canImport">
            <div :class="{ 'drop-zone': true, dragging: draggingFile }" :id="dropZoneId" @drop="dropHandler"
                :data-dragging-text="i18n('Drop Your Files Here')" @dragover="dragOverHandler"
                @dragleave="dragLeaveHandler">
                <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>
                <div class="mb-2">
                    <FileField @input="fileInput" :required="true" :disabled="submitted" :customAutofocus="true"
                        :label="i18n('File')" :errorMessage="errorMessages.file" ref="fileInput"
                        files="text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" />
                </div>
                <div class="mb-2" v-if="!live">
                    <Field cssClass="small-checkbox" type="checkbox"
                        :label="i18n('IMPORT_LIVE_HELP_HTML').replace('%s', delayMinutes)"
                        v-model="formData.options.live" />
                </div>
                <p class="mt-3">
                    <small v-dompurify-html="importHelperHtml"></small>
                </p>
            </div>
        </div>
        <template #footer>
            <div class="row" v-if="canImport">
                <div class="col text-end">
                    <button type="submit" class="btn btn-dark btn-sm" :disabled="submitted">
                        {{ i18n('Import') }}
                    </button>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col text-end">
                    <button type="button" class="btn btn-dark btn-sm" @click="hide">{{ i18n('Close') }}</button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import api from "@/api.js";
import randomIdMixin from '@/mixins/common/randomIdMixin.js';
import Modal from "@/components/common/layout/Modal.vue";
import FileField from "@/components/common/form/FileField.vue";
import Field from "@/components/common/form/Field.vue";
import { formatDate, formatTime, } from "@/tools/date.js";
import $env from "@/tools/environment.js";
import { translatedErrorMessage, } from "@/tools/errorHandling.js";

export default {
    mixins: [randomIdMixin,],
    components: {
        Modal,
        FileField,
        Field,
    },
    data() {
        return {
            draggingFile: false,
            clearDragTimeout: null,
            submitted: false,
            formData: {
                options: {},
            },
            errorMessages: {},
            errorMessage: '',
            files: [],
            importInfo: null,
            canImport: false,
            formatDate,
            formatTime,
            strings: {},
            updateInterval: null,
            delayMinutes: parseInt($env('VITE_IMPORT_MINUTES', 1)),
        };
    },
    props: {
        name: String,
        columns: Array,
        endpoint: String,
        live: Boolean,
    },
    emits: [
        'shown',
        'hidden',
        'submit',
        'created',
    ],
    computed: {
        dropZoneId() {
            return 'drop-zone-' + this.randomId;
        },
        importHelperHtml() {
            return this.i18n('IMPORT_HELPER_HTML').split('%s').join('<ul class="mt-1 mb-0 pb-0"><li>' + this.columns.join('</li><li>') + '</li></ul>');
        },
    },
    methods: {
        dropHandler(event) {
            let htmlFileInput;
            event.preventDefault();
            this.draggingFile = false;

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
            this.draggingFile = true;
            clearTimeout(this.clearDragTimeout);
        },
        dragLeaveHandler(event) {
            event.preventDefault();
            if (!this.draggingFile) return;
            clearTimeout(this.clearDragTimeout);
            this.clearDragTimeout = setTimeout(() => {
                this.draggingFile = false;
            }, 100);
        },
        show() {
            api.get(this.endpoint).then((importInfo) => {
                this.importInfo = importInfo;
                this.canImport = !this.importInfo || this.importInfo.ended_at;

                clearTimeout(this.clearDragTimeout);
                clearInterval(this.updateInterval);
                this.draggingFile = false;
                this.clearDragTimeout = null;
                this.submitted = false;
                this.formData = {
                    options: {},
                };
                this.errorMessages = {};
                this.errorMessage = '';
                this.files = [];

                if (this.live) {
                    this.formData.options.live = true;
                }

                this.strings = {
                    success: this.i18n('Last import ended successfully at %s.'),
                    error: this.i18n('Last import ended with errors at %s.'),
                    running: this.i18n('Import started at %s - '),
                };

                this.updateInterval = setInterval(() => {
                    api.get(this.endpoint).then((importInfo) => {
                        this.importInfo = importInfo;
                        this.canImport = !this.importInfo || this.importInfo.ended_at;
                    });
                }, 15000);

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
            clearTimeout(this.clearDragTimeout);
            clearInterval(this.updateInterval);
            this.$emit('hidden');
        },
        fileInput(files) {
            let processedFiles = Array.from(files).map(file => file.binary ? file.binary : file);

            if (processedFiles.length == 0) {
                this.files = processedFiles;
            } else {
                this.files = processedFiles.slice(0, 1);
            }
        },
        submit() {
            if (!this.canImport) return;

            if (!this.files[0]) {
                this.errorMessage = this.i18n('Select a file to continue.');
                return;
            }

            this.submitted = true;
            this.errorMessages = {};
            this.errorMessage = '';

            const postFormData = new FormData();
            postFormData.append('file', this.files[0]);

            Object.keys(this.formData.options).forEach((key) => {
                postFormData.append('options[' + key + ']', this.formData.options[key]);
            });

            api.post(this.endpoint, postFormData).then(importInfo => {
                this.importInfo = importInfo;
                this.canImport = false;
                this.submitted = false;

                if (this.importInfo.ended_at) {
                    this.$emit('created');
                    clearInterval(this.updateInterval);
                }
            }).catch((errorMessage) => {
                this.errorMessage = translatedErrorMessage(errorMessage);
                this.submitted = false;
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