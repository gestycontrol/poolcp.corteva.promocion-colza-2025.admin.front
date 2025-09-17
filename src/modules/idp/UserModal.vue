<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-md" @submit="submit">
        <template #title>
            <template v-if="user && !readonly">
                {{ i18n('Edit {name}').replace('{name}', i18n('User')) }}
            </template>
            <template v-else-if="user">
                {{ i18n('{name} Detail').replace('{name}', i18n('User')) }}
            </template>
            <template v-else>
                {{ i18n('Add {name}').replace('{name}', i18n('User')) }}
            </template>
        </template>

        <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>

        <div v-if="!user && !emailSearched" class="row g-2">
            <div class="col-12">
                <Field v-model="searchEmail" :label="i18n('Email')" type="email" :required="true" :disabled="submitted"
                    placeholder="Enter email to search..." />
            </div>
        </div>
        <div v-if="user || emailSearched" class="row g-2">
            <div class="col-12">
                <Field v-model="formData.first_name" :errorMessage="errorMessages.first_name"
                    :label="i18n('First Name')" :disabled="submitted" :type="readonly ? 'readonly' : 'text'" />
            </div>
            <div class="col-12">
                <Field v-model="formData.last_name" :errorMessage="errorMessages.last_name" :label="i18n('Last Name')"
                    :disabled="submitted" :type="readonly ? 'readonly' : 'text'" />
            </div>
            <div class="col-12">
                <Field v-model="formData.email" :errorMessage="errorMessages.email" :label="i18n('Email')"
                    :disabled="submitted || !!userId" :required="true" :type="readonly ? 'readonly' : 'email'" />
            </div>
            <div class="col-12">
                <Field v-model="selectedProfile" :errorMessage="errorMessages.profile" :label="i18n('Profile')"
                    :disabled="submitted" :list="profiles" format="object"
                    :type="readonly ? 'readonly' : 'dictionary'" />
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
                        <button v-if="!user && !emailSearched" type="submit" class="btn btn-primary text-white"
                            :disabled="submitted">
                            {{ i18n('Continue') }}
                        </button>
                        <button v-else type="submit" class="btn btn-primary text-white" :disabled="submitted">
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
import $env from "@/tools/environment.js";

export default {
    components: {
        Modal,
        Field,
    },
    props: {
    },
    data() {
        return {
            userId: null,
            user: null,
            submitted: false,
            formData: {},
            errorMessages: {},
            errorMessage: '',
            domainsByOrigin: {},
            profiles: [],
            currentUserProfiles: [],
            selectedProfile: null,
            searchEmail: '',
            emailSearched: false,
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
            if (!this.user) return false;
            return !(this.user.acl?.update === true);
        },
    },
    methods: {
        show(userId, baseFormData) {
            this.userId = userId;
            this.user = null;
            this.emailSearched = false;
            this.searchEmail = '';
            this.load().then(() => {
                this.submitted = false;
                this.$refs['modal'].show();
                this.errorMessages = {};
                this.errorMessage = '';
                this.selectedProfile = null;

                if (this.user) {
                    this.formData = duplicate(this.user);
                    this.selectedProfile = this.profiles.find(p => p.id == this.currentUserProfiles[0]?.id) || null;
                } else if (baseFormData) {
                    this.formData = duplicate(baseFormData);
                    this.emailSearched = true;
                } else {
                    this.formData = {};
                }
            });
        },
        async searchUserByEmail() {
            this.searchEmail = (this.searchEmail || '').trim().toLowerCase();

            if (!this.searchEmail) {
                this.errorMessages.email = this.i18n('Email is required.');
                return;
            }

            this.submitted = true;
            this.errorMessages = {};
            this.errorMessage = '';

            try {
                const email = this.searchEmail.trim().toLowerCase();
                const users = await api.get(`${api.urls.idp}users`, { email: email, acl: 1 });

                if (users && users.length > 0) {
                    this.userId = users[0].id;
                    this.user = users[0];
                    this.emailSearched = true;
                    await this.load();
                    this.formData = duplicate(this.user);
                    this.selectedProfile = this.profiles.find(p => p.id == this.currentUserProfiles[0]?.id) || null;
                } else {
                    this.emailSearched = true;
                    this.formData = {
                        email: email,
                        first_name: '',
                        last_name: '',
                    };
                }
            } catch (error) {
                console.error('Error searching user:', error);
                this.errorMessage = this.i18n('An error occurred while searching for the user.');
            } finally {
                this.submitted = false;
            }
        },
        load() {
            const promises = [];

            if (this.userId) {
                let promise = api.get(`${api.urls.idp}users/${this.userId}`, { acl: 1 });

                promise.then(user => {
                    this.user = user;
                });

                promises.push(promise);

                promise = api.get(`${api.urls.idp}users/${this.userId}/profiles`).then(profiles => {
                    this.currentUserProfiles = profiles.filter(p => p.application.id == $env('VITE_IDP_CLIENT_ID'));
                });

                promises.push(promise);
            }

            promises.push(api.cached(`${api.urls.idp}configuration/domains`).then(domainsByOrigin => {
                this.domainsByOrigin = domainsByOrigin;
            }));

            promises.push(api.cached(`${api.urls.idp}applications/${$env('VITE_IDP_CLIENT_ID')}/profiles`).then(profiles => {
                this.profiles = profiles;
            }));

            return Promise.all(promises);
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
            if (!this.user && !this.emailSearched) {
                this.searchUserByEmail();
                return;
            }

            this.submitted = true;
            this.errorMessages = {};
            this.errorMessage = '';

            const postFormData = duplicate(this.formData);
            postFormData.email = postFormData.email ? postFormData.email.trim().toLowerCase() : '';
            let savePromise;

            if (!this.user) {
                const domain = (postFormData.email.split('@')[1] || '').trim();
                const origin = Object.keys(this.domainsByOrigin).find(o => this.domainsByOrigin[o].includes(domain)) || 'local';

                if (!this.domainsByOrigin[origin]) {
                    this.errorMessages.email = this.i18n('The email domain {domain} is not allowed.').replace('{domain}', domain);
                    this.submitted = false;
                    return;
                }

                if (origin === 'local') {
                    savePromise = new Promise((resolve, reject) => {
                        api.post(`${api.urls.idp}localUsers`, postFormData).then(localUser => {
                            api.get(`${api.urls.idp}users`, { email: localUser.email, acl: 1 }).then(resolve).catch(reject);
                        }).catch(reject);
                    });
                } else {
                    postFormData.userOrigin = { code: origin };
                    postFormData.origin_identifier = postFormData.email;
                    savePromise = api.post(`${api.urls.idp}users`, postFormData);
                }
            } else if (this.user.userOrigin.code === 'local') {
                savePromise = new Promise((resolve, reject) => {
                    api.put(`${api.urls.idp}localUsers/${this.user.origin_identifier}`, postFormData).then(localUser => {
                        api.get(`${api.urls.idp}users`, { email: localUser.email, acl: 1 }).then(resolve).catch(reject);
                    }).catch(reject);
                });
            } else {
                savePromise = api.put(`${api.urls.idp}users/${this.user.id}`, postFormData);
            }

            savePromise.then(user => {
                if (Array.isArray(user)) {
                    user = user[0];
                }

                api.clearCache();
                api.get(`${api.urls.idp}users/${user.id}/profiles`).then(profiles => {
                    const realUserAdminProfileId = parseInt($env('VITE_IDP_REAL_USER_ADMIN_PROFILE_ID')) || null;
                    const applicationUserAdminProfileId = parseInt($env('VITE_IDP_APPLICATION_USER_ADMIN_PROFILE_ID')) || null;
                    const currentUserProfiles = profiles.filter(p => p.application.id == $env('VITE_IDP_CLIENT_ID') || (realUserAdminProfileId && p.id == realUserAdminProfileId));
                    const expectedUserProfiles = [this.selectedProfile].filter(Boolean);

                    if (realUserAdminProfileId
                        && applicationUserAdminProfileId
                        && expectedUserProfiles.map(ep => ep.id).includes(applicationUserAdminProfileId)) {
                        expectedUserProfiles.push({ id: realUserAdminProfileId });
                    }

                    const profileIdsToRemove = currentUserProfiles
                        .filter(p => !expectedUserProfiles.some(ep => ep.id == p.id))
                        .map(p => p.id);
                    const profileIdsToAdd = expectedUserProfiles
                        .filter(ep => !currentUserProfiles.some(p => p.id == ep.id))
                        .map(p => p.id);

                    const promises = [];

                    profileIdsToRemove.forEach(profileId => {
                        promises.push(api.delete(`${api.urls.idp}users/${user.id}/profiles/${profileId}`));
                    });

                    profileIdsToAdd.forEach(profileId => {
                        promises.push(api.post(`${api.urls.idp}users/${user.id}/profiles/${profileId}`));
                    });

                    return Promise.all(promises);
                }).then(() => {
                    api.clearCache();

                    if (!this.user) {
                        this.$emit('created', user);
                    } else {
                        this.$emit('updated', user);
                    }

                    this.hide();
                });
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