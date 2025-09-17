<script setup>
import loginImagePath from '@/assets/img/login.jpg';
</script>
<template>
    <MinimalLayout>
        <div class="container-fluid">
            <section class="vh-100">
                <div class="row vh-100">
                    <div class="col-md-6 d-none d-md-block p-0">
                        <div class="w-100 vh-100 bg-cover bg-center"
                            :style="`background-image: url(${loginImagePath});`">
                        </div>
                    </div>
                    <div class="col-md-6 d-flex align-items-center justify-content-center">
                        <div class="text-center" style="min-width: 20rem">
                            <form action="javascript:void(0)" @submit="submit" :class="{ submitting: formSending }" class="w-100">
                                <img class="img-fluid mb-3" :src="defaultLogotUrl" :alt="defaultCompanyAlias"
                                    data-logo="default" v-if="false">
                                <h1 class="h3">Iniciar sesión</h1>
                                <div class="alert alert-danger" v-if="formErrorMessage">{{ formErrorMessage }}</div>
                                <div class="row g-2 mb-2">
                                    <div class="col-12">
                                        <TextField label="Email" type="email" placeholder="" v-model="formData.username"
                                            :disabled="formSending || showPassword"
                                            :errorMessage="formFieldErrorMessages.username" />
                                    </div>
                                    <div class="col-12" v-if="showPassword">
                                        <TextField label="Contraseña" type="password" placeholder="" ref="password"
                                            v-model="formData.password"
                                            :errorMessage="formFieldErrorMessages.password" />
                                    </div>
                                </div>
                                <div class="d-grid mb-3" v-if="showPassword">
                                    <button type="submit" class="btn btn-dark" :disabled="formSending">
                                        <span v-if="formSending" class="spinner-border spinner-border-sm" role="status">
                                            <span class="visually-hidden">Enviando…</span>
                                        </span>
                                        Entrar
                                    </button>
                                </div>
                                <div class="d-grid mb-3" v-if="!showPassword">
                                    <button type="button" class="btn btn-dark" @click="checkEmail">
                                        Continuar
                                    </button>
                                </div>
                                <div class="d-grid mb-3" v-if="!formData.username">
                                    <a href="javascript:void(0)" class="d-block" @click="microsoft">
                                        <img src="@/assets/img/ms-login.svg" class="w-100" width="363" height="53">
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    </MinimalLayout>
</template>

<script>
import MinimalLayout from "@/layouts/MinimalLayout.vue";
import TextField from "@/components/common/form/TextField.vue";
import api from "@/api.js";
const idp_client_id =
    import.meta.env.VITE_IDP_CLIENT_ID;
const defaultCompanyAlias = import.meta.env.VITE_DEFAULT_COMPANY_ALIAS;
const defaultLogotUrl = import.meta.env.VITE_DEFAULT_LOGO_URL;
import {
    hexToObject,
} from "@/tools/object.js";

export default {
    components: {
        MinimalLayout,
        TextField,
    },
    data() {
        return {
            formData: {},
            formErrorMessage: '',
            formFieldErrorMessages: {},
            formSending: false,
            showPassword: false,
            defaultCompanyAlias,
            defaultLogotUrl
        };
    },
    methods: {
        checkEmail() {
            this.formData.username = (this.formData.username ? this.formData.username : '').toLowerCase().trim();
            if (!this.formData.username) return;

            let domains = [
                'gestycontrol.com',
                'poolcp.com',
            ];

            if (domains.filter(domain => this.formData.username.endsWith('@' + domain)).length > 0) {
                this.microsoft();
            } else {
                this.showPassword = true;

                this.$nextTick(() => {
                    document.getElementById(this.$refs['password'].id).focus();
                });
            }
        },
        microsoft() {
            window.location = api.urls.idp_login_page + window.location.search;
        },
        submit() {
            if (!this.showPassword) {
                this.checkEmail();
                return;
            }

            if (!this.formData.username || !this.formData.password) return;

            this.formErrorMessage = '';
            this.formFieldErrorMessages = {};
            this.formSending = true;


            fetch(api.urls.idp + 'tokens/password', {
                method: 'POST',
                body: JSON.stringify({
                    client_id: idp_client_id,
                    email: this.formData.username,
                    password: this.formData.password,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then(response => {
                if (!response.ok &&
                    (response.status == 401 || response.status == 403)) {
                    this.formErrorMessage = 'Usuario o contraseña incorrectos.';
                    this.formSending = false;

                    return;
                }

                if (!response.ok) {
                    this.formErrorMessage = 'Usuario o contraseña incorrectos.';
                    this.formSending = false;
                    return;
                }

                try {
                    response.json().then(json => {
                        api.setToken(json.token);
                        this.$router.push(hexToObject(this.$route.query.state));
                    }).catch();
                } catch (e) { }
            }).catch(() => {
                this.formErrorMessage = 'Error.';
                this.formSending = false;
            });
        },
    }
};
</script>


<style lang="scss" scoped>
form {
    max-width: 320px;
}
</style>