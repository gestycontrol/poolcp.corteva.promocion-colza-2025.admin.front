<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-md" @submit="submit">
        <template #title>
            <template v-if="account && !readonly">
                {{ i18n('Edit {name}').replace('{name}', i18n('Account')) }}
            </template>
            <template v-else-if="account">
                {{ i18n('{name} detail').replace('{name}', i18n('Account')) }}
            </template>
            <template v-else>
                {{ i18n('Add {name}').replace('{name}', i18n('Account')) }}
            </template>
        </template>

        <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>

        <div class="row g-2">
            <div class="col-12 col-sm-6">
                <Field v-model="formData.email" :errorMessage="errorMessages.email" :label="i18n('Email')" :disabled="submitted" :required="true" :type="readonly ? 'readonly' : 'email'" />
            </div>
            <div class="col-12 col-sm-6">
                <Field v-model="formData.onboarding_step" :errorMessage="errorMessages.onboarding_step" :label="i18n('Onboarding Step')" :disabled="submitted" :required="true" step="1" format="int" :type="readonly ? 'readonly' : 'number'" />
            </div>
            <div class="col-12 col-sm-6">
                <Field v-model="formData.transfer_mode" :errorMessage="errorMessages.transfer_mode" :label="i18n('Transfer Mode')" :disabled="submitted" :required="true" :type="readonly ? 'readonly' : 'text'" />
            </div>
            <div class="col-12 col-sm-6">
                <Field v-model="formData.transfer_holder" :errorMessage="errorMessages.transfer_holder" :label="i18n('Transfer Holder')" :disabled="submitted" :required="true" :type="readonly ? 'readonly' : 'text'" />
            </div>
            <div class="col-12 col-sm-6">
                <Field v-model="formData.transfer_details" :errorMessage="errorMessages.transfer_details" :label="i18n('Transfer Details')" :disabled="submitted" :required="true" :type="readonly ? 'readonly' : 'text'" />
            </div>
            <div class="col-12 col-sm-6">
                <Field v-model="formData.points" :errorMessage="errorMessages.points" :label="i18n('Points')" :disabled="submitted" :required="true" step="1" format="int" :type="readonly ? 'readonly' : 'number'" />
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

export default {
    components: {
        Modal,
        Field,
    },
    props: {
    },
    data() {
        return {
            accountId: null,
            account: null,
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
    computed: {
        readonly() {
            if (!this.account) {
              return false;
            }

            return this.account.acl?.update !== true;
        },
    },
    methods: {
        show(accountId) {
            this.accountId = accountId;
            this.account = null;
            this.load().then(() => {
                this.submitted = false;
                this.$refs['modal'].show();
                this.errorMessages = {};
                this.errorMessage = '';

                if (this.account) {
                    this.formData = duplicate(this.account);
                } else {
                    this.formData = {};
                }
            });
        },
        load() {
            if (!this.accountId) {
              return Promise.resolve();
            }

            let promise = api.get(`admin/accounts/${this.accountId}`, {acl: 'account'});

            promise.then(account => {
                this.account = account;
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
            let savePromise;

            if (!this.account) {
                savePromise = api.post(`admin/accounts`, postFormData);
            } else {
                savePromise = api.put(`admin/accounts/${this.account.id}`, postFormData);
            }

            savePromise.then(account => {
                if (!this.account) {
                    this.$emit('created', account);
                } else {
                    this.$emit('updated', account);
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