<template>
    <Modal @shown="shown" @hidden="hidden" ref="modal" modalClass="modal-md" @submit="submit">
        <template #title>
            {{ displayTitle }}
        </template>

        <template v-if="!signingOnMobile">
            <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>

            <slot name="content"></slot>

            <div class="row g-2">
                <div class="col-12">
                    <div class="row g-2 align-items-center mt-2">
                        <div class="col" v-dompurify-html="signInsideTitleHtml"></div>
                        <div class="col">
                            <div class="d-none d-lg-block text-end" v-if="viewOnMobileUrlComputed">
                                <button type="button" class="btn btn-secondary btn-sm " @click="signingOnMobile = true">
                                    {{ i18n('Sign on mobile') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="signature-wrapper">
                        <VueSignaturePad width="100%" height="14em" ref="signaturePad" :options="signatureOptions"
                            @click="checkEmptyCanvas" @mouseleave="checkEmptyCanvas" @touchend="checkEmptyCanvas" />
                    </div>
                    <div class="text-center mb-2" v-if="!isEmptyCanvas">
                        <button type="button" class="btn btn-secondary btn-sm" @click="clearSignature">
                            {{ i18n('Clear Signature') }}
                        </button>
                    </div>
                </div>
            </div>
        </template>
        <template v-else>
            <div class="alert alert-danger mb-2" v-if="errorMessage">{{ errorMessage }}</div>
            <div class="d-block text-center p-5" v-if="viewOnMobileUrlComputed">
                <QrcodeVue :value="viewOnMobileUrlComputed" :size="300" :level="'M'" v-if="signingOnMobile" />
            </div>
            <p class="mt-0 text-center">
                {{ i18n('Scan the QR code with your mobile phone to sign.') }}
            </p>
        </template>

        <template #footer>
            <div class="row" v-if="!signingOnMobile">
                <div class="col text-start">
                    <button type="button" class="btn btn-danger" @click="hide">
                        {{ i18n('Cancel') }}
                    </button>
                </div>
                <div class="col text-end">
                    <button type="submit" class="btn btn-primary text-white" :disabled="submitted || isEmptyCanvas">
                        {{ i18n('Confirm') }}
                    </button>
                </div>
            </div>
            <div class="row" v-if="signingOnMobile">
                <div class="col text-start">
                    <button type="button" class="btn btn-danger" @click="signingOnMobile = false">
                        {{ i18n('Cancel') }}
                    </button>
                </div>
                <div class="col text-end">
                    <button type="submit" class="btn btn-primary text-white" @click="hide">
                        {{ i18n('Close') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import QrcodeVue from 'qrcode.vue';
import Modal from "@/components/common/layout/Modal.vue";
import { fingerPrint, } from "@/tools/navigator.js";
import { VueSignaturePad, } from "vue-signature-pad";

export default {
    components: {
        Modal,
        VueSignaturePad,
        QrcodeVue,
    },
    data() {
        return {
            submitted: false,
            errorMessage: '',
            signatureOptions: {
                penColor: "#000",
                dotSize: (1.5 + 4) / 2,
                minWidth: 1.5,
                maxWidth: 4
            },
            isEmptyCanvas: true,
            promiseResolve: null,
            promiseReject: null,
            signingOnMobile: false,
            navigatorEvidence: null,
            options: {},
        };
    },
    props: {
        title: {
            type: String,
            default: null,
        },
        viewOnMobileUrl: {
            type: [String, Boolean],
            default: true,
        },
    },
    emits: [
        'shown',
        'hidden',
    ],
    computed: {
        signInsideTitleHtml() {
            return `<h5 class=" h6 mb-0">${this.i18n('Sign Inside (HTML)')}</h5>`;
        },
        displayTitle() {
            if (this.title) return this.title;
            return this.i18n('Do Sign');
        },
        viewOnMobileUrlComputed() {
            if (this.viewOnMobileUrl === true) {
                return window.location.href;
            }

            return this.viewOnMobileUrl;
        },
    },
    methods: {
        show(options) {
            this.options = options;

            if (!this.options) {
                this.options = {};
            }

            this.submitted = false;
            this.signingOnMobile = false;
            this.errorMessage = '';
            this.$refs['modal'].show();
            if (this.options.withEvidence) this.initNavigatorEvidence();

            this.$nextTick(() => {
                if (this.$refs.signaturePad) {
                    this.$refs.signaturePad.clearSignature();
                }
            });

            return new Promise((resolve, reject) => {
                this.promiseResolve = resolve;
                this.promiseReject = reject;
            });
        },
        hide() {
            this.$refs['modal'].hide();
        },
        shown() {
            this.$emit('shown');
        },
        hidden() {
            if (this.signingOnMobile) {
                this.submitted = true;
                window.location.reload();
            } else {
                this.$emit('hidden');

                if (this.promiseReject) {
                    this.promiseReject();
                    this.promiseResolve = null;
                    this.promiseReject = null;
                }
            }
        },
        submit() {
            if (this.isEmptyCanvas) {
                this.errorMessage = this.i18n('Please sign in the marked area.');
                return;
            }

            this.errorMessage = null;
            this.submitted = true;

            if (this.promiseResolve) {
                if (this.options.withEvidence) {
                    this.promiseResolve({
                        svg: this.getSvgSignature(),
                        evidence: this.navigatorEvidence,
                    });
                } else {
                    this.promiseResolve(this.getSvgSignature());
                }
                this.promiseResolve = null;
                this.promiseReject = null;
            }

            this.hide();
        },
        checkEmptyCanvas() {
            this.isEmptyCanvas = this.$refs.signaturePad.isEmpty();
        },
        clearSignature() {
            this.$refs.signaturePad.clearSignature();
            this.checkEmptyCanvas();
        },
        initNavigatorEvidence() {
            this.navigatorEvidence = fingerPrint();
        },
        getSvgSignature() {
            const { data } = this.$refs.signaturePad.saveSignature('image/svg+xml');

            return data;
        },
    }
}
</script>
<style lang="scss" scoped>
.signature-wrapper {
    width: 100%;
    height: 0;
    padding-bottom: 50%;
    border: 2px dashed var(--bs-gray-500);
    background-color: var(--bs-gray-100);
    margin-bottom: 12px;
    border-radius: 3px;

}
</style>