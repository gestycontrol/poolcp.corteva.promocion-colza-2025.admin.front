<template>
    <Modal @submit="submit" ref="modal" modalClass="modal-md" @hidden="hidden">
        <template #title>
            {{ title || i18n('Scan') }}
        </template>

        <div class="row g-2">
            <div class="col-12 text-center" v-if="cameras && cameras.length > 1">
                <Field type="dictionary" :list="cameras" v-model="deviceId" :label="i18n('Camera')" />
            </div>
            <div class="col-12" v-if="cameras && cameras.length > 0">
                <div class="scan-wrapper">
                    <div class="canvas-wrapper">
                        <div :id="videoId" ref="videoElem" class="w-100"></div>
                    </div>
                </div>
                <div class="mt-2" v-show="track">
                    <input type="range" :id="rangeId" v-model="focusDistance" class="w-100">
                </div>
            </div>
            <div class="col-12 mt-2" v-if="allowManualInput">
                <Field :label="i18n('Enter code manually')" v-model="formData.code" />
            </div>
        </div>

        <template #footer>
            <div class="row">
                <div class="col text-start">
                    <button type="button" class="btn btn-danger" @click="hide">
                        {{ i18n('Cancel') }}
                    </button>
                </div>
                <div class="col text-end" v-if="formData.code">
                    <button class="btn btn-primary text-white" :disabled="submitted">
                        {{ i18n('Accept') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import $env from '@/tools/environment.js';
const qrPrefix = $env('VITE_QR_PREFIX');
const qrIgnoreAfter = $env('VITE_QR_IGNORE_AFTER');
const qrLeftPad = $env('VITE_QR_LEFT_PAD');
const qrLength = $env('VITE_QR_LENGTH');

import { duplicate } from "@/tools/object.js";
import Field from "@/components/common/form/Field.vue";
import Modal from "@/components/common/layout/Modal.vue";
import randomIdMixin from "@/mixins/common/randomIdMixin.js";
import { Html5Qrcode } from "html5-qrcode";

const defaultFormData = {};
const defaultConstraints = {
    video: {
        facingMode: 'environment'
    }
};

export default {
    mixins: [randomIdMixin],
    components: {
        Field,
        Modal,
    },
    data() {
        return {
            allowManualInput: false,
            formData: duplicate(defaultFormData),
            submitted: false,
            cameras: [],
            deviceId: null,
            mediastream: null,
            track: null,
            focusDistance: null,
            html5QrCode: null,
            promiseResolve: null,
            promiseReject: null,
        };
    },
    props: {
        title: {
            type: String,
        },
    },
    emits: [
        'scanned',
    ],
    watch: {
        deviceId() {
            if (!this.cameras.length || !this.deviceId) return;
            this.selectCamera(this.deviceId);
            this.$root.setCookie('userConfigDeviceId', this.deviceId);
        },
        focusDistance() {
            if (!this.track) return;
            this.track.applyConstraints({
                advanced: [{
                    focusMode: 'manual',
                    focusDistance: this.focusDistance,
                }]
            });
            this.$root.setCookie('focusDistance', this.focusDistance);
        },
        'formData.code'() {
            let code = this.sanitizeQrCode(this.formData?.code);
            if (code && code.length === qrLength) {
                this.submit();
            }
        },
    },
    computed: {
        videoId() {
            return 'video-' + this.randomId;
        },
        rangeId() {
            return 'range-' + this.randomId;
        },
    },
    methods: {
        async initCamera() {
            if (!navigator.mediaDevices) return;

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                stream.getTracks().forEach(track => track.stop());
                const devices = await navigator.mediaDevices.enumerateDevices();
                this.processDevices(devices);
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        },
        processDevices(devices) {
            this.cameras = devices.filter(device => device.kind === 'videoinput').map(device => ({
                id: device.deviceId,
                name: device.label || device.deviceId,
            }));
            this.selectDefaultCamera();
        },
        selectDefaultCamera() {
            if (this.cameras.length === 0) return;

            let userConfigDeviceId = this.$root.getCookie('userConfigDeviceId');

            if (userConfigDeviceId && this.cameras.some(c => c.id == userConfigDeviceId)) {
                this.deviceId = userConfigDeviceId;
            } else {
                const preferredCamera = this.findPreferredCamera();
                this.deviceId = preferredCamera ? preferredCamera.id : this.cameras[0].id;
            }
        },
        findPreferredCamera() {
            const criteria = [
                'camera2 0 facing back',
                'facing back',
                'back',
                'trasera -tele -dual -angular -triple',
                'trasera -tele -dual -angular',
                'trasera -tele -dual',
                'trasera -angular',
                'trasera -tele',
                'trasera -dual',
                'trasera -triple',
                'trasera',
            ];

            for (let criterion of criteria) {
                const preferredCamera = this.cameras.find(c => {
                    const conditions = criterion.split(' ').map(cond => cond.trim());
                    return conditions.every(cond => {
                        const negate = cond.startsWith('-');
                        const term = negate ? cond.slice(1) : cond;
                        return negate ? !c.name.toLowerCase().includes(term) : c.name.toLowerCase().includes(term);
                    });
                });

                if (preferredCamera) {
                    return preferredCamera;
                }
            }
            return null;
        },
        selectCamera(deviceId) {
            this.stopScanner();

            const updatedConstraints = {
                video: {
                    deviceId: { exact: deviceId }
                }
            };

            navigator.mediaDevices
                .getUserMedia(updatedConstraints)
                .then(mediastream => this.gotMedia(mediastream))
                .catch(console.error);
        },
        gotMedia(mediastream) {
            this.mediastream = mediastream;
            this.startScanner();
            this.setupFocus(mediastream);
        },
        startScanner() {
            if (!this.html5QrCode) {
                this.html5QrCode = new Html5Qrcode(this.videoId);
            }

            let video = document.getElementById(this.videoId);
            let boxSize = Math.round(video.offsetWidth * 0.6);

            this.html5QrCode.start(
                this.deviceId,
                { fps: 10, qrbox: { width: boxSize, height: boxSize } },
                this.onQrCodeScanned.bind(this)
            ).catch(console.error);
        },
        onQrCodeScanned(decodedText) {
            this.formData.code = decodedText;
            this.formData.scannedCode = decodedText;
            this.formData.scannedSanitizedCode = this.sanitizeQrCode(decodedText);

            if (this.formData.code) {
                this.$nextTick(() => this.submit());
            }
        },
        setupFocus(mediastream) {
            const track = mediastream.getVideoTracks()[0];
            const capabilities = track.getCapabilities();

            if (!capabilities.focusDistance) return;

            const input = document.getElementById(this.rangeId);
            input.min = capabilities.focusDistance.min;
            input.max = capabilities.focusDistance.max;
            input.step = capabilities.focusDistance.step;
            this.focusDistance = track.getSettings().focusDistance;
            this.$nextTick(() => {
                this.track = track;
                const userConfigFocusDistance = this.$root.getCookie('focusDistance');
                if (userConfigFocusDistance) {
                    this.focusDistance = Math.round(userConfigFocusDistance);
                }
            });
        },
        show(allowManualInput = true) {
            this.resetModal(allowManualInput);
            this.$refs['modal'].show();
            this.$nextTick(() => this.initCamera());
        },
        resetModal(allowManualInput) {
            this.cameras = [];
            this.deviceId = null;
            this.stopScanner();
            this.formData = duplicate(defaultFormData);
            this.submitted = false;
            this.focusDistance = null;
            this.allowManualInput = allowManualInput;
        },
        scan(allowManualInput) {
            this.show(allowManualInput);

            return new Promise((resolve, reject) => {
                this.promiseResolve = resolve;
                this.promiseReject = reject;
            });
        },
        hidden() {
            this.stopScanner();
        },
        hide() {
            this.stopScanner();

            if (this.promiseReject) {
                this.promiseReject();
                this.promiseReject = null;
            }

            this.$refs['modal'].hide();
        },
        sanitizeQrCode(code) {
            if (!code) return '';

            code = code.trim();

            if (code.startsWith(qrPrefix)) {
                code = code.substring(qrPrefix.length);
            }

            if (code.includes(qrIgnoreAfter)) {
                code = code.split(qrIgnoreAfter)[0];
            }

            return code;
        },
        submit() {
            if (!this.formData.code) {
                return;
            }

            this.formData.code = this.sanitizeQrCode(this.formData.code);

            if (qrLeftPad && qrLength) {
                this.formData.code = this.formData.code.padStart(qrLength, qrLeftPad);
            }

            this.submitted = true;
            this.$emit('scanned', duplicate(this.formData));

            if (this.promiseResolve) {
                this.promiseResolve(duplicate(this.formData));
                this.promiseResolve = null;
            }

            this.hide();
        },
        stopScanner() {
            if (this.track) {
                this.track.applyConstraints({ advanced: [{ focusMode: 'continuous' }] });
                this.track = null;
            }

            if (this.mediastream) {
                this.mediastream.getTracks().forEach(track => track.stop());
                this.mediastream = null;
            }

            if (this.html5QrCode && this.html5QrCode.isScanning) {
                this.html5QrCode.stop();
            }
        }
    },
};
</script>

<style lang="scss">
.scan-wrapper {
    position: relative;
    width: 100%;
    min-height: 200px;
    background: black;
}

.scan-wrapper video {
    margin-bottom: -8px;
    width: 100%;
    max-height: 50vh !important;
    object-fit: cover;
}

.scan-wrapper .canvas-wrapper {
    background-color: var(--bs-gray-800);
}
</style>
