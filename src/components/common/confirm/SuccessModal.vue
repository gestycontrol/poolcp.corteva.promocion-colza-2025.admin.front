<template>
    <Modal modalClass="modal-fullscreen-sm-down" @hidden="hidden" ref="modal">
        <template #title>
            {{ title }}
        </template>

        <div class="text-center">
            <div class="mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-check-circle" style="width: 4rem; height: 4rem; color: #009a80;" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path
                        d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z" />
                </svg>
            </div>

            <strong>{{ text }}</strong>
        </div>

        <template #footer>
            <div class="row">
                <div class="col text-end">
                    <button type="button" @click="hide" class="btn btn-primary">{{ i18n('OK') }}</button>
                </div>
            </div>
        </template>
    </Modal>
</template>
<script>
import Modal from "@/components/common/layout/Modal.vue";

export default {
    components: {
        Modal,
    },
    data() {
        return {
            title: null,
            text: null,
        };
    },
    emits: [
        'hidden',
    ],
    methods: {
        show(title, text) {
            if (title && text) {
                this.title = title;
                this.text = text;
            } else {
                this.title = this.i18n('Success');
                this.text = title || this.i18n('Completed successfully.');
            }

            this.$refs['modal'].show();
        },
        hide() {
            this.$refs['modal'].hide();
        },
        hidden() {
            this.$emit('hidden');
        },
    }
};
</script>