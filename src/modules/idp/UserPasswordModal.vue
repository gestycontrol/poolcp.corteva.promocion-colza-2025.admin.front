<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-md" @submit="submit">
        <template #title>
            {{ i18n('Change {name}\'s Password').replace('{name}',
                [localUser?.first_name, localUser?.last_name].filter(Boolean).join(' ')) }}
        </template>

        <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>

        <div class="row g-2">
            <div class="col-12">
                <Field v-model="formData.password" :errorMessage="errorMessages.password" :label="i18n('Password')"
                    :disabled="submitted" :type="readonly ? 'readonly' : 'password'" />
            </div>
            <div class="col-12">
                <Field v-model="formData.repeat_password" :errorMessage="errorMessages.repeat_password"
                    :label="i18n('Repeat Password')" :disabled="submitted" :type="readonly ? 'readonly' : 'password'" />
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
import {
    duplicate,
} from "@/tools/object.js";
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
            localUserId: null,
            localUser: null,
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
            if (!this.localUser) return false;
            return !(this.localUser.acl?.update === true);
        },
    },
    methods: {
        show(localUserId) {
            this.localUserId = localUserId;
            this.localUser = null;
            this.load().then(() => {
                if (!this.localUser?.acl?.setPassword) return;

                this.submitted = false;
                this.$refs['modal'].show();
                this.errorMessages = {};
                this.errorMessage = '';
                this.formData = {};
            });
        },
        load() {
            if (!this.localUserId) return Promise.resolve();
            let promise = api.get(`${api.urls.idp}localUsers/${this.localUserId}`, { acl: 1 });

            promise.then(localUser => {
                this.localUser = localUser;
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

            api.post(`${api.urls.idp}localUsers/${this.localUser.id}/setPassword`, postFormData).then(localUser => {
                this.$emit('updated', localUser);
                this.$root.showSuccessModal(this.i18n('Password changed successfully.'));
                this.hide();
            }).catch((errorMessage) => {
                if (errorMessage && errorMessage.message && !(errorMessage instanceof TypeError))
                    errorMessage = errorMessage.message;
                if (!errorMessage || (typeof errorMessage != 'string'))
                    errorMessage = 'An error has occurred';
                this.errorMessage = this.i18n(errorMessage);
                this.submitted = false;
            });
        }
    }
}
</script>