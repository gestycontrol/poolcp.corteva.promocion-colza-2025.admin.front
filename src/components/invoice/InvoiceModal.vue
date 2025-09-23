<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-md" @submit="submit">
        <template #title>
            <template v-if="invoice && !readonly">
                {{ i18n('Edit {name}').replace('{name}', i18n('Invoice')) }}
            </template>
            <template v-else-if="invoice">
                {{ i18n('{name} detail').replace('{name}', i18n('Invoice')) }}
            </template>
            <template v-else>
                {{ i18n('Add {name}').replace('{name}', i18n('Invoice')) }}
            </template>
        </template>

        <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>

        <div class="row g-2">
            <div class="col-12" v-if="fileFormat === 'pdf'">
                <iframe :src="invoice?.preview_url" style="width: 100%; aspect-ratio: 1/2;" title="">
                    {{ i18n('Your browser does not support iframes.') }}
                </iframe>
            </div>
            <div class="col-12" v-else-if="fileFormat === 'image'">
                <img :src="invoice?.preview_url" alt="" style="width: 100%;" />
            </div>
            <div class="col-12" v-else-if="invoice?.preview_url">
                <a :href="invoice?.preview_url" target="_blank" rel="noopener noreferrer">
                    {{ i18n('Open file') }}
                </a>
            </div>
            <div class="col-12" v-for="invoiceProduct in (invoice?.invoiceProducts || [])" :key="invoiceProduct.id">
                <FieldReadonly :value="invoiceProduct.quantity" :label="invoiceProduct.product?.name"
                    :suffix="invoiceProduct.product.unit_plural" />
            </div>
            <div class="col-12 col-sm-6">
                <Field v-model="formData.is_valid" :errorMessage="errorMessages.is_valid" :label="i18n('Is Valid')"
                    :disabled="submitted" format="boolean" :type="readonly ? 'readonly' : 'checkbox'" />
            </div>
            <div class="col-12 col-sm-6">
                <Field v-model="formData.is_invalid" :errorMessage="errorMessages.is_invalid"
                    :label="i18n('Is Invalid')" :disabled="submitted" format="boolean"
                    :type="readonly ? 'readonly' : 'checkbox'" />
            </div>
            <div class="col-12" v-if="formData.is_invalid === true">
                <Field v-model="formData.valid_reason" :errorMessage="errorMessages.valid_reason"
                    :label="i18n('Valid Reason')" :disabled="submitted" :type="readonly ? 'readonly' : 'text'" />
            </div>
        </div>

        <template #footer>
            <div class="row">
                <template v-if="!readonly">
                    <div class="col text-start">
                        <button type="button" class="btn btn-danger" @click="hide">
                            {{ i18n('Cancel') }}
                        </button>
                    </div>
                    <div class="col text-end">
                        <button type="submit" class="btn btn-primary text-white" :disabled="submitted">
                            {{ i18n('Confirm') }}
                        </button>
                    </div>
                </template>
                <div class="col text-end" v-else>
                    <button type="button" @click="hide" class="btn btn-outline-dark btn-sm me-2">
                        {{ i18n('Close') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import api from "@/api.js";
import { duplicate, } from "@/tools/object.js";
import { translatedErrorMessage, } from "@/tools/errorHandling.js";
import Modal from "@/components/common/layout/Modal.vue";
import Field from "@/components/common/form/Field.vue";
import FieldReadonly from "@/components/common/form/FieldReadonly.vue";

export default {
    components: {
        Modal,
        Field,
        FieldReadonly,
    },
    props: {
        account: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            invoiceId: null,
            invoice: null,
            submitted: false,
            formData: {},
            errorMessages: {},
            errorMessage: '',
        };
    },
    emits: [
        'shown',
        'hidden',
        'created',
        'updated',
    ],
    watch: {
        'formData.is_valid'(newValue) {
            if (newValue === true && this.formData.is_invalid) {
                this.formData.is_invalid = false;
                this.formData.valid_reason = null;
            }

            if (newValue === true && this.formData.valid_reason) {
                this.formData.valid_reason = null;
            }
        },
        'formData.is_invalid'(newValue) {
            if (newValue === true && this.formData.is_valid) {
                this.formData.is_valid = false;
            }

            if (newValue !== true) {
                this.formData.valid_reason = null;
            }
        },
    },
    computed: {
        fileFormat() {
            if (this.invoice?.preview_url.endsWith('.pdf')) {
                return 'pdf';
            } else if (this.invoice?.preview_url.endsWith('.svg')
                || this.invoice?.preview_url.endsWith('.png')
                || this.invoice?.preview_url.endsWith('.jpg')
                || this.invoice?.preview_url.endsWith('.jpeg')
                || this.invoice?.preview_url.endsWith('.gif')) {
                return 'image';
            }

            return 'other';
        },
        readonly() {
            if (!this.invoice) {
                return false;
            }

            return this.invoice.acl?.update !== true;
        },
    },
    methods: {
        show(invoiceId) {
            this.invoiceId = invoiceId;
            this.invoice = null;
            this.load().then(() => {
                this.submitted = false;
                this.$refs['modal'].show();
                this.errorMessages = {};
                this.errorMessage = '';

                if (this.invoice) {
                    this.formData = duplicate(this.invoice);

                    if (this.invoice.is_valid === true) {
                        this.formData.is_valid = true;
                        this.formData.is_invalid = false;
                    } else if (this.invoice.is_valid === false) {
                        this.formData.is_valid = false;
                        this.formData.is_invalid = true;
                    } else {
                        this.formData.is_valid = false;
                        this.formData.is_invalid = false;
                    }
                } else {
                    this.formData = {};
                }
            });
        },
        load() {
            if (!this.invoiceId) {
                return Promise.resolve();
            }

            let promise = api.get(`admin/accounts/${this.account.id}/invoices/${this.invoiceId}`, { acl: 'invoice' });

            promise.then(invoice => {
                this.invoice = invoice;
            });

            return promise;
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
            this.submitted = true;
            this.errorMessages = {};
            this.errorMessage = '';

            const postFormData = duplicate(this.formData);

            if (postFormData.is_invalid) {
                postFormData.is_valid = false;
            } else if (!postFormData.is_valid) {
                postFormData.is_valid = null;
            }

            delete postFormData.is_invalid;

            let savePromise;

            if (!this.invoice) {
                savePromise = api.post(`admin/accounts/${this.account.id}/invoices`, postFormData);
            } else {
                savePromise = api.put(`admin/accounts/${this.account.id}/invoices/${this.invoice.id}`, postFormData);
            }

            savePromise.then(invoice => {
                if (!this.invoice) {
                    this.$emit('created', invoice);
                } else {
                    this.$emit('updated', invoice);
                }

                this.hide();
            }).catch((errorMessage) => {
                this.errorMessage = translatedErrorMessage(errorMessage);
                this.submitted = false;
            });
        }
    }
}
</script>