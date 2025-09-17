<template>
    <Modal modalClass="modal-fullscreen-sm-down" @hidden="hidden" @shown="shown" ref="modal" @submit="submit">
        <template #title>
            {{ title }}
        </template>

        <div class="text-center">
            <strong>{{ message }}</strong>
        </div>

        <template #footer>
            <div class="row">
                <div class="col text-start">
                    <button type="button" @click="hide" class="btn btn-danger">
                        {{ i18n('Cancel') }}
                    </button>
                </div>
                <div class="col text-end">
                    <button type="button" ref="confirmButton" @click="confirm" class="btn btn-primary">
                        {{ i18n('Confirm') }}
                    </button>
                </div>
            </div>
        </template>
    </Modal>
</template>

<script>
import { i18n } from "@/tools/i18n.js";
import Modal from "@/components/common/layout/Modal.vue";

export default {
    components: {
        Modal,
    },
    data() {
        return {
            confirmed: false,
        };
    },
    props: {
        title: {
            type: String,
            default: i18n('Confirm'),
        },
        message: {
            type: String,
            default: i18n('Are you sure?'),
        },
    },
    emits: [
        'cancelled',
        'confirmed',
    ],
    methods: {
        show() {
            this.confirmed = false;
            this.$refs.modal.show();
        },
        hide() {
            this.$refs.modal.hide();
        },
        hidden() {
            if (this.confirmed) return;
            this.$emit('cancelled');
        },
        submit() {
            this.confirm();
        },
        confirm() {
            this.$emit('confirmed');
            this.hide();
        },
        shown() {
            this.$nextTick(() => {
                if (!this.$refs.confirmButton) return;
                this.$refs.confirmButton.focus();
            });
        },
    }
};
</script>